/**
 * Bus Simulator - Base Entity
 * Foundation class for all world entities (position, velocity, lifecycle)
 */

(function () {
  'use strict';

  function Entity(x, y) {
    this.id = Entity._nextId++;
    this.x = x || 0;
    this.y = y || 0;
    this.vx = 0;
    this.vy = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.active = true;
    this.collisionRadius = 0;
    this.tags = [];
  }

  Entity._nextId = 0;

  Entity.prototype.update = function (dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  };

  Entity.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Entity.prototype.getPosition = function () {
    return { x: this.x, y: this.y };
  };

  Entity.prototype.setVelocity = function (vx, vy) {
    this.vx = vx;
    this.vy = vy;
  };

  Entity.prototype.getVelocity = function () {
    return { x: this.vx, y: this.vy };
  };

  Entity.prototype.getSpeed = function () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  };

  Entity.prototype.getAngle = function () {
    return Math.atan2(this.vy, this.vx);
  };

  Entity.prototype.distanceTo = function (other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Entity.prototype.hasTag = function (tag) {
    return this.tags.indexOf(tag) >= 0;
  };

  Entity.prototype.addTag = function (tag) {
    if (!this.hasTag(tag)) this.tags.push(tag);
  };

  Entity.prototype.destroy = function () {
    this.active = false;
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Entity = Entity;
  }
  if (typeof module !== 'undefined') {
    module.exports = Entity;
  }
})();
