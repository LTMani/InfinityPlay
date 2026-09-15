import * as THREE from 'three';

export type BayCategory = 'FUEL' | 'EV' | 'DINER' | 'SHOP' | 'MOTEL' | 'PARKING';

export interface ParkingBay {
  id: string;
  category: BayCategory;
  name: string;
  position: THREE.Vector3;
  rotationY: number;
  approachPoint: THREE.Vector3; // Point on access road before turning in
  exitPoint: THREE.Vector3;     // Point on exit road after pulling out
  occupiedBy: string | null;    // Vehicle ID or null
  dwellTime: number;            // How long a vehicle stays
}

export class ParkingBayManager {
  public bays: ParkingBay[] = [];
  public waitingQueues: Map<BayCategory, string[]> = new Map();

  constructor() {
    this.waitingQueues.set('FUEL', []);
    this.waitingQueues.set('EV', []);
    this.waitingQueues.set('DINER', []);
    this.waitingQueues.set('SHOP', []);
    this.waitingQueues.set('MOTEL', []);
    this.waitingQueues.set('PARKING', []);

    this.initializeBays();
  }

  private initializeBays(): void {
    // === ZONE 1: FUEL & EV PLAZA (Z = -75 to -25) ===
    // 1. Regular Gasoline Pumps for Passenger Cars (X = 22.0, facing along Z)
    this.bays.push({
      id: 'fuel_pump_1',
      category: 'FUEL',
      name: 'Fuel Pump #1 (Regular 87)',
      position: new THREE.Vector3(22.0, 0.08, -65.0),
      rotationY: 0, // Facing along Z (parallel)
      approachPoint: new THREE.Vector3(5.0, 0.08, -80.0),
      exitPoint: new THREE.Vector3(5.0, 0.08, -50.0),
      occupiedBy: null,
      dwellTime: 5.5
    });

    this.bays.push({
      id: 'fuel_pump_2',
      category: 'FUEL',
      name: 'Fuel Pump #2 (Premium 93)',
      position: new THREE.Vector3(22.0, 0.08, -55.0),
      rotationY: 0,
      approachPoint: new THREE.Vector3(5.0, 0.08, -72.0),
      exitPoint: new THREE.Vector3(5.0, 0.08, -42.0),
      occupiedBy: null,
      dwellTime: 5.5
    });

    // 2. Heavy-Duty Commercial Diesel Lanes for 18-Wheeler Trucks
    // Set 31 METERS BACK from service road at X = 36.0 & 43.0, oriented strictly along +Z (parallel)
    // Trucks drive through smoothly with ZERO encroachment on service road!
    this.bays.push({
      id: 'fuel_pump_3',
      category: 'FUEL',
      name: 'Commercial Diesel Lane #1',
      position: new THREE.Vector3(36.0, 0.08, -65.0),
      rotationY: 0,
      approachPoint: new THREE.Vector3(5.0, 0.08, -85.0),
      exitPoint: new THREE.Vector3(5.0, 0.08, -45.0),
      occupiedBy: null,
      dwellTime: 6.5
    });

    this.bays.push({
      id: 'fuel_pump_4',
      category: 'FUEL',
      name: 'Commercial Diesel Lane #2',
      position: new THREE.Vector3(43.0, 0.08, -65.0),
      rotationY: 0,
      approachPoint: new THREE.Vector3(5.0, 0.08, -85.0),
      exitPoint: new THREE.Vector3(5.0, 0.08, -45.0),
      occupiedBy: null,
      dwellTime: 6.5
    });

    // 3. EV Fast Supercharging Stalls (X = 22.0, parallel along Z)
    for (let i = 0; i < 3; i++) {
      const z = -38.0 + i * 5.5;
      this.bays.push({
        id: `ev_stall_${i + 1}`,
        category: 'EV',
        name: `350kW EV Charger #${i + 1}`,
        position: new THREE.Vector3(22.0, 0.08, z),
        rotationY: 0,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 7),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 7),
        occupiedBy: null,
        dwellTime: 6.5
      });
    }

    // === ZONE 2: STORE & FOOD PLAZA (Z = -5 to +45) ===
    // 4. QuickMart Convenience Store Customer Parking (X = 22.0, parallel along Z)
    for (let i = 0; i < 3; i++) {
      const z = -2.0 + i * 6.0;
      this.bays.push({
        id: `shop_stall_${i + 1}`,
        category: 'SHOP',
        name: `QuickMart Express #${i + 1}`,
        position: new THREE.Vector3(22.0, 0.08, z),
        rotationY: 0,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 7),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 7),
        occupiedBy: null,
        dwellTime: 5.0
      });
    }

    // 5. Route 66 Diner Customer Parking (X = 22.0, parallel along Z)
    for (let i = 0; i < 3; i++) {
      const z = 22.0 + i * 6.0;
      this.bays.push({
        id: `diner_stall_${i + 1}`,
        category: 'DINER',
        name: `Diner Parking Stall #${i + 1}`,
        position: new THREE.Vector3(22.0, 0.08, z),
        rotationY: 0,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 7),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 7),
        occupiedBy: null,
        dwellTime: 6.5
      });
    }

    // === ZONE 3: REST & LODGING PLAZA (Z = +55 to +125) ===
    // 6. Motel Room Guest Parking (X = 22.0, parallel along Z)
    for (let i = 0; i < 3; i++) {
      const z = 65.0 + i * 6.5;
      this.bays.push({
        id: `motel_stall_${i + 1}`,
        category: 'MOTEL',
        name: `Motel Room Bay #${i + 1}`,
        position: new THREE.Vector3(22.0, 0.08, z),
        rotationY: 0,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 7),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 7),
        occupiedBy: null,
        dwellTime: 8.0
      });
    }

    // 7. Dedicated Long-Haul Truck Overnight Parking Stalls (33m to 41m away from service road!)
    // Oriented strictly along +Z (rotationY = 0) with generous 32m drive-through berths!
    this.bays.push({
      id: 'trucker_rest_1',
      category: 'PARKING',
      name: 'Rig Overnight Berth #1',
      position: new THREE.Vector3(38.0, 0.08, 95.0),
      rotationY: 0,
      approachPoint: new THREE.Vector3(5.0, 0.08, 78.0),
      exitPoint: new THREE.Vector3(5.0, 0.08, 118.0),
      occupiedBy: null,
      dwellTime: 8.5
    });

    this.bays.push({
      id: 'trucker_rest_2',
      category: 'PARKING',
      name: 'Rig Overnight Berth #2',
      position: new THREE.Vector3(46.0, 0.08, 95.0),
      rotationY: 0,
      approachPoint: new THREE.Vector3(5.0, 0.08, 78.0),
      exitPoint: new THREE.Vector3(5.0, 0.08, 118.0),
      occupiedBy: null,
      dwellTime: 8.5
    });
  }

  /**
   * Request an available bay matching category and unlocked by plaza level.
   */
  public requestBay(category: BayCategory, vehicleId: string, level: number = 1, isTruck: boolean = false): ParkingBay | null {
    // 1. Level Gating: check if category is unlocked at current plaza level
    if (category === 'EV' && level < 2) return null;
    if (isTruck && level < 2) return null; // Truck diesel unlocked at Level 2
    if ((category === 'SHOP' || category === 'DINER') && level < 3) return null;
    if ((category === 'MOTEL' || category === 'PARKING') && level < 4) return null;

    // 2. Filter available bays by category & truck compatibility
    let eligibleBays = this.bays.filter(b => b.category === category && b.occupiedBy === null);

    if (isTruck) {
      // Trucks MUST use dedicated deep truck lanes (X >= 34)
      eligibleBays = eligibleBays.filter(b => b.position.x >= 34.0);
    } else {
      // Passenger cars use car lanes (X <= 32)
      eligibleBays = eligibleBays.filter(b => b.position.x <= 32.0);
    }

    if (eligibleBays.length > 0) {
      const chosen = eligibleBays[0];
      chosen.occupiedBy = vehicleId;
      return chosen;
    }

    // Otherwise all full: add vehicle to waiting queue
    const queue = this.waitingQueues.get(category);
    if (queue && !queue.includes(vehicleId)) {
      queue.push(vehicleId);
    }

    return null;
  }

  /**
   * Release bay when vehicle departs
   */
  public releaseBay(bayId: string): void {
    const bay = this.bays.find(b => b.id === bayId);
    if (!bay) return;

    bay.occupiedBy = null;

    // Check if there's a queued vehicle waiting for this category
    const queue = this.waitingQueues.get(bay.category);
    if (queue && queue.length > 0) {
      // Next in line gets reserved
      const nextVehicleId = queue.shift();
      if (nextVehicleId) {
        bay.occupiedBy = nextVehicleId;
      }
    }
  }

  public getBay(bayId: string): ParkingBay | undefined {
    return this.bays.find(b => b.id === bayId);
  }

  public getOccupancyCount(category: BayCategory): { occupied: number; total: number } {
    const matching = this.bays.filter(b => b.category === category);
    const occupied = matching.filter(b => b.occupiedBy !== null).length;
    return { occupied, total: matching.length };
  }

  public isCategoryFull(category: BayCategory): boolean {
    const stats = this.getOccupancyCount(category);
    return stats.occupied >= stats.total;
  }

  public getTotalStats(): { occupied: number; total: number; queued: number } {
    const total = this.bays.length;
    const occupied = this.bays.filter(b => b.occupiedBy !== null).length;
    let queued = 0;
    this.waitingQueues.forEach(q => {
      queued += q.length;
    });
    return { occupied, total, queued };
  }
}
