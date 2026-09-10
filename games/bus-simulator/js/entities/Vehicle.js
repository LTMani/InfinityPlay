/**
 * Bus Simulator - Vehicle Base Class
 * Extends Entity with physics-based driving dynamics
 */

(function () {
  'use strict';

  const Entity = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Entity) ||
    (typeof require !== 'undefined' ? require('./Entity') : null);

  function Vehicle(x, y, type) {
    if (!Entity) {
      // Fallback if Entity not loaded yet
      this.x = x || 0;
      this.y = y || 0;
      this.vx = 0;
      this.vy = 0;
    } else {
      Entity.call(this, x, y);
    }

    this.type = type || 'vehicle';
    this.maxSpeed = 65;
    this.acceleration = 8.0;
    this.brakeDeceleration = 25.0;
    this.steeringReturnSpeed = 4.0;
    this.maxSteeringAngle = 35;
    this.turnRate = 1.8;

    this.speed = 0;          // km/h, scalar speed
    this.targetSpeed = 0;
    this.steering = 0;       // -1 to 1
    this.angle = 0;          // radians, direction of travel
    this.length = 12;
    this.width = 3;

    this.airResistance = 0.0008;
    this.rollingResistance = 0.012;

    this.color = '#e5e7eb';
    this.livery = { primary: '#dc2626', secondary: '#ffffff' };
  }

  if (Entity) {
    Vehicle.prototype = Object.create(Entity.prototype);
    Vehicle.prototype.constructor = Vehicle;
  } else {
    Vehicle.prototype = {};
  }

  Vehicle.prototype.update = function (dt) {
    if (!this.active) return;
    this._dt = dt;

    // Speed interpolation toward target speed (negative = reverse)
    if (this.targetSpeed > 0) {
      if (this.speed < this.targetSpeed) {
        this.speed += this.acceleration * dt * 3.6;
        if (this.speed > this.targetSpeed) this.speed = this.targetSpeed;
      }
    } else if (this.targetSpeed < 0) {
      if (this.speed > this.targetSpeed) {
        this.speed -= this.acceleration * 0.5 * dt * 3.6;
        if (this.speed < this.targetSpeed) this.speed = this.targetSpeed;
      }
    } else {
      // Target is zero - apply deceleration
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.brakeDeceleration * dt * 3.6);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.brakeDeceleration * dt * 3.6);
        if (this.speed > 0) this.speed = 0;
      }
    }

    // Apply resistance
    const speedMag = Math.abs(this.speed);
    this.speed *= (1 - this.airResistance * speedMag * dt - this.rollingResistance * dt);
    if (speedMag < 0.1 && this.targetSpeed === 0) this.speed = 0;
    if (Math.abs(this.speed) < 0.05) this.speed = 0;

    // Clamp speed
    this.speed = Math.max(-this.maxSpeed * 0.35, Math.min(this.maxSpeed, this.speed));

    // Normalize angle
    this.angle = ((this.angle + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;

    // Update velocity vector (negative speed = reverse)
    const radSpeed = this.speed / 3.6;
    this.vx = Math.sin(this.angle) * radSpeed;
    this.vy = -Math.cos(this.angle) * radSpeed;

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  };

  Vehicle.prototype.accelerate = function (amount) {
    amount = Math.max(-1, Math.min(1, amount));
    const speedDelta = amount * this.acceleration * this._dt * 3.6;
    this.targetSpeed = Math.max(0, Math.min(this.maxSpeed, this.targetSpeed + speedDelta));
  };

  Vehicle.prototype.setTargetSpeed = function (speed) {
    this.targetSpeed = Math.max(0, Math.min(this.maxSpeed, speed));
  };

  Vehicle.prototype.brake = function (amount) {
    amount = Math.max(0, Math.min(1, amount));
    this.speed *= (1 - amount * 0.3 * this._dt * 10);
    if (this.speed < 0) this.speed = 0;
  };

  Vehicle.prototype.steer = function (direction) {
    direction = Math.max(-1, Math.min(1, direction));
    this.steering = direction;
  };

  Vehicle.prototype.hardBrake = function () {
    this.targetSpeed = 0;
    this.speed *= 0.85;
    if (this.speed < 1) this.speed = 0;
  };

  Vehicle.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;

    renderer.context.save();
    renderer.context.translate(cx, cy);
    renderer.context.scale(zoom, zoom);
    renderer.context.rotate(this.angle);

    const halfLength = this.length / 2;
    const halfWidth = this.width / 2;

    // Draw bus body as rounded rectangle
    renderer.context.fillStyle = this.color;

    renderer.context.beginPath();
    const radius = 1.5;
    renderer.context.moveTo(-halfLength + radius, -halfWidth);
    renderer.context.lineTo(halfLength - radius, -halfWidth);
    renderer.context.quadraticCurveTo(halfLength, -halfWidth, halfLength, -halfWidth + radius);
    renderer.context.lineTo(halfLength, halfWidth - radius);
    renderer.context.quadraticCurveTo(halfLength, halfWidth, halfLength - radius, halfWidth);
    renderer.context.lineTo(-halfLength + radius, halfWidth);
    renderer.context.quadraticCurveTo(-halfLength, halfWidth, -halfLength, halfWidth - radius);
    renderer.context.lineTo(-halfLength, -halfWidth + radius);
    renderer.context.quadraticCurveTo(-halfLength, -halfWidth, -halfLength + radius, -halfWidth);
    renderer.context.closePath();
    renderer.context.fill();

    // Draw windows strip
    renderer.context.fillStyle = '#87ceeb';
    renderer.context.fillRect(-halfLength + 3, -halfWidth + 1, this.length - 6, 1.5);

    // Draw front grille
    renderer.context.fillStyle = '#333';
    renderer.context.fillRect(halfLength - 1, -0.8, 1, 1.6);

    // Draw wheels
    renderer.context.fillStyle = '#1a1a1a';
    const wheelOffset = 4;
    renderer.context.beginPath();
    renderer.context.arc(-halfLength + 2, halfWidth + 0.3, 0.8, 0, Math.PI * 2);
    renderer.context.fill();
    renderer.context.beginPath();
    renderer.context.arc(halfLength - 2, halfWidth + 0.3, 0.8, 0, Math.PI * 2);
    renderer.context.fill();
    renderer.context.beginPath();
    renderer.context.arc(-halfLength + 2, -halfWidth - 0.3, 0.8, 0, Math.PI * 2);
    renderer.context.fill();
    renderer.context.beginPath();
    renderer.context.arc(halfLength - 2, -halfWidth - 0.3, 0.8, 0, Math.PI * 2);
    renderer.context.fill();

    // Draw reverse indicator (red light) when in reverse
    if (this.reverseMode || this.speed < 0) {
      renderer.context.fillStyle = '#ef4444';
      renderer.context.beginPath();
      renderer.context.arc(halfLength - 1, 0, 0.5, 0, Math.PI * 2);
      renderer.context.fill();
    }

    renderer.context.restore();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Vehicle = Vehicle;
  }
  if (typeof module !== 'undefined') {
    module.exports = Vehicle;
  }
})();
