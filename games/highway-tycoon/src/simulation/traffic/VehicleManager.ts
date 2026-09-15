import { PlacedBuilding, Vehicle } from '../../types';
import { CustomerFactory } from '../customer/CustomerNeeds';
import { HighwayNetwork } from './HighwayNetwork';
import { FuelStorage } from '../petrol/FuelStorage';
import { RoomManager } from '../hospitality/RoomManager';
import { StoreManager } from '../commercial/StoreManager';
import { EconomyEngine } from '../economy/EconomyEngine';
import { sound } from '../../audio/SoundEngine';
import { gameEvents } from '../../core/EventBus';

export class VehicleManager {
  public vehicles: Vehicle[] = [];
  public highway: HighwayNetwork = new HighwayNetwork();
  private spawnTimer: number = 0;
  public totalServicedCount: number = 0;

  constructor() {}

  /**
   * Spawns new highway traffic based on game clock and traffic rate
   */
  public updateSpawning(
    deltaTimeSec: number,
    mapWidth: number,
    trafficVolumeRate: number = 1.0,
    hasBillboard: boolean = false
  ): void {
    this.spawnTimer += deltaTimeSec;
    // Spawn every ~1.5 to 2.5 seconds scaled by rate
    const spawnInterval = Math.max(0.6, 2.0 / trafficVolumeRate);

    if (this.spawnTimer >= spawnInterval) {
      this.spawnTimer = 0;
      const lane = Math.random() > 0.5 ? 2 : 3;
      const newVeh = CustomerFactory.createRandomVehicle(0, lane, lane);
      
      // Billboard increases likelihood of weary drivers looking for rest
      if (hasBillboard) {
        newVeh.fatigue = Math.min(100, newVeh.fatigue + 15);
      }

      this.vehicles.push(newVeh);
    }
  }

  /**
   * Main simulation tick for all active vehicles
   */
  public updateVehicles(
    deltaTimeSec: number,
    buildings: PlacedBuilding[],
    fuelStorage: FuelStorage,
    roomManager: RoomManager,
    storeManager: StoreManager,
    economy: EconomyEngine,
    currentDay: number,
    currentHour: number,
    onReviewAdded: (rev: any) => void
  ): void {
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];

      switch (v.state) {
        case 'HIGHWAY_APPROACH': {
          // Move along highway eastwards
          v.x += v.speed * (deltaTimeSec * 60);

          // Near exit ramp decision zone (x between 3 and 5)
          if (v.x >= 3.5 && v.x <= 5.5 && !v.hasStopped) {
            v.state = 'DECIDING_EXIT';
          } else if (v.x > 36) {
            // Reached end of highway map, remove
            this.vehicles.splice(i, 1);
          }
          break;
        }

        case 'DECIDING_EXIT': {
          // Calculate urgency to stop
          const needsFuel = v.fuelLevel < 40;
          const needsSleep = v.fatigue > 65;
          const needsFood = v.hunger > 65;

          const wantsToStop = needsFuel || needsSleep || needsFood || Math.random() < 0.25;

          if (wantsToStop) {
            // Find appropriate destination
            let target: PlacedBuilding | null = null;

            if (needsFuel) {
              target = buildings.find(b => 
                (b.type === 'PUMP_ISLAND' || (v.fuelType === 'ELECTRIC' && b.type === 'EV_STATION')) && b.active
              ) || null;
            }

            if (!target && needsSleep) {
              target = roomManager.findAvailableRoom(buildings, v.vehicleClass === 'SEMI_TRUCK' || v.vehicleClass === 'REEFER_TRUCK');
            }

            if (!target && (needsFood || Math.random() > 0.5)) {
              target = buildings.find(b => (b.type === 'CONVENIENCE_STORE' || b.type === 'DINER') && b.active) || null;
            }

            if (target) {
              v.targetBuildingId = target.id;
              v.path = this.highway.generatePathToBuilding(target);
              v.pathIndex = 0;
              v.state = 'ENTERING_RAMP';
              v.hasStopped = true;
              break;
            }
          }

          // Continue cruising on highway if no stop or no targets
          v.state = 'HIGHWAY_APPROACH';
          break;
        }

        case 'ENTERING_RAMP': {
          // Follow path towards destination
          if (v.pathIndex < v.path.length) {
            const wp = v.path[v.pathIndex];
            const dx = wp.x - v.x;
            const dy = wp.y - v.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.3) {
              v.pathIndex++;
            } else {
              v.x += (dx / dist) * v.speed * (deltaTimeSec * 50);
              v.y += (dy / dist) * v.speed * (deltaTimeSec * 50);
            }
          } else {
            // Reached target building
            const b = buildings.find(bld => bld.id === v.targetBuildingId);
            if (!b) {
              v.state = 'DRIVING_TO_EXIT';
              v.path = this.highway.generatePathToExit(v.x, v.y);
              v.pathIndex = 0;
              break;
            }

            if (b.type === 'PUMP_ISLAND' || b.type === 'EV_STATION') {
              v.state = 'REFUELING';
              v.stateTimer = 4.0; // 4 seconds refueling
              sound.playPumpSound();
            } else if (b.type === 'MOTEL_ROOM' || b.type === 'MOTEL_CABIN') {
              v.state = 'AT_MOTEL';
              v.stateTimer = 8.0; // 8 seconds sleeping
              const bill = roomManager.checkIn(b, v.id, 8.0, currentHour);
              v.spentTotal += bill;
              economy.recordTransaction('MOTEL', bill, `Room Stay: ${v.driverName}`, currentDay, currentHour);
            } else if (b.type === 'CONVENIENCE_STORE') {
              v.state = 'SHOPPING';
              v.stateTimer = 3.5;
              const bill = storeManager.visitStore(b, v.hunger);
              v.spentTotal += bill;
              economy.recordTransaction('STORE', bill, `Oasis Mart: ${v.driverName}`, currentDay, currentHour);
            } else if (b.type === 'DINER') {
              v.state = 'EATING';
              v.stateTimer = 5.0;
              const bill = storeManager.visitDiner(b, v.passengers);
              v.spentTotal += bill;
              economy.recordTransaction('DINER', bill, `Highway Diner: ${v.driverName}`, currentDay, currentHour);
            } else {
              v.state = 'PARKED';
              v.stateTimer = 3.0;
            }
          }
          break;
        }

        case 'REFUELING': {
          v.stateTimer -= deltaTimeSec;
          if (v.stateTimer <= 0) {
            // Dispense fuel and charge
            const litersToFill = Math.round(v.fuelCapacityLiters * ((100 - v.fuelLevel) / 100));
            const { litersDispensed, costToCustomer } = fuelStorage.dispenseFuel(v.fuelType, litersToFill);

            v.fuelLevel = 100;
            v.spentTotal += costToCustomer;
            economy.recordTransaction('FUEL', costToCustomer, `Fuel Sold: ${v.driverName} (${litersDispensed}L ${v.fuelType})`, currentDay, currentHour);
            sound.playCashSound();

            gameEvents.emit('FLOATING_TEXT', {
              text: `+$${costToCustomer.toFixed(2)}`,
              x: v.x,
              y: v.y,
              color: '#34d399'
            });

            // Head to exit ramp
            v.state = 'DRIVING_TO_EXIT';
            v.path = this.highway.generatePathToExit(v.x, v.y);
            v.pathIndex = 0;
            this.totalServicedCount++;
          }
          break;
        }

        case 'AT_MOTEL': {
          v.stateTimer -= deltaTimeSec;
          if (v.stateTimer <= 0) {
            v.fatigue = 0;
            gameEvents.emit('FLOATING_TEXT', {
              text: `Well Rested! ⭐`,
              x: v.x,
              y: v.y,
              color: '#a855f7'
            });
            v.state = 'DRIVING_TO_EXIT';
            v.path = this.highway.generatePathToExit(v.x, v.y);
            v.pathIndex = 0;
            this.totalServicedCount++;
          }
          break;
        }

        case 'SHOPPING':
        case 'EATING':
        case 'PARKED': {
          v.stateTimer -= deltaTimeSec;
          if (v.stateTimer <= 0) {
            v.hunger = 10;
            v.state = 'DRIVING_TO_EXIT';
            v.path = this.highway.generatePathToExit(v.x, v.y);
            v.pathIndex = 0;
            this.totalServicedCount++;
          }
          break;
        }

        case 'DRIVING_TO_EXIT': {
          // Follow path to on-ramp
          if (v.pathIndex < v.path.length) {
            const wp = v.path[v.pathIndex];
            const dx = wp.x - v.x;
            const dy = wp.y - v.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.3) {
              v.pathIndex++;
            } else {
              v.x += (dx / dist) * v.speed * (deltaTimeSec * 50);
              v.y += (dy / dist) * v.speed * (deltaTimeSec * 50);
            }
          } else {
            // Merged back onto highway!
            v.state = 'HIGHWAY_LEAVE';
            v.lane = 3;
            v.y = 3;

            // Generate driver review
            const review = CustomerFactory.generateReview(v, true, currentDay, currentHour);
            onReviewAdded(review);
          }
          break;
        }

        case 'HIGHWAY_LEAVE': {
          v.x += v.speed * (deltaTimeSec * 60);
          if (v.x > 38) {
            this.vehicles.splice(i, 1);
          }
          break;
        }
      }
    }
  }
}
