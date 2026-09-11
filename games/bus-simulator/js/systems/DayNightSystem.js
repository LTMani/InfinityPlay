/**
 * Bus Simulator - Day & Night Cycle System (21)
 * Simulates the passage of time with dynamic lighting
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);

  const DayNightSystem = {
    timeOfDay: 0,           // 0-1 where 0=midnight, 0.5=noon
    currentTime: 0,         // seconds since midnight
    dayLength: 24 * 60,     // 24 minutes scaled day
    timeScale: 60,          // 1 real sec = 60 game seconds (1 min)
    isNight: false,
    isDawn: false,
    isDusk: false,

    init(modules) {
      this.modules = modules;
      this.timeOfDay = 0.75; // start at evening
      this._calculateTimeState();

      EventManager.emit('timeOfDayChanged', {
        timeOfDay: this.timeOfDay,
        isNight: this.isNight,
        isDawn: this.isDawn,
        isDusk: this.isDusk
      });
    },

    update(dt) {
      const realSeconds = dt * this.timeScale;
      this.currentTime += realSeconds;

      // Wrap at 24 hours
      if (this.currentTime >= this.dayLength) {
        this.currentTime -= this.dayLength;
        EventManager.emit('dayPassed', { day: Math.floor(this.currentTime / this.dayLength) });
      }

      this.timeOfDay = this.currentTime / this.dayLength;
      this._calculateTimeState();

      EventManager.emit('timeUpdate', {
        timeOfDay: this.timeOfDay,
        hours: this.getHours(),
        minutes: this.getMinutes(),
        isNight: this.isNight,
        isDawn: this.isDawn,
        isDusk: this.isDusk,
        brightness: this.getBrightness()
      });
    },

    _calculateTimeState() {
      const hours = this.getHours();
      const prevNight = this.isNight;
      const prevDawn = this.isDawn;
      const prevDusk = this.isDusk;

      this.isNight = hours >= 19 || hours < 5;
      this.isDawn = hours >= 5 && hours < 7;
      this.isDusk = hours >= 17 && hours < 19;

      if (prevNight !== this.isNight || prevDawn !== this.isDawn || prevDusk !== this.isDusk) {
        EventManager.emit('timeOfDayChanged', {
          timeOfDay: this.timeOfDay,
          isNight: this.isNight,
          isDawn: this.isDawn,
          isDusk: this.isDusk
        });
      }
    },

    getHours() {
      return Math.floor((this.currentTime / this.dayLength) * 24) % 24;
    },

    getMinutes() {
      const totalMinutes = (this.currentTime / this.dayLength) * 24 * 60;
      return Math.floor(totalMinutes) % 60;
    },

    getHoursMinutes() {
      return `${String(this.getHours()).padStart(2, '0')}:${String(this.getMinutes()).padStart(2, '0')}`;
    },

    getBrightness() {
      const hours = this.getHours();
      if (hours >= 6 && hours < 18) return 1.0;
      if (hours >= 5 && hours < 6) return 0.5 + (hours - 5) * 0.5;
      if (hours >= 18 && hours < 19) return 1.0 - (hours - 18) * 0.5;
      if (hours >= 19 && hours < 24) return 0.3 + (1 - (hours - 19) / 5) * 0.2;
      return 0.3; // 0-5
    },

    getSkyColor() {
      const hours = this.getHours();
      const brightness = this.getBrightness();

      if (hours >= 6 && hours < 18) {
        // Day sky - light blue
        return {
          top: `rgba(135, 206, 235, ${brightness})`,
          bottom: `rgba(178, 223, 255, ${brightness})`
        };
      } else if (hours >= 5 && hours < 6) {
        // Dawn - orange/pink
        return {
          top: `rgba(255, 140, 0, ${brightness})`,
          bottom: `rgba(255, 255, 200, ${brightness})`
        };
      } else if (hours >= 18 && hours < 19) {
        // Dusk
        return {
          top: `rgba(75, 0, 130, ${brightness})`,
          bottom: `rgba(25, 25, 112, ${brightness})`
        };
      } else {
        // Night - dark blue
        return {
          top: `rgba(10, 15, 35, ${brightness})`,
          bottom: `rgba(15, 25, 55, ${brightness})`
        };
      }
    },

    isPremiumTime() {
      // Night premium hours: 22:00 - 05:00
      const hours = this.getHours();
      return hours >= 22 || hours < 5;
    },

    getTimeOfDay() {
      const hours = this.getHours();
      if (hours >= 5 && hours < 8) return 'dawn';
      if (hours >= 18 && hours < 20) return 'evening';
      if (hours >= 20 || hours < 5) return 'night';
      return 'day';
    },

    serialize() {
      return {
        timeOfDay: this.timeOfDay,
        currentTime: this.currentTime,
        dayLength: this.dayLength
      };
    },

    deserialize(data) {
      this.timeOfDay = data.timeOfDay;
      this.currentTime = data.currentTime;
      this.dayLength = data.dayLength;
      this._calculateTimeState();
    },

    destroy() {}
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.DayNightSystem = DayNightSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = DayNightSystem;
  }
})();
