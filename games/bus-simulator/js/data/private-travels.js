/**
 * Bus Simulator - Private Travels Data
 * Player-owned bus company management templates
 */

(function () {
  'use strict';

  const PrivateTravelsData = {

    // Default company template applied to new players
    defaultCompany: {
      id: 'player_travels',
      name: 'My Bus Company',
      tagline: 'Safe & Comfortable Journeys',
      foundedDate: null,
      logo: 'MB',
      logoShape: 'rounded-square',

      // Visual identity
      livery: {
        primaryColor: '#dc2626',
        secondaryColor: '#ffffff',
        accentColor: '#fbbf24',
        stripePattern: 'wave',
        stripeWidth: 3
      },

      // Fleet numbering
      fleetPrefix: 'MH',
      fleetStartNumber: 1,
      nextFleetNumber: 1,

      // Brand identity
      routeBranding: 'Express Service',
      routeBrandingColor: '#ffffff',

      // Driver uniforms
      driverUniform: {
        shirtColor: '#1e3a8a',
        pantColor: '#0f172a',
        capColor: '#ffffff',
        tieColor: '#00f0ff'
      },

      // Interior theme
      interiorTheme: 'walnut-wood',

      // Company stats
      reputation: 50,
      reputationLevel: 'Average',
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,

      // Financials
      revenue: 0,
      expenses: 0,
      balance: 50000,
      loan: 0,

      // Fleet
      fleet: [],           // owned bus IDs
      garageSlots: 5,
      unlockedGarageSlots: 5
    },

    reputationTiers: [
      { level: 1, name: 'Average', minRep: 0, color: '#94a3b8' },
      { level: 2, name: 'Good', minRep: 30, color: '#10b981' },
      { level: 3, name: 'Excellent', minRep: 60, color: '#00f0ff' },
      { level: 4, name: 'Outstanding', minRep: 85, color: '#fbbf24' },
      { level: 5, name: 'Legendary', minRep: 95, color: '#f59e0b' }
    ],

    companyLevelXp: [
      { level: 1, xp: 0, garageSlots: 5, unlock: 'basic-fleet' },
      { level: 2, xp: 1000, garageSlots: 8, unlock: 'custom-livery' },
      { level: 3, xp: 5000, garageSlots: 12, unlock: 'interior-custom' },
      { level: 4, xp: 15000, garageSlots: 16, unlock: 'private-routes' },
      { level: 5, xp: 40000, garageSlots: 20, unlock: 'multi-region' }
    ],

    generateFleetNumber(company) {
      const num = company.nextFleetNumber;
      company.nextFleetNumber++;
      const padded = String(num).padStart(3, '0');
      return `${company.fleetPrefix}-${padded}`;
    },

    getNextLevelXp(currentLevel) {
      const entry = this.companyLevelXp.find(l => l.level === currentLevel + 1);
      return entry ? entry.xp : this.companyLevelXp[this.companyLevelXp.length - 1].xp * 2;
    },

    getReputationTier(rep) {
      const tier = [...this.reputationTiers].reverse().find(t => rep >= t.minRep);
      return tier || this.reputationTiers[0];
    },

    // ===== FICTIONAL PRIVATE OPERATORS =====
    // Original fictional companies inspired by South Indian road transport.
    // No real company logos or copyrighted branding are used.
    privateOperators: [
      {
        id: 'superia-travels',
        name: 'Superia Travels',
        tagline: 'Luxury Every Mile',
        type: 'private',
        fleetType: 'luxury-coach',
        pricingMultiplier: 1.3,
        preferredRoutes: ['ap-vijayawada-visakhapatnam', 'inter-ap-tz-hyderabad-vijayawada'],
        serviceCategories: ['deluxe', 'super-express', 'luxury-coach'],
        passengerPreferences: ['business', 'tourist'],
        livery: { primaryColor: '#dc2626', secondaryColor: '#ffffff', logoColor: '#ffffff' },
        reputation: 60
      },
      {
        id: 'greenline-travels',
        name: 'Greenline Travels',
        tagline: 'Eco. Comfort. Connectivity',
        type: 'private',
        fleetType: 'semi-sleeper',
        pricingMultiplier: 1.15,
        preferredRoutes: ['ap-tirupati-amaravati', 'tz-hyderabad-warangal'],
        serviceCategories: ['express', 'deluxe', 'semi-sleeper'],
        passengerPreferences: ['commuter', 'business', 'tourist'],
        livery: { primaryColor: '#16a34a', secondaryColor: '#22c55e', logoColor: '#ffffff' },
        reputation: 55
      },
      {
        id: 'orange-travels',
        name: 'Orange Travels',
        tagline: 'Overnight. On Time.',
        type: 'private',
        fleetType: 'sleeper',
        pricingMultiplier: 1.25,
        preferredRoutes: ['inter-ap-tz-hyderabad-vijayawada', 'ap-vijayawada-visakhapatnam'],
        serviceCategories: ['sleeper', 'semi-sleeper', 'deluxe'],
        passengerPreferences: ['tourist', 'business', 'elderly'],
        livery: { primaryColor: '#ea580c', secondaryColor: '#f97316', logoColor: '#ffffff' },
        reputation: 58
      },
      {
        id: 'deccan-express',
        name: 'Deccan Express',
        tagline: 'Across The Deccan',
        type: 'intercity',
        fleetType: 'express',
        pricingMultiplier: 1.2,
        preferredRoutes: ['ap-nellore-kurnool', 'tz-hyderabad-nizamabad'],
        serviceCategories: ['express', 'super-express', 'deluxe'],
        passengerPreferences: ['commuter', 'business', 'tourist'],
        livery: { primaryColor: '#7c3aed', secondaryColor: '#a78bfa', logoColor: '#ffffff' },
        reputation: 62
      },
      {
        id: 'river-valley-lines',
        name: 'River Valley Lines',
        tagline: 'Scenic Journeys, Reliable Service',
        type: 'long-distance',
        fleetType: 'luxury-coach',
        pricingMultiplier: 1.35,
        preferredRoutes: ['inter-ap-tz-hyderabad-vijayawada', 'ap-vijayawada-visakhapatnam'],
        serviceCategories: ['super-express', 'sleeper', 'luxury-coach'],
        passengerPreferences: ['tourist', 'business'],
        livery: { primaryColor: '#4f46e5', secondaryColor: '#6366f1', logoColor: '#ffffff' },
        reputation: 65
      },
      {
        id: 'coastal-connect',
        name: 'Coastal Connect',
        tagline: 'Linking The Coast',
        type: 'local',
        fleetType: 'local',
        pricingMultiplier: 0.95,
        preferredRoutes: ['ap-nellore-kurnool', 'tz-karimnagar-nalgonda'],
        serviceCategories: ['local', 'city'],
        passengerPreferences: ['commuter', 'student', 'elderly'],
        livery: { primaryColor: '#0891ca', secondaryColor: '#0ea5e9', logoColor: '#ffffff' },
        reputation: 45
      }
    ],

    getPrivateOperator(operatorId) {
      return this.privateOperators.find(o => o.id === operatorId) || null;
    },

    getOperatorsByServiceCategory(category) {
      return this.privateOperators.filter(o =>
        o.serviceCategories.includes(category)
      );
    },

    getOperatorsByType(type) {
      return this.privateOperators.filter(o => o.type === type);
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.PrivateTravelsData = PrivateTravelsData;
  }
  if (typeof module !== 'undefined') {
    module.exports = PrivateTravelsData;
  }
})();
