import { describe, it, expect, beforeEach } from 'vitest';
import { RoomManager } from '../simulation/hospitality/RoomManager';
import { PlacedBuilding } from '../types';

describe('RoomManager & Hospitality Turnover', () => {
  let roomManager: RoomManager;
  let buildings: PlacedBuilding[];

  beforeEach(() => {
    roomManager = new RoomManager();
    buildings = [
      {
        id: 'motel_1',
        defId: 'MOTEL_ROOM',
        type: 'MOTEL_ROOM',
        x: 10,
        y: 10,
        width: 2,
        height: 2,
        level: 1,
        condition: 100,
        active: true,
        roomStatus: 'VACANT_CLEAN',
        revenueTotal: 0
      },
      {
        id: 'cabin_1',
        defId: 'MOTEL_CABIN',
        type: 'MOTEL_CABIN',
        x: 14,
        y: 10,
        width: 1,
        height: 2,
        level: 1,
        condition: 100,
        active: true,
        roomStatus: 'VACANT_CLEAN',
        revenueTotal: 0
      }
    ];
  });

  it('should find clean vacant rooms matching trucker preferences', () => {
    const truckerRoom = roomManager.findAvailableRoom(buildings, true);
    expect(truckerRoom).toBeDefined();
    expect(truckerRoom?.type).toBe('MOTEL_CABIN');

    const carRoom = roomManager.findAvailableRoom(buildings, false);
    expect(carRoom).toBeDefined();
    expect(carRoom?.type).toBe('MOTEL_ROOM');
  });

  it('should check guest in and record revenue', () => {
    const room = buildings[0];
    const bill = roomManager.checkIn(room, 'cust_123', 8, 14);

    expect(bill).toBe(roomManager.nightlyRateStandard);
    expect(room.roomStatus).toBe('OCCUPIED');
    expect(room.currentOccupantId).toBe('cust_123');
    expect(room.occupiedUntil).toBe(22);
  });

  it('should transition room to VACANT_DIRTY after checkout', () => {
    const room = buildings[0];
    roomManager.checkIn(room, 'cust_123', 4, 10);

    // Update rooms at hour 15 (past checkout time 14)
    roomManager.updateRooms(buildings, 15, false);

    expect(room.roomStatus).toBe('VACANT_DIRTY');
    expect(room.currentOccupantId).toBeUndefined();
  });

  it('should clean dirty rooms when housekeepers are active', () => {
    const room = buildings[0];
    room.roomStatus = 'VACANT_DIRTY';
    room.condition = 70;

    // Simulate housekeeping with multiplier 2.0
    roomManager.updateRooms(buildings, 15, true, 2.0, 2.0);

    expect(room.condition).toBeGreaterThan(70);
  });
});
