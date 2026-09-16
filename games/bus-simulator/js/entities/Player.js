/**
 * Bus Simulator - Player Entity
 * Player profile: money, XP, level, owned buses, private travels
 */

(function () {
  'use strict';

  const Bus = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Bus) ||
    (typeof require !== 'undefined' ? require('./Bus') : null);

  const PrivateTravelsData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.PrivateTravelsData) ||
    (typeof require !== 'undefined' ? require('../data/private-travels') : null);

  function Player(playerData) {
    const data = playerData || {};

    this.id = data.id || 'player_001';
    this.name = data.name || 'Driver';
    this.email = data.email || null;

    // Progression
    this.level = data.level || 1;
    this.xp = data.xp || 0;
    this.xpToNextLevel = data.xpToNextLevel || 1000;

    // Economy
    this.money = data.money !== undefined ? data.money : 50000;
    this.totalRevenue = data.totalRevenue || 0;
    this.totalExpenses = data.totalExpenses || 0;
    this.totalDistance = data.totalDistance || 0;
    this.totalPassengersServed = data.totalPassengersServed || 0;
    this.tripsCompleted = data.tripsCompleted || 0;
    this.onTimeTrips = data.onTimeTrips || 0;
    this.accidentCount = data.accidentCount || 0;

    // Fleet
    this.garage = data.garage || [];
    this.activeBusId = data.activeBusId || null;
    this.garageSlots = data.garageSlots || 5;

    // Private travels company
    this.company = data.company || this._createDefaultCompany();

    // Current trip
    this.currentTrip = data.currentTrip || null;

    // Achievements
    this.unlockedAchievements = data.unlockedAchievements || [];
    this.achievementProgress = data.achievementProgress || {};
  }

  Player.prototype._createDefaultCompany = function () {
    if (PrivateTravelsData && PrivateTravelsData.defaultCompany) {
      return JSON.parse(JSON.stringify(PrivateTravelsData.defaultCompany));
    }
    return {
      name: 'My Bus Company',
      nameTagline: 'Safe Journeys',
      logo: 'MB',
      reputation: 50,
      level: 1,
      xp: 0,
      balance: 50000,
      fleet: [],
      garageSlots: 5
    };
  };

  Player.prototype.addXP = function (amount) {
    this.xp += amount;
    while (this.xp >= this.xpToNextLevel) {
      this.xp -= this.xpToNextLevel;
      this.levelUp();
    }
  };

  Player.prototype.levelUp = function () {
    this.level++;
    this.xpToNextLevel = Math.round(1000 * Math.pow(1.5, this.level - 1));

    // Check level-based unlocks
    const levelRewards = (typeof require !== 'undefined' ? require('../data/economy') : null);
    if (levelRewards && levelRewards.levelRewards) {
      const reward = levelRewards.levelRewards.find(r => r.level === this.level);
      if (reward) {
        this.money += reward.reward || 0;
      }
    }

    // Expand garage slots every 5 levels
    if (this.level % 5 === 0) {
      this.garageSlots = Math.min(50, this.garageSlots + 3);
    }
  };

  Player.prototype.canAfford = function (cost) {
    return this.money >= cost;
  };

  Player.prototype.spendMoney = function (amount) {
    if (this.money >= amount) {
      this.money -= amount;
      this.totalExpenses += amount;
      return true;
    }
    return false;
  };

  Player.prototype.addMoney = function (amount) {
    this.money += amount;
    this.totalRevenue += amount;
  };

  Player.prototype.addDistance = function (km) {
    this.totalDistance += km;
  };

  Player.prototype.addPassengers = function (count) {
    this.totalPassengersServed += count;
  };

  Player.prototype.addTrip = function (tripData) {
    this.tripsCompleted++;
    if (tripData.distance) this.addDistance(tripData.distance);
    if (tripData.passengers) this.addPassengers(tripData.passengers);
    if (tripData.revenue) this.addMoney(tripData.revenue);
    if (tripData.onTime) this.onTimeTrips++;
    if (tripData.accident) this.accidentCount++;
  };

  Player.prototype.addBusToFleet = function (bus) {
    if (this.garage.length >= this.garageSlots) return false;
    this.garage.push(bus);
    bus.fleetNumber = this._generateFleetNumber();
    return true;
  };

  Player.prototype._generateFleetNumber = function () {
    const prefix = this.company ? this.company.fleetPrefix || 'MH' : 'MH';
    const num = String(this.garage.length + 1).padStart(3, '0');
    return `${prefix}-${num}`;
  };

  Player.prototype.getActiveBus = function () {
    return this.garage.find(b => b.id === this.activeBusId) ||
           (this.garage[0] || null);
  };

  Player.prototype.serialize = function () {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      level: this.level,
      xp: this.xp,
      xpToNextLevel: this.xpToNextLevel,
      money: this.money,
      totalRevenue: this.totalRevenue,
      totalExpenses: this.totalExpenses,
      totalDistance: this.totalDistance,
      totalPassengersServed: this.totalPassengersServed,
      tripsCompleted: this.tripsCompleted,
      onTimeTrips: this.onTimeTrips,
      accidentCount: this.accidentCount,
      garage: this.garage.map(b => {
        if (b && typeof b.serialize === 'function') return b.serialize();
        return b;
      }),
      activeBusId: this.activeBusId,
      garageSlots: this.garageSlots,
      company: this.company,
      currentTrip: this.currentTrip,
      unlockedAchievements: this.unlockedAchievements,
      achievementProgress: this.achievementProgress
    };
  };

  Player.deserialize = function (data) {
    if (!data || typeof data !== 'object') return new Player();
    const player = new Player(data);

    // Phase 10A Task 7: reconstruct real Bus instances from serialized
    // plain objects. Without this, deserialized garage entries are plain
    // objects and lose all prototype methods (update, refuel, serialize,
    // startTrip, fuel accounting, etc.).
    const Bus = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Bus) ||
      (typeof require !== 'undefined' ? require('./Bus') : null);
    if (Bus && player.garage) {
      player.garage = player.garage.map((entry) => {
        if (!entry) return null;
        // Already a Bus instance (e.g. imported in-memory objects)
        if (typeof entry.update === 'function' && typeof entry.refuel === 'function') {
          return entry;
        }
        const bus = new Bus(entry.x || 0, entry.y || 0, entry.busTypeId || 'pallevelugu');
        // Restore all serialized fields safely
        if (entry.id) bus.id = entry.id;
        if (entry.busNumber) bus.busNumber = entry.busNumber;
        if (entry.operatorId) bus.operatorId = entry.operatorId;
        if (entry.serviceType) bus.serviceType = entry.serviceType;
        if (entry.destinationBoard) bus.destinationBoard = entry.destinationBoard;
        if (entry.customization) bus.customization = entry.customization;
        if (entry.fleetNumber) bus.fleetNumber = entry.fleetNumber;
        if (entry.color) bus.color = entry.color;
        if (entry.livery) bus.livery = entry.livery;
        if (entry.value !== undefined) bus.value = entry.value;
        if (entry.fuelLevel !== undefined) bus.fuelLevel = entry.fuelLevel;
        if (entry.fuelCapacity !== undefined) bus.fuelCapacity = entry.fuelCapacity;
        if (entry.fuelEfficiency !== undefined) bus.fuelEfficiency = entry.fuelEfficiency;
        if (entry.fuelUsed !== undefined) bus.fuelUsed = entry.fuelUsed;
        if (entry.condition !== undefined) bus.condition = entry.condition;
        if (entry.damage !== undefined) bus.damage = entry.damage;
        if (entry.isDamaged !== undefined) bus.isDamaged = entry.isDamaged;
        if (entry.isLowFuel !== undefined) bus.isLowFuel = entry.isLowFuel;
        if (entry.passengersOnBoard !== undefined) bus.passengersOnBoard = entry.passengersOnBoard;
        if (entry.tripDistance !== undefined) bus.tripDistance = entry.tripDistance;
        if (entry.tripRevenue !== undefined) bus.tripRevenue = entry.tripRevenue;
        if (entry._aiState) bus._aiState = entry._aiState;
        if (entry._aiRoad) bus._aiRoad = entry._aiRoad;
        if (entry._aiTravelDirection !== undefined) bus._aiTravelDirection = entry._aiTravelDirection;
        if (entry._aiWaitTimer !== undefined) bus._aiWaitTimer = entry._aiWaitTimer;
        if (entry._aiTurnTarget) bus._aiTurnTarget = entry._aiTurnTarget;
        if (entry._aiTurnDirection) bus._aiTurnDirection = entry._aiTurnDirection;
        if (entry._intersectionDecisionMade !== undefined) bus._intersectionDecisionMade = entry._intersectionDecisionMade;
        if (entry._roundaboutExitChecked !== undefined) bus._roundaboutExitChecked = entry._roundaboutExitChecked;
        if (entry._isAIBus !== undefined) bus._isAIBus = entry._isAIBus;
        if (entry._aiTarget) bus._aiTarget = entry._aiTarget;
        if (entry._currentSpeedLimit !== undefined) bus._currentSpeedLimit = entry._currentSpeedLimit;
        if (entry._dt !== undefined) bus._dt = entry._dt;
        if (entry.active !== undefined) bus.active = entry.active;
        return bus;
      });
    }

    // Sync activeBusId to a valid bus if the saved id no longer exists
    if (player.garage && player.garage.length > 0) {
      const stillExists = player.garage.some(b => b && b.id === player.activeBusId);
      if (!stillExists) {
        player.activeBusId = player.garage[0].id;
      }
    } else {
      player.activeBusId = null;
    }

    return player;
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Player = Player;
  }
  if (typeof module !== 'undefined') {
    module.exports = Player;
  }
})();
