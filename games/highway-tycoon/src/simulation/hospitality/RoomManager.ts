import { PlacedBuilding } from '../../types';
import { gameEvents } from '../../core/EventBus';
import { sound } from '../../audio/SoundEngine';

export interface RoomStats {
  totalRooms: number;
  occupiedRooms: number;
  dirtyRooms: number;
  cleanVacantRooms: number;
  nightlyRateStandard: number;
  nightlyRateCabin: number;
}

export class RoomManager {
  public nightlyRateStandard: number = 85;
  public nightlyRateCabin: number = 55;

  /**
   * Find an available clean room matching vehicle class preference
   */
  public findAvailableRoom(
    buildings: PlacedBuilding[],
    isTrucker: boolean
  ): PlacedBuilding | null {
    // Truckers prefer CABIN, cars prefer MOTEL_ROOM, but both can use either if necessary
    const primaryType = isTrucker ? 'MOTEL_CABIN' : 'MOTEL_ROOM';
    const secondaryType = isTrucker ? 'MOTEL_ROOM' : 'MOTEL_CABIN';

    let room = buildings.find(
      b => b.type === primaryType && b.active && b.roomStatus === 'VACANT_CLEAN'
    );
    if (!room) {
      room = buildings.find(
        b => b.type === secondaryType && b.active && b.roomStatus === 'VACANT_CLEAN'
      );
    }

    return room || null;
  }

  /**
   * Check customer into room
   */
  public checkIn(
    room: PlacedBuilding,
    customerId: string,
    sleepDurationSec: number,
    currentTime: number
  ): number {
    room.roomStatus = 'OCCUPIED';
    room.currentOccupantId = customerId;
    room.occupiedUntil = currentTime + sleepDurationSec;

    const rate = room.type === 'MOTEL_CABIN' ? this.nightlyRateCabin : this.nightlyRateStandard;
    room.revenueTotal += rate;

    sound.playBellSound();
    gameEvents.emit('ROOM_BOOKED', {
      roomId: room.id,
      customerId,
      rate,
      roomType: room.type
    });

    return rate;
  }

  /**
   * Updates room state (cleaning, check-out timer)
   */
  public updateRooms(
    buildings: PlacedBuilding[],
    currentTime: number,
    hasHousekeepers: boolean,
    cleaningSpeedMultiplier: number = 1.0,
    deltaTimeSec: number = 1.0
  ): void {
    buildings.forEach(building => {
      if (building.type !== 'MOTEL_ROOM' && building.type !== 'MOTEL_CABIN') return;

      // Check out when time arrives
      if (building.roomStatus === 'OCCUPIED' && building.occupiedUntil && currentTime >= building.occupiedUntil) {
        building.roomStatus = 'VACANT_DIRTY';
        building.currentOccupantId = undefined;
        building.occupiedUntil = undefined;
      }

      // Housekeeper cleaning dirty rooms
      if (building.roomStatus === 'VACANT_DIRTY' && hasHousekeepers) {
        // Condition recovers slowly while being cleaned
        building.condition = (building.condition || 80) + (10 * cleaningSpeedMultiplier * deltaTimeSec);
        if (building.condition >= 100) {
          building.condition = 100;
          building.roomStatus = 'VACANT_CLEAN';
          gameEvents.emit('ROOM_CLEANED', { roomId: building.id });
        }
      }
    });
  }

  public getStats(buildings: PlacedBuilding[]): RoomStats {
    let totalRooms = 0;
    let occupiedRooms = 0;
    let dirtyRooms = 0;
    let cleanVacantRooms = 0;

    buildings.forEach(b => {
      if (b.type === 'MOTEL_ROOM' || b.type === 'MOTEL_CABIN') {
        totalRooms++;
        if (b.roomStatus === 'OCCUPIED') occupiedRooms++;
        else if (b.roomStatus === 'VACANT_DIRTY') dirtyRooms++;
        else if (b.roomStatus === 'VACANT_CLEAN') cleanVacantRooms++;
      }
    });

    return {
      totalRooms,
      occupiedRooms,
      dirtyRooms,
      cleanVacantRooms,
      nightlyRateStandard: this.nightlyRateStandard,
      nightlyRateCabin: this.nightlyRateCabin
    };
  }
}
