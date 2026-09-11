/**
 * Bus Simulator - Passenger Entity
 * Individual passenger waiting at or riding on a bus
 */

(function () {
  'use strict';

  const Entity = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Entity) ||
    (typeof require !== 'undefined' ? require('./Entity') : null);

  const PASSENGER_TYPES = [
    { id: 'commuter', name: 'Commuter', fareMultiplier: 1.0, patience: 120 },
    { id: 'student', name: 'Student', fareMultiplier: 0.8, patience: 90 },
    { id: 'elderly', name: 'Elderly', fareMultiplier: 0.9, patience: 180 },
    { id: 'business', name: 'Business Traveler', fareMultiplier: 1.5, patience: 60 },
    { id: 'tourist', name: 'Tourist', fareMultiplier: 1.2, patience: 300 }
  ];

  const DESTINATIONS = [
    'vijayawada', 'guntur', 'visakhapatnam', 'tirupati',
    'nellore', 'kurnool', 'rajahmundry', 'kadapa',
    'anantapur', 'amaravati', 'hyderabad', 'warangal',
    'karimnagar', 'nizamabad', 'khammam', 'nalgonda'
  ];

  const PASSENGER_NAMES = {
    male: ['Ramesh', 'Suresh', 'Rajesh', 'Kiran', 'Manoj', 'Vijay', 'Arun', 'Mohan', 'Dinesh', 'Prakash'],
    female: ['Priya', 'Lakshmi', 'Sita', 'Meena', 'Anjali', 'Divya', 'Kavitha', 'Sneha', 'Neha', 'Tina']
  };

  let _nextPassengerId = 0;

  function Passenger(x, y, destination, originStopId) {
    if (Entity) {
      Entity.call(this, x, y);
    } else {
      this.x = x; this.y = y;
    }

    this.passengerId = 'pax_' + (_nextPassengerId++);
    this.entityType = 'passenger';
    this.type = PASSENGER_TYPES[Math.floor(Math.random() * PASSENGER_TYPES.length)];
    this.name = this._generateName();
    this.originStopId = originStopId || null;
    this.destination = destination || null;
    this.destinationStopId = destination || null;
    this.state = 'waiting';  // waiting | boarding | riding | alighting
    this.patience = this.type.patience;
    this.waitTime = 0;
    this.boardingProgress = 0;
    this.alightingProgress = 0;
    this.fareMultiplier = this.type.fareMultiplier;
    this.anger = 0;  // 0-100
    this.gender = Math.random() > 0.5 ? 'male' : 'female';

    this.active = true;

    this.size = 0.5;
    this.collisionRadius = 0.3;

    // Ticket data
    this.ticket = null;
    this.fare = 0;
    this.ticketStatus = 'unpaid';
  }

  // Set up prototype chain BEFORE any prototype method assignments
  if (Entity) {
    Passenger.prototype = Object.create(Entity.prototype);
    Passenger.prototype.constructor = Passenger;
  }

  Passenger.prototype._generateName = function () {
    const names = this.gender === 'male' ? PASSENGER_NAMES.male : PASSENGER_NAMES.female;
    return names[Math.floor(Math.random() * names.length)];
  };

  Passenger.prototype.setDestination = function (stopId, distance) {
    this.destination = stopId;
    this.destinationStopId = stopId;
    if (distance) {
      this.fare = this.getFare(distance);
      this.ticketStatus = 'assigned';
    }
  };

  Passenger.prototype.assignTicket = function (originStop, destStop, distance) {
    this.originStopId = originStop ? (typeof originStop === 'string' ? originStop : originStop.id) : this.originStopId;
    this.destinationStopId = destStop ? (typeof destStop === 'string' ? destStop : destStop.id) : this.destinationStopId;
    this.destination = this.destinationStopId;
    this.fare = this.getFare(distance);
    this.ticket = {
      passengerId: this.passengerId,
      origin: this.originStopId,
      destination: this.destinationStopId,
      fare: this.fare,
      issuedAt: Date.now(),
      paid: false
    };
    this.ticketStatus = 'assigned';
  };

  Passenger.prototype.payFare = function () {
    this.ticketStatus = 'paid';
    if (this.ticket) this.ticket.paid = true;
    return this.fare;
  };

  Passenger.prototype.update = function (dt) {
    if (!this.active) return;

    if (this.state === 'waiting') {
      this.waitTime += dt;
      this.anger = Math.min(100, (this.waitTime / this.patience) * 100);
      if (this.waitTime > this.patience * 2) {
        this.anger = 100;
      }
    } else if (this.state === 'boarding') {
      this.boardingProgress += dt;
    } else if (this.state === 'alighting') {
      this.alightingProgress += dt;
    }
  };

  Passenger.prototype.board = function () {
    this.state = 'boarding';
  };

  Passenger.prototype.ride = function () {
    this.state = 'riding';
  };

  Passenger.prototype.alight = function () {
    this.state = 'alighting';
  };

  Passenger.prototype.isBored = function () {
    return this.anger >= 100;
  };

  Passenger.prototype.getFare = function (distance) {
    return Math.round(distance * 0.25 * this.fareMultiplier);
  };

  Passenger.prototype.draw = function (renderer, camera) {
    const px = this.x - (camera ? camera.x : 0);
    const py = this.y - (camera ? camera.y : 0);
    const zoom = camera ? camera.zoom : 1;

    renderer.context.save();
    renderer.context.translate(
      px * zoom + renderer.width / 2,
      py * zoom + renderer.height / 2
    );

    // Draw passenger as a small figure
    const size = this.size * zoom * 10;
    const color = this.gender === 'male' ? '#3b82f6' : '#ec4899';

    renderer.context.fillStyle = color;
    renderer.context.beginPath();
    renderer.context.arc(0, 0, size / 2, 0, Math.PI * 2);
    renderer.context.fill();

    // Show anger indicator if getting impatient
    if (this.anger > 50) {
      renderer.context.fillStyle = '#fbbf24';
      renderer.context.font = `${size * 0.6}px monospace`;
      renderer.context.textAlign = 'center';
      renderer.context.fillText('!', 0, -size - 2);
    }

    renderer.context.restore();
  };

  Passenger.prototype.serialize = function () {
    return {
      passengerId: this.passengerId,
      name: this.name,
      type: this.type.id,
      gender: this.gender,
      x: this.x,
      y: this.y,
      originStopId: this.originStopId,
      destinationStopId: this.destinationStopId,
      destination: this.destination,
      state: this.state,
      fare: this.fare,
      ticketStatus: this.ticketStatus,
      ticket: this.ticket,
      anger: this.anger,
      waitTime: this.waitTime,
      active: this.active
    };
  };

  Passenger.prototype.destroy = function () {
    this.active = false;
    this.state = 'removed';
  };

  Passenger.deserialize = function (data) {
    if (!Entity) return data;
    const p = new Passenger(data.x, data.y, data.destinationStopId, data.originStopId);
    p.passengerId = data.passengerId;
    p.name = data.name;
    p.type = PASSENGER_TYPES.find(t => t.id === data.type) || PASSENGER_TYPES[0];
    p.gender = data.gender;
    p.state = data.state || 'waiting';
    p.fare = data.fare || 0;
    p.ticketStatus = data.ticketStatus || 'unpaid';
    p.ticket = data.ticket;
    p.anger = data.anger || 0;
    p.waitTime = data.waitTime || 0;
    p.fareMultiplier = p.type.fareMultiplier;
    return p;
  };

  Passenger.TYPES = PASSENGER_TYPES;
  Passenger.DESTINATIONS = DESTINATIONS;

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Passenger = Passenger;
  }
  if (typeof module !== 'undefined') {
    module.exports = Passenger;
  }
})();
