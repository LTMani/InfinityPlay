/**
 * Bus Simulator - Event Manager
 * Lightweight pub/sub messaging system for loose coupling
 */

(function () {
  'use strict';

  const EventManager = {
    _events: {},

    on(eventName, callback, context) {
      if (!this._events[eventName]) {
        this._events[eventName] = [];
      }
      this._events[eventName].push({
        callback: callback,
        context: context || null
      });
      return this;
    },

    off(eventName, callback) {
      if (!this._events[eventName]) return this;
      if (!callback) {
        delete this._events[eventName];
        return this;
      }
      this._events[eventName] = this._events[eventName].filter(
        (handler) => handler.callback !== callback
      );
      if (this._events[eventName].length === 0) {
        delete this._events[eventName];
      }
      return this;
    },

    emit(eventName, data) {
      if (!this._events[eventName]) return this;
      const handlers = this._events[eventName].slice();
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (handler.context) {
          handler.callback.call(handler.context, data);
        } else {
          handler.callback(data);
        }
      }
      return this;
    },

    once(eventName, callback, context) {
      const wrapper = (data) => {
        callback(data);
        this.off(eventName, wrapper);
      };
      this.on(eventName, wrapper, context);
      return this;
    },

    clearAll() {
      this._events = {};
      return this;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.EventManager = EventManager;
  }
  if (typeof module !== 'undefined') {
    module.exports = EventManager;
  }
})();
