/**
 * Bus Simulator - Routes Data
 * Bus route definitions connecting cities across AP and TZ
 */

(function () {
  'use strict';

  const routes = [
    // ===== Andhra Pradesh Routes =====
    {
      id: 'ap-vijayawada-guntur',
      name: 'Vijayawada - Guntur Express',
      region: 'ap',
      from: 'vijayawada',
      to: 'guntur',
      distance: 35,    // km
      baseFare: 125,
      baseTime: 55,    // minutes
      difficulty: 'easy',
      stops: ['vijayawada', 'tenali', 'guntur'],
      roadType: 'highway',
      toll: false,
      busTypes: ['express', 'amaravati', 'ultra-deluxe'],
      serviceType: 'city',
      stopFrequency: 0.6,
      maxStops: 12
    },
    {
      id: 'ap-vijayawada-visakhapatnam',
      name: 'Vijayawada - Visakhapatnam Highway',
      region: 'ap',
      from: 'vijayawada',
      to: 'visakhapatnam',
      distance: 380,
      baseFare: 850,
      baseTime: 360,
      difficulty: 'hard',
      stops: ['vijayawada', 'rajahmundry', 'visakhapatnam'],
      roadType: 'highway',
      toll: true,
      tollCost: 45,
      busTypes: ['express', 'amaravati', 'super-luxury', 'indra-ac'],
      serviceType: 'super-express',
      stopFrequency: 0.15,
      maxStops: 3
    },
    {
      id: 'ap-tirupati-amaravati',
      name: 'Tirupati - Amaravati Corridor',
      region: 'ap',
      from: 'tirupati',
      to: 'amaravati',
      distance: 220,
      baseFare: 420,
      baseTime: 220,
      difficulty: 'medium',
      stops: ['tirupati', 'kadapa', 'kurnool', 'amaravati'],
      roadType: 'highway',
      toll: true,
      tollCost: 30,
      busTypes: ['express', 'amaravati', 'vennela'],
      serviceType: 'express',
      stopFrequency: 0.3,
      maxStops: 5
    },
    {
      id: 'ap-nellore-kurnool',
      name: 'Nellore - Kurnool Route',
      region: 'ap',
      from: 'nellore',
      to: 'kurnool',
      distance: 310,
      baseFare: 580,
      baseTime: 280,
      difficulty: 'medium',
      stops: ['nellore', 'kurnool'],
      roadType: 'mixed',
      toll: false,
      busTypes: ['pallevelugu', 'express'],
      serviceType: 'local',
      stopFrequency: 0.8,
      maxStops: 15
    },
    {
      id: 'ap-anantapur-hyderabad-border',
      name: 'Anantapur to TZ Border',
      region: 'ap',
      from: 'anantapur',
      to: 'kadapa',
      distance: 180,
      baseFare: 340,
      baseTime: 170,
      difficulty: 'medium',
      stops: ['anantapur', 'kadapa'],
      roadType: 'highway',
      toll: false,
      busTypes: ['express', 'indra-ac'],
      serviceType: 'express',
      stopFrequency: 0.35,
      maxStops: 6
    },

    // ===== Telangana Routes =====
    {
      id: 'tz-hyderabad-warangal',
      name: 'Hyderabad - Warangal Express',
      region: 'tz',
      from: 'hyderabad',
      to: 'warangal',
      distance: 145,
      baseFare: 320,
      baseTime: 150,
      difficulty: 'medium',
      stops: ['hyderabad', 'nalgonda', 'khammam', 'warangal'],
      roadType: 'highway',
      toll: true,
      tollCost: 25,
      busTypes: ['express', 'amaravati', 'vennela', 'indra-ac'],
      serviceType: 'express',
      stopFrequency: 0.35,
      maxStops: 6
    },
    {
      id: 'tz-hyderabad-nizamabad',
      name: 'Hyderabad - Nizamabad Superfast',
      region: 'tz',
      from: 'hyderabad',
      to: 'nizamabad',
      distance: 185,
      baseFare: 410,
      baseTime: 180,
      difficulty: 'medium',
      stops: ['hyderabad', 'nizamabad'],
      roadType: 'highway',
      toll: true,
      tollCost: 30,
      busTypes: ['express', 'super-luxury', 'indra-ac'],
      serviceType: 'super-express',
      stopFrequency: 0.2,
      maxStops: 3
    },
    {
      id: 'tz-karimnagar-nalgonda',
      name: 'Karimnagar - Nalgonda Link',
      region: 'tz',
      from: 'karimnagar',
      to: 'nalgonda',
      distance: 110,
      baseFare: 260,
      baseTime: 110,
      difficulty: 'easy',
      stops: ['karimnagar', 'nizamabad', 'nalgonda'],
      roadType: 'highway',
      toll: false,
      busTypes: ['pallevelugu', 'express'],
      serviceType: 'local',
      stopFrequency: 0.7,
      maxStops: 12
    },
    {
      id: 'tz-hyderabad-khammam',
      name: 'Hyderabad - Khammam Short Route',
      region: 'tz',
      from: 'hyderabad',
      to: 'khammam',
      distance: 100,
      baseFare: 230,
      baseTime: 95,
      difficulty: 'easy',
      stops: ['hyderabad', 'khammam'],
      roadType: 'highway',
      toll: false,
      busTypes: ['express', 'amaravati'],
      serviceType: 'city',
      stopFrequency: 0.5,
      maxStops: 8
    },

    // ===== Inter-state Routes =====
    {
      id: 'inter-ap-tz-hyderabad-vijayawada',
      name: 'Hyderabad - Vijayawada Interstate',
      region: 'interstate',
      from: 'hyderabad',
      to: 'vijayawada',
      distance: 520,
      baseFare: 1100,
      baseTime: 480,
      difficulty: 'hard',
      stops: ['hyderabad', 'nalgonda', 'kurnool', 'kadapa', 'vijayawada'],
      roadType: 'highway',
      toll: true,
      tollCost: 55,
      busTypes: ['express', 'super-luxury', 'indra-ac', 'amaravati'],
      serviceType: 'super-express',
      stopFrequency: 0.15,
      maxStops: 3
    }
  ];

  const RouteData = {
    routes: routes,

    getById(id) {
      return routes.find(r => r.id === id) || null;
    },

    getByRegion(region) {
      return routes.filter(r => r.region === region);
    },

    getByStart(startCityId) {
      return routes.filter(r => r.from === startCityId);
    },

    getSuggestedRoutes(busTypeId) {
      return routes.filter(r => r.busTypes.includes(busTypeId));
    },

    calculateDistance(fromId, toId) {
      const allRoutes = routes;
      const direct = allRoutes.find(r =>
        (r.from === fromId && r.to === toId) ||
        (r.to === fromId && r.from === toId)
      );
      return direct ? direct.distance : 0;
    },

    /**
     * Returns the service type configured for a route, falling back to 'city'.
     */
    getServiceType(routeId) {
      const route = this.getById(routeId);
      return route ? (route.serviceType || 'city') : 'city';
    },

    /**
     * Returns routes configured for a given service type.
     */
    getByServiceType(serviceTypeId) {
      return routes.filter(r => r.serviceType === serviceTypeId);
    },

    /**
     * Returns routes whose configured service type is compatible with the
     * given bus type's supported service types.
     */
    getCompatibleRoutes(busTypeId, BusTypes) {
      const bt = BusTypes ? BusTypes.getById(busTypeId) : null;
      const supported = (bt && bt.serviceTypes && bt.serviceTypes.length)
        ? bt.serviceTypes
        : (bt && bt.serviceType ? [bt.serviceType] : ['city']);
      return routes.filter(r => supported.includes(r.serviceType || 'city'));
    },

    /**
     * Returns the effective stop count for a route given a service type.
     * Service types with a stopFrequency < 1 reduce the number of stops.
     */
    getEffectiveStops(routeId, serviceTypeId, ServiceTypes) {
      const route = this.getById(routeId);
      if (!route) return [];
      const stops = route.stops || [];
      const svc = ServiceTypes ? ServiceTypes.getById(serviceTypeId) : null;
      const freq = (svc && svc.stopFrequency !== undefined) ? svc.stopFrequency
        : (route.stopFrequency !== undefined ? route.stopFrequency : 1.0);
      const maxStops = (svc && svc.maxStopsPerRoute !== undefined) ? svc.maxStopsPerRoute
        : (route.maxStops !== undefined ? route.maxStops : stops.length);

      if (freq >= 1.0 && maxStops >= stops.length) return stops;

      const effective = Math.min(maxStops, Math.max(2, Math.ceil(stops.length * freq)));
      if (effective >= stops.length) return stops;

      // Keep first and last stops, subsample the middle.
      const middle = stops.slice(1, -1);
      const step = Math.max(1, Math.floor(middle.length / Math.max(1, effective - 2)));
      const sampled = [];
      for (let i = 0; i < middle.length; i += step) {
        sampled.push(middle[i]);
      }
      return [stops[0], ...sampled, stops[stops.length - 1]];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.RouteData = RouteData;
  }
  if (typeof module !== 'undefined') {
    module.exports = RouteData;
  }
})();
