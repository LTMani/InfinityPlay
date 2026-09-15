import { GridCoord, ScreenCoord } from '../types';

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

/**
 * Converts grid coordinates (tile units) to screen pixel coordinates
 */
export function gridToScreen(
  gx: number,
  gy: number,
  originX: number,
  originY: number,
  zoom: number = 1
): ScreenCoord {
  const halfW = (TILE_WIDTH / 2) * zoom;
  const halfH = (TILE_HEIGHT / 2) * zoom;
  return {
    x: originX + (gx - gy) * halfW,
    y: originY + (gx + gy) * halfH,
  };
}

/**
 * Converts screen pixel coordinates to nearest grid coordinates
 */
export function screenToGrid(
  sx: number,
  sy: number,
  originX: number,
  originY: number,
  zoom: number = 1
): GridCoord {
  const halfW = (TILE_WIDTH / 2) * zoom;
  const halfH = (TILE_HEIGHT / 2) * zoom;

  const dx = sx - originX;
  const dy = sy - originY;

  const gx = (dx / halfW + dy / halfH) / 2;
  const gy = (dy / halfH - dx / halfW) / 2;

  return {
    x: Math.floor(gx),
    y: Math.floor(gy),
  };
}

/**
 * Depth sort comparator for painter's algorithm
 */
export function isometricDepthSort(
  a: { x: number; y: number; width?: number; height?: number; zOrder?: number },
  b: { x: number; y: number; width?: number; height?: number; zOrder?: number }
): number {
  const aCenter = a.x + (a.width ? a.width / 2 : 0) + a.y + (a.height ? a.height / 2 : 0) + (a.zOrder || 0);
  const bCenter = b.x + (b.width ? b.width / 2 : 0) + b.y + (b.height ? b.height / 2 : 0) + (b.zOrder || 0);
  return aCenter - bCenter;
}

/**
 * Distance between two grid points (Manhattan and Euclidean)
 */
export function manhattanDistance(a: GridCoord, b: GridCoord): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function euclideanDistance(a: GridCoord, b: GridCoord): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
