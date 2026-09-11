/**
 * Bus Simulator - Operators Data
 * Fictional bus operator definitions for Phase 7.
 * All names and branding are original creations inspired by
 * South Indian bus transportation environments.
 */

(function () {
  'use strict';

  const OPERATORS = [
    {
      id: 'rtc-ap',
      name: 'RTC',
      fullName: 'Regional Transport Corporation',
      type: 'public',
      description: 'State-run public transport serving villages, towns and cities.',
      livery: { primaryColor: '#f59e0b', secondaryColor: '#d97706', logoColor: '#ffffff' },
      logo: 'RTC',
      fleetPrefix: 'AP',
      pricingMultiplier: 1.0,
      preferredServiceTypes: ['local', 'city', 'express'],
      reputation: 70,
      depotId: 'depot_ap_main'
    },
    {
      id: 'rtc-tz',
      name: 'RTC Telangana',
      fullName: 'Telangana State Road Transport Corporation',
      type: 'public',
      description: 'State-run public transport across Telangana corridors.',
      livery: { primaryColor: '#2a9d8f', secondaryColor: '#16a34a', logoColor: '#ffffff' },
      logo: 'TSRTC',
      fleetPrefix: 'TS',
      pricingMultiplier: 1.0,
      preferredServiceTypes: ['local', 'city', 'express'],
      reputation: 72,
      depotId: 'depot_tz_main'
    },
    {
      id: 'greenline-travels',
      name: 'Greenline Travels',
      fullName: 'Greenline Roadways',
      type: 'private',
      description: 'Private operator running multi-axle semi-sleeper coaches.',
      livery: { primaryColor: '#16a34a', secondaryColor: '#22c55e', logoColor: '#ffffff' },
      logo: 'GL',
      fleetPrefix: 'GL',
      pricingMultiplier: 1.15,
      preferredServiceTypes: ['express', 'deluxe', 'semi-sleeper'],
      reputation: 55,
      depotId: 'depot_greenline'
    },
    {
      id: 'superia-travels',
      name: 'Superia Travels',
      fullName: 'Superia Road Transport',
      type: 'private',
      description: 'Luxury private tour operator with premium coaches.',
      livery: { primaryColor: '#dc2626', secondaryColor: '#ffffff', logoColor: '#ffffff' },
      logo: 'ST',
      fleetPrefix: 'ST',
      pricingMultiplier: 1.3,
      preferredServiceTypes: ['deluxe', 'super-express', 'luxury-coach'],
      reputation: 60,
      depotId: 'depot_superia'
    },
    {
      id: 'orange-travels',
      name: 'Orange Travels',
      fullName: 'Orange Night Riders',
      type: 'private',
      description: 'Sleeper coach operator specialising in overnight journeys.',
      livery: { primaryColor: '#ea580c', secondaryColor: '#f97316', logoColor: '#ffffff' },
      logo: 'OR',
      fleetPrefix: 'OR',
      pricingMultiplier: 1.25,
      preferredServiceTypes: ['sleeper', 'semi-sleeper', 'deluxe'],
      reputation: 58,
      depotId: 'depot_orange'
    },
    {
      id: 'coastal-connect',
      name: 'Coastal Connect',
      fullName: 'Coastal Connect Bus Service',
      type: 'local',
      description: 'Local operator linking coastal towns and fishing villages.',
      livery: { primaryColor: '#0891ca', secondaryColor: '#0ea5e9', logoColor: '#ffffff' },
      logo: 'CC',
      fleetPrefix: 'CC',
      pricingMultiplier: 0.95,
      preferredServiceTypes: ['local', 'city'],
      reputation: 45,
      depotId: 'depot_coastal'
    },
    {
      id: 'deccan-express',
      name: 'Deccan Express',
      fullName: 'Deccan Express Travels',
      type: 'intercity',
      description: 'Intercity operator connecting major Deccan plateau cities.',
      livery: { primaryColor: '#7c3aed', secondaryColor: '#a78bfa', logoColor: '#ffffff' },
      logo: 'DX',
      fleetPrefix: 'DX',
      pricingMultiplier: 1.2,
      preferredServiceTypes: ['express', 'super-express', 'deluxe'],
      reputation: 62,
      depotId: 'depot_deccan'
    },
    {
      id: 'river-valley-lines',
      name: 'River Valley Lines',
      fullName: 'River Valley Transport Co.',
      type: 'long-distance',
      description: 'Long-distance operator running deluxe coaches on inter-state routes.',
      livery: { primaryColor: '#4f46e5', secondaryColor: '#6366f1', logoColor: '#ffffff' },
      logo: 'RVL',
      fleetPrefix: 'RVL',
      pricingMultiplier: 1.35,
      preferredServiceTypes: ['super-express', 'sleeper', 'luxury-coach'],
      reputation: 65,
      depotId: 'depot_river-valley'
    }
  ];

  const OperatorSystem = {
    operators: OPERATORS,

    getAll() {
      return OPERATORS;
    },

    getById(id) {
      return OPERATORS.find(o => o.id === id) || null;
    },

    getByType(type) {
      return OPERATORS.filter(o => o.type === type);
    },

    getPublicOperators() {
      return OPERATORS.filter(o => o.type === 'public');
    },

    getPrivateOperators() {
      return OPERATORS.filter(o => o.type === 'private');
    },

    getByServiceType(serviceTypeId) {
      return OPERATORS.filter(o =>
        o.preferredServiceTypes.includes(serviceTypeId)
      );
    },

    /**
     * Returns operators whose preferred service types include any of
     * the service types compatible with the given bus body type.
     */
    getByBusType(busType) {
      if (!busType) return OPERATORS;
      const ServiceTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.ServiceTypes) || null;
      if (!ServiceTypes) return OPERATORS;
      const compatible = ServiceTypes.getByBusBodyType(busType.bodyType).map(s => s.id);
      return OPERATORS.filter(o =>
        o.preferredServiceTypes.some(s => compatible.includes(s))
      );
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.OperatorSystem = OperatorSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = OperatorSystem;
  }
})();