/**
 * Bus Simulator - Bus Entity
 * The player-controlled bus with integrated subsystems
 * (fuel, damage, maintenance, passenger capacity, etc.)
 */

(function () {
  'use strict';

  const Vehicle = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Vehicle) ||
    (typeof require !== 'undefined' ? require('./Vehicle') : null);
  const BusTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusTypes) ||
    (typeof require !== 'undefined' ? require('../data/bus-types') : null);

  function Bus(x, y, busTypeId, operatorId, serviceType, busNumber, destinationBoard, customization) {
    const busType = BusTypes && BusTypes.getById(busTypeId) || BusTypes && BusTypes.rtcBusTypes[0];

    if (Vehicle) {
      Vehicle.call(this, x, y, 'bus');
    } else {
      this.x = x; this.y = y; this.vx = 0; this.vy = 0;
    }

    this.busTypeId = busTypeId || 'pallevelugu';
    this.busType = busType;

    // ===== Phase 7: Operator & Service configuration =====
    this.operatorId = operatorId || (busType && busType.operatorId ? busType.operatorId : null) || null;
    this.serviceType = serviceType || (busType && busType.serviceType ? busType.serviceType : null) || 'city';

    // Resolve service config (if available) to apply multipliers
    const ServiceTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.ServiceTypes) || null;
    const serviceConfig = ServiceTypes && ServiceTypes.getById ? ServiceTypes.getById(this.serviceType) : null;

    // Physical properties from bus type, scaled by service config
    const baseSpeed = busType ? busType.speed : 65;
    const speedMult = serviceConfig && serviceConfig.speedMultiplier ? serviceConfig.speedMultiplier : 1.0;
    this.maxSpeed = Math.round(baseSpeed * speedMult);
    this.baseMaxSpeed = this.maxSpeed; // service-scaled max speed used on repair
    this.acceleration = 6.5;
    this.brakeDeceleration = 22.0;
    this.turnRate = 1.5;
    this.maxSteeringAngle = 32;
    this.length = 14;
    this.width = 3.2;

    // Fuel system
    this.fuelCapacity = (busType && busType.fuelCapacity) ? busType.fuelCapacity : 200;
    this.fuelLevel = this.fuelCapacity;
    this.fuelEfficiency = busType ? busType.fuelEfficiency : 3.5;
    this.isLowFuel = false;

    // Damage system
    this.condition = 100;    // 0-100%, health of bus
    this.damage = 0;         // current damage percentage
    this.isDamaged = false;

    // Passenger system
    const baseCapacity = busType ? busType.capacity : 42;
    const capMult = serviceConfig && serviceConfig.capacityMultiplier ? serviceConfig.capacityMultiplier : 1.0;
    this.passengerCapacity = Math.max(1, Math.round(baseCapacity * capMult));
    this.passengersOnBoard = 0;
    this.passengersWaiting = [];  // passengers waiting to board
    this.boardedPassengers = [];  // individual passenger objects on board
    this.baseStandingCapacity = (busType && typeof busType.standingCapacity !== 'undefined')
      ? busType.standingCapacity
      : Math.floor(baseCapacity * 0.3);
    this.maxStanding = Math.max(0, Math.round(this.baseStandingCapacity * capMult));
    this.standingPassengers = 0;
    this.allowStanding = true;

    // Service-specific boarding/alighting timing
    this.boardingTimePerPassenger = (serviceConfig && serviceConfig.boardingTimePerPassenger)
      ? serviceConfig.boardingTimePerPassenger
      : 2.5;
    this.alightTimePerPassenger = (serviceConfig && serviceConfig.alightTimePerPassenger)
      ? serviceConfig.alightTimePerPassenger
      : 1.5;

    // Service fare multiplier (used by TicketSystem)
    this.serviceFareMultiplier = (serviceConfig && serviceConfig.fareMultiplier)
      ? serviceConfig.fareMultiplier
      : 1.0;

    // Maintenance
    this.maintenanceCondition = 100;
    this.lastMaintenance = 0;
    this.maintenanceInterval = 5000; // km

    // Customization
    this.customization = {
      exterior: {
        paintColor: busType ? busType.livery.color : '#f59e0b',
        livery: 'standard',
        lights: 'stock',
        wheels: 'steel',
        accessories: [],
        fleetNumber: null
      },
      interior: {
        seatStyle: 'fabric-red',
        interiorColor: 'beige',
        lighting: 'warm-white',
        decorations: [],
        comfort: 5,
        theme: 'standard'
      },
      performance: {
        engineTuning: 'stock',
        transmission: 'manual-5',
        brakes: 'drum',
        suspension: 'leaf'
      }
    };

    // Trip state
    this.tripStartTime = 0;
    this.tripDistance = 0;
    this.tripRevenue = 0;
    this.tripsCompleted = 0;

    // Economy
    this.value = busType ? busType.price : 1000000;
    this.purchasePrice = this.value;

// Color based on livery
    this.color = this.customization.exterior.paintColor || this.color;
    this.tintColor = this.busType ? this.busType.livery.color : '#f59e0b';

    // Fleet
    this.fleetNumber = null;

    // Phase 8: identity fields
    this.busNumber = busNumber || null;
    this.destinationBoard = destinationBoard || null;

    // Phase 8: apply optional customization overrides
    if (customization) {
      this.setCustomization(customization);
    }

    // Movement state
    this.reverseMode = false;
    this.reverseSpeed = 0;
  }

  if (Vehicle) {
    Bus.prototype = Object.create(Vehicle.prototype);
    Bus.prototype.constructor = Bus;
  } else {
    Bus.prototype = {};
  }

  Bus.prototype.update = function (dt) {
    if (!this.active) return;

    // Store dt for acceleration (Vehicle uses this._dt)
    this._dt = dt;

    // Call parent update
    if (Vehicle) {
      Vehicle.prototype.update.call(this, dt);
    }

    // Track trip distance (only when moving forward)
    if (this.speed > 0) {
      this.tripDistance += this.speed * dt / 3.6;
    }

    // Check fuel
    if (this.fuelLevel <= 0 && this.speed > 0) {
      this.targetSpeed = Math.min(this.targetSpeed, this.maxSpeed * 0.3);
    }

    // Fuel consumption (scaled, reverse uses less fuel)
    const speedMag = Math.abs(this.speed);
    const fuelMultiplier = this.reverseMode ? 0.5 : 1.0;
    const fuelConsumption = (speedMag / this.fuelEfficiency) * 0.0278 * dt * fuelMultiplier;
    this.fuelLevel = Math.max(0, this.fuelLevel - fuelConsumption);

    if (this.fuelLevel <= this.fuelCapacity * 0.1) {
      this.isLowFuel = true;
    } else {
      this.isLowFuel = false;
    }

    // Check damage
    if (this.damage > 80) {
      this.maxSpeed = (this.busType ? this.busType.speed : 65) * 0.7;
    }
    this.isDamaged = this.damage > 10;

    // Degradation of condition
    this.condition = Math.max(0, 100 - this.damage);

    // Degradation of maintenance condition
    if (this.speed > 0) {
      this.maintenanceCondition -= 0.001 * dt;
    }
  };

  Bus.prototype.refuel = function (amount) {
    this.fuelLevel = Math.min(this.fuelCapacity, this.fuelLevel + amount);
    this.isLowFuel = false;
  };

  Bus.prototype.canMove = function () {
    return this.fuelLevel > 0 && this.condition > 0;
  };

  Bus.prototype.embarkPassenger = function (passenger) {
    if (!passenger) return false;

    const seatedSpace = this.passengerCapacity - this.passengersOnBoard;
    if (seatedSpace <= 0) {
      if (this.allowStanding) {
        const standingSpace = this.maxStanding - this.standingPassengers;
        if (standingSpace <= 0) return false;
        this.standingPassengers++;
      } else {
        return false;
      }
    }

    this.passengersOnBoard++;
    if (this.boardedPassengers) {
      this.boardedPassengers.push(passenger);
    }
    return true;
  };

  Bus.prototype.disembarkPassenger = function (passenger) {
    if (!passenger || !this.boardedPassengers) return false;

    const idx = this.boardedPassengers.indexOf(passenger);
    if (idx >= 0) {
      this.boardedPassengers.splice(idx, 1);
      this.passengersOnBoard--;
      if (this.passengersOnBoard < 0) this.passengersOnBoard = 0;
      return true;
    }
    return false;
  };

  Bus.prototype.embarkPassengers = function (count) {
    const space = this.passengerCapacity - this.passengersOnBoard;
    const embarked = Math.min(count, space);
    this.passengersOnBoard += embarked;
    return embarked;
  };

  Bus.prototype.disembarkPassengers = function (count) {
    const alighted = Math.min(count, this.passengersOnBoard);
    this.passengersOnBoard -= alighted;
    if (this.passengersOnBoard < 0) this.passengersOnBoard = 0;
    return alighted;
  };

  Bus.prototype.getAvailableCapacity = function () {
    if (this.allowStanding) {
      return this.passengerCapacity - this.passengersOnBoard + (this.maxStanding - this.standingPassengers);
    }
    return this.passengerCapacity - this.passengersOnBoard;
  };

  Bus.prototype.getAlightingPassengers = function (stopId) {
    if (!this.boardedPassengers) return [];
    return this.boardedPassengers.filter(p => {
      const destId = p.destinationStopId || p.destination;
      return destId === stopId;
    });
  };

  Bus.prototype.getOccupancy = function () {
    return this.passengersOnBoard / this.passengerCapacity;
  };

  /**
   * Phase 8: Re-apply a service type configuration to an existing bus.
   * Recomputes capacity, speed, timing, and fare multiplier in place.
   */
  Bus.prototype.setService = function (serviceType, operatorId) {
    const ServiceTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.ServiceTypes) || null;
    const serviceConfig = ServiceTypes && ServiceTypes.getById ? ServiceTypes.getById(serviceType) : null;

    this.serviceType = serviceType || this.serviceType || 'city';
    if (operatorId) this.operatorId = operatorId;

    const baseCapacity = this.busType ? this.busType.capacity : 42;
    const baseSpeed = this.busType ? this.busType.speed : 65;
    const capMult = serviceConfig && serviceConfig.capacityMultiplier ? serviceConfig.capacityMultiplier : 1.0;
    const speedMult = serviceConfig && serviceConfig.speedMultiplier ? serviceConfig.speedMultiplier : 1.0;

    this.passengerCapacity = Math.max(1, Math.round(baseCapacity * capMult));
    this.maxSpeed = Math.round(baseSpeed * speedMult);
    this.baseMaxSpeed = this.maxSpeed;
    this.maxStanding = Math.max(0, Math.round((this.baseStandingCapacity || Math.floor(baseCapacity * 0.3)) * capMult));

    this.boardingTimePerPassenger = (serviceConfig && serviceConfig.boardingTimePerPassenger)
      ? serviceConfig.boardingTimePerPassenger
      : 2.5;
    this.alightTimePerPassenger = (serviceConfig && serviceConfig.alightTimePerPassenger)
      ? serviceConfig.alightTimePerPassenger
      : 1.5;
    this.serviceFareMultiplier = (serviceConfig && serviceConfig.fareMultiplier)
      ? serviceConfig.fareMultiplier
      : 1.0;

    return true;
  };

  /**
   * Phase 8: Apply customization settings to the bus.
   */
  Bus.prototype.setCustomization = function (customization) {
    if (!this.customization) this.customization = {};
    const merged = JSON.parse(JSON.stringify(this.customization));
    for (const section of Object.keys(customization || {})) {
      if (typeof customization[section] === 'object' && customization[section] !== null) {
        merged[section] = Object.assign(merged[section] || {}, customization[section]);
      }
    }
    this.customization = merged;

    if (this.customization.exterior && this.customization.exterior.paintColor) {
      this.color = this.customization.exterior.paintColor;
    }
    if (this.customization.exterior && this.customization.exterior.fleetNumber) {
      this.fleetNumber = this.customization.exterior.fleetNumber;
    }
    return true;
  };

  Bus.prototype.repair = function (amount) {
    this.damage = Math.max(0, this.damage - amount);
    this.condition = Math.max(0, 100 - this.damage);
    this.isDamaged = this.damage > 10;

    // Restore max speed if damage low
    if (this.damage <= 80) {
      this.maxSpeed = this.baseMaxSpeed || this.maxSpeed;
    }
  };

  Bus.prototype.performMaintenance = function () {
    this.maintenanceCondition = 100;
    this.lastMaintenance = this.tripDistance;
    this.damage = Math.max(0, this.damage - 20);
    this.condition = Math.max(0, 100 - this.damage);
    this.fuelLevel = this.fuelCapacity; // full service includes refuel
  };

  Bus.prototype.applyPerformanceUpgrade = function (upgradeId) {
    const perf = this.customization.performance;

    if (upgradeId === 'engineTuning') {
      const upgrades = {
        stock: { speedBonus: 0, fuelPenalty: 0 },
        sport: { speedBonus: 5, fuelPenalty: 0.1 },
        turbo: { speedBonus: 12, fuelPenalty: 0.25 },
        performance: { speedBonus: 20, fuelPenalty: 0.4 }
      };
      const selected = upgrades[this.customization._engineTuningId || 'stock'];
      if (this.busType) {
        this.maxSpeed = this.busType.speed + (selected ? selected.speedBonus : 0);
      }
      this.fuelEfficiency = (this.busType ? this.busType.fuelEfficiency : 3.5) * (1 - (selected ? selected.fuelPenalty : 0));
    }
  };

  Bus.prototype.startTrip = function () {
    this.tripStartTime = performance.now();
    this.tripDistance = 0;
    this.tripRevenue = 0;
  };

  Bus.prototype.completeTrip = function () {
    this.tripsCompleted++;
    const revenue = this.tripRevenue;
    const distance = this.tripDistance;
    this.tripRevenue = 0;
    this.tripDistance = 0;
    return { revenue, distance, trips: this.tripsCompleted };
  };

  Bus.prototype.getInfo = function () {
    return {
      id: this.id,
      busTypeId: this.busTypeId,
      name: this.busType ? this.busType.displayName : 'Unknown Bus',
      speed: Math.round(this.speed),
      fuel: Math.round(this.fuelLevel),
      fuelCapacity: this.fuelCapacity,
      fuelPercent: Math.round((this.fuelLevel / this.fuelCapacity) * 100),
      condition: Math.round(this.condition),
      damage: Math.round(this.damage),
      passengers: this.passengersOnBoard,
      capacity: this.passengerCapacity,
      occupancy: this.getOccupancy(),
      tripsCompleted: this.tripsCompleted,
      maintenanceCondition: Math.round(this.maintenanceCondition),
      fleetNumber: this.fleetNumber,
      value: this.value
    };
  };

  Bus.prototype.draw = function (renderer, camera) {
    if (Vehicle) {
      Vehicle.prototype.draw.call(this, renderer, camera);
    } else {
      renderer.fillRect(this.x, this.y, this.width, this.length, this.color);
    }

    // Draw fleet number on side
    if (this.fleetNumber) {
      const rect = renderer.context.canvas.getBoundingClientRect();
      renderer.resetTransform();

      const cx = (this.x - (camera ? camera.x : 0)) * (camera ? camera.zoom : 1) + rect.width / 2;
      const cy = (this.y - (camera ? camera.y : 0)) * (camera ? camera.zoom : 1) + rect.height / 2;

      renderer.context.save();
      renderer.context.font = '10px monospace';
      renderer.context.fillStyle = '#ffffff';
      renderer.context.textAlign = 'center';
      renderer.context.fillText(this.fleetNumber, cx, cy - 20);
      renderer.context.restore();

      renderer.applyCamera();
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Bus = Bus;
  }
  if (typeof module !== 'undefined') {
    module.exports = Bus;
  }
})();
