/**
 * Bus Simulator - World: Map
 * Top-level world container that holds regions, roads, cities, and POIs
 */

(function () {
  'use strict';

  const WorldGenerator = (typeof window !== 'undefined' && window.BusSim && window.BusSim.WorldGenerator) ||
    (typeof require !== 'undefined' ? require('./WorldGenerator') : null);
  const Region = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Region) ||
    (typeof require !== 'undefined' ? require('./Region') : null);

  function Map() {
    this.regions = [];
    this.allCities = [];
    this.allRoads = [];
    this.allBusStops = [];
    this.pois = [];
    this.activeRegionIds = [];

    this.width = 8000;
    this.height = 8000;

    this._initialized = false;
  }

  Map.prototype.initialize = function () {
    if (!WorldGenerator) return;

    const world = WorldGenerator.generatePrototypeWorld ?
      WorldGenerator.generatePrototypeWorld() :
      WorldGenerator.generateWorld();

    this.regions = world.regions || [];
    this.allCities = world.allCities || [];
    this.allRoads = world.allRoads || [];
    this.allBusStops = world.allBusStops || [];
    this.pois = world.pois || [];
    this.landmarks = world.landmarks || [];
    this.environment = world.environment || [];
    this.intersections = world.intersections || [];
    this.roundabouts = world.roundabouts || [];
    this.busStations = world.busStations || [];
    this.activeRegionIds = world.activeRegionIds || [];
    this.spawnPosition = world.spawnPosition || { x: 0, y: 0 };
    this.worldSize = world.worldSize || { width: 8000, height: 8000 };

    this._initialized = true;

    if (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) {
      window.BusSim.EventManager.emit('worldInitialized', this);
    }
  };

  Map.prototype.update = function (dt) {
    if (!this._initialized) return;

    for (let i = 0; i < this.regions.length; i++) {
      if (this.regions[i].update) this.regions[i].update(dt);
    }
    for (let i = 0; i < this.allBusStops.length; i++) {
      if (this.allBusStops[i].update) this.allBusStops[i].update(dt);
    }
    for (let i = 0; i < this.pois.length; i++) {
      if (this.pois[i].update) this.pois[i].update(dt);
    }
    for (let i = 0; i < this.landmarks.length; i++) {
      if (this.landmarks[i].update) this.landmarks[i].update(dt);
    }
    for (let i = 0; i < this.environment.length; i++) {
      if (this.environment[i].update) this.environment[i].update(dt);
    }
    for (let i = 0; i < this.intersections.length; i++) {
      if (this.intersections[i].update) this.intersections[i].update(dt);
    }
    for (let i = 0; i < this.roundabouts.length; i++) {
      if (this.roundabouts[i].update) this.roundabouts[i].update(dt);
    }
    for (let i = 0; i < this.busStations.length; i++) {
      if (this.busStations[i].update) this.busStations[i].update(dt);
    }
  };

  Map.prototype.draw = function (renderer, camera) {
    if (!this._initialized) return;

    // Draw environment background first (sky, grass, hills)
    this._drawEnvironment(renderer, camera);

    // Draw roads first (under everything)
    for (let i = 0; i < this.allRoads.length; i++) {
      this.allRoads[i].draw(renderer, camera);
    }

    // Draw environment objects (trees, fields)
    for (let i = 0; i < this.environment.length; i++) {
      if (this.environment[i].draw) {
        this.environment[i].draw(renderer, camera);
      }
    }

    // Draw cities, towns, villages
    for (let i = 0; i < this.regions.length; i++) {
      if (this.regions[i].drawCities) {
        this.regions[i].drawCities(renderer, camera);
      }
    }
    for (let i = 0; i < this.allCities.length; i++) {
      if (this.allCities[i].drawLabel) {
        this.allCities[i].drawLabel(renderer, camera);
      }
    }

    // Draw intersections and roundabouts
    for (let i = 0; i < this.intersections.length; i++) {
      if (this.intersections[i].draw) {
        this.intersections[i].draw(renderer, camera);
      }
    }
    for (let i = 0; i < this.roundabouts.length; i++) {
      if (this.roundabouts[i].draw) {
        this.roundabouts[i].draw(renderer, camera);
      }
    }

    // Draw POIs (non-landmark POIs like depots)
    for (let i = 0; i < this.pois.length; i++) {
      if (this.pois[i].type !== 'bus_station' && this.pois[i].draw) {
        this.pois[i].draw(renderer, camera);
      }
    }

    // Draw landmarks (toll gates, fuel stations, tea stalls, restaurants, markets)
    for (let i = 0; i < this.landmarks.length; i++) {
      if (this.landmarks[i].draw) {
        this.landmarks[i].draw(renderer, camera);
      }
    }

    // Draw bus stations
    for (let i = 0; i < this.busStations.length; i++) {
      if (this.busStations[i].draw) {
        this.busStations[i].draw(renderer, camera);
      }
    }

    // Draw bus stops
    for (let i = 0; i < this.allBusStops.length; i++) {
      if (this.allBusStops[i].draw) {
        this.allBusStops[i].draw(renderer, camera);
      }
    }
  };

  Map.prototype._drawEnvironment = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;

    // Sky background
    const dayNight = (typeof window !== 'undefined' && window.BusSim && window.BusSim.DayNightSystem) || null;
    renderer.context.save();
    renderer.context.setTransform(1, 0, 0, 1, 0, 0);

    let skyTop = 'rgba(135, 206, 235, 0.9)';
    let skyBottom = 'rgba(178, 223, 255, 0.95)';
    if (dayNight && dayNight.isNight) {
      skyTop = 'rgba(10, 15, 35, 0.9)';
      skyBottom = 'rgba(15, 25, 55, 0.95)';
    } else if (dayNight && dayNight.isDawn) {
      skyTop = 'rgba(255, 140, 0, 0.8)';
      skyBottom = 'rgba(255, 250, 220, 0.9)';
    }

    const gradient = renderer.context.createLinearGradient(0, 0, 0, renderer.height);
    gradient.addColorStop(0, skyTop);
    gradient.addColorStop(1, skyBottom);
    renderer.context.fillStyle = gradient;
    renderer.context.fillRect(0, 0, renderer.width, renderer.height);

    // Sun/moon
    let sunColor = 'rgba(255, 250, 220, 0.9)';
    if (dayNight && dayNight.isNight) {
      sunColor = 'rgba(220, 220, 240, 0.8)';
    } else if (dayNight && dayNight.isDawn) {
      sunColor = 'rgba(255, 165, 0, 0.85)';
    }
    renderer.context.fillStyle = sunColor;
    renderer.context.beginPath();
    renderer.context.arc(renderer.width - 80, 80, 24, 0, Math.PI * 2);
    renderer.context.fill();

    // Cloud layers
    renderer.context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    renderer.context.beginPath();
    renderer.context.arc(renderer.width * 0.2, renderer.height * 0.15, 20, 0, Math.PI * 2);
    renderer.context.arc(renderer.width * 0.25, renderer.height * 0.12, 16, 0, Math.PI * 2);
    renderer.context.arc(renderer.width * 0.7, renderer.height * 0.2, 24, 0, Math.PI * 2);
    renderer.context.fill();

    renderer.context.restore();
  };

  Map.prototype.drawLabels = function (renderer, camera) {
    for (let i = 0; i < this.regions.length; i++) {
      this.regions[i].drawCities(renderer, camera);
    }
    for (let i = 0; i < this.allCities.length; i++) {
      if (this.allCities[i].drawLabel) {
        this.allCities[i].drawLabel(renderer, camera);
      }
    }
  };

  Map.prototype.getNearestBusStop = function (x, y, maxDistance) {
    if (!this.allBusStops || this.allBusStops.length === 0) return null;

    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < this.allBusStops.length; i++) {
      const stop = this.allBusStops[i];
      const dist = Math.sqrt(Math.pow(stop.x - x, 2) + Math.pow(stop.y - y, 2));
      if (dist < minDist && dist <= (maxDistance || 200)) {
        minDist = dist;
        nearest = stop;
      }
    }
    return nearest;
  };

  Map.prototype.getNearestPOI = function (x, y, type, maxDistance) {
    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < this.pois.length; i++) {
      const poi = this.pois[i];
      if (type && poi.type !== type) continue;
      const dist = Math.sqrt(Math.pow(poi.x - x, 2) + Math.pow(poi.y - y, 2));
      if (dist < minDist && dist <= (maxDistance || Infinity)) {
        minDist = dist;
        nearest = poi;
      }
    }
    return nearest;
  };

  Map.prototype.getNearestRoad = function (x, y) {
    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < this.allRoads.length; i++) {
      const road = this.allRoads[i];
      const point = road.getNearestPoint(x, y);
      const dist = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      if (dist < minDist) {
        minDist = dist;
        nearest = road;
      }
    }
    return nearest;
  };

  Map.prototype.serialize = function () {
    return {
      regions: this.regions.map(r => r.serialize()),
      allBusStops: this.allBusStops.map(s => s.serialize ? s.serialize() : s),
      pois: this.pois.map(p => p.serialize ? p.serialize() : p)
    };
  };

  Map.deserialize = function (data) {
    const map = new Map();
    if (data.regions && Region) {
      map.regions = data.regions.map(rData => {
        const region = new Region(rData);
        return region;
      });
    }
    // Rebuild flat arrays from loaded data
    for (const region of map.regions) {
      map.allCities.push(...region.getAllLocations());
      map.allRoads.push(...region.getAllRoads());
    }
    map._initialized = true;
    return map;
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Map = Map;
  }
  if (typeof module !== 'undefined') {
    module.exports = Map;
  }
})();
