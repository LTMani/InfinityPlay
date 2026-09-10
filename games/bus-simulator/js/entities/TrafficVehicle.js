/**
 * Bus Simulator - Traffic Vehicle Entity
 * AI-controlled vehicles on the road with configurable types
 * inspired by Indian/South Asian road traffic.
 */

(function () {
  'use strict';

  const Vehicle = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Vehicle) ||
    (typeof require !== 'undefined' ? require('./Vehicle') : null);
  const TrafficVehicleTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TrafficVehicleTypes) ||
    (typeof require !== 'undefined' ? require('../data/TrafficVehicleTypes') : null);

  let _nextId = 0;

  function TrafficVehicle(x, y, roadOrX1, angleOrY1, vehicleTypeOrTypeStr) {
    if (Vehicle) {
      Vehicle.call(this, x, y, 'traffic');
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.vx = 0;
      this.vy = 0;
    }

    this.id = 'tv_' + (_nextId++);

    this.roadRef = null;
    this.angle = 0;
    this.laneOffset = 0;

    // Resolve vehicle type
    let vehicleType = null;
    let road = null;
    let angle = 0;

    if (typeof roadOrX1 === 'object' && roadOrX1 !== null) {
      road = roadOrX1;
      angle = typeof angleOrY1 === 'number' ? angleOrY1 : 0;
      vehicleType = vehicleTypeOrTypeStr || (TrafficVehicleTypes ? TrafficVehicleTypes.getRandom() : null);
    } else {
      vehicleType = vehicleTypeOrTypeStr || (TrafficVehicleTypes ? TrafficVehicleTypes.getRandom() : null);
      angle = typeof angleOrY1 === 'number' ? angleOrY1 : 0;
    }

    if (road) {
      this.roadRef = road;
    }

    if (typeof vehicleType === 'string') {
      // Legacy type string
      vehicleType = TrafficVehicleTypes ? TrafficVehicleTypes.getById(vehicleType) : null;
      if (!vehicleType) {
        vehicleType = this._getLegacySpecs(vehicleTypeOrTypeStr);
      }
    }

    // Store the vehicle type definition
    this.vehicleType = vehicleType ? vehicleType.id : 'car';
    this.vehicleCategory = vehicleType ? vehicleType.category : 'passenger';
    this.vehicleTypeDef = vehicleType;

    // Physical properties
    if (vehicleType) {
      this.width = vehicleType.width || 2;
      this.length = vehicleType.length || 4;
      this.maxSpeed = vehicleType.maxSpeed || 65;
      this.acceleration = vehicleType.acceleration || 8.0;
      this.brakeDeceleration = vehicleType.braking || 25.0;
      this.turnRate = vehicleType.turnRate || 1.8;
      this.maxSteeringAngle = vehicleType.maxSteeringAngle || 35;
      this.safeDistance = vehicleType.safeDistance || 25;
      this.lanePreference = vehicleType.lanePreference || 'any';
      this.color = this._pickColor(vehicleType);
      this.liveryPattern = vehicleType.liveryPattern || 'solid';
    } else {
      // Fallback to legacy specs
      const specs = this._getLegacySpecs(vehicleTypeOrTypeStr);
      this.width = specs.width;
      this.length = specs.length;
      this.maxSpeed = specs.maxSpeed;
      this.acceleration = specs.acceleration;
      this.brakeDeceleration = 25.0;
      this.turnRate = 1.8;
      this.maxSteeringAngle = 35;
      this.safeDistance = 25;
      this.lanePreference = 'any';
      this.color = TrafficVehicle._pickLegacyColor();
      this.liveryPattern = 'solid';
    }

    this.livery = { primary: this.color, secondary: '#ffffff' };

    // AI state
    this.targetSpeed = this.maxSpeed * (0.7 + Math.random() * 0.3);
    this._aiRoad = road || null;
    this._aiTravelDirection = 1;
    this._aiTargetRoad = null;
    this._aiState = 'traveling';
    this._aiWaitTimer = 0;
    this._intersectionDecisionMade = false;
    this._roundaboutExitChecked = false;

    this._dt = 0;
  }

  TrafficVehicle._pickLegacyColor = function () {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f97316'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (Vehicle) {
    TrafficVehicle.prototype = Object.create(Vehicle.prototype);
    TrafficVehicle.prototype.constructor = TrafficVehicle;
  }

  TrafficVehicle.prototype._pickColor = function (vehicleType) {
    const colors = vehicleType.colorVariants || ['#e5e7eb'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  TrafficVehicle.prototype._getLegacySpecs = function (type) {
    const specs = {
      truck: { maxSpeed: 50, acceleration: 3.0, length: 16, width: 3.5 },
      car: { maxSpeed: 75, acceleration: 10.0, length: 8, width: 2 },
      van: { maxSpeed: 65, acceleration: 7.0, length: 10, width: 2.5 },
      bike: { maxSpeed: 85, acceleration: 12.0, length: 6, width: 1.2 }
    };
    return specs[type] || specs.car;
  };

  TrafficVehicle.prototype.update = function (dt) {
    if (!this.active) return;
    this._dt = dt;

    if (Vehicle) {
      Vehicle.prototype.update.call(this, dt);
    }

    // Boundary wrapping as a fallback (AIVehicleSystem handles despawn)
    const wrap = 8000;
    if (this.x > wrap) this.x = -wrap;
    if (this.x < -wrap) this.x = wrap;
    if (this.y > wrap) this.y = -wrap;
    if (this.y < -wrap) this.y = wrap;
  };

  TrafficVehicle.prototype.draw = function (renderer, camera) {
    if (Vehicle) {
      Vehicle.prototype.draw.call(this, renderer, camera);
    } else {
      if (typeof renderer.fillRect === 'function') {
        renderer.fillRect(this.x, this.y, this.width, this.length, this.color);
      } else if (renderer.context) {
        renderer.context.save();
        const zoom = camera ? camera.zoom : 1;
        const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
        const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
        renderer.context.translate(cx, cy);
        renderer.context.rotate(this.angle);
        renderer.context.scale(zoom, zoom);
        renderer.context.fillStyle = this.color;
        renderer.context.fillRect(-this.length / 2, -this.width / 2, this.length, this.width);
        renderer.context.restore();
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TrafficVehicle = TrafficVehicle;
  }
  if (typeof module !== 'undefined') {
    module.exports = TrafficVehicle;
  }
})();
