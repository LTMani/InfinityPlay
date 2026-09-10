/**
 * Bus Simulator - Road System (11)
 * Handles road rendering, pathfinding, and road network queries
 *
 * SKELETON - Pathfinding stub, rendering delegates to Road entities
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);

  const RoadSystem = {
    _roadGraph: null,
    _navigationCache: {},

    init(modules) {
      this.modules = modules;
      this._roadGraph = null;
      this._navigationCache = {};
    },

    /**
     * Build a navigation graph from the world's road network.
     */
    buildGraph() {
      const map = this.modules.Map;
      if (!map || !map.allRoads) return;

      this._roadGraph = {
        nodes: {},
        edges: []
      };

      // Create nodes from road endpoints
      for (const road of map.allRoads) {
        const key1 = `${road.x1},${road.y1}`;
        const key2 = `${road.x2},${road.y2}`;

        if (!this._roadGraph.nodes[key1]) {
          this._roadGraph.nodes[key1] = { x: road.x1, y: road.y1, edges: [] };
        }
        if (!this._roadGraph.nodes[key2]) {
          this._roadGraph.nodes[key2] = { x: road.x2, y: road.y2, edges: [] };
        }
      }

      // Create edges
      for (const road of map.allRoads) {
        const key1 = `${road.x1},${road.y1}`;
        const key2 = `${road.x2},${road.y2}`;
        const distance = road.getDistance();

        this._roadGraph.nodes[key1].edges.push({ to: key2, distance, road });
        this._roadGraph.nodes[key2].edges.push({ to: key1, distance, road });
      }
    },

    /**
     * A* pathfinding between two points.
     * @returns {Array<Road>} list of roads forming the path
     */
    findPath(startX, startY, endX, endY) {
      const cacheKey = `${Math.round(startX)},${Math.round(startY)}->${Math.round(endX)},${Math.round(endY)}`;
      if (this._navigationCache[cacheKey]) {
        return this._navigationCache[cacheKey];
      }

      if (!this._roadGraph) {
        this.buildGraph();
      }

      if (!this._roadGraph) return [];

      // Find nearest nodes to start and end
      const startNode = this._findNearestNode(startX, startY);
      const endNode = this._findNearestNode(endX, endY);

      if (!startNode || !endNode) return [];

      // Simple pathfinding (BFS for now, A* to be implemented in Phase 2)
      const openSet = [startNode.key];
      const cameFrom = {};
      const gScore = {};
      gScore[startNode.key] = 0;

      const visited = new Set();

      while (openSet.length > 0) {
        const currentKey = openSet.shift();
        if (visited.has(currentKey)) continue;
        visited.add(currentKey);

        if (currentKey === endNode.key) {
          // Reconstruct path
          const path = [currentKey];
          let key = currentKey;
          while (cameFrom[key]) {
            key = cameFrom[key];
            path.unshift(key);
          }
          return this._pathToRoads(path);
        }

        const node = this._roadGraph.nodes[currentKey];
        if (!node) continue;

        for (const edge of node.edges) {
          if (visited.has(edge.to)) continue;
          const tentativeG = gScore[currentKey] + edge.distance;
          if (!gScore[edge.to] || tentativeG < gScore[edge.to]) {
            cameFrom[edge.to] = currentKey;
            gScore[edge.to] = tentativeG;
            openSet.push(edge.to);
          }
        }
      }

      return [];
    },

    _findNearestNode(x, y) {
      if (!this._roadGraph) return null;

      let nearest = null;
      let minDist = Infinity;
      const threshold = 100;

      for (const key in this._roadGraph.nodes) {
        const node = this._roadGraph.nodes[key];
        const dist = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
        if (dist < minDist && dist < threshold) {
          minDist = dist;
          nearest = { key, x: node.x, y: node.y };
        }
      }

      // Also check endpoints of all roads
      const map = this.modules.Map;
      if (map && map.allRoads) {
        for (const road of map.allRoads) {
          const d1 = Math.sqrt(Math.pow(road.x1 - x, 2) + Math.pow(road.y1 - y, 2));
          if (d1 < minDist && d1 < threshold) {
            minDist = d1;
            nearest = { key: `${road.x1},${road.y1}`, x: road.x1, y: road.y1 };
          }
          const d2 = Math.sqrt(Math.pow(road.x2 - x, 2) + Math.pow(road.y2 - y, 2));
          if (d2 < minDist && d2 < threshold) {
            minDist = d2;
            nearest = { key: `${road.x2},${road.y2}`, x: road.x2, y: road.y2 };
          }
        }
      }

      return nearest;
    },

    _pathToRoads(path) {
      if (!path || path.length < 2) return [];

      const map = this.modules.Map;
      if (!map || !map.allRoads) return [];

      const roads = [];
      for (let i = 0; i < path.length - 1; i++) {
        const [x1, y1] = path[i].split(',').map(Number);
        const [x2, y2] = path[i + 1].split(',').map(Number);

        // Find connecting road
        for (const road of map.allRoads) {
          const matches1 = (road.x1 === x1 && road.y1 === y1) || (road.x1 === x2 && road.y1 === y2);
          const matches2 = (road.x2 === x1 && road.y2 === y1) || (road.x2 === x2 && road.y2 === y2);
          if (matches1 && matches2) {
            roads.push(road);
            break;
          }
        }
      }
      return roads;
    },

    findNearestRoad(x, y) {
      const map = this.modules.Map;
      if (!map || !map.allRoads) return null;

      let nearest = null;
      let minDist = Infinity;

      for (const road of map.allRoads) {
        const point = road.getNearestPoint(x, y);
        const dist = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
        if (dist < minDist) {
          minDist = dist;
          nearest = road;
        }
      }
      return nearest;
    },

    snapToRoad(entity) {
      if (!entity) return;
      const road = this.findNearestRoad(entity.x, entity.y);
      if (!road) return;

      const point = road.getNearestPoint(entity.x, entity.y);
      const snapDist = 3;

      if (point && Math.sqrt(Math.pow(entity.x - point.x, 2) + Math.pow(entity.y - point.y, 2)) < snapDist * 20) {
        entity.x = point.x;
        entity.y = point.y;
        entity._currentSpeedLimit = road.speedLimit;
      }
    },

    drawRoads(renderer, camera) {
      if (!this.modules.Map || !this.modules.Map.allRoads) return;
      for (const road of this.modules.Map.allRoads) {
        road.draw(renderer, camera);
      }
    },

    getRoadDensity(x, y, radius) {
      if (!this.modules.Map || !this.modules.Map.allRoads) return 0;
      let count = 0;
      const r2 = radius * radius;
      for (const road of this.modules.Map.allRoads) {
        const point = road.getNearestPoint(x, y);
        const distSq = Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2);
        if (distSq < r2) count++;
      }
      return count;
    },

    destroy() {
      this._roadGraph = null;
      this._navigationCache = {};
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.RoadSystem = RoadSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = RoadSystem;
  }
})();
