/**
 * Bus Simulator - Service Types Data
 * Configurable bus service categories that influence capacity,
 * passenger type, fare multiplier, speed, stop frequency, and route preference.
 *
 * All names and branding are original fictional creations inspired by
 * South Indian bus transportation environments.
 */

(function () {
  'use strict';

  const SERVICE_TYPES = [
    {
      id: 'local',
      name: 'Local',
      displayName: 'Local Service',
      description: 'Frequent-stop city service connecting neighbourhoods and suburbs.',
      category: 'public',
      fareMultiplier: 0.85,
      capacityMultiplier: 1.0,
      speedMultiplier: 0.85,
      stopFrequency: 1.0,        // 1.0 = stop at every stop
      maxStopsPerRoute: 20,
      preferredPassengerTypes: ['commuter', 'student'],
      preferredBusBodyTypes: ['standard', 'semi-deluxe'],
      boardingTimePerPassenger: 2.0,
      alightTimePerPassenger: 1.5,
      color: '#60a5fa'
    },
    {
      id: 'city',
      name: 'City',
      displayName: 'City Express',
      description: 'Rapid urban service with limited intermediate stops.',
      category: 'public',
      fareMultiplier: 1.0,
      capacityMultiplier: 1.0,
      speedMultiplier: 1.0,
      stopFrequency: 0.6,
      maxStopsPerRoute: 12,
      preferredPassengerTypes: ['commuter', 'student', 'business'],
      preferredBusBodyTypes: ['standard', 'semi-deluxe', 'ac-standard'],
      boardingTimePerPassenger: 2.2,
      alightTimePerPassenger: 1.6,
      color: '#10b981'
    },
    {
      id: 'express',
      name: 'Express',
      displayName: 'Express',
      description: 'Fast intercity service with few stops and higher fares.',
      category: 'public',
      fareMultiplier: 1.25,
      capacityMultiplier: 0.95,
      speedMultiplier: 1.15,
      stopFrequency: 0.35,
      maxStopsPerRoute: 6,
      preferredPassengerTypes: ['commuter', 'business', 'tourist'],
      preferredBusBodyTypes: ['semi-deluxe', 'ac-standard', 'deluxe'],
      boardingTimePerPassenger: 2.5,
      alightTimePerPassenger: 1.8,
      color: '#f59e0b'
    },
    {
      id: 'super-express',
      name: 'Super Express',
      displayName: 'Super Express',
      description: 'Premium fast service with minimal stops and reclining seats.',
      category: 'public',
      fareMultiplier: 1.5,
      capacityMultiplier: 0.9,
      speedMultiplier: 1.3,
      stopFrequency: 0.2,
      maxStopsPerRoute: 3,
      preferredPassengerTypes: ['business', 'tourist'],
      preferredBusBodyTypes: ['deluxe', 'ac-deluxe', 'semi-luxury'],
      boardingTimePerPassenger: 2.8,
      alightTimePerPassenger: 2.0,
      color: '#7c3aed'
    },
    {
      id: 'deluxe',
      name: 'Deluxe',
      displayName: 'Deluxe Coach',
      description: 'Comfortable long-distance coach with cushioned seating.',
      category: 'private',
      fareMultiplier: 1.6,
      capacityMultiplier: 0.85,
      speedMultiplier: 1.2,
      stopFrequency: 0.25,
      maxStopsPerRoute: 5,
      preferredPassengerTypes: ['business', 'tourist', 'elderly'],
      preferredBusBodyTypes: ['deluxe', 'ac-deluxe', 'semi-luxury', 'luxury'],
      boardingTimePerPassenger: 3.0,
      alightTimePerPassenger: 2.2,
      color: '#0ea5e9'
    },
    {
      id: 'sleeper',
      name: 'Sleeper',
      displayName: 'Sleeper Coach',
      description: 'Air-conditioned sleeper for overnight long-distance journeys.',
      category: 'private',
      fareMultiplier: 1.8,
      capacityMultiplier: 0.75,
      speedMultiplier: 1.15,
      stopFrequency: 0.15,
      maxStopsPerRoute: 3,
      preferredPassengerTypes: ['tourist', 'business', 'elderly'],
      preferredBusBodyTypes: ['ac-sleeper', 'semi-luxury', 'luxury'],
      boardingTimePerPassenger: 3.5,
      alightTimePerPassenger: 2.5,
      color: '#4f46e5'
    },
    {
      id: 'semi-sleeper',
      name: 'Semi-Sleeper',
      displayName: 'Semi-Sleeper Coach',
      description: 'Semi-sleeper seating for medium-long routes with good comfort.',
      category: 'private',
      fareMultiplier: 1.55,
      capacityMultiplier: 0.82,
      speedMultiplier: 1.18,
      stopFrequency: 0.22,
      maxStopsPerRoute: 4,
      preferredPassengerTypes: ['business', 'tourist', 'elderly'],
      preferredBusBodyTypes: ['semi-sleeper', 'semi-luxury', 'deluxe'],
      boardingTimePerPassenger: 3.2,
      alightTimePerPassenger: 2.3,
      color: '#6366f1'
    },
    {
      id: 'luxury-coach',
      name: 'Luxury Coach',
      displayName: 'Luxury Coach',
      description: 'Top-tier premium coach with pushback seats and entertainment.',
      category: 'private',
      fareMultiplier: 2.0,
      capacityMultiplier: 0.7,
      speedMultiplier: 1.25,
      stopFrequency: 0.1,
      maxStopsPerRoute: 2,
      preferredPassengerTypes: ['business', 'tourist'],
      preferredBusBodyTypes: ['luxury', 'pushback', 'semi-luxury'],
      boardingTimePerPassenger: 3.8,
      alightTimePerPassenger: 2.8,
      color: '#f43f5e'
    }
  ];

  const ServiceTypes = {
    types: SERVICE_TYPES,

    getById(id) {
      return SERVICE_TYPES.find(t => t.id === id) || null;
    },

    getByCategory(category) {
      return SERVICE_TYPES.filter(t => t.category === category);
    },

    getPublicTypes() {
      return SERVICE_TYPES.filter(t => t.category === 'public');
    },

    getPrivateTypes() {
      return SERVICE_TYPES.filter(t => t.category === 'private');
    },

    /**
     * Returns service types compatible with a given bus body type.
     */
    getByBusBodyType(bodyType) {
      return SERVICE_TYPES.filter(t =>
        t.preferredBusBodyTypes.includes(bodyType)
      );
    },

    /**
     * Returns service types compatible with a given bus type id.
     */
    getByBusTypeId(busType, allBusTypes) {
      if (!busType) return SERVICE_TYPES;
      const body = busType.bodyType;
      return this.getByBusBodyType(body);
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.ServiceTypes = ServiceTypes;
  }
  if (typeof module !== 'undefined') {
    module.exports = ServiceTypes;
  }
})();