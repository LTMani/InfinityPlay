/**
 * Bus Simulator - Achievements Data
 * Bus-specific achievements for the Bus Simulator game
 */

(function () {
  'use strict';

  const BusSimAchievements = [
    {
      id: 'first-journey',
      title: 'First Journey',
      description: 'Complete your first bus route from start to finish.',
      icon: '🚌',
      xp: 100,
      category: 'General',
      criteria: { type: 'trip_complete', threshold: 1 },
      rewards: { coins: 500 }
    },
    {
      id: 'safe-driver',
      title: 'Safe Driver',
      description: 'Complete 5 trips without any accidents or passenger complaints.',
      icon: '✅',
      xp: 200,
      category: 'Skill',
      criteria: { type: 'clean_trips', threshold: 5 },
      rewards: { coins: 1000 }
    },
    {
      id: 'on-time-king',
      title: 'On-Time King',
      description: 'Complete 5 routes with perfect punctuality.',
      icon: '⏰',
      xp: 250,
      category: 'Skill',
      criteria: { type: 'on_time_trips', threshold: 5 },
      rewards: { coins: 1500 }
    },
    {
      id: 'passenger-favorite',
      title: 'Passenger Favorite',
      description: 'Serve 500 passengers across all routes.',
      icon: '👥',
      xp: 300,
      category: 'Service',
      criteria: { type: 'passengers_served', threshold: 500 },
      rewards: { coins: 2000 }
    },
    {
      id: 'road-trip-master',
      title: 'Road Trip Master',
      description: 'Drive 1000 kilometers total.',
      icon: '🛣️',
      xp: 350,
      category: 'Mileage',
      criteria: { type: 'total_distance', threshold: 1000 },
      rewards: { coins: 2500 }
    },
    {
      id: 'fuel-efficient',
      title: 'Fuel Efficient',
      description: 'Complete a long route using less than 60 liters of fuel.',
      icon: '⛽',
      xp: 200,
      category: 'Skill',
      criteria: { type: 'fuel_efficient_trip', threshold: 1 },
      rewards: { coins: 1000 }
    },
    {
      id: 'night-driver',
      title: 'Night Driver',
      description: 'Complete 3 routes during night hours (8PM - 5AM).',
      icon: '🌙',
      xp: 250,
      category: 'Schedule',
      criteria: { type: 'night_trips', threshold: 3 },
      rewards: { coins: 1500 }
    },
    {
      id: 'millionaire',
      title: 'Transport Tycoon',
      description: 'Accumulate 100,000 game coins in total revenue.',
      icon: '💰',
      xp: 500,
      category: 'Economy',
      criteria: { type: 'total_revenue', threshold: 100000 },
      rewards: { coins: 10000 }
    },
    {
      id: 'fleet-owner',
      title: 'Fleet Owner',
      description: 'Own 3 buses in your garage.',
      icon: '🏢',
      xp: 400,
      category: 'Collection',
      criteria: { type: 'buses_owned', threshold: 3 },
      rewards: { coins: 5000 }
    },
    {
      id: 'custom-legend',
      title: 'Customization Legend',
      description: 'Fully customize a bus with maximum upgrades.',
      icon: '🎨',
      xp: 300,
      category: 'Customization',
      criteria: { type: 'full_customization', threshold: 1 },
      rewards: { coins: 3000 }
    },
    {
      id: 'state-conqueror',
      title: 'State Conqueror',
      description: 'Complete at least one route in every region (AP & TZ).',
      icon: '🗺️',
      xp: 400,
      category: 'Exploration',
      criteria: { type: 'regions_completed', threshold: 2 },
      rewards: { coins: 3500 }
    },
    {
      id: 'perfect-score',
      title: 'Perfect Trip',
      description: 'Complete a trip with 100% on-time rating and full occupancy.',
      icon: '⭐',
      xp: 500,
      category: 'Skill',
      criteria: { type: 'perfect_trip', threshold: 1 },
      rewards: { coins: 5000 }
    },
    {
      id: 'weather-master',
      title: 'Weather Master',
      description: 'Complete 10 trips in rainy weather without accidents.',
      icon: '🌧️',
      xp: 350,
      category: 'Skill',
      criteria: { type: 'rain_trips', threshold: 10 },
      rewards: { coins: 2000 }
    },
    {
      id: 'veteran-driver',
      title: 'Veteran Driver',
      description: 'Reach Level 20 as a bus driver.',
      icon: '🎖️',
      xp: 600,
      category: 'Progression',
      criteria: { type: 'player_level', threshold: 20 },
      rewards: { coins: 10000 }
    },
    {
      id: 'sunrise-sunset',
      title: 'Dawn to Dusk',
      description: 'Complete a route that spans from dawn to dusk.',
      icon: '🌅',
      xp: 250,
      category: 'Schedule',
      criteria: { type: 'full_day_trip', threshold: 1 },
      rewards: { coins: 1500 }
    },
    {
      id: 'toll-master',
      title: 'Toll Master',
      description: 'Pass through 20 toll gates.',
      icon: '💳',
      xp: 200,
      category: 'Exploration',
      criteria: { type: 'tolls_crossed', threshold: 20 },
      rewards: { coins: 1000 }
    },
    {
      id: 'speed-demon-bus',
      title: 'Speed Demon',
      description: 'Reach maximum speed in a Super Luxury bus on a highway.',
      icon: '⚡',
      xp: 300,
      category: 'Skill',
      criteria: { type: 'max_speed_reached', threshold: 85 },
      rewards: { coins: 2000 }
    },
    {
      id: 'economy-expert',
      title: 'Economy Expert',
      description: 'Complete a route with zero expenses (no fuel, no tolls, no maintenance).',
      icon: '📊',
      xp: 350,
      category: 'Economy',
      criteria: { type: 'zero_expense_trip', threshold: 1 },
      rewards: { coins: 2500 }
    }
  ];

  const AchievementSystem_Data = {
    achievements: BusSimAchievements,
    getInstance: function() {
      return this.achievements;
    },
    getById(id) {
      return BusSimAchievements.find(a => a.id === id) || null;
    },
    getByCategory(category) {
      return BusSimAchievements.filter(a => a.category === category);
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.BusSimAchievements = BusSimAchievements;
    window.BusSim.AchievementData = AchievementSystem_Data;
  }
  if (typeof module !== 'undefined') {
    module.exports = AchievementSystem_Data;
  }
})();
