/**
 * Zombie Survival - Collision Detection and Physics Response
 * Robust 2D circle, rectangle, line, and sliding response mathematics.
 */

const Collision = {
  // Distance between two points
  dist(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.hypot(dx, dy);
  },

  // Circle vs Circle intersection
  circleCircle(c1x, c1y, r1, c2x, c2y, r2) {
    const dx = c2x - c1x;
    const dy = c2y - c1y;
    const rSum = r1 + r2;
    return (dx * dx + dy * dy) < (rSum * rSum);
  },

  // Circle vs AABB (Axis-Aligned Bounding Box)
  circleRect(cx, cy, radius, rx, ry, rw, rh) {
    // Find closest point on rectangle to circle center
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));

    const dx = cx - closestX;
    const dy = cy - closestY;

    return (dx * dx + dy * dy) < (radius * radius);
  },

  // Resolves circle colliding with AABB by pushing the circle out (sliding response)
  resolveCircleRect(circle, rect) {
    const { x: cx, y: cy, radius } = circle;
    const { x: rx, y: ry, w: rw, h: rh } = rect;

    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));

    const dx = cx - closestX;
    const dy = cy - closestY;
    const distSq = dx * dx + dy * dy;

    if (distSq < radius * radius) {
      const d = Math.sqrt(distSq);
      if (d === 0) {
        // Circle center is inside rect; push out along closest edge
        const dl = cx - rx;
        const dr = (rx + rw) - cx;
        const dt = cy - ry;
        const db = (ry + rh) - cy;
        const minVal = Math.min(dl, dr, dt, db);

        if (minVal === dl) circle.x = rx - radius;
        else if (minVal === dr) circle.x = rx + rw + radius;
        else if (minVal === dt) circle.y = ry - radius;
        else circle.y = ry + rh + radius;
      } else {
        const overlap = radius - d;
        circle.x += (dx / d) * overlap;
        circle.y += (dy / d) * overlap;
      }
      return true;
    }
    return false;
  },

  // Circle vs Circle push separation
  resolveCircleCircle(c1, c2, weight1 = 0.5, weight2 = 0.5) {
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const dist = Math.hypot(dx, dy);
    const minDist = (c1.radius || 15) + (c2.radius || 15);

    if (dist > 0 && dist < minDist) {
      const overlap = minDist - dist;
      const nx = dx / dist;
      const ny = dy / dist;

      c1.x -= nx * overlap * weight1;
      c1.y -= ny * overlap * weight1;
      c2.x += nx * overlap * weight2;
      c2.y += ny * overlap * weight2;
      return true;
    }
    return false;
  },

  // Clamps an entity inside map bounds with radius padding
  clampToBounds(entity, bounds) {
    const r = entity.radius || 15;
    if (entity.x - r < bounds.minX) entity.x = bounds.minX + r;
    if (entity.x + r > bounds.maxX) entity.x = bounds.maxX - r;
    if (entity.y - r < bounds.minY) entity.y = bounds.minY + r;
    if (entity.y + r > bounds.maxY) entity.y = bounds.maxY - r;
  },

  // Ray vs Circle intersection (for continuous laser / beam weapons)
  rayCircle(x1, y1, x2, y2, cx, cy, r) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len === 0) return this.circleCircle(x1, y1, 0, cx, cy, r);

    const u = Math.max(0, Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / (len * len)));
    const closestX = x1 + u * dx;
    const closestY = y1 + u * dy;

    return this.dist(cx, cy, closestX, closestY) <= r;
  },

  // Ray vs Line Segment (for line-of-sight and laser blocking)
  lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return null; // Parallel

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        distanceRatio: ua
      };
    }
    return null;
  }
};

window.Collision = Collision;

