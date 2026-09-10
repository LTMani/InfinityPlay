/**
 * Bus Simulator - Weather System (22)
 * Manages dynamic weather conditions affecting visibility and driving
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);

  const WeatherSystem = {
    weather: 'clear',         // clear | cloudy | rain | storm
    intensity: 0,            // 0-1
    visibility: 1.0,         // 0-1
    windSpeed: 0,             // km/h
    precipitation: 0,         // 0-1

    _weatherDurations: {
      clear: 120,    // 2 minutes average
      cloudy: 90,
      rain: 180,
      storm: 60
    },
    _currentWeatherDuration: 0,
    _weatherTimer: 0,

    init(modules) {
      this.modules = modules;
      this._setWeather('clear', 0.5);
    },

    update(dt) {
      this._weatherTimer += dt;
      this._currentWeatherDuration += dt;

      // Occasionally transition to a new weather
      const avgDuration = this._weatherDurations[this.weather] || 120;
      if (this._weatherTimer > avgDuration * (0.8 + Math.random() * 0.4)) {
        this._transitionWeather();
        this._weatherTimer = 0;
      }

      // Update intensity based on weather
      this._updateIntensity(dt);

      // Update visibility based on weather and time
      const dayNight = this.modules.DayNightSystem;
      const nightFactor = dayNight ? dayNight.getBrightness() : 1;

      this.visibility = 1.0;
      if (this.weather === 'rain') this.visibility = 0.7;
      if (this.weather === 'storm') this.visibility = 0.4;
      if (this.weather === 'cloudy') this.visibility = 0.85;
      this.visibility *= Math.max(0.3, nightFactor + 0.2);

      EventManager.emit('weatherUpdate', {
        weather: this.weather,
        intensity: this.intensity,
        visibility: this.visibility,
        windSpeed: this.windSpeed,
        precipitation: this.precipitation
      });
    },

    _transitionWeather() {
      const weathers = ['clear', 'cloudy', 'rain', 'storm'];
      const dayNight = this.modules.DayNightSystem;
      const hours = dayNight ? dayNight.getHours() : 12;

      // Nighttime more likely to be rainy
      if (hours >= 22 || hours < 5) {
        this._setWeather(Math.random() < 0.5 ? 'rain' : (Math.random() < 0.3 ? 'storm' : 'clear'),
          0.6 + Math.random() * 0.4);
      } else {
        const weights = [0.5, 0.25, 0.15, 0.1]; // clear, cloudy, rain, storm
        let r = Math.random();
        let cumulative = 0;
        for (let i = 0; i < weathers.length; i++) {
          cumulative += weights[i];
          if (r <= cumulative) {
            this._setWeather(weathers[i], 0.4 + Math.random() * 0.6);
            return;
          }
        }
      }
    },

    _setWeather(weather, intensity) {
      this.weather = weather;
      this.intensity = intensity;
      this._currentWeatherDuration = 0;

      switch (weather) {
        case 'clear':
          this.visibility = 1.0;
          this.windSpeed = 0;
          this.precipitation = 0;
          break;
        case 'cloudy':
          this.visibility = 0.85;
          this.windSpeed = 5 + intensity * 10;
          this.precipitation = 0;
          break;
        case 'rain':
          this.visibility = 0.7;
          this.windSpeed = 10 + intensity * 15;
          this.precipitation = 0.5 + intensity * 0.5;
          break;
        case 'storm':
          this.visibility = 0.4;
          this.windSpeed = 25 + intensity * 20;
          this.precipitation = 0.8 + intensity * 0.2;
          break;
      }

      EventManager.emit('weatherChanged', {
        weather: this.weather,
        intensity: this.intensity,
        visibility: this.visibility
      });
    },

    _updateIntensity(dt) {
      // Intensity naturally drifts slightly
      this.intensity += (Math.random() - 0.5) * 0.01 * dt;
      this.intensity = Math.max(0.2, Math.min(1.0, this.intensity));
    },

    getWeatherMultiplier() {
      const multipliers = {
        clear: 1.0,
        cloudy: 1.05,
        rain: 0.9,
        storm: 0.75
      };
      return multipliers[this.weather] || 1.0;
    },

    getRoadFrictionMultiplier() {
      const multipliers = {
        clear: 1.0,
        cloudy: 1.0,
        rain: 0.8,
        storm: 0.6
      };
      return multipliers[this.weather] || 1.0;
    },

    serialize() {
      return {
        weather: this.weather,
        intensity: this.intensity,
        windSpeed: this.windSpeed,
        precipitation: this.precipitation
      };
    },

    deserialize(data) {
      this._setWeather(data.weather || 'clear', data.intensity || 0.5);
    },

    destroy() {}
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.WeatherSystem = WeatherSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = WeatherSystem;
  }
})();
