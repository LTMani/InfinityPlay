/**
 * Bus Simulator - World: World Generator
 * Procedurally generates the road network, bus stops, and POIs
 */

(function () {
  'use strict';

  const RegionData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.RegionData) ||
    (typeof require !== 'undefined' ? require('../data/regions') : null);
  const RouteData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.RouteData) ||
    (typeof require !== 'undefined' ? require('../data/routes') : null);
  const Region = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Region) ||
    (typeof require !== 'undefined' ? require('./Region') : null);
  const POI = (typeof window !== 'undefined' && window.BusSim && window.BusSim.POI) ||
    (typeof require !== 'undefined' ? require('./POI') : null);
  const BusStop = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusStop) ||
    (typeof require !== 'undefined' ? require('./BusStop') : null);
  const City = (typeof window !== 'undefined' && window.BusSim && window.BusSim.City) ||
    (typeof require !== 'undefined' ? require('./City') : null);
  const Road = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Road) ||
    (typeof require !== 'undefined' ? require('./Road') : null);
  const CurvedRoad = (typeof window !== 'undefined' && window.BusSim && window.BusSim.CurvedRoad) ||
    (typeof require !== 'undefined' ? require('./roads/CurvedRoad') : null);
  const Intersection = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Intersection) ||
    (typeof require !== 'undefined' ? require('./roads/Intersection') : null);
  const Roundabout = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Roundabout) ||
    (typeof require !== 'undefined' ? require('./roads/Roundabout') : null);
  const APWorldData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.APWorldData) ||
    (typeof require !== 'undefined' ? require('./data/APWorldData') : null);
  const EnvironmentObject = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EnvironmentObject) ||
    (typeof require !== 'undefined' ? require('./landmarks/EnvironmentObject') : null);
  const TollGate = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TollGate) ||
    (typeof require !== 'undefined' ? require('./landmarks/TollGate') : null);
  const FuelStation = (typeof window !== 'undefined' && window.BusSim && window.BusSim.FuelStation) ||
    (typeof require !== 'undefined' ? require('./landmarks/FuelStation') : null);
  const TeaStall = (typeof window !== 'undefined' && window.BusSim && window.BusSim.TeaStall) ||
    (typeof require !== 'undefined' ? require('./landmarks/TeaStall') : null);
  const Restaurant = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Restaurant) ||
    (typeof require !== 'undefined' ? require('./landmarks/Restaurant') : null);
  const Market = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Market) ||
    (typeof require !== 'undefined' ? require('./landmarks/Market') : null);
  const BusStation = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusStation) ||
    (typeof require !== 'undefined' ? require('./bus_stations/BusStation') : null);

  const WorldGenerator = {
    _prototypeGenerated: false,
    _prototypeWorld: null,

    generateWorld() {
      const world = {
        regions: [],
        allCities: [],
        allRoads: [],
        allBusStops: [],
        pois: [],
        activeRegionIds: []
      };

      const regionIds = ['ap', 'tz'];
      for (const rid of regionIds) {
        const regionData = RegionData ? RegionData.getRegion(rid) : null;
        if (!regionData || !Region) continue;

        const region = new Region(regionData);
        world.regions.push(region);
        world.activeRegionIds.push(rid);

        world.allCities.push(...region.getAllLocations());
        this._generatePOIs(region, world.pois);
      }

      this._generateBusStops(world, world.allRoads);
      this._scaleToWorld(world);

      return world;
    },

    /**
     * Generates the AP-inspired world (used as the prototype world for testing).
     */
    generatePrototypeWorld() {
      if (this._prototypeWorld) return this._prototypeWorld;
      this._prototypeWorld = this.generateAPWorld();
      return this._prototypeWorld;
    },

    /**
     * Generates the full Andhra Pradesh-inspired world.
     * Creates a connected road network with cities, towns, villages,
     * intersections, roundabouts, landmarks, and environment objects.
     */
    generateAPWorld() {
      const world = {
        regions: [],
        allCities: [],
        allRoads: [],
        allBusStops: [],
        busStops: [],
        pois: [],
        landmarks: [],
        environment: [],
        intersections: [],
        roundabouts: [],
        busStations: [],
        activeRegionIds: ['ap-main'],
        spawnPosition: { x: 2000, y: 3000 },
        worldSize: { width: 8000, height: 6000 }
      };

      if (!APWorldData) {
        return this.generateWorld();
      }

      const data = APWorldData;

      // Create cities
      for (const c of data.cities) {
        const city = new City(c);
        world.allCities.push(city);
      }
      // Create towns
      for (const t of data.towns) {
        const town = new City({ ...t, type: 'town' });
        world.allCities.push(town);
      }
      // Create villages
      for (const v of data.villages) {
        const village = new City({ ...v, type: 'village', radius: 800 });
        world.allCities.push(village);
      }

      // Create roads from data
      for (const roadDef of data.roads) {
        let road;
        if (roadDef.points && roadDef.points.length > 2) {
          // Multi-segment curved road
          if (CurvedRoad) {
            road = new CurvedRoad(roadDef.id, roadDef.points, {
              width: roadDef.width,
              lanes: roadDef.lanes,
              roadType: roadDef.type,
              speedLimit: roadDef.speedLimit,
              surface: roadDef.surface
            });
          } else if (Road) {
            // Fallback: create individual straight segments
            for (let i = 0; i < roadDef.points.length - 1; i++) {
              const p1 = roadDef.points[i];
              const p2 = roadDef.points[i + 1];
              const segRoad = new Road(
                `${roadDef.id}_seg${i}`, p1[0], p1[1], p2[0], p2[1],
                { width: roadDef.width, lanes: roadDef.lanes, roadType: roadDef.type,
                  speedLimit: roadDef.speedLimit, surface: roadDef.surface }
              );
              world.allRoads.push(segRoad);
            }
            continue;
          }
        } else if (roadDef.points && roadDef.points.length === 2) {
          if (Road) {
            road = new Road(
              roadDef.id, roadDef.points[0][0], roadDef.points[0][1],
              roadDef.points[1][0], roadDef.points[1][1],
              { width: roadDef.width, lanes: roadDef.lanes, roadType: roadDef.type,
                speedLimit: roadDef.speedLimit, surface: roadDef.surface }
            );
          }
        }

        if (road) {
          world.allRoads.push(road);
        }
      }

      // Create intersections
      for (const intDef of data.intersections) {
        if (Intersection) {
          const intersection = new Intersection(intDef.id, intDef.x, intDef.y, {
            name: intDef.name || 'Junction',
            connectedRoads: intDef.connectedRoads,
            type: 'standard'
          });
          world.intersections.push(intersection);
          world.pois.push(intersection);
        }
      }

      // Create roundabouts
      for (const rtDef of data.roundabouts) {
        if (Roundabout) {
          const roundabout = new Roundabout(rtDef.id, rtDef.x, rtDef.y, {
            radius: rtDef.radius,
            connectingRoads: rtDef.connectingRoads
          });
          world.roundabouts.push(roundabout);
          world.pois.push(roundabout);
        }
      }

      // Create bus stations
      for (const stationDef of data.busStations) {
        if (BusStation) {
          const station = new BusStation(stationDef.id, stationDef.x, stationDef.y, {
            name: stationDef.name,
            type: stationDef.type,
            platforms: stationDef.platforms,
            entryRoad: stationDef.entryRoad,
            exitRoad: stationDef.exitRoad
          });
          world.busStations.push(station);
          world.pois.push(station);
        }
      }

      // Create landmarks along roads
      for (const lmDef of data.landmarks) {
        let landmark;
        switch (lmDef.type) {
          case 'toll':
            if (TollGate) landmark = new TollGate(lmDef.id, lmDef.x, lmDef.y, {
              name: lmDef.name, fee: lmDef.fee
            });
            break;
          case 'fuel':
            if (FuelStation) landmark = new FuelStation(lmDef.id, lmDef.x, lmDef.y, {
              name: lmDef.name, fuelCapacity: lmDef.fuel, fuelType: 'diesel'
            });
            break;
          case 'tea_stall':
            if (TeaStall) landmark = new TeaStall(lmDef.id, lmDef.x, lmDef.y, {
              name: lmDef.name, specialty: lmDef.specialty
            });
            break;
          case 'restaurant':
            if (Restaurant) landmark = new Restaurant(lmDef.id, lmDef.x, lmDef.y, {
              name: lmDef.name, cuisine: lmDef.cuisine
            });
            break;
          case 'market':
            if (Market) landmark = new Market(lmDef.id, lmDef.x, lmDef.y, {
              name: lmDef.name
            });
            break;
          default:
            if (POI) landmark = new POI(lmDef.id, lmDef.type, lmDef.x, lmDef.y, {
              name: lmDef.name, icon: '📍', color: '#00f0ff'
            });
        }
        if (landmark) {
          world.landmarks.push(landmark);
          world.pois.push(landmark);
        }
      }

      // Create environment objects (trees, fields)
      for (const envDef of data.environment) {
        if (envDef.type === 'tree_group') {
          if (EnvironmentObject) {
            const count = envDef.count || 3;
            const spacing = envDef.spacing || 8;
            const startX = envDef.x - (count * spacing) / 2;
            const treeType = `${envDef.treeType}_tree`;
            for (let i = 0; i < count; i++) {
              const tree = new EnvironmentObject(
                `tree_${envDef.treeType}_${i}_${Math.random().toString(36).substr(2, 4)}`,
                treeType,
                startX + i * spacing, envDef.y,
                { variant: i, scale: 0.8 + Math.random() * 0.4 }
              );
              world.environment.push(tree);
            }
          }
        } else if (envDef.type === 'field') {
          if (EnvironmentObject) {
            const field = new EnvironmentObject(
              `field_${envDef.crop}_${Math.random().toString(36).substr(2, 4)}`,
              `field_${envDef.crop}`,
              envDef.x, envDef.y,
              { scale: 1 }
            );
            field.width = envDef.width;
            field.height = envDef.height;
            world.environment.push(field);
          }
        }
      }

      // Generate bus stops along the main roads
      this._generateAPBusStops(world);

      // Set spawn position
      world.spawnPosition = data.spawnPosition || { x: 2000, y: 3000 };

      return world;
    },

    _generateAPBusStops(world) {
      if (!BusStop) return;

      for (const road of world.allRoads) {
        const points = road.points || [[road.x1, road.y1], [road.x2, road.y2]];
        const step = road.getDistance() > 400 ? 300 : 200;

        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const segLen = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
          const segSteps = Math.max(1, Math.floor(segLen / step));

          for (let j = 0; j <= segSteps; j++) {
            const t = j / segSteps;
            const sx = p1[0] + (p2[0] - p1[0]) * t;
            const sy = p1[1] + (p2[1] - p1[1]) * t;

            // Place bus stops on larger roads, skip very close to intersections
            if (road.lanes >= 2 || road.roadType === 'highway') {
              // Offset stop slightly from road center
              const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
              const offset = road.width / 2 + 5;
              const stopX = sx + Math.cos(angle + Math.PI / 2) * offset;
              const stopY = sy + Math.sin(angle + Math.PI / 2) * offset;

              // Check proximity to existing stops
              const existing = world.allBusStops.find(s =>
                Math.sqrt(Math.pow(s.x - stopX, 2) + Math.pow(s.y - stopY, 2)) < 40
              );
              if (!existing) {
                const stop = new BusStop(
                  `stop_${road.id || road._id}_${j}`,
                  stopX, stopY,
                  {
                    name: `${road.roadType} Stop ${world.allBusStops.length + 1}`,
                    roadType: road.roadType,
                    spawnInterval: road.roadType === 'highway' ? 8 : 15
                  }
                );
                world.allBusStops.push(stop);
              }
            }
          }
        }
      }
    },

    _generatePOIs(region, pois) {

      const roads = region.getAllRoads();
      let poiCount = 0;

      for (const road of roads) {
        if (road.roadType === 'highway' && road.getDistance() > 200) {
          // Place toll gate at midpoint of long highways
          if (Math.random() < 0.3) {
            const mid = road.getMidpoint();
            pois.push(new POI(
              `toll_${poiCount++}`, 'toll',
              mid.x, mid.y,
              { name: 'Toll Gate', cost: 45, icon: '💳', color: '#f59e0b' }
            ));
          }

          // Place fuel station at 1/3 and 2/3 points
          if (Math.random() < 0.4) {
            const t1 = 0.33;
            const t2 = 0.66;
            for (const t of [t1, t2]) {
              if (Math.random() < 0.5) {
                const px = road.x1 + (road.x2 - road.x1) * t;
                const py = road.y1 + (road.y2 - road.y1) * t;
                pois.push(new POI(
                  `fuel_${poiCount++}`, 'fuel',
                  px, py,
                  { name: 'Fuel Station', cost: 0, icon: '⛽', color: '#10b981' }
                ));
              }
            }
          }
        }
      }

      // Place depot in each major city
      for (const city of region.cities) {
        if (city.type === 'metropolitan' || city.type === 'capital') {
          pois.push(new POI(
            `depot_${city.id}`, 'depot',
            city.x, city.y,
            { name: `${city.name} Depot`, cost: 0, icon: '🏢', color: '#8b5cf6' }
          ));
        }
      }
    },

    _generateBusStops(world, allRoads) {
      for (const road of allRoads) {
        if (!BusStop) continue;

        const nodeCount = road.nodes.length;
        for (let i = 0; i < nodeCount; i += Math.max(1, Math.floor(nodeCount / 4))) {
          const node = road.nodes[i];
          const stopId = `stop_${road.id}_${i}`;

          // Check proximity to existing stops
          const existing = world.allBusStops.find(s =>
            Math.sqrt(Math.pow(s.x - node.x, 2) + Math.pow(s.y - node.y, 2)) < 30
          );
          if (!existing) {
            const stop = new BusStop(stopId, node.x, node.y, {
              name: `Stop ${world.allBusStops.length + 1}`,
              roadType: road.roadType,
              spawnInterval: road.roadType === 'highway' ? 8 : 15
            });
            world.allBusStops.push(stop);
          }
        }
      }
    },

    _scaleToWorld(world) {
      // Scale coordinates from region data space (0-800) to world pixels (0-8000)
      const scale = 10;
      for (const region of world.regions) {
        for (const city of region.getAllLocations()) {
          city.x *= scale;
          city.y *= scale;
          city.radius *= scale;
        }
        for (const road of region.getAllRoads()) {
          road.x1 *= scale;
          road.y1 *= scale;
          road.x2 *= scale;
          road.y2 *= scale;
          road.nodes = road._generateNodes ? road._generateNodes() : road.nodes;
        }
      }
      for (const poi of world.pois) {
        poi.x *= scale;
        poi.y *= scale;
        poi.size *= scale * 0.5;
      }
      for (const stop of world.allBusStops) {
        stop.x *= scale;
        stop.y *= scale;
      }

      // Recollect scaled cities
      world.allCities = [];
      for (const region of world.regions) {
        world.allCities.push(...region.getAllLocations());
      }
      world.allRoads = [];
      for (const region of world.regions) {
        world.allRoads.push(...region.getAllRoads());
      }
    },

    findNearestBusStop(x, y, maxDistance) {
      if (!this.allBusStops) return null;
      let nearest = null;
      let minDist = Infinity;
      for (const stop of this.allBusStops) {
        const dist = Math.sqrt(Math.pow(stop.x - x, 2) + Math.pow(stop.y - y, 2));
        if (dist < minDist && dist <= (maxDistance || 100)) {
          minDist = dist;
          nearest = stop;
        }
      }
      return nearest;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.WorldGenerator = WorldGenerator;
  }
  if (typeof module !== 'undefined') {
    module.exports = WorldGenerator;
  }
})();
