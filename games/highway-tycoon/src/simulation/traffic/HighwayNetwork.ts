import { GridCoord, PlacedBuilding } from '../../types';

export class HighwayNetwork {
  public highwayY: number = 3;
  public offRampEntrance: GridCoord = { x: 5, y: 3 };
  public offRampExit: GridCoord = { x: 6, y: 6 };
  public onRampEntrance: GridCoord = { x: 22, y: 6 };
  public onRampHighwayMerge: GridCoord = { x: 24, y: 3 };

  /**
   * Generates a waypoint path from off-ramp to a target building
   */
  public generatePathToBuilding(targetBuilding: PlacedBuilding): GridCoord[] {
    const path: GridCoord[] = [];

    // From off-ramp down into oasis driveway
    path.push({ x: 5, y: 3 });
    path.push({ x: 5, y: 4 });
    path.push({ x: 6, y: 5 });
    path.push({ x: 6, y: 6 });

    const startX = 6;
    const targetX = Math.round(targetBuilding.x);
    const targetY = Math.round(targetBuilding.y);

    // Move along main boulevard to target's X position
    if (targetX > startX) {
      for (let x = startX + 1; x <= targetX; x++) {
        path.push({ x, y: 6 });
      }
    } else if (targetX < startX) {
      for (let x = startX - 1; x >= targetX; x--) {
        path.push({ x, y: 6 });
      }
    }

    // Move from main boulevard y=6 to target's Y position
    if (targetY > 6) {
      for (let y = 7; y <= targetY; y++) {
        path.push({ x: targetX, y });
      }
    } else if (targetY < 6) {
      for (let y = 5; y >= targetY; y--) {
        path.push({ x: targetX, y });
      }
    }

    path.push({ x: targetX, y: targetY });
    return path;
  }

  /**
   * Generates a waypoint path from building/current pos to on-ramp exit back to highway
   */
  public generatePathToExit(rawFromX: number, rawFromY: number): GridCoord[] {
    const path: GridCoord[] = [];
    const fromX = Math.max(0, Math.min(35, Math.round(rawFromX)));
    const fromY = Math.max(0, Math.min(35, Math.round(rawFromY)));
    const exitX = this.onRampEntrance.x; // 22

    // Return to main boulevard y = 6
    if (fromY > 6) {
      for (let y = fromY - 1; y >= 6; y--) {
        path.push({ x: fromX, y });
      }
    } else if (fromY < 6) {
      for (let y = fromY + 1; y <= 6; y++) {
        path.push({ x: fromX, y });
      }
    }

    // Drive along boulevard to on-ramp entrance at x = 22
    if (fromX < exitX) {
      for (let x = fromX + 1; x <= exitX; x++) {
        path.push({ x, y: 6 });
      }
    } else if (fromX > exitX) {
      for (let x = fromX - 1; x >= exitX; x--) {
        path.push({ x, y: 6 });
      }
    }

    // Accelerate through on-ramp merge
    path.push({ x: 22, y: 6 });
    path.push({ x: 23, y: 5 });
    path.push({ x: 23, y: 4 });
    path.push({ x: 24, y: 3 });

    return path;
  }
}
