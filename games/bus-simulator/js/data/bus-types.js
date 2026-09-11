/**
 * Bus Simulator - Bus Types Data
 * RTC-style bus categories and private travels fleet
 */

(function () {
  'use strict';

  // ===== RTC-STYLE BUS CATEGORIES =====
  const rtcBusTypes = [
    {
      id: 'pallevelugu',
      name: 'Pallevelugu',
      category: 'rtc',
      displayName: 'Pallevelugu (పల్లెవేళుగు)',
      description: 'Budget-friendly village service bus for remote rural routes.',
      speed: 45,
      capacity: 42,
      fuelCapacity: 180,
      standingCapacity: 15,
      fuelEfficiency: 3.2,    // km/liter
      comfort: 3,
      price: 1200000,
      maintenanceCost: 800,
      livery: { color: '#f59e0b', secondary: '#d97706' },
      seats: 'standard',
      bodyType: 'semi-deluxe',
      serviceType: 'local',
      serviceTypes: ['local', 'city'],
      operatorId: 'rtc-ap'
    },
    {
      id: 'express',
      name: 'Express',
      category: 'rtc',
      displayName: 'Express',
      description: 'Fast passenger express for medium-distance intercity travel.',
      speed: 65,
      capacity: 48,
      fuelCapacity: 200,
      standingCapacity: 18,
      fuelEfficiency: 2.8,
      comfort: 4,
      price: 2800000,
      maintenanceCost: 1200,
      livery: { color: '#10b981', secondary: '#059669' },
      seats: 'standard',
      bodyType: 'semi-deluxe',
      serviceType: 'express',
      serviceTypes: ['express', 'city', 'super-express'],
      operatorId: 'rtc-ap'
    },
    {
      id: 'ultra-deluxe',
      name: 'Ultra Deluxe',
      category: 'rtc',
      displayName: 'Ultra Deluxe',
      description: 'Premium comfort with reclining seats and AC for long-distance travel.',
      speed: 70,
      capacity: 42,
      fuelCapacity: 210,
      standingCapacity: 10,
      fuelEfficiency: 2.5,
      comfort: 7,
      price: 5200000,
      maintenanceCost: 2200,
      livery: { color: '#0e4a6e', secondary: '#0284c7' },
      seats: 'semi-sleeper',
      bodyType: 'deluxe',
      serviceType: 'super-express',
      serviceTypes: ['super-express', 'deluxe', 'semi-sleeper'],
      operatorId: 'rtc-ap'
    },
    {
      id: 'super-luxury',
      name: 'Super Luxury',
      category: 'rtc',
      displayName: 'Super Luxury',
      description: 'Top-tier Volvo with full AC, pushback seats, and entertainment.',
      speed: 80,
      capacity: 36,
      fuelCapacity: 240,
      standingCapacity: 6,
      fuelEfficiency: 2.2,
      comfort: 9,
      price: 8500000,
      maintenanceCost: 3500,
      livery: { color: '#7c3aed', secondary: '#4f46e5' },
      seats: 'pushback',
      bodyType: 'luxury',
      serviceType: 'luxury-coach',
      serviceTypes: ['luxury-coach', 'super-express', 'deluxe'],
      operatorId: 'superia-travels'
    },
    {
      id: 'vennela',
      name: 'Vennela',
      category: 'rtc',
      displayName: 'Vennela (వెన్నెల)',
      description: 'White AC service connecting major urban centers, "Moon" in Telugu.',
      speed: 72,
      capacity: 40,
      fuelCapacity: 220,
      standingCapacity: 12,
      fuelEfficiency: 2.3,
      comfort: 8,
      price: 6800000,
      maintenanceCost: 2800,
      livery: { color: '#ffffff', secondary: '#e5e7eb' },
      seats: 'semi-sleeper',
      bodyType: 'ac-deluxe',
      serviceType: 'deluxe',
      serviceTypes: ['deluxe', 'semi-sleeper', 'super-express'],
      operatorId: 'rtc-tz'
    },
    {
      id: 'amaravati',
      name: 'Amaravati',
      category: 'rtc',
      displayName: 'Amaravati Express',
      description: 'Flagship RTC service for capital city connections.',
      speed: 75,
      capacity: 45,
      fuelCapacity: 200,
      standingCapacity: 16,
      fuelEfficiency: 2.4,
      comfort: 6,
      price: 4800000,
      maintenanceCost: 2000,
      livery: { color: '#f97316', secondary: '#ea580c' },
      seats: 'standard',
      bodyType: 'semi-deluxe',
      serviceType: 'express',
      serviceTypes: ['express', 'city', 'super-express'],
      operatorId: 'rtc-ap'
    },
    {
      id: 'indra-ac',
      name: 'Indra AC',
      category: 'rtc',
      displayName: 'Indra AC',
      description: 'Air-conditioned bus with comfortable seating for medium-distance routes.',
      speed: 68,
      capacity: 44,
      fuelCapacity: 200,
      standingCapacity: 14,
      fuelEfficiency: 2.6,
      comfort: 6,
      price: 3800000,
      maintenanceCost: 1600,
      livery: { color: '#0891ca', secondary: '#0284c7' },
      seats: 'standard',
      bodyType: 'ac-standard',
      serviceType: 'express',
      serviceTypes: ['express', 'city', 'super-express'],
      operatorId: 'rtc-tz'
    }
  ];

  // ===== SAMPLE PRIVATE TRAVELS BUSES =====
  const privateBusTypes = [
    {
      id: 'superia-travels',
      name: 'Superia Travels',
      category: 'private',
      displayName: 'Superia Travels Volvo',
      description: 'Luxury private tour bus with premium seating.',
      speed: 85,
      capacity: 32,
      fuelCapacity: 260,
      standingCapacity: 4,
      fuelEfficiency: 2.0,
      comfort: 10,
      price: 12000000,
      maintenanceCost: 4500,
      livery: { color: '#dc2626', secondary: '#ffffff' },
      seats: 'leather-exec',
      bodyType: 'coach',
      serviceType: 'luxury-coach',
      serviceTypes: ['luxury-coach', 'super-express', 'deluxe'],
      operatorId: 'superia-travels'
    },
    {
      id: 'green-line',
      name: 'Green Line Travels',
      category: 'private',
      displayName: 'Green Line Multi-Axle',
      description: 'Multi-axle semi-sleeper with LED lighting.',
      speed: 78,
      capacity: 40,
      fuelCapacity: 240,
      standingCapacity: 10,
      fuelEfficiency: 2.1,
      comfort: 8,
      price: 9500000,
      maintenanceCost: 3200,
      livery: { color: '#16a34a', secondary: '#22c55e' },
      seats: 'multi-axle',
      bodyType: 'semi-luxury',
      serviceType: 'semi-sleeper',
      serviceTypes: ['semi-sleeper', 'deluxe', 'express'],
      operatorId: 'greenline-travels'
    },
    {
      id: 'orange-travels',
      name: 'Orange Travels',
      category: 'private',
      displayName: 'Orange Travels A/C Sleeper',
      description: 'Air-conditioned sleeper coach for overnight journeys.',
      speed: 72,
      capacity: 30,
      fuelCapacity: 280,
      standingCapacity: 4,
      fuelEfficiency: 2.4,
      comfort: 9,
      price: 8800000,
      maintenanceCost: 3000,
      livery: { color: '#ea580c', secondary: '#f97316' },
      seats: 'sleeper',
      bodyType: 'ac-sleeper',
      serviceType: 'sleeper',
      serviceTypes: ['sleeper', 'semi-sleeper', 'deluxe'],
      operatorId: 'orange-travels'
    }
  ];

  // ===== PRIVATE TRAVELS COMPANY TEMPLATE =====
  const defaultPrivateTravelTemplate = {
    name: 'My Bus Company',
    tagline: 'Safe & Comfortable Journeys',
    logo: 'MB',
    livery: {
      primaryColor: '#dc2626',
      secondaryColor: '#ffffff',
      logoColor: '#ffffff',
      stripePattern: 'wave'
    },
    fleetNumbers: ['MH-01-BUS-001', 'MH-02-BUS-002'],
    uniform: {
      driverShirt: '#dc2626',
      driverPants: '#1e293b',
      capColor: '#ffffff'
    },
    interiorTheme: 'walnut-wood',
    reputation: 50,       // 0-100
    level: 1,             // company level
    xp: 0,
    xpToNextLevel: 1000
  };

  const BusTypes = {
    rtcBusTypes: rtcBusTypes,
    privateBusTypes: privateBusTypes,
    allBusTypes: [...rtcBusTypes, ...privateBusTypes],
    defaultPrivateTravelTemplate: defaultPrivateTravelTemplate,

    getById(id) {
      return this.allBusTypes.find(b => b.id === id) || null;
    },

    getByCategory(category) {
      return this.allBusTypes.filter(b => b.category === category);
    },

    getRTCBusTypes() {
      return rtcBusTypes;
    },

    getPrivateBusTypes() {
      return privateBusTypes;
    },

    /**
     * Returns the default service type id for a bus type.
     */
    getDefaultServiceType(busTypeId) {
      const bt = this.allBusTypes.find(b => b.id === busTypeId);
      return bt ? (bt.serviceType || 'city') : 'city';
    },

    /**
     * Returns all service type ids compatible with a bus type.
     */
    getCompatibleServiceTypes(busTypeId) {
      const bt = this.allBusTypes.find(b => b.id === busTypeId);
      if (!bt) return ['city'];
      return bt.serviceTypes && bt.serviceTypes.length
        ? bt.serviceTypes
        : (bt.serviceType ? [bt.serviceType] : ['city']);
    },

    /**
     * Returns the operator id associated with a bus type (if any).
     */
    getOperatorId(busTypeId) {
      const bt = this.allBusTypes.find(b => b.id === busTypeId);
      return bt ? (bt.operatorId || null) : null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.BusTypes = BusTypes;
  }
  if (typeof module !== 'undefined') {
    module.exports = BusTypes;
  }
})();
