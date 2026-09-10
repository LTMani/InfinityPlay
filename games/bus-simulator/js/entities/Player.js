/**
 * Bus Simulator - Player Entity
 * Player profile: money, XP, level, owned buses, private travels
 */

(function () {
  'use strict';

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
    return new Player(data);
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Player = Player;
  }
  if (typeof module !== 'undefined') {
    module.exports = Player;
  }
})();
