/**
 * Bus Simulator - Traffic System
 * Spawns and manages AI traffic vehicles on the road network.
 * Traffic is distributed by road type, with distance-based
 * optimization and player-exclusion zones.
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const TrafficVehicle = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TrafficVehicle) ||
    (typeof require !== 'undefined' ? require('../entities/TrafficVehicle') : null);
  const TrafficVehicleTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TrafficVehicleTypes) ||
    (typeof require !== 'undefined' ? require('../data/TrafficVehicleTypes') : null);
  const TrafficConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TrafficConfig) ||
    (typeof require !== 'undefined' ? require('../config/TrafficConfig') : null);

  const TrafficSystem = {
    _vehicles: [],
    _modules: null,
    _active: false,
    _spawnTimer: 0,
    _despawnTimer: 0,
    _totalSpawned: 0,
    _totalDespawned: 0,

    init(modules) {
      this._modules = modules;
      this._vehicles = [];
      this._spawnTimer = 0;
      this._despawnTimer = 0;
      this._totalSpawned = 0;
      this._totalDespawned = 0;
      this._active = TrafficConfig ? TrafficConfig.active : true;

      if (EventManager) {
        EventManager.emit('trafficSystemReady', {
          maxVehicles: (TrafficConfig ? TrafficConfig.maxVehicles : 40)
        });
      }
    },

    update(dt) {
      if (!this._active) return;

      const cfg = TrafficConfig || {};
      const map = this._modules ? this._modules.Map : null;
      if (!map || !map.allRoads || map.allRoads.length === 0) return;

      // Player position for distance checks
      const playerBus = this._getPlayerBus();
      const playerPos = playerBus ? { x: playerBus.x, y: playerBus.y } : { x: 0, y: 0 };

      // Spawn new traffic
      this._spawnTimer += dt;
      if (this._spawnTimer >= (cfg.spawnInterval || 1.0)) {
        this._spawnTimer = 0;

        const maxV = (cfg.maxVehicles || 40);
        if (this._vehicles.length < maxV) {
          this._spawnVehicle(map, playerPos);
        }
      }

      // Despawn check
      this._despawnTimer += dt;
      const despawnInterval = (cfg.optimization ? cfg.optimization.despawnCheckInterval : 2.0);
      if (this._despawnTimer >= despawnInterval) {
        this._despawnTimer = 0;
        this._despawnDistant(map, playerPos);
      }

      // Update vehicles (with optimization: only update near player/camera)
      this._updateVehicles(dt, map, playerPos, cfg);
    },

    _getPlayerBus() {
      const init = this._modules ? this._modules.GameInitSystem : null;
      if (init && typeof init.getActiveBus === 'function') {
        return init.getActiveBus();
      }
      return null;
    },

    _spawnVehicle(map, playerPos) {
      if (!TrafficVehicle || !map.allRoads || map.allRoads.length === 0) return;
      if (!TrafficVehicleTypes) {
        // Fallback to basic spawn
        return this._spawnVehicleBasic(map, playerPos);
      }

      const cfg = TrafficConfig || {};
      const exclusionRadius = (cfg.playerSpawnExclusionRadius || 600);
      const spawnRateByType = cfg.spawnRateByRoadType || {};

      // Build candidate pool of roads with their spawn probability
      const candidates = [];
      for (let i = 0; i < map.allRoads.length; i++) {
        const road = map.allRoads[i];
        if (!road || !road.roadType) continue;

        const rate = spawnRateByType[road.roadType] || 0.5;
        const density = (cfg.densityByRoadType && cfg.densityByRoadType[road.roadType]) || 0.5;

        // Weighted candidate selection
        candidates.push({ road: road, weight: rate * density });
      }

      if (candidates.length === 0) return;

      // Pick a road using weighted random selection
      let totalWeight = 0;
      for (let i = 0; i < candidates.length; i++) {
        totalWeight += candidates[i].weight;
      }

      let r = Math.random() * totalWeight;
      let selectedRoad = null;
      for (let i = 0; i < candidates.length; i++) {
        r -= candidates[i].weight;
        if (r <= 0) {
          selectedRoad = candidates[i].road;
          break;
        }
      }
      if (!selectedRoad) selectedRoad = candidates[0].road;

      // Pick spawn point at start or end of road
      const atStart = Math.random() < 0.5;
      const x = atStart ? selectedRoad.x1 : selectedRoad.x2;
      const y = atStart ? selectedRoad.y1 : selectedRoad.y2;

      // Check player exclusion zone
      if (playerPos) {
        const distToPlayer = Math.sqrt(Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2));
        if (distToPlayer < exclusionRadius) return;
      }

      // Get direction along the road
      let angle = selectedRoad.getDirection();
      if (!atStart) angle += Math.PI;

      // Select vehicle type appropriate for road type
      const vehicleType = TrafficVehicleTypes.getRandom(selectedRoad.roadType);

      // Create the traffic vehicle
      const vehicle = new TrafficVehicle(x, y, selectedRoad, angle, vehicleType);

      // Apply speed variance
      const varFactor = 1 - (cfg.ai ? cfg.ai.speedVariance : 0.15) * Math.random();
      vehicle.targetSpeed = vehicle.maxSpeed * (0.7 + Math.random() * 0.3) * varFactor;

      // Store road reference and direction for AI pathfinding
      vehicle._aiRoad = selectedRoad;
      vehicle._aiTravelDirection = atStart ? 1 : -1;
      vehicle._aiTargetRoad = null;
      vehicle._aiPathIndex = atStart ? 0 : -1;

      this._vehicles.push(vehicle);
      this._totalSpawned++;

      if (EventManager) {
        EventManager.emit('trafficVehicleSpawned', {
          id: vehicle.id,
          type: vehicle.vehicleType,
          x: vehicle.x,
          y: vehicle.y
        });
      }
    },

    _spawnVehicleBasic(map, playerPos) {
      // Legacy fallback spawn
      if (!TrafficVehicle || !map.allRoads) return;
      const road = map.allRoads[Math.floor(Math.random() * map.allRoads.length)];
      if (!road) return;

      const atStart = Math.random() < 0.5;
      const x = atStart ? road.x1 : road.x2;
      const y = atStart ? road.y1 : road.y2;

      if (playerPos) {
        const dist = Math.sqrt(Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2));
        if (dist < 600) return;
      }

      let angle = road.getDirection();
      if (!atStart) angle += Math.PI;

      const vehicle = new TrafficVehicle(x, y, road.x1, road.y1, null);
      vehicle.angle = angle;
      vehicle.targetSpeed = vehicle.maxSpeed * (0.6 + Math.random() * 0.4);

      this._vehicles.push(vehicle);
      this._totalSpawned++;
    },

    _spawnVehicleAtIntersection(map, intersection, vehicleType) {
      // Used by AIVehicleSystem or for intersection-based spawning
      if (!TrafficVehicle || !Intersection) return null;

      const angle = Math.random() * Math.PI * 2;
      const vehicle = new TrafficVehicle(
        intersection.x, intersection.y, intersection.connectedRoads || [], angle, vehicleType
      );

      vehicle._aiRoad = null;
      vehicle._aiTravelDirection = 1;
      vehicle._aiTargetRoad = null;
      vehicle._aiPathIndex = 0;

      this._vehicles.push(vehicle);
      this._totalSpawned++;

      return vehicle;
    },

    _despawnDistant(map, playerPos) {
      const cfg = TrafficConfig || {};
      const despawnRadius = (cfg.playerDespawnRadius || 1200);
      const mapMargin = (cfg.optimization ? cfg.optimization.mapMargin : 500);

      for (let i = this._vehicles.length - 1; i >= 0; i--) {
        const v = this._vehicles[i];
        let shouldDespawn = false;

        // Despawn if too far from player
        if (playerPos) {
          const dist = Math.sqrt(Math.pow(v.x - playerPos.x, 2) + Math.pow(v.y - playerPos.y, 2));
          if (dist > despawnRadius * 2) {
            shouldDespawn = true;
          }
        }

        // Despawn if off the map
        if (!shouldDespawn && map.worldSize) {
          if (v.x > map.worldSize.width + mapMargin || v.x < -mapMargin ||
              v.y > map.worldSize.height + mapMargin || v.y < -mapMargin) {
            shouldDespawn = true;
          }
        }

        if (shouldDespawn) {
          this._vehicles.splice(i, 1);
          this._totalDespawned++;
        }
      }
    },

    _updateVehicles(dt, map, playerPos, cfg) {
      const updateRadius = cfg.optimization ? cfg.optimization.updateRadius : 1500;
      const playerBus = this._getPlayerBus();

      for (let i = this._vehicles.length - 1; i >= 0; i--) {
        const vehicle = this._vehicles[i];

        // Optimization: skip update if too far from player
        if (playerPos) {
          const dist = Math.sqrt(Math.pow(vehicle.x - playerPos.x, 2) + Math.pow(vehicle.y - playerPos.y, 2));
          if (dist > updateRadius) {
            continue;
          }
        }

        vehicle.update(dt);

        // Remove vehicles that have left map bounds (legacy behavior)
        if (!playerPos && map.width) {
          const margin = 2000;
          if (vehicle.x > map.width + margin || vehicle.x < -margin ||
              vehicle.y > map.height + margin || vehicle.y < -margin) {
            this._vehicles.splice(i, 1);
            this._totalDespawned++;
          }
        }
      }
    },

    getVehicles() {
      return this._vehicles;
    },

    getVehicleCount() {
      return this._vehicles.length;
    },

    getTotalSpawned() {
      return this._totalSpawned;
    },

    getTotalDespawned() {
      return this._totalDespawned;
    },

    clear() {
      this._vehicles = [];
    },

    draw(renderer, camera) {
      const cfg = TrafficConfig || {};
      const drawRadius = cfg.optimization ? cfg.optimization.drawRadius : 1800;
      const camX = camera ? camera.x : 0;
      const camY = camera ? camera.y : 0;

      for (let i = 0; i < this._vehicles.length; i++) {
        const v = this._vehicles[i];

        // Optimization: skip drawing if too far from camera
        if (camera) {
          const dist = Math.sqrt(Math.pow(v.x - camX, 2) + Math.pow(v.y - camY, 2));
          if (dist > drawRadius) continue;
        }

        if (v.draw) {
          v.draw(renderer, camera);
        }
      }

      // Debug draw
      if (cfg.debug && cfg.debug.enabled) {
        this._debugDraw(renderer, camera);
      }
    },

    _debugDraw(renderer, camera) {
      if (!TrafficConfig || !TrafficConfig.debug || !TrafficConfig.debug.enabled) return;

      // Draw spawn positions (intersection points)
      if (TrafficConfig.debug.showSpawnPoints && this._modules && this._modules.Map) {
        const map = this._modules.Map;
        if (map.intersections) {
          for (let i = 0; i < map.intersections.length; i++) {
            const int = map.intersections[i];
            renderer.context.save();
            renderer.context.setTransform(1, 0, 0, 1, 0, 0);
            const cx = (int.x - (camera ? camera.x : 0)) * (camera ? camera.zoom : 1) + renderer.width / 2;
            const cy = (int.y - (camera ? camera.y : 0)) * (camera ? camera.zoom : 1) + renderer.height / 2;
            renderer.context.fillStyle = 'rgba(255, 0, 128, 0.5)';
            renderer.context.beginPath();
            renderer.context.arc(cx, cy, 5, 0, Math.PI * 2);
            renderer.context.fill();
            renderer.context.restore();
          }
        }
      }

      // Draw safe distance circles
      if (TrafficConfig.debug.showSafeDistance) {
        for (let i = 0; i < this._vehicles.length; i++) {
          const v = this._vehicles[i];
          renderer.context.save();
          renderer.context.setTransform(1, 0, 0, 1, 0, 0);
          const cx = (v.x - (camera ? camera.x : 0)) * (camera ? camera.zoom : 1) + renderer.width / 2;
          const cy = (v.y - (camera ? camera.y : 0)) * (camera ? camera.zoom : 1) + renderer.height / 2;
          const radius = (v.safeDistance || 25) * (camera ? camera.zoom : 1);
          renderer.context.strokeStyle = 'rgba(255, 255, 0, 0.4)';
          renderer.context.lineWidth = 1;
          renderer.context.beginPath();
          renderer.context.arc(cx, cy, radius, 0, Math.PI * 2);
          renderer.context.stroke();
          renderer.context.restore();
        }
      }

      // Draw active count
      if (TrafficConfig.debug.showActiveCount) {
        renderer.context.save();
        renderer.context.setTransform(1, 0, 0, 1, 0, 0);
        renderer.context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        renderer.context.font = '14px Inter, sans-serif';
        renderer.context.textAlign = 'left';
        renderer.context.fillText(`Traffic: ${this._vehicles.length}/${TrafficConfig.maxVehicles}`, 10, 30);
        renderer.context.fillText(`Spawned: ${this._totalSpawned} | Despawned: ${this._totalDespawned}`, 10, 50);
        renderer.context.restore();
      }
    },

    serialize() {
      return {
        vehicleCount: this._vehicles.length,
        totalSpawned: this._totalSpawned,
        totalDespawned: this._totalDespawned
      };
    },

    destroy() {
      this.clear();
      this._active = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TrafficSystem = TrafficSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = TrafficSystem;
  }
})();
