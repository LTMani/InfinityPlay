/**
 * Bus Simulator - AI Vehicle System
 * Controls AI traffic vehicle behavior:
 * - Road following along road nodes
 * - Safe-distance detection and speed adjustment
 * - Intersection route selection
 * - Roundabout navigation
 * - Player bus awareness
 */

(function () {
  'use strict';

  const BusTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusTypes) || null;
  const TrafficVehicleTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TrafficVehicleTypes) ||
    (typeof require !== 'undefined' ? require('../data/TrafficVehicleTypes') : null);
  const TrafficConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TrafficConfig) ||
    (typeof require !== 'undefined' ? require('../config/TrafficConfig') : null);
  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const TrafficVehicle = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TrafficVehicle) ||
    (typeof require !== 'undefined' ? require('../entities/TrafficVehicle') : null);
  const Bus = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Bus) ||
    (typeof require !== 'undefined' ? require('../entities/Bus') : null);

  const AIVehicleSystem = {
    _vehicles: [],
    _modules: null,
    _active: false,
    _updateTimer: 0,

    init(modules) {
      this._modules = modules;
      this._vehicles = [];
      this._updateTimer = 0;
      this._active = TrafficConfig ? TrafficConfig.active : true;
    },

    update(dt) {
      if (!this._active) return;

      const cfg = TrafficConfig || {};
      const map = this._modules ? this._modules.Map : null;
      if (!map) return;

      // Update AI logic at a reduced frequency for performance
      this._updateTimer += dt;
      const aiInterval = cfg.ai ? cfg.ai.reevaluateInterval : 0.5;
      const shouldThink = this._updateTimer >= aiInterval;
      if (shouldThink) {
        this._updateTimer = 0;
      }

      const playerBus = this._getPlayerBus();

      for (let i = this._vehicles.length - 1; i >= 0; i--) {
        const vehicle = this._vehicles[i];

        if (!vehicle || !vehicle.active) {
          this._vehicles.splice(i, 1);
          continue;
        }

        // Update vehicle physics
        vehicle.update(dt);

        // AI think step (less frequent)
        if (shouldThink) {
          this._updateAIVehicle(vehicle, dt, map, playerBus);
        }

        // Despawn when far from player
        if (playerBus) {
          const dist = Math.sqrt(Math.pow(vehicle.x - playerBus.x, 2) + Math.pow(vehicle.y - playerBus.y, 2));
          const despawnRadius = cfg.playerDespawnRadius || 1200;
          if (dist > despawnRadius * 2) {
            this._vehicles.splice(i, 1);
          }
        }
      }
    },

    _getPlayerBus() {
      const init = this._modules ? this._modules.GameInitSystem : null;
      if (init && typeof init.getActiveBus === 'function') {
        return init.getActiveBus();
      }
      return null;
    },

    _updateAIVehicle(vehicle, dt, map, playerBus) {
      const cfg = TrafficConfig || {};
      const aiCfg = cfg.ai || {};

      // Get current road the vehicle is on
      const currentRoad = this._findNearestRoad(vehicle, map);
      if (!currentRoad) {
        // Off-road, find nearest road
        const nearest = map.getNearestRoad(vehicle.x, vehicle.y);
        if (nearest) {
          vehicle._aiRoad = nearest;
          vehicle._aiTravelDirection = this._determineDirection(vehicle, nearest);
        }
        return;
      }

      // Set the vehicle's current road reference
      if (!vehicle._aiRoad || vehicle._aiRoad.id !== currentRoad.id) {
        vehicle._aiRoad = currentRoad;
        vehicle._aiTravelDirection = this._determineDirection(vehicle, currentRoad);
      }

      // Check for vehicle ahead (safe distance)
      const vehicleAhead = this._checkVehicleAhead(vehicle, this._vehicles, cfg);
      if (vehicleAhead) {
        this._handleFollowing(vehicle, vehicleAhead, cfg, currentRoad);
      } else {
        // No vehicle ahead, maintain normal speed
        this._maintainSpeed(vehicle, currentRoad, cfg);
      }

      // Check for player bus proximity
      if (playerBus) {
        this._handlePlayerInteraction(vehicle, playerBus, cfg);
      }

      // Check for intersection/roundabout ahead
      const intersection = this._checkIntersectionAhead(vehicle, map);
      if (intersection) {
        this._handleIntersection(vehicle, intersection, map, cfg);
      }

      // Apply steering to follow the road
      this._applyRoadFollowing(vehicle, currentRoad, dt, cfg);

      // Check if we've reached end of current road
      this._checkRoadEnd(vehicle, currentRoad, map, cfg);
    },

    _findNearestRoad(vehicle, map) {
      if (!map || !map.allRoads) return null;

      // Check if vehicle already has a road and is still on it
      if (vehicle._aiRoad) {
        const nearest = vehicle._aiRoad.getNearestPoint(vehicle.x, vehicle.y);
        const dist = Math.sqrt(Math.pow(nearest.x - vehicle.x, 2) + Math.pow(nearest.y - vehicle.y, 2));
        const threshold = (vehicle._aiRoad.width / 2) + (vehicle.width || 2);
        if (dist <= threshold) {
          return vehicle._aiRoad;
        }
      }

      // Search all roads
      if (typeof map.getNearestRoad === 'function') {
        return map.getNearestRoad(vehicle.x, vehicle.y);
      }

      // Fallback: brute force
      let nearest = null;
      let minDist = Infinity;
      for (let i = 0; i < map.allRoads.length; i++) {
        const road = map.allRoads[i];
        const point = road.getNearestPoint(vehicle.x, vehicle.y);
        const dist = Math.sqrt(Math.pow(point.x - vehicle.x, 2) + Math.pow(point.y - vehicle.y, 2));
        if (dist < minDist) {
          minDist = dist;
          nearest = road;
        }
      }
      return nearest;
    },

    _determineDirection(vehicle, road) {
      // Determine travel direction based on vehicle position relative to road endpoints
      const distToStart = Math.sqrt(Math.pow(vehicle.x - road.x1, 2) + Math.pow(vehicle.y - road.y1, 2));
      const distToEnd = Math.sqrt(Math.pow(vehicle.x - road.x2, 2) + Math.pow(vehicle.y - road.y2, 2));

      // If closer to start point, we're likely traveling toward end
      // If closer to end point, we're likely traveling toward start
      return distToStart < distToEnd ? 1 : -1;
    },

    _getRoadEndPoints(road, direction) {
      // Returns the "ahead" endpoint based on travel direction
      if (direction === 1) {
        // Traveling from x1,y1 toward x2,y2
        return { x: road.x2, y: road.y2, nextX: road.x2, nextY: road.y2 };
      } else {
        return { x: road.x1, y: road.y1, nextX: road.x1, nextY: road.y1 };
      }
    },

    _getRoadPathPoints(road, direction) {
      // Get ordered path points for road following
      if (direction === 1) {
        // Traveling forward: start to end
        if (road.points) {
          return road.points;
        }
        return [[road.x1, road.y1], [road.x2, road.y2]];
      } else {
        // Traveling backward: end to start
        if (road.points) {
          return road.points.slice().reverse();
        }
        return [[road.x2, road.y2], [road.x1, road.y1]];
      }
    },

    _getRoadEndPosition(road, direction) {
      if (direction === 1) {
        return { x: road.x2, y: road.y2 };
      } else {
        return { x: road.x1, y: road.y1 };
      }
    },

    _checkVehicleAhead(vehicle, allVehicles, cfg) {
      const safeDist = this._getSafeDistance(vehicle, cfg);
      const checkRange = safeDist + 50;

      // Project vehicle position forward along its heading
      const lookAheadX = vehicle.x + Math.sin(vehicle.angle) * checkRange;
      const lookAheadY = vehicle.y - Math.cos(vehicle.angle) * checkRange;

      let nearest = null;
      let minDist = Infinity;

      for (let i = 0; i < allVehicles.length; i++) {
        const other = allVehicles[i];
        if (!other || other === vehicle || !other.active) continue;

        // Check if other vehicle is roughly in front (within 45 degrees of heading)
        const dx = other.x - vehicle.x;
        const dy = other.y - vehicle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > checkRange || dist < 2) continue;

        // Check if vehicle is in front (dot product with heading)
        const headingX = Math.sin(vehicle.angle);
        const headingY = -Math.cos(vehicle.angle);
        const dot = (dx * headingX + dy * headingY) / dist;

        if (dot > 0.7) {
          // Vehicle is roughly in front
          if (dist < minDist) {
            minDist = dist;
            nearest = other;
          }
        }
      }

      return nearest;
    },

    _getSafeDistance(vehicle, cfg) {
      const safeCfg = cfg.safeDistance || {};
      const multiplier = safeCfg.multiplier || 2.0;
      const minimum = safeCfg.minimum || 12;
      const speedFactor = safeCfg.speedFactor || 0.5;

      const baseDist = (vehicle.length || 5) * multiplier;
      const speedDist = Math.abs(vehicle.speed || 0) * speedFactor;

      return Math.max(minimum, baseDist + speedDist);
    },

    _handleFollowing(vehicle, target, cfg, road) {
      const aiCfg = cfg.ai || {};
      const safeDist = this._getSafeDistance(vehicle, cfg);

      const dx = target.x - vehicle.x;
      const dy = target.y - vehicle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Calculate relative speed
      const mySpeed = Math.abs(vehicle.speed || 0);
      const targetSpeed = Math.abs(target.speed || 0);

      // If too close, reduce target speed
      if (dist < safeDist) {
        // Brake proportionally to closeness
        const brakeFactor = 1 - (dist / safeDist);
        const reducedSpeed = targetSpeed * (0.3 + 0.7 * brakeFactor);
        vehicle.targetSpeed = Math.max(0, Math.min(vehicle.maxSpeed, reducedSpeed));

        // Apply hard brake if very close
        if (dist < safeDist * 0.5) {
          const brakeAmount = (1 - dist / (safeDist * 0.5)) * aiCfg.obstacleBrakeFactor;
          vehicle.brake(brakeAmount);
        }
      } else {
        // Maintain target speed (slightly below leader's speed for safety)
        const roadSpeedLimit = road ? (road.speedLimit || vehicle.maxSpeed) : vehicle.maxSpeed;
        vehicle.targetSpeed = Math.max(
          0,
          Math.min(vehicle.maxSpeed, targetSpeed * 0.95, roadSpeedLimit)
        );
      }
    },

    _maintainSpeed(vehicle, road, cfg) {
      const aiCfg = cfg.ai || {};
      const roadSpeedLimit = road ? (road.speedLimit || vehicle.maxSpeed) : vehicle.maxSpeed;

      // Target speed is a fraction of the speed limit with variance
      const variance = aiCfg.speedVariance || 0.15;
      const targetPct = 0.8 + Math.random() * 0.2;
      vehicle.targetSpeed = roadSpeedLimit * targetPct * (1 - variance * Math.random());

      // Clamp to vehicle max speed
      vehicle.targetSpeed = Math.max(0, Math.min(vehicle.maxSpeed, vehicle.targetSpeed));
    },

    _handlePlayerInteraction(vehicle, playerBus, cfg) {
      if (!playerBus || !playerBus.active) return;

      const dx = playerBus.x - vehicle.x;
      const dy = playerBus.y - vehicle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const awarenessRadius = cfg.playerAwarenessRadius || 200;

      if (dist < awarenessRadius) {
        // Player bus is nearby - AI should slow down and give way
        const headingX = Math.sin(vehicle.angle);
        const headingY = -Math.cos(vehicle.angle);
        const dot = (dx * headingX + dy * headingY) / dist;

        if (dot > 0.5) {
          // Player is in front - slow down
          vehicle.targetSpeed = Math.max(0, Math.min(vehicle.targetSpeed, playerBus.speed * 0.7));
          vehicle.brake(0.3);
        } else if (dot < -0.5) {
          // Player is behind - maintain speed
          vehicle.targetSpeed = Math.min(vehicle.targetSpeed, vehicle.maxSpeed);
        }
      }
    },

    _checkIntersectionAhead(vehicle, map) {
      if (!map.intersections || map.intersections.length === 0) return null;
      if (!map.roundabouts || map.roundabouts.length === 0) return null;

      const checkDistance = 80;

      // Check intersections
      for (let i = 0; i < map.intersections.length; i++) {
        const int = map.intersections[i];
        if (!int || !int.active) continue;

        const dist = Math.sqrt(Math.pow(int.x - vehicle.x, 2) + Math.pow(int.y - vehicle.y, 2));
        if (dist > checkDistance) continue;

        // Check if vehicle is approaching the intersection
        const dx = int.x - vehicle.x;
        const dy = int.y - vehicle.y;
        const headingX = Math.sin(vehicle.angle);
        const headingY = -Math.cos(vehicle.angle);
        const dot = dx * headingX + dy * headingY;

        if (dot > 0 && dist < 50) {
          return { type: 'intersection', data: int };
        }
      }

      // Check roundabouts
      for (let i = 0; i < map.roundabouts.length; i++) {
        const rt = map.roundabouts[i];
        if (!rt || !rt.active) continue;

        const dist = Math.sqrt(Math.pow(rt.x - vehicle.x, 2) + Math.pow(rt.y - vehicle.y, 2));
        if (dist <= (rt.radius || 25) + 30) {
          return { type: 'roundabout', data: rt };
        }
      }

      return null;
    },

    _handleIntersection(vehicle, intersectionInfo, map, cfg) {
      const intCfg = (cfg.intersections || {});
      const rtCfg = (cfg.roundabouts || {});

      if (intersectionInfo.type === 'roundabout') {
        this._handleRoundabout(vehicle, intersectionInfo.data, map, rtCfg);
      } else {
        this._handleStandardIntersection(vehicle, intersectionInfo.data, map, intCfg);
      }
    },

    _handleStandardIntersection(vehicle, intersection, map, cfg) {
      if (vehicle._aiState === 'waiting') {
        vehicle.targetSpeed = 0;
        return;
      }

      // Decide whether to turn or go straight
      if (!vehicle._intersectionDecisionMade) {
        const roll = Math.random();
        const turnProb = cfg.turnProbability || 0.35;
        const leftProb = cfg.leftProbability || 0.1;
        const rightProb = cfg.rightProbability || 0.05;

        if (roll < turnProb) {
          // Turn - find a connected road
          vehicle._aiTurnDirection = 'left';
          vehicle._aiTurnTarget = this._findConnectedRoad(intersection, vehicle, map, 'left');
        } else if (roll < turnProb + rightProb) {
          vehicle._aiTurnDirection = 'right';
          vehicle._aiTurnTarget = this._findConnectedRoad(intersection, vehicle, map, 'right');
        } else if (roll < turnProb + rightProb + leftProb) {
          vehicle._aiTurnDirection = 'left';
          vehicle._aiTurnTarget = this._findConnectedRoad(intersection, vehicle, map, 'left');
        } else {
          // Go straight
          vehicle._aiTurnDirection = 'straight';
          vehicle._aiTurnTarget = this._findConnectedRoad(intersection, vehicle, map, 'straight');
        }

        vehicle._intersectionDecisionMade = true;
        vehicle.targetSpeed = 0;
        vehicle._aiState = 'waiting';
        vehicle._aiWaitTimer = 0;
      }

      // Continue waiting
      vehicle._aiWaitTimer += 0.016;
      const minWait = cfg.minStopTime || 1.0;
      const maxWait = cfg.maxStopTime || 3.0;

      if (vehicle._aiWaitTimer >= minWait + Math.random() * (maxWait - minWait)) {
        vehicle._aiState = 'traveling';
        vehicle._intersectionDecisionMade = false;
        vehicle._aiWaitTimer = 0;

        if (vehicle._aiTurnTarget) {
          vehicle._aiRoad = vehicle._aiTurnTarget;
          vehicle._aiTravelDirection = 1;
          vehicle._aiTurnTarget = null;
        }
      }
    },

    _handleRoundabout(vehicle, roundabout, map, cfg) {
      if (vehicle._aiState === 'waiting') {
        // In roundabout, maintain circulation speed
        const minSpeed = cfg.minCirculationSpeed || 15;
        vehicle.targetSpeed = Math.max(minSpeed, vehicle.speed || 0);
        return;
      }

      // Check for exit
      if (!vehicle._roundaboutExitChecked) {
        const connections = roundabout.connectingRoads || [];
        if (connections.length > 0) {
          const exitIdx = connections[0];
          vehicle._aiTurnTarget = this._findRoadById(map, exitIdx);
          vehicle._aiState = 'waiting';
          vehicle._roundaboutExitChecked = true;
        }
      }

      // Maintain speed in roundabout
      const minSpeed = cfg.minCirculationSpeed || 15;
      vehicle.targetSpeed = Math.max(minSpeed, Math.min(vehicle.maxSpeed * 0.6, vehicle.maxSpeed));

      // Stay on the roundabout's circular path
      const angleToCenter = Math.atan2(vehicle.y - roundabout.y, vehicle.x - roundabout.x);
      const toCenterAngle = Math.atan2(vehicle.y - roundabout.y, vehicle.x - roundabout.x);

      if (cfg.clockwise !== false) {
        // Clockwise: steer right relative to center
        const tangentAngle = toCenterAngle + Math.PI / 2;
        const angleDiff = this._angleDiff(tangentAngle, vehicle.angle);
        vehicle.steer(Math.max(-1, Math.min(1, angleDiff * 0.5)));
      }
    },

    _angleDiff(a, b) {
      let diff = a - b;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      return diff;
    },

    _findConnectedRoad(intersection, vehicle, map, direction) {
      const connectedIds = intersection.connectedRoads || [];
      if (connectedIds.length === 0) return null;

      // Find the current road
      const currentRoadId = vehicle._aiRoad ? vehicle._aiRoad.id : null;
      const remainingRoads = connectedIds.filter(id => id !== currentRoadId);

      if (remainingRoads.length === 0) return null;

      if (direction === 'straight') {
        // Pick the road opposite to the current one
        if (remainingRoads.length === 1) return this._findRoadById(map, remainingRoads[0]);
        // For simplicity, pick the first remaining (better logic can be added)
        return this._findRoadById(map, remainingRoads[0]);
      } else {
        // Turn: pick any remaining road
        const randomId = remainingRoads[Math.floor(Math.random() * remainingRoads.length)];
        return this._findRoadById(map, randomId);
      }
    },

    _findRoadById(map, roadId) {
      if (!map || !map.allRoads) return null;
      for (let i = 0; i < map.allRoads.length; i++) {
        const road = map.allRoads[i];
        if (road.id === roadId || road._id === roadId) {
          return road;
        }
        // Check segments
        if (road.segments) {
          for (let j = 0; j < road.segments.length; j++) {
            if (road.segments[j].id === roadId) return road.segments[j];
          }
        }
      }
      return null;
    },

    _applyRoadFollowing(vehicle, road, dt, cfg) {
      const aiCfg = cfg.ai || {};
      const sens = aiCfg.steeringSensitivity || 2.5;

      // Get path points for the road
      const pathPoints = this._getRoadPathPoints(road, vehicle._aiTravelDirection);
      if (!pathPoints || pathPoints.length < 2) {
        // Use endpoints as path
        const endPt = this._getRoadEndPosition(road, vehicle._aiTravelDirection);
        const startPt = vehicle._aiTravelDirection === 1 ? { x: road.x1, y: road.y1 } : { x: road.x2, y: road.y2 };
        pathPoints = [startPt, endPt];
      }

      // Find the target point ahead on the path
      const targetPoint = this._findTargetPoint(vehicle, pathPoints, vehicle._aiTravelDirection);

      if (targetPoint) {
        // Calculate steering to reach target point
        const dx = targetPoint.x - vehicle.x;
        const dy = targetPoint.y - vehicle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.1) {
          const targetAngle = Math.atan2(dy, dx);
          // Wait - vehicle angle 0 = facing up (north), so:
          // atan2 gives angle from x-axis, but vehicle.angle uses
          // standard where angle=0 faces up (y-negative direction)
          // We need to convert: target angle relative to vehicle heading
          const vehicleHeadingX = Math.sin(vehicle.angle);
          const vehicleHeadingY = -Math.cos(vehicle.angle);

          const cross = vehicleHeadingX * dy - vehicleHeadingY * dx;
          const dot = vehicleHeadingX * dx + vehicleHeadingY * dy;

          const angleError = Math.atan2(cross, dot);
          vehicle.steer(Math.max(-1, Math.min(1, angleError * sens)));
        }
      }
    },

    _findTargetPoint(vehicle, pathPoints, direction) {
      if (!pathPoints || pathPoints.length < 2) return null;

      // Look ahead along the path
      const lookAheadDistance = 60 + (vehicle.speed || 0) * 0.8;
      let accumulatedDist = 0;

      // Find the point on the path closest to the vehicle
      let closestIdx = 0;
      let closestDist = Infinity;
      for (let i = 0; i < pathPoints.length; i++) {
        const pt = pathPoints[i];
        const dist = Math.sqrt(Math.pow(pt[0] - vehicle.x, 2) + Math.pow(pt[1] - vehicle.y, 2));
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }

      // Step forward along the path to find target point
      for (let i = closestIdx; i < pathPoints.length - 1; i++) {
        const p1 = pathPoints[i];
        const p2 = pathPoints[i + 1];
        const segLen = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

        if (accumulatedDist + segLen >= lookAheadDistance) {
          const remaining = lookAheadDistance - accumulatedDist;
          const t = remaining / segLen;
          return {
            x: p1[0] + (p2[0] - p1[0]) * t,
            y: p1[1] + (p2[1] - p1[1]) * t
          };
        }
        accumulatedDist += segLen;
      }

      // Return last point if we've looked ahead past it
      const last = pathPoints[pathPoints.length - 1];
      return { x: last[0], y: last[1] };
    },

    _checkRoadEnd(vehicle, road, map, cfg) {
      const endPos = this._getRoadEndPosition(road, vehicle._aiTravelDirection);
      const distToEnd = Math.sqrt(Math.pow(vehicle.x - endPos.x, 2) + Math.pow(vehicle.y - endPos.y, 2));

      if (distToEnd < 5) {
        // Find a connected road to continue onto
        const intersection = this._findNearestIntersection(vehicle, map);
        if (intersection) {
          const nextRoad = this._findConnectedRoad(intersection, vehicle, map, 'straight');
          if (nextRoad) {
            vehicle._aiRoad = nextRoad;
            vehicle._aiTravelDirection = this._determineDirection(vehicle, nextRoad);
          }
        }
      }
    },

    _findNearestIntersection(vehicle, map) {
      if (!map.intersections || map.intersections.length === 0) return null;

      let nearest = null;
      let minDist = Infinity;

      for (let i = 0; i < map.intersections.length; i++) {
        const int = map.intersections[i];
        const dist = Math.sqrt(Math.pow(int.x - vehicle.x, 2) + Math.pow(int.y - vehicle.y, 2));
        if (dist < minDist && dist < 100) {
          minDist = dist;
          nearest = int;
        }
      }

      return nearest;
    },

    spawnAIBus(map) {
      if (!this._modules || !this._modules.Map) return null;

      const mapInstance = this._modules.Map;
      const cities = mapInstance.allCities || [];
      if (cities.length === 0) return null;

      const startCity = cities[Math.floor(Math.random() * cities.length)];

      const busTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusTypes) || null;
      const rtcTypes = busTypes ? busTypes.getRTCBusTypes() : null;
      if (!rtcTypes) return null;

      const busType = rtcTypes[Math.floor(Math.random() * rtcTypes.length)];
      if (!Bus) return null;

      const bus = new Bus(startCity.x, startCity.y, busType.id);
      bus.color = busType.livery ? busType.livery.color : bus.color;

      const destCities = cities.filter(c => c.id !== startCity.id);
      if (destCities.length > 0) {
        const dest = destCities[Math.floor(Math.random() * destCities.length)];
        bus._aiTarget = { x: dest.x, y: dest.y };
        bus._aiState = 'traveling';
      }

      bus._isAIBus = true;
      this._vehicles.push(bus);

      return bus;
    },

    getAIBuses() {
      return this._vehicles.filter(v => v._isAIBus);
    },

    getTrafficVehicles() {
      return this._vehicles.filter(v => !v._isAIBus);
    },

    getVehicleCount() {
      return this._vehicles.length;
    },

    draw(renderer, camera) {
      const cfg = TrafficConfig || {};
      const drawRadius = cfg.optimization ? cfg.optimization.drawRadius : 1800;
      const camX = camera ? camera.x : 0;
      const camY = camera ? camera.y : 0;

      for (let i = 0; i < this._vehicles.length; i++) {
        const v = this._vehicles[i];
        if (!v || !v.active) continue;

        if (camera) {
          const dist = Math.sqrt(Math.pow(v.x - camX, 2) + Math.pow(v.y - camY, 2));
          if (dist > drawRadius) continue;
        }

        if (v.draw) {
          v.draw(renderer, camera);
        }
      }

      // Debug: draw AI paths
      if (cfg.debug && cfg.debug.enabled && cfg.debug.showPaths) {
        for (let i = 0; i < this._vehicles.length; i++) {
          const v = this._vehicles[i];
          if (!v._aiRoad) continue;

          renderer.context.save();
          renderer.context.setTransform(1, 0, 0, 1, 0, 0);

          // Draw target point
          const targetPoint = this._findTargetPoint(v, this._getRoadPathPoints(v._aiRoad, v._aiTravelDirection), v._aiTravelDirection);
          if (targetPoint) {
            const cx = (targetPoint.x - (camera ? camera.x : 0)) * (camera ? camera.zoom : 1) + renderer.width / 2;
            const cy = (targetPoint.y - (camera ? camera.y : 0)) * (camera ? camera.zoom : 1) + renderer.height / 2;
            renderer.context.fillStyle = 'rgba(0, 255, 0, 0.6)';
            renderer.context.beginPath();
            renderer.context.arc(cx, cy, 4, 0, Math.PI * 2);
            renderer.context.fill();
          }

          renderer.context.restore();
        }
      }
    },

    clear() {
      this._vehicles = [];
    },

    destroy() {
      this.clear();
      this._active = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.AIVehicleSystem = AIVehicleSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = AIVehicleSystem;
  }
})();
