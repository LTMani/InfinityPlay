/**
 * Bus Simulator - Ticket System
 * Manages ticket sales, fare calculation, ticket records,
 * and payment collection for each passenger journey.
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const EconomyConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EconomyConfig) ||
    (typeof require !== 'undefined' ? require('../data/economy') : null);
  const PassengerConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.PassengerConfig) ||
    (typeof require !== 'undefined' ? require('../config/PassengerConfig') : null);

  const TicketSystem = {
    totalTicketsSold: 0,
    totalRevenue: 0,
    pendingFare: 0,
    ticketPriceMultiplier: 1.0,
    _tickets: [],          // Active ticket records
    _ticketCounter: 0,

    init(modules) {
      this.modules = modules;
      this.totalTicketsSold = 0;
      this.totalRevenue = 0;
      this.pendingFare = 0;
      this._tickets = [];
      this._ticketCounter = 0;
      this.ticketPriceMultiplier = 1.0;

      if (EventManager) {
        EventManager.on('boardingCompleted', (data) => {
          this._collectFares(data);
        });
        EventManager.on('passengersAlighted', (data) => {
          this._processCompletedJourneys(data);
        });
      }
    },

    generateTicket(passenger, originStop, destStop, distance, bus) {
      if (!passenger) return null;

      const pcfg = PassengerConfig || {};
      const fareCfg = pcfg.fare || {};

      const originId = originStop ? (typeof originStop === 'string' ? originStop : originStop.id) : passenger.originStopId;
      const destId = destStop ? (typeof destStop === 'string' ? destStop : destStop.id) : passenger.destinationStopId;

      // Calculate fare
      let fare = this.calculateFare(passenger, distance, bus);

      const ticket = {
        ticketId: 'TKT_' + (this._ticketCounter++),
        passengerId: passenger.passengerId,
        passengerType: passenger.type ? passenger.type.id : passenger.type,
        origin: originId,
        destination: destId,
        distance: distance || 0,
        fare: fare,
        issuedAt: Date.now(),
        paid: false,
        status: 'active'
      };

      // Assign ticket to passenger
      if (passenger) {
        passenger.ticket = ticket;
        passenger.fare = fare;
        passenger.ticketStatus = 'assigned';
      }

      this._tickets.push(ticket);
      this.pendingFare += fare;

      return ticket;
    },

    calculateFare(passenger, distance, bus) {
      if (!EconomyConfig) {
        // Fallback fare calculation
        const pcfg = PassengerConfig || {};
        const basePerKm = (pcfg.fare && pcfg.fare.basePerKm) || 8.0;
        let fare = (distance || 0) * basePerKm;
        const mult = passenger && passenger.type && passenger.type.fareMultiplier ? passenger.type.fareMultiplier : 1.0;
        fare *= mult;
        const min = (pcfg.fare && pcfg.fare.minimum) || 10;
        const max = (pcfg.fare && pcfg.fare.maximum) || 500;
        return Math.max(min, Math.min(max, Math.round(fare)));
      }

      const dayNight = this.modules.DayNightSystem;
      const weather = this.modules.WeatherSystem;
      const routeSystem = this.modules.RouteSystem;

      // Base fare calculation using economy config
      let fare = 0;
      const distanceKm = (distance || 0) / 100; // world units to km (400px = 1km)

      if (distanceKm > 0) {
        const basePerKm = EconomyConfig.revenue.baseFarePerKm;
        fare = distanceKm * basePerKm;

        // Passenger type multiplier
        if (passenger && passenger.fareMultiplier) {
          fare *= passenger.fareMultiplier;
        }

        // Time of day multiplier
        if (dayNight) {
          const tod = dayNight.getTimeOfDay ? dayNight.getTimeOfDay() : dayNight.getHours ? dayNight.getHours() : 'day';
          const todMult = EconomyConfig.revenue.timeOfDayMultipliers[tod];
          if (todMult) fare *= todMult;
        }

        // Weather multiplier
        if (weather && weather.getWeatherMultiplier) {
          fare *= weather.getWeatherMultiplier();
        }

        // Ticket price multiplier (player upgrades, etc.)
        fare *= this.ticketPriceMultiplier;

        // Phase 7: service type fare multiplier (e.g. sleeper, luxury coach)
        const serviceMult = this._getServiceFareMultiplier(passenger, bus);
        if (serviceMult && serviceMult > 0) {
          fare *= serviceMult;
        }
      } else {
        // Fallback to standard fare calculation
        fare = EconomyConfig.revenue.calculateTripRevenue({
          route: routeSystem ? routeSystem.getRouteInfo() : null,
          timeOfDay: dayNight ? dayNight.getHours() : 12,
          weather: weather ? weather.weather : 'clear',
          passengers: 1,
          capacity: 40,
          onTime: false,
          perfect: false
        });
      }

      // Apply min/max from PassengerConfig if available
      const pcfg = PassengerConfig || {};
      const min = (pcfg.fare && pcfg.fare.minimum) || 0;
      const max = (pcfg.fare && pcfg.fare.maximum) || Infinity;

      return Math.max(min, Math.min(max, Math.round(fare)));
    },

    /**
     * Phase 7: Returns the service fare multiplier for a passenger's journey.
     * Prefers the bus's configured serviceType, falling back to the route's
     * configured service type, and finally to 1.0.
     */
    _getServiceFareMultiplier(passenger, bus) {
      if (!passenger && !bus) return 1.0;

      const ServiceTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.ServiceTypes) || null;
      if (!ServiceTypes) return 1.0;

      let serviceId = null;
      if (bus && bus.serviceType) {
        serviceId = bus.serviceType;
      } else if (bus && bus.busType && bus.busType.serviceType) {
        serviceId = bus.busType.serviceType;
      } else if (this.modules.RouteSystem) {
        const route = this.modules.RouteSystem.getRouteInfo();
        if (route && route.serviceType) serviceId = route.serviceType;
      }

      if (!serviceId) return 1.0;

      const svc = ServiceTypes.getById(serviceId);
      return svc && svc.fareMultiplier ? svc.fareMultiplier : 1.0;
    },

    sellTicket(passengerCount, distance) {
      const routeSystem = this.modules.RouteSystem;
      const route = routeSystem ? routeSystem.getRouteInfo() : null;

      if (!EconomyConfig || !route) {
        // Use simple per-passenger calculation
        let totalFare = 0;
        for (let i = 0; i < passengerCount; i++) {
          totalFare += this.calculateFare(null, distance);
        }
        totalFare = Math.round(totalFare * this.ticketPriceMultiplier);

        this.totalTicketsSold += passengerCount;
        this.totalRevenue += totalFare;

        if (EventManager) {
          EventManager.emit('ticketSold', { count: passengerCount, fare: totalFare });
        }

        return totalFare;
      }

      let totalFare = 0;
      for (let i = 0; i < passengerCount; i++) {
        totalFare += this.calculateFare(null, distance);
      }

      totalFare = Math.round(totalFare * this.ticketPriceMultiplier);

      this.totalTicketsSold += passengerCount;
      this.totalRevenue += totalFare;

      if (EventManager) {
        EventManager.emit('ticketSold', { count: passengerCount, fare: totalFare });
      }

      return totalFare;
    },

    _collectFares(data) {
      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      if (!bus || !data) return;

      const onBoard = bus.passengersOnBoard;
      const route = this.modules.RouteSystem ? this.modules.RouteSystem.getRouteInfo() : null;

      if (route) {
        const fare = this.sellTicket(onBoard, route.distance);
        this.pendingFare = fare;

        // Pay all active tickets
        for (let i = 0; i < this._tickets.length; i++) {
          if (!this._tickets[i].paid) {
            this._tickets[i].paid = true;
            this._tickets[i].status = 'paid';
          }
        }

        if (EventManager) {
          EventManager.emit('fareCollected', {
            amount: fare,
            onBoard: onBoard,
            ticketsSold: onBoard
          });
        }
      }
    },

    _processCompletedJourneys(data) {
      // Mark tickets as completed when passengers alight
      if (data && data.passenger) {
        const ticket = data.passenger.ticket;
        if (ticket) {
          ticket.status = 'completed';
        }
      }

      if (data && data.alighted > 0) {
        // Clear paid tickets from active list
        this._tickets = this._tickets.filter(t => t.status === 'active');
      }
    },

    payRevenue() {
      const amount = this.pendingFare;
      this.pendingFare = 0;
      return amount;
    },

    getRevenue() {
      return this.totalRevenue;
    },

    getTicketsSold() {
      return this.totalTicketsSold;
    },

    getActiveTickets() {
      return this._tickets.filter(t => t.status === 'active');
    },

    setMultiplier(multiplier) {
      this.ticketPriceMultiplier = multiplier;
    },

    serialize() {
      return {
        totalTicketsSold: this.totalTicketsSold,
        totalRevenue: this.totalRevenue,
        ticketPriceMultiplier: this.ticketPriceMultiplier,
        activeTickets: this._tickets.length
      };
    },

    deserialize(data) {
      this.totalTicketsSold = data.totalTicketsSold || 0;
      this.totalRevenue = data.totalRevenue || 0;
      this.ticketPriceMultiplier = data.ticketPriceMultiplier || 1.0;
      this._ticketCounter = data.totalTicketsSold || 0;
    },

    destroy() {
      this._tickets = [];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TicketSystem = TicketSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = TicketSystem;
  }
})();
