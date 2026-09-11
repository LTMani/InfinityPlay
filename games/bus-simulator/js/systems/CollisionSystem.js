/**
 * Bus Simulator - Collision System (5)
 * Detects and responds to road boundary collisions and static obstacles.
 * Works with the road network to keep the bus on-track.
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);

  const CollisionSystem = {
    _obstacles: [],
    _roadBoundaries: [],
    _collisionEnabled: true,

    init(modules) {
      this.modules = modules;
      this._obstacles = [];
      this._roadBoundaries = [];
      this._collisionEnabled = true;
      this._buildRoadBoundaries();
    },

    _buildRoadBoundaries() {
      this._roadBoundaries = [];
      const map = this.modules.Map;
      if (!map || !map.allRoads) return;

      for (const road of map.allRoads) {
        const halfWidth = road.width / 2;
        const dx = road.x2 - road.x1;
        const dy = road.y2 - road.y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) continue;

        const nx = -dy / len;
        const ny = dx / len;

        const boundary = {
          x1: road.x1, y1: road.y1,
          x2: road.x2, y2: road.y2,
          normalX: nx, normalY: ny,
          halfWidth: halfWidth,
          speedLimit: road.speedLimit,
          leftEdgeX1: road.x1 + nx * halfWidth,
          leftEdgeY1: road.y1 + ny * halfWidth,
          leftEdgeX2: road.x2 + nx * halfWidth,
          leftEdgeY2: road.y2 + ny * halfWidth,
          rightEdgeX1: road.x1 - nx * halfWidth,
          rightEdgeY1: road.y1 - ny * halfWidth,
          rightEdgeX2: road.x2 - nx * halfWidth,
          rightEdgeY2: road.y2 - ny * halfWidth
        };

        this._roadBoundaries.push(boundary);
      }
    },

    update(dt) {
      if (!this._collisionEnabled) return;

      const init = this.modules.GameInitSystem;
      const bus = init ? init.getActiveBus() : null;
      if (!bus || !bus.active) return;

      const boundaryCheck = this._checkRoadBoundary(bus);
      if (boundaryCheck.collided) {
        bus.damage = Math.min(100, bus.damage + boundaryCheck.impact * 0.5);
        bus.condition = Math.max(0, 100 - bus.damage);

        if (EventManager) {
          EventManager.emit('boundaryCollision', {
            impact: boundaryCheck.impact,
            position: { x: bus.x, y: bus.y },
            speed: bus.speed
          });
        }
      }
    },

    _checkRoadBoundary(bus) {
      let nearestBoundary = null;
      let minDist = Infinity;

      const roadSystem = this.modules.RoadSystem;
      if (roadSystem && typeof roadSystem.findNearestRoad === 'function') {
        const nearestRoad = roadSystem.findNearestRoad(bus.x, bus.y);
        if (nearestRoad) {
          const point = nearestRoad.getNearestPoint(bus.x, bus.y);
          const dist = Math.sqrt(Math.pow(bus.x - point.x, 2) + Math.pow(bus.y - point.y, 2));
          const threshold = (nearestRoad.width / 2) + bus.width;

          if (dist > threshold) {
            nearestBoundary = { road: nearestRoad, point, dist };
            minDist = dist;
          }
        }
      }

      if (!nearestBoundary && this._roadBoundaries.length > 0) {
        for (const boundary of this._roadBoundaries) {
          const d = this._pointToLineDistance(bus.x, bus.y, boundary);
          if (d < minDist) {
            minDist = d;
            nearestBoundary = { boundary, dist: d };
          }
        }
      }

      if (!nearestBoundary) {
        return { collided: false };
      }

      const roadWidth = nearestBoundary.road ? nearestBoundary.road.width : nearestBoundary.boundary.halfWidth * 2;
      const threshold = roadWidth / 2 + bus.width / 2;

      if (minDist > threshold) {
        const excess = minDist - threshold;
        const impact = Math.min(100, excess * 2);

        if (nearestBoundary.road) {
          const point = nearestBoundary.point;
          const dx = bus.x - point.x;
          const dy = bus.y - point.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) {
            bus.x = point.x + (dx / len) * threshold;
            bus.y = point.y + (dy / len) * threshold;
          }
        }

        const speedFactor = bus.speed / (bus.maxSpeed || 65);
        bus.speed *= Math.pow(0.92, speedFactor * 60 * (1 / 60));
        if (bus.speed < 0.5) bus.speed = 0;

        return { collided: true, impact: impact };
      }

      return { collided: false };
    },

    _pointToLineDistance(px, py, line) {
      const dx = line.x2 - line.x1;
      const dy = line.y2 - line.y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return Math.sqrt(Math.pow(px - line.x1, 2) + Math.pow(py - line.y1, 2));
      const t = Math.max(0, Math.min(1, ((px - line.x1) * dx + (py - line.y1) * dy) / (len * len)));
      const projX = line.x1 + t * dx;
      const projY = line.y1 + t * dy;
      return Math.sqrt(Math.pow(px - projX, 2) + Math.pow(py - projY, 2));
    },

    addStaticObstacle(x, y, radius, options) {
      this._obstacles.push({
        x: x, y: y, radius: radius,
        type: options ? options.type : 'obstacle',
        properties: options || {}
      });
    },

    _checkObstacleCollision(bus) {
      for (const obstacle of this._obstacles) {
        const dist = Math.sqrt(Math.pow(bus.x - obstacle.x, 2) + Math.pow(bus.y - obstacle.y, 2));
        if (dist < obstacle.radius + bus.width / 2) {
          return obstacle;
        }
      }
      return null;
    },

    debugDraw(renderer, camera) {
      if (!GameConfig || !GameConfig.debug.showColliders) return;

      if (this._roadBoundaries) {
        for (const boundary of this._roadBoundaries) {
          renderer.drawLine(
            boundary.x1, boundary.y1,
            boundary.x2, boundary.y2,
            'rgba(239, 68, 68, 0.3)', 1
          );
        }
      }
    },

    enable() { this._collisionEnabled = true; },
    disable() { this._collisionEnabled = false; },

    destroy() {
      this._obstacles = [];
      this._roadBoundaries = [];
      this._collisionEnabled = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.CollisionSystem = CollisionSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = CollisionSystem;
  }
})();
