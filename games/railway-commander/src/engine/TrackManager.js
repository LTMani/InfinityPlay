/**
 * Railway Commander - Track & Route Manager
 * Generates and manages railway track geometry, curvature,
 * speed limit zones, stations, signals, and procedural scenery elements.
 */

export class TrackManager {
  constructor() {
    this.totalDistanceMeters = 5000;
    this.segments = []; // Curvature & elevation segments
    this.speedLimitZones = []; // [{ from, to, limitKmh }]
    this.trackSwitches = []; // [{ position, direction, name }]
    this.stations = []; // [{ id, name, stopPosition, platformLength, nameSide }]
    this.signals = []; // [{ id, position, defaultAspect, isDynamic }]
    this.scenery = []; // [{ type, position, offsetSide, scale, variant }]
    this.catenarySpacing = 65; // meters between electrification gantries
  }

  /**
   * Load route data for a specific mission
   * @param {Object} routeConfig Mission route definition
   */
  loadRoute(routeConfig) {
    this.totalDistanceMeters = routeConfig.totalDistanceMeters || routeConfig.distanceMeters || 4000;
    this.segments = routeConfig.segments || [
      { from: 0, to: 800, curve: 0, grade: 0 },
      { from: 800, to: 1600, curve: 0.0004, grade: 0.005 },
      { from: 1600, to: 2400, curve: -0.0003, grade: -0.002 },
      { from: 2400, to: this.totalDistanceMeters, curve: 0, grade: 0 }
    ];

    this.speedLimitZones = routeConfig.speedLimitZones || [
      { from: 0, to: 800, limitKmh: 60 },
      { from: 800, to: 2800, limitKmh: 100 },
      { from: 2800, to: this.totalDistanceMeters, limitKmh: 50 }
    ];

    this.trackSwitches = routeConfig.trackSwitches || [
      { position: 720, direction: 'right', name: 'Points No. 12B' }
    ];

    this.stations = routeConfig.stations || [];
    this.signals = routeConfig.signals || [];

    // Build trackside scenery based on route environment
    this.generateScenery(routeConfig.environment || 'city');
  }

  generateScenery(environment) {
    this.scenery = [];

    // 1. Electrification Catenary Poles (both sides or overhead gantry)
    for (let pos = 20; pos < this.totalDistanceMeters + 300; pos += this.catenarySpacing) {
      this.scenery.push({
        type: 'catenary',
        position: pos,
        side: (Math.floor(pos / this.catenarySpacing) % 2 === 0) ? -1 : 1,
        width: 4.8,
        height: 7.2
      });
    }

    // 2. Kilometre / Mileposts every 250m
    for (let pos = 250; pos < this.totalDistanceMeters; pos += 250) {
      this.scenery.push({
        type: 'milepost',
        position: pos,
        side: 1,
        label: (pos / 1000).toFixed(1) + ' km'
      });
    }

    // 3. Environment Scenery (Trees, Buildings, Streetlights, Mountain Backdrops)
    const isCity = environment === 'city' || environment === 'industrial';
    const isAlpine = environment === 'alpine' || environment === 'mountain';

    const step = 45; // meters
    for (let pos = 40; pos < this.totalDistanceMeters + 200; pos += step) {
      // Check if too close to a station platform
      const nearStation = this.stations.some(st => Math.abs(st.stopPosition - pos) < 120);

      // Left side object
      const leftDist = 8 + (pos % 7) * 2.2;
      const rightDist = 8 + (pos % 11) * 2.1;

      if (!nearStation) {
        if (isCity) {
          // City skyscrapers / industrial warehouses / billboards
          if (pos % 90 === 0) {
            this.scenery.push({
              type: 'building',
              position: pos,
              side: -1,
              dist: leftDist + 12,
              height: 25 + (pos % 40),
              width: 18 + (pos % 15),
              color: (pos % 2 === 0) ? '#1e293b' : '#0f172a'
            });
          }
          if (pos % 120 === 0) {
            this.scenery.push({
              type: 'building',
              position: pos + 25,
              side: 1,
              dist: rightDist + 14,
              height: 30 + (pos % 35),
              width: 20 + (pos % 12),
              color: '#1e1e38'
            });
          }
        }

        // Trackside trees & vegetation
        if (!isCity || pos % 135 !== 0) {
          this.scenery.push({
            type: 'tree',
            position: pos,
            side: -1,
            dist: leftDist,
            scale: 0.8 + (pos % 5) * 0.15,
            variant: (pos % 3)
          });
          this.scenery.push({
            type: 'tree',
            position: pos + 18,
            side: 1,
            dist: rightDist,
            scale: 0.85 + (pos % 4) * 0.12,
            variant: ((pos + 1) % 3)
          });
        }
      }

      // Overhead Railway Bridges at key points
      if (pos === 1200 || pos === 2800) {
        this.scenery.push({
          type: 'overhead_bridge',
          position: pos,
          height: 8.5
        });
      }
    }

    // 4. Station Platform Crowds & Indian Railway Life (Coolies, passengers, chai stalls)
    // 4a. Departure Station Platform (Platform 1 - Arakkonam / Chennai Junction)
    this.scenery.push(
      // Walking commuter in white shirt & dark trousers (matching reference image)
      { type: 'passenger', position: 1.5, dist: 3.5, shirtColor: '#f8fafc' },
      // Foreground Coolie in traditional scarlet red kurta carrying brass trunk on head
      { type: 'coolie', position: -1.2, dist: 2.7, trunkColor: '#b45309' },
      // Passenger in orange shirt with briefcase/bag
      { type: 'passenger', position: -4.0, dist: 3.8, shirtColor: '#ea580c' },
      // Passenger in blue shirt with rolling suitcase
      { type: 'passenger', position: -7.5, dist: 3.4, shirtColor: '#0284c7' },
      // Station luggage push trolley stacked with parcels
      { type: 'trolley', position: -12.0, dist: 4.4 },
      // Traditional Indian Railway Chai & Snack Stall on right edge
      { type: 'tea_stall', position: -18.0, dist: 5.2 },
      // Commuter waiting near chai stall
      { type: 'passenger', position: -20.5, dist: 4.6, shirtColor: '#eab308' },
      // Second Coolie carrying blue trunk
      { type: 'coolie', position: -26.0, dist: 2.9, trunkColor: '#0369a1' },
      // Walking commuter near station concourse
      { type: 'passenger', position: -33.0, dist: 4.0, shirtColor: '#f8fafc' },
      // Parked opposing passenger rake on parallel left track (Blue ICF Coaches)
      { type: 'parked_train', position: -55.0, endPosition: 45.0, side: -1, dist: 3.8 }
    );

    // 4b. Arrival Station Platforms (e.g. Arakkonam Junction)
    for (const st of this.stations) {
      const platLength = st.platformLength || 160;
      const platStart = st.stopPosition - platLength * 0.72;
      const platEnd = st.stopPosition + platLength * 0.28;
      const platSideX = 1.95;

      for (let pz = platStart + 10; pz < platEnd - 6; pz += 20) {
        this.scenery.push({
          type: 'coolie',
          position: pz,
          side: 1,
          dist: platSideX + 1.25,
          trunkColor: (Math.floor(pz) % 2 === 0) ? '#b45309' : '#0284c7'
        });
      }

      for (let pz = platStart + 4; pz < platEnd - 4; pz += 12) {
        this.scenery.push({
          type: 'passenger',
          position: pz,
          side: 1,
          dist: platSideX + 1.8 + ((Math.floor(pz) % 4) * 0.28),
          shirtColor: ['#f8fafc', '#0284c7', '#ea580c', '#eab308', '#ec4899'][Math.floor(pz) % 5]
        });
      }

      this.scenery.push({
        type: 'tea_stall',
        position: platStart + 25,
        side: 1,
        dist: platSideX + 3.2
      });

      this.scenery.push({
        type: 'trolley',
        position: platStart + 15,
        side: 1,
        dist: platSideX + 2.2
      });

      this.scenery.push({
        type: 'parked_train',
        position: platStart - 20,
        endPosition: platEnd + 20,
        side: -1,
        dist: 3.8
      });
    }
  }

  /**
   * Get track curvature at a specific meter coordinate
   * Returns curve delta for smooth 2.5D perspective bending
   */
  getCurvatureAt(positionMeters) {
    for (const seg of this.segments) {
      if (positionMeters >= seg.from && positionMeters < seg.to) {
        return seg.curve || 0;
      }
    }
    return 0;
  }

  /**
   * Get track grade / slope at a specific meter coordinate
   */
  getGradeAt(positionMeters) {
    for (const seg of this.segments) {
      if (positionMeters >= seg.from && positionMeters < seg.to) {
        return seg.grade || 0;
      }
    }
    return 0;
  }

  /**
   * Get active speed limit at position
   */
  getSpeedLimitAt(positionMeters) {
    for (const zone of this.speedLimitZones) {
      if (positionMeters >= zone.from && positionMeters < zone.to) {
        return zone.limitKmh;
      }
    }
    return 80;
  }

  /**
   * Look ahead for upcoming speed limit change
   */
  getNextSpeedLimitNotice(currentPosition, lookAheadMeters = 800) {
    for (const zone of this.speedLimitZones) {
      if (zone.from > currentPosition && (zone.from - currentPosition) <= lookAheadMeters) {
        return {
          distance: Math.round(zone.from - currentPosition),
          nextLimit: zone.limitKmh
        };
      }
    }
    return null;
  }

  /**
   * Get next upcoming station
   */
  getNextStation(currentPosition) {
    for (const st of this.stations) {
      if (st.stopPosition >= currentPosition - 15) {
        return {
          ...st,
          distanceMeters: Math.round(st.stopPosition - currentPosition)
        };
      }
    }
    return null;
  }

  /**
   * Get upcoming track switch / turnout
   */
  getNextTrackSwitch(currentPosition, lookAheadMeters = 800) {
    for (const sw of this.trackSwitches) {
      if (sw.position > currentPosition && (sw.position - currentPosition) <= lookAheadMeters) {
        return {
          ...sw,
          distanceMeters: Math.round(sw.position - currentPosition)
        };
      }
    }
    return null;
  }
}
