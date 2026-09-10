/**
 * Bus Simulator - World: Region
 * A geographic region containing cities, towns, and connecting roads
 */

(function () {
  'use strict';

  const RegionData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.RegionData) ||
    (typeof require !== 'undefined' ? require('../data/regions') : null);

  const City = (typeof window !== 'undefined' && window.BusSim && window.BusSim.City) ||
    (typeof require !== 'undefined' ? require('./City') : null);

  const Road = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Road) ||
    (typeof require !== 'undefined' ? require('./Road') : null);

  function Region(regionData) {
    this.id = regionData.id || 'unknown';
    this.name = regionData.name || 'Unknown Region';
    this.color = regionData.color || '#ffffff';

    this.cities = [];
    this.towns = [];
    this.villages = [];
    this.roads = [];
    this.poi = []; // points of interest (toll gates, fuel stations, depots)

    this._initFromData(regionData);
  }

  Region.prototype._initFromData = function (data) {
    // Create City entities
    if (data.cities) {
      data.cities.forEach(cData => {
        if (City) {
          this.cities.push(new City({
            ...cData,
            region: this.id,
            color: this.color
          }));
        }
      });
    }

    if (data.towns) {
      data.towns.forEach(tData => {
        if (City) {
          this.towns.push(new City({
            ...tData,
            region: this.id,
            type: 'town',
            color: this.color
          }));
        }
      });
    }

    if (data.villages) {
      data.villages.forEach(vData => {
        if (City) {
          this.villages.push(new City({
            ...vData,
            region: this.id,
            type: 'village',
            color: this.color
          }));
        }
      });
    }

    // Generate roads connecting cities within region
    this._generateRoads();
  };

  Region.prototype._generateRoads = function () {
    const allLocations = [...this.cities, ...this.towns];
    if (allLocations.length < 2) return;

    // Connect each city to nearest neighbors (up to 3 connections)
    for (let i = 0; i < allLocations.length; i++) {
      const city = allLocations[i];
      const others = allLocations.filter(l => l !== city);

      others.sort((a, b) => {
        const distA = city.distanceTo(a);
        const distB = city.distanceTo(b);
        return distA - distB;
      });

      const connections = others.slice(0, 3);
      connections.forEach(target => {
        const roadId = `road_${city.id}_${target.id}`;
        const distance = city.distanceTo(target);
        const roadType = distance > 300 ? 'highway' : (distance > 100 ? 'city' : 'village');
        const speedLimit = roadType === 'highway' ? 80 : (roadType === 'city' ? 60 : 40);

        if (Road) {
          const road = new Road(roadId, city.x, city.y, target.x, target.y, {
            width: roadType === 'highway' ? 20 : 14,
            lanes: roadType === 'highway' ? 4 : 2,
            roadType: roadType,
            speedLimit: speedLimit
          });
          this.roads.push(road);
        }
      });
    }
  };

  Region.prototype.update = function (dt) {
    this.cities.forEach(c => c.update(dt));
    this.towns.forEach(t => t.update(dt));
    this.villages.forEach(v => v.update(dt));

    this.poi.forEach(p => {
      if (p.update) p.update(dt);
    });
  };

  Region.prototype.getAllLocations = function () {
    return [...this.cities, ...this.towns, ...this.villages];
  };

  Region.prototype.getAllRoads = function () {
    return this.roads;
  };

  Region.prototype.getNearestCity = function (x, y) {
    const all = this.getAllLocations();
    let nearest = null;
    let minDist = Infinity;
    for (const loc of all) {
      const dist = Math.sqrt(Math.pow(loc.x - x, 2) + Math.pow(loc.y - y, 2));
      if (dist < minDist) {
        minDist = dist;
        nearest = loc;
      }
    }
    return nearest;
  };

  Region.prototype.drawCities = function (renderer, camera) {
    this.cities.forEach(c => c.draw(renderer, camera));
    this.towns.forEach(t => t.draw(renderer, camera));
    this.villages.forEach(v => v.draw(renderer, camera));
  };

  Region.prototype.drawRoads = function (renderer, camera) {
    this.roads.forEach(r => r.draw(renderer, camera));
  };

  Region.prototype.drawPOI = function (renderer, camera) {
    this.poi.forEach(p => {
      if (p.draw) p.draw(renderer, camera);
    });
  };

  Region.prototype.serialize = function () {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      cities: this.cities.map(c => c.serialize()),
      towns: this.towns.map(t => t.serialize()),
      villages: this.villages.map(v => v.serialize()),
      roads: this.roads.map(r => ({
        id: r.id, x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2,
        width: r.width, lanes: r.lanes, roadType: r.roadType,
        speedLimit: r.speedLimit
      })),
      poi: this.poi.map(p => p.serialize ? p.serialize() : p)
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Region = Region;
  }
  if (typeof module !== 'undefined') {
    module.exports = Region;
  }
})();
