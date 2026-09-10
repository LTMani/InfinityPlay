/**
 * Bus Simulator - World: Curved Road
 * Multi-point road segment supporting curves via piecewise linear or Bezier curves
 */

(function () {
  'use strict';

  const Road = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Road) ||
    (typeof require !== 'undefined' ? require('../Road') : null);

  function CurvedRoad(id, points, options) {
    if (!points || points.length < 2) {
      throw new Error('CurvedRoad requires at least 2 points');
    }

    this.points = points;

    // Initialize as base Road with first and last points
    if (Road) {
      Road.call(this, id, points[0][0], points[0][1], points[points.length - 1][0], points[points.length - 1][1], options);
    } else {
      this.id = id || 'curvedroad_' + Math.random().toString(36).substr(2, 9);
      this.x1 = points[0][0];
      this.y1 = points[0][1];
      this.x2 = points[points.length - 1][0];
      this.y2 = points[points.length - 1][1];
      this.width = options.width || 20;
      this.lanes = options.lanes || 2;
      this.roadType = options.roadType || 'highway';
      this.surface = options.surface || 'asphalt';
      this.speedLimit = options.speedLimit || (this.roadType === 'highway' ? 80 : 40);
      this.connections = options.connections || [];
    }

    this.segments = [];
    this._buildSegments();
  }

  if (Road) {
    CurvedRoad.prototype = Object.create(Road.prototype);
    CurvedRoad.prototype.constructor = CurvedRoad;
  }

  CurvedRoad.prototype._buildSegments = function () {
    this.segments = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];
      const segId = `${this.id}_seg${i}`;
      const segOpts = {
        width: this.width,
        lanes: this.lanes,
        roadType: this.roadType,
        surface: this.surface,
        speedLimit: this.speedLimit
      };
      // Use Road for 2-point segments to avoid recursion;
      // CurvedRoad is only needed for multi-point roads
      let seg;
      if (Road) {
        seg = new Road(
          segId, p1[0], p1[1], p2[0], p2[1], segOpts
        );
      }
      this.segments.push(seg);
    }
  };

  CurvedRoad.prototype.getDistance = function () {
    let dist = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      const dx = this.points[i + 1][0] - this.points[i][0];
      const dy = this.points[i + 1][1] - this.points[i][1];
      dist += Math.sqrt(dx * dx + dy * dy);
    }
    return dist;
  };

  CurvedRoad.prototype.getDirection = function () {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    return Math.atan2(dy, dx);
  };

  CurvedRoad.prototype.getEndPoints = function () {
    return {
      start: { x: this.x1, y: this.y1 },
      end: { x: this.x2, y: this.y2 }
    };
  };

  CurvedRoad.prototype.getNearestPoint = function (px, py) {
    let nearest = { x: px, y: py, t: 0, dist: Infinity };

    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i];
      const point = Road ? Road.prototype.getNearestPoint.call(seg, px, py) : null;
      if (!point) continue;
      const dist = Math.sqrt(Math.pow(point.x - px, 2) + Math.pow(point.y - py, 2));
      if (dist < nearest.dist) {
        nearest = { x: point.x, y: point.y, t: point.t, dist: dist };
      }
    }

    // Also check all points
    for (let i = 0; i < this.points.length; i++) {
      const pt = this.points[i];
      const dist = Math.sqrt(Math.pow(pt[0] - px, 2) + Math.pow(pt[1] - py, 2));
      if (dist < nearest.dist) {
        nearest = { x: pt[0], y: pt[1], t: i / (this.points.length - 1), dist: dist };
      }
    }

    delete nearest.dist;
    return nearest;
  };

  CurvedRoad.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const offsetX = camera ? camera.x : 0;
    const offsetY = camera ? camera.y : 0;
    const cx = renderer.width / 2;
    const cy = renderer.height / 2;

    const screenPoints = this.points.map(p => ({
      x: (p[0] - offsetX) * zoom + cx,
      y: (p[1] - offsetY) * zoom + cy
    }));

    const w = this.width * zoom;
    const isHighway = this.roadType === 'highway';
    const roadColor = isHighway ? '#1e293b' : '#374151';

    renderer.context.save();

    // Draw road body as polygon using parallel offset curves
    const halfWidth = w / 2;
    const leftPoints = [];
    const rightPoints = [];

    for (let i = 0; i < screenPoints.length; i++) {
      let nx, ny;
      if (i === 0) {
        const dx = screenPoints[1].x - screenPoints[0].x;
        const dy = screenPoints[1].y - screenPoints[0].y;
        const len = Math.sqrt(dx * dx + dy * dy);
        nx = -dy / len;
        ny = dx / len;
      } else if (i === screenPoints.length - 1) {
        const dx = screenPoints[i].x - screenPoints[i - 1].x;
        const dy = screenPoints[i].y - screenPoints[i - 1].y;
        const len = Math.sqrt(dx * dx + dy * dy);
        nx = -dy / len;
        ny = dx / len;
      } else {
        const dx1 = screenPoints[i].x - screenPoints[i - 1].x;
        const dy1 = screenPoints[i].y - screenPoints[i - 1].y;
        const dx2 = screenPoints[i + 1].x - screenPoints[i].x;
        const dy2 = screenPoints[i + 1].y - screenPoints[i].y;
        const angle1 = Math.atan2(dy1, dx1);
        const angle2 = Math.atan2(dy2, dx2);
        const avgAngle = (angle1 + angle2) / 2;
        nx = -Math.sin(avgAngle);
        ny = Math.cos(avgAngle);
      }

      leftPoints.push({ x: screenPoints[i].x + nx * halfWidth, y: screenPoints[i].y + ny * halfWidth });
      rightPoints.push({ x: screenPoints[i].x - nx * halfWidth, y: screenPoints[i].y - ny * halfWidth });
    }

    // Draw filled polygon (road body)
    renderer.context.fillStyle = roadColor;
    renderer.context.beginPath();
    renderer.context.moveTo(leftPoints[0].x, leftPoints[0].y);
    for (let i = 1; i < leftPoints.length; i++) {
      renderer.context.lineTo(leftPoints[i].x, leftPoints[i].y);
    }
    for (let i = rightPoints.length - 1; i >= 0; i--) {
      renderer.context.lineTo(rightPoints[i].x, rightPoints[i].y);
    }
    renderer.context.closePath();
    renderer.context.fill();

    // Draw center line (dashed for highways, solid for local roads)
    if (this.lanes >= 2) {
      if (isHighway) {
        renderer.context.strokeStyle = '#fbbf24';
        renderer.context.lineWidth = Math.max(1, w * 0.015);
        renderer.context.setLineDash([w * 0.3, w * 0.2]);
      } else {
        renderer.context.strokeStyle = '#ffffff';
        renderer.context.lineWidth = Math.max(1, w * 0.02);
        renderer.context.setLineDash([w * 0.2, w * 0.15]);
      }
      renderer.context.setLineCap('round');
      renderer.context.beginPath();
      renderer.context.moveTo(screenPoints[0].x, screenPoints[0].y);
      for (let i = 1; i < screenPoints.length; i++) {
        renderer.context.lineTo(screenPoints[i].x, screenPoints[i].y);
      }
      renderer.context.stroke();
      renderer.context.setLineDash([]);
    }

    // Draw road edges (white/yellow lines)
    renderer.context.strokeStyle = isHighway ? '#f59e0b' : '#ffffff';
    renderer.context.lineWidth = Math.max(1, w * 0.02);
    renderer.context.setLineCap('round');
    renderer.context.beginPath();
    renderer.context.moveTo(leftPoints[0].x, leftPoints[0].y);
    for (let i = 1; i < leftPoints.length; i++) {
      renderer.context.lineTo(leftPoints[i].x, leftPoints[i].y);
    }
    renderer.context.stroke();
    renderer.context.beginPath();
    renderer.context.moveTo(rightPoints[0].x, rightPoints[0].y);
    for (let i = 1; i < rightPoints.length; i++) {
      renderer.context.lineTo(rightPoints[i].x, rightPoints[i].y);
    }
    renderer.context.stroke();

    // Draw shoulder for highways
    if (isHighway) {
      renderer.context.strokeStyle = '#8d7a63';
      renderer.context.lineWidth = Math.max(2, w * 0.04);
      renderer.context.setLineDash([w * 0.1, w * 0.15]);
      // Left shoulder
      renderer.context.beginPath();
      const shoulderLeft = [];
      const shoulderRight = [];
      for (let i = 0; i < screenPoints.length; i++) {
        let nx, ny;
        if (i === 0) {
          const dx = screenPoints[1].x - screenPoints[0].x;
          const dy = screenPoints[1].y - screenPoints[0].y;
          const len = Math.sqrt(dx * dx + dy * dy);
          nx = -dy / len;
          ny = dx / len;
        } else {
          const dx = screenPoints[i].x - screenPoints[i - 1].x;
          const dy = screenPoints[i].y - screenPoints[i - 1].y;
          const len = Math.sqrt(dx * dx + dy * dy);
          nx = -dy / len;
          ny = dx / len;
        }
        shoulderLeft.push({ x: screenPoints[i].x + nx * (halfWidth + 2), y: screenPoints[i].y + ny * (halfWidth + 2) });
        shoulderRight.push({ x: screenPoints[i].x - nx * (halfWidth + 2), y: screenPoints[i].y - ny * (halfWidth + 2) });
      }
      renderer.context.moveTo(shoulderLeft[0].x, shoulderLeft[0].y);
      for (let i = 1; i < shoulderLeft.length; i++) {
        renderer.context.lineTo(shoulderLeft[i].x, shoulderLeft[i].y);
      }
      renderer.context.stroke();
      renderer.context.beginPath();
      renderer.context.moveTo(shoulderRight[0].x, shoulderRight[0].y);
      for (let i = 1; i < shoulderRight.length; i++) {
        renderer.context.lineTo(shoulderRight[i].x, shoulderRight[i].y);
      }
      renderer.context.stroke();
      renderer.context.setLineDash([]);
    }

    renderer.context.restore();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.CurvedRoad = CurvedRoad;
  }
  if (typeof module !== 'undefined') {
    module.exports = CurvedRoad;
  }
})();
