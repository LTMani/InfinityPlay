/**
 * Bus Simulator - Movement System (4)
 * Controls bus acceleration, braking, and steering
 * Integrates AccelerationSystem, BrakingSystem, SteeringSystem
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);

  const AccelerationSystem = {
    _currentThrust: 0,

    apply(bus, throttle, dt) {
      this._currentThrust = throttle;

      if (throttle > 0) {
        bus.targetSpeed = Math.min(
          bus.maxSpeed,
          bus.targetSpeed + bus.acceleration * throttle * dt * 3.6
        );
      }

      // Engine braking when no input
      if (throttle === 0 && bus.targetSpeed > 0) {
        bus.targetSpeed *= 0.98;
      }

      EventManager.emit('accelerationChanged', { thrust: throttle, targetSpeed: bus.targetSpeed });
    },

    reset(bus) {
      this._currentThrust = 0;
      bus.targetSpeed = 0;
    },

    getThrust() {
      return this._currentThrust;
    }
  };

  const BrakingSystem = {
    _brakePressure: 0,
    _hardBrake: false,

    apply(bus, brakeInput, dt) {
      this._brakePressure = brakeInput;
      this._hardBrake = brakeInput > 0.5;

      if (this._hardBrake) {
        // Hard brake - direct speed reduction
        bus.speed *= Math.pow(0.85, dt * 60);
        bus.targetSpeed *= 0.9;
      } else if (brakeInput > 0) {
        bus.targetSpeed *= Math.pow(0.95, dt * 60);
      }

      if (!bus.isDamaged) {
        bus.condition = Math.min(100, bus.condition + brakeInput * 0.01);
      }

      EventManager.emit('brakingApplied', {
        pressure: this._brakePressure,
        speed: bus.speed,
        hardBrake: this._hardBrake
      });
    },

    release(bus) {
      this._brakePressure = 0;
      this._hardBrake = false;
    },

    getPressure() {
      return this._brakePressure;
    }
  };

  const SteeringSystem = {
    _steeringInput: 0,
    _steeringAngle: 0,

    apply(bus, steeringInput, dt) {
      this._steeringInput = steeringInput;

      // Gradually turn steering wheel toward input
      if (steeringInput !== 0) {
        this._steeringAngle += steeringInput * bus.turnRate * dt * 60;
      } else {
        // Return to center
        this._steeringAngle *= 0.85;
        if (Math.abs(this._steeringAngle) < 0.5) this._steeringAngle = 0;
      }

      // Clamp
      this._steeringAngle = Math.max(-bus.maxSteeringAngle,
        Math.min(bus.maxSteeringAngle, this._steeringAngle));

       // Apply rotation to bus (only when moving)
      // Buses are less responsive at high speed, more at low speed
      if (bus.speed > 2) {
        const speedRatio = bus.speed / bus.maxSpeed;
        const turnFactor = 1.5 - speedRatio * 0.5; // 1.5 at low speed, 1.0 at max speed
        const maxTurnRate = 0.6; // radians per second at full lock, low speed
        bus.angle += (this._steeringAngle / bus.maxSteeringAngle) * maxTurnRate * dt * turnFactor;
      }

      bus.steering = this._steeringAngle / bus.maxSteeringAngle;

      EventManager.emit('steeringChanged', {
        input: steeringInput,
        angle: this._steeringAngle
      });
    },

    reset() {
      this._steeringInput = 0;
      this._steeringAngle = 0;
    },

    getAngle() {
      return this._steeringAngle;
    },

    getInput() {
      return this._steeringInput;
    }
  };

  const MovementSystem = {
    acceleration: AccelerationSystem,
    braking: BrakingSystem,
    steering: SteeringSystem,

    init(modules) {
      this.modules = modules;
    },

    update(dt) {
      if (!this.modules) return;

      const gameLoop = this.modules.GameLoopSystem;
      if (!gameLoop || !gameLoop.canPlay()) return;

      const inputSystem = this.modules.InputSystem;
      const init = this.modules.GameInitSystem;
      if (!inputSystem || !init) return;

      const bus = init.getActiveBus();
      if (!bus || !bus.active) return;

      const inputState = {
        throttle: inputSystem.getThrottle(),
        brake: inputSystem.getAction('brake'),
        steering: inputSystem.getSteering(),
        handbrake: inputSystem.getAction('handbrake')
      };

      if (!bus.canMove()) return;

      // Reverse detection: brake when stopped enters reverse mode
      if (inputState.brake > 0 && Math.abs(bus.speed) < 2 && !bus.reverseMode) {
        bus.reverseMode = true;
        bus.targetSpeed = -bus.maxSpeed * 0.3;
      }
      // Exit reverse when accelerating forward
      if (inputState.accelerate > 0 && bus.reverseMode) {
        bus.reverseMode = false;
        bus.targetSpeed = Math.min(bus.targetSpeed, 0);
        bus.speed = Math.max(bus.speed, -0.5);
      }

      // Acceleration (forward only when not in reverse)
      if (!bus.reverseMode) {
        this.acceleration.apply(bus, inputState.throttle, dt);
      }

      // Braking (handbrake takes priority)
      if (inputState.handbrake > 0) {
        bus.speed *= Math.pow(0.80, dt * 60);
        bus.targetSpeed = 0;
        EventManager.emit('handbrakeApplied', { speed: bus.speed });
      } else if (inputState.brake > 0) {
        const brakeInput = inputState.brake;
        this.braking.apply(bus, brakeInput, dt);
      } else if (bus.targetSpeed > 0 && inputState.throttle === 0) {
        this.braking.release(bus);
      }

      // Steering
      this.steering.apply(bus, inputState.steering, dt);

      // Apply speed cap from road
      const roadSpeedLimit = bus._currentSpeedLimit || bus.maxSpeed;
      if (bus.speed > roadSpeedLimit) {
        bus.speed = bus.speed * 0.97;
      }

      // Update vehicle physics (position integration)
      bus._dt = dt;
      bus.update(dt);

      EventManager.emit('busMovementUpdate', {
        speed: Math.round(bus.speed),
        angle: bus.angle,
        fuel: bus.fuelLevel,
        position: { x: bus.x, y: bus.y }
      });
    },

    getCurrentSpeed(bus) {
      return bus ? Math.round(bus.speed) : 0;
    },

    getCurrentSpeedKmh(bus) {
      return bus ? Math.round(bus.speed) : 0;
    },

    destroy() {
      this.acceleration.reset();
      this.braking.release();
      this.steering.reset();
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.MovementSystem = MovementSystem;
    window.BusSim.AccelerationSystem = AccelerationSystem;
    window.BusSim.BrakingSystem = BrakingSystem;
    window.BusSim.SteeringSystem = SteeringSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = MovementSystem;
  }
})();
