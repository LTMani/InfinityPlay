/**
 * Bus Simulator - Route System (12)
 * Manages active routes, navigation waypoints, and route progress
 */

(function () {
  'use strict';

  const RouteData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.RouteData) ||
    (typeof require !== 'undefined' ? require('../data/routes') : null);
  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);

  const RouteSystem = {
    activeRoute: null,
    waypoints: [],
    currentWaypoint: 0,
    progress: 0,        // 0-1
    distanceTraveled: 0,

    init(modules) {
      this.modules = modules;
      this.activeRoute = null;
      this.waypoints = [];
      this.currentWaypoint = 0;
      this.progress = 0;
      this.distanceTraveled = 0;
    },

    setRoute(routeId) {
      const route = RouteData ? RouteData.getById(routeId) : null;
      if (!route) {
        EventManager.emit('routeNotFound', { routeId });
        return false;
      }

      this.activeRoute = route;
      this.waypoints = this._generateWaypoints(route);
      this.currentWaypoint = 0;
      this.progress = 0;
      this.distanceTraveled = 0;

      EventManager.emit('routeStarted', {
        route: route,
        waypointCount: this.waypoints.length
      });

      return true;
    },

    _generateWaypoints(route) {
      const map = this.modules.Map;
      if (!map) return [];

      const waypoints = [];
      const allCities = map.allCities || [];

      // Resolve start and end cities
      const startCity = allCities.find(c => c.id === route.from) || allCities[0];
      const endCity = allCities.find(c => c.id === route.to) || allCities[allCities.length - 1];

      if (!startCity || !endCity) return [];

      waypoints.push({ x: startCity.x, y: startCity.y, type: 'start', cityId: startCity.id });

      // Add intermediate stops
      if (route.stops) {
        for (let i = 1; i < route.stops.length - 1; i++) {
          const stopCity = allCities.find(c => c.id === route.stops[i]);
          if (stopCity) {
            waypoints.push({
              x: stopCity.x,
              y: stopCity.y,
              type: 'stop',
              cityId: stopCity.id
            });
          }
        }
      }

      waypoints.push({ x: endCity.x, y: endCity.y, type: 'end', cityId: endCity.id });

      return waypoints;
    },

    getNearestWaypoint(x, y) {
      if (!this.waypoints || this.waypoints.length === 0) return null;

      let nearest = null;
      let minDist = Infinity;

      for (let i = this.currentWaypoint; i < this.waypoints.length; i++) {
        const wp = this.waypoints[i];
        const dist = Math.sqrt(Math.pow(wp.x - x, 2) + Math.pow(wp.y - y, 2));
        if (dist < minDist) {
          minDist = dist;
          nearest = wp;
        }
      }
      return nearest;
    },

    advanceWaypoint() {
      if (this.currentWaypoint < this.waypoints.length - 1) {
        this.currentWaypoint++;
        EventManager.emit('waypointReached', {
          index: this.currentWaypoint,
          waypoint: this.waypoints[this.currentWaypoint]
        });
        return true;
      }
      return false;
    },

    isComplete() {
      return this.currentWaypoint >= this.waypoints.length - 1;
    },

    getProgress() {
      if (!this.waypoints || this.waypoints.length === 0) return 0;
      return this.currentWaypoint / (this.waypoints.length - 1);
    },

    getDistanceToNext() {
      if (!this.waypoints || this.waypoints.length === 0) return 0;
      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      if (!bus) return 0;

      const wp = this.waypoints[this.currentWaypoint];
      if (!wp) return 0;

      return Math.sqrt(Math.pow(wp.x - bus.x, 2) + Math.pow(wp.y - bus.y, 2));
    },

    getRouteInfo() {
      return this.activeRoute;
    },

    getRouteName() {
      return this.activeRoute ? this.activeRoute.name : 'No Route';
    },

    serialize() {
      return {
        activeRouteId: this.activeRoute ? this.activeRoute.id : null,
        currentWaypoint: this.currentWaypoint,
        distanceTraveled: this.distanceTraveled,
        progress: this.progress
      };
    },

    deserialize(data) {
      if (data.activeRouteId) {
        this.setRoute(data.activeRouteId);
        this.currentWaypoint = data.currentWaypoint || 0;
        this.distanceTraveled = data.distanceTraveled || 0;
      }
    },

    destroy() {
      this.activeRoute = null;
      this.waypoints = [];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.RouteSystem = RouteSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = RouteSystem;
  }
})();
