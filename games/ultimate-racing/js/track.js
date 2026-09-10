/**
 * InfinityPlay Ultimate Racing - Professional Track & Geometry Engine
 * Implements smooth curve/elevation interpolation, authentic corner anatomy,
 * AI waypoints & racing lines, 3-sector timing, and 2D planar circuit path integration.
 */

(function() {
  // Cubic smoothstep easing: smooth entry and exit with zero derivative at endpoints
  function smoothstep(t) {
    const clamped = Math.max(0, Math.min(1, t));
    return clamped * clamped * (3 - 2 * clamped);
  }

  // Hermite interpolation for butter-smooth curvature transitions
  function hermite(p0, p1, t) {
    return p0 + (p1 - p0) * smoothstep(t);
  }

  class TrackBuilder {
    constructor() {
      this.SEGMENT_LENGTH = 200; // world units per segment
    }

    /**
     * Master track generation method
     * Accepts a track definition and produces fully structured segments,
     * waypoints, checkpoints, scenery, and 2D minimap coordinates.
     */
    buildTrack(trackConfig) {
      const roadWidth = trackConfig.roadWidth || 600;
      const builderContext = new TrackSectionCollector(this.SEGMENT_LENGTH, roadWidth, trackConfig);

      // Execute track-specific layout definition
      if (typeof trackConfig.build === 'function') {
        trackConfig.build(builderContext);
      } else {
        // Fallback default circuit
        builderContext.addStraight(80, 0, 'START STRAIGHT');
        builderContext.addCurve(120, 2.5, 0, 'FIRST TURN');
        builderContext.addStraight(80, 0, 'BACK STRAIGHT');
        builderContext.addCurve(120, -2.5, 0, 'FINAL TURN');
      }

      // Finalize and validate compiled track geometry
      const result = builderContext.finalize();
      return result;
    }
  }

  /**
   * Internal collector that sequences track primitives with cubic easing
   */
  class TrackSectionCollector {
    constructor(segmentLength, roadWidth, config) {
      this.segmentLength = segmentLength;
      this.roadWidth = roadWidth;
      this.config = config;

      this.rawSegments = [];
      this.currentElevation = 0;
      this.currentSectionName = 'START GRID';
      this.currentSector = 1;
    }

    /**
     * 1. Add Straight: Acceleration / Overtaking / Recovery
     */
    addStraight(lengthInSegments, elevationDelta = 0, sectionName = 'STRAIGHT', options = {}) {
      const startElev = this.currentElevation;
      const targetElev = startElev + elevationDelta;
      this.currentSectionName = sectionName;

      for (let i = 0; i < lengthInSegments; i++) {
        const t = (i + 1) / lengthInSegments;
        const elev = hermite(startElev, targetElev, t);

        this.rawSegments.push({
          curve: 0,
          elevation: elev,
          sectionName: sectionName,
          sector: this.currentSector,
          recommendedSpeedRatio: 1.0,
          idealX: options.racingLineX !== undefined ? options.racingLineX : 0.0,
          isBrakingZone: false,
          isApex: false,
          banking: 0,
          isTunnel: Boolean(options.isTunnel),
          isBridge: Boolean(options.isBridge),
          isIce: Boolean(options.isIce),
          landmark: i === Math.floor(lengthInSegments / 2) ? options.landmark : null,
          customProps: options.customProps || null,
          bannerText: options.bannerText || null
        });
      }
      this.currentElevation = targetElev;
      return this;
    }

    /**
     * 2. Add Curve: Professional Corner Anatomy
     * Entry (ease-in) -> Braking Zone -> Turn-in -> Apex -> Corner Exit -> Acceleration
     */
    addCurve(lengthInSegments, targetCurve, elevationDelta = 0, sectionName = 'CURVE', options = {}) {
      const startElev = this.currentElevation;
      const targetElev = startElev + elevationDelta;
      this.currentSectionName = sectionName;

      // Ensure length is sufficient for smooth progression (minimum 36 segments)
      const len = Math.max(36, lengthInSegments);
      const entryLen = Math.floor(len * 0.32);
      const apexLen = Math.floor(len * 0.36);
      const exitLen = len - entryLen - apexLen;

      // Direction: + is Right turn, - is Left turn
      const dir = Math.sign(targetCurve) || 1;
      const curveMag = Math.abs(targetCurve);
      const banking = options.banking !== undefined ? options.banking : dir * Math.min(0.12, curveMag * 0.025);

      // Safe cornering speed ratio (tighter curves require lower speeds)
      const safeSpeedRatio = Math.max(0.48, 1.0 - (curveMag / 6.0) * 0.42);

      // Add pre-corner braking distance marker boards (150m, 100m, 50m) to previous segments if available
      this.injectBrakingMarkers(dir);

      for (let i = 0; i < len; i++) {
        let curveValue = 0;
        let idealX = 0;
        let isApex = false;
        let isBrakingZone = false;
        let speedRatio = 1.0;

        if (i < entryLen) {
          // Entry Phase: Outside line -> Turn-in
          const t = (i + 1) / entryLen;
          curveValue = targetCurve * smoothstep(t);
          idealX = -dir * (0.60 * (1 - t) + 0.15 * t);
          isBrakingZone = true;
          speedRatio = hermite(1.0, safeSpeedRatio, t);
        } else if (i < entryLen + apexLen) {
          // Apex Phase: Maximum curvature, clipping inside curb
          const t = (i - entryLen) / apexLen;
          curveValue = targetCurve;
          idealX = dir * 0.65; // Inside curb apex
          isApex = true;
          speedRatio = safeSpeedRatio;
        } else {
          // Exit Phase: Accelerate out towards the outside curb
          const t = (i - entryLen - apexLen) / exitLen;
          curveValue = targetCurve * (1 - smoothstep(t));
          idealX = -dir * (0.60 * t);
          speedRatio = hermite(safeSpeedRatio, 1.0, t);
        }

        const tTotal = (i + 1) / len;
        const elev = hermite(startElev, targetElev, tTotal);

        this.rawSegments.push({
          curve: curveValue,
          elevation: elev,
          sectionName: sectionName,
          sector: this.currentSector,
          recommendedSpeedRatio: speedRatio,
          idealX: idealX,
          isBrakingZone: isBrakingZone,
          isApex: isApex,
          banking: banking * (Math.abs(curveValue) / curveMag),
          isTunnel: Boolean(options.isTunnel),
          isBridge: Boolean(options.isBridge),
          isIce: Boolean(options.isIce),
          turnChevron: (i % 6 === 0 && Math.abs(curveValue) > 2.0) ? (dir > 0 ? 'chevron_right' : 'chevron_left') : null,
          landmark: i === Math.floor(len / 2) ? options.landmark : null,
          customProps: options.customProps || null
        });
      }

      this.currentElevation = targetElev;
      return this;
    }

    /**
     * Inject braking boards (150m, 100m, 50m) on outside shoulder before corner
     */
    injectBrakingMarkers(turnDirection) {
      const count = this.rawSegments.length;
      if (count < 18) return;
      const outsideOffset = turnDirection > 0 ? -1.65 : 1.65; // opposite of turn direction

      if (this.rawSegments[count - 16]) {
        this.rawSegments[count - 16].brakeMarker = { distance: 150, offset: outsideOffset };
      }
      if (this.rawSegments[count - 11]) {
        this.rawSegments[count - 11].brakeMarker = { distance: 100, offset: outsideOffset };
      }
      if (this.rawSegments[count - 6]) {
        this.rawSegments[count - 6].brakeMarker = { distance: 50, offset: outsideOffset };
      }
    }

    /**
     * 3. Add Hairpin: Extreme 180° Technical Corner
     */
    addHairpin(lengthInSegments, direction = 1, elevationDelta = 0, sectionName = 'HAIRPIN', options = {}) {
      const curveIntensity = 4.8 * (direction > 0 ? 1 : -1);
      return this.addCurve(lengthInSegments, curveIntensity, elevationDelta, sectionName, {
        banking: 0.08 * (direction > 0 ? 1 : -1),
        ...options
      });
    }

    /**
     * 4. Add Chicane: Rapid S-Turn Sequence (Left-Right or Right-Left)
     */
    addChicane(lengthInSegments, initialDirection = 1, elevationDelta = 0, sectionName = 'CHICANE', options = {}) {
      const halfLen = Math.floor(lengthInSegments / 2);
      const intensity = 3.2 * (initialDirection > 0 ? 1 : -1);
      this.addCurve(halfLen, intensity, elevationDelta * 0.5, `${sectionName} ENTRY`, options);
      this.addCurve(halfLen, -intensity, elevationDelta * 0.5, `${sectionName} EXIT`, options);
      return this;
    }

    /**
     * 5. Add S-Curve: Flowing Sweeping Double Turn
     */
    addSCurve(lengthInSegments, curveA, curveB, elevationDelta = 0, sectionName = 'S-CURVE', options = {}) {
      const halfLen = Math.floor(lengthInSegments / 2);
      this.addCurve(halfLen, curveA, elevationDelta * 0.5, `${sectionName} 1`, options);
      this.addCurve(halfLen, curveB, elevationDelta * 0.5, `${sectionName} 2`, options);
      return this;
    }

    /**
     * 6. Add Hill / Crest / Dip: Vertical Elevation Feature
     */
    addHill(lengthInSegments, peakElevation, sectionName = 'HILL CREST', options = {}) {
      const startElev = this.currentElevation;
      const len = Math.max(30, lengthInSegments);
      this.currentSectionName = sectionName;

      for (let i = 0; i < len; i++) {
        const pct = (i + 1) / len;
        // Sine wave for smooth hill ascent and descent
        const elev = startElev + Math.sin(pct * Math.PI) * peakElevation;

        this.rawSegments.push({
          curve: options.curve || 0,
          elevation: elev,
          sectionName: sectionName,
          sector: this.currentSector,
          recommendedSpeedRatio: 0.92,
          idealX: 0,
          isBrakingZone: false,
          isApex: false,
          banking: 0,
          isTunnel: Boolean(options.isTunnel),
          isBridge: Boolean(options.isBridge),
          isIce: Boolean(options.isIce),
          landmark: i === Math.floor(len / 2) ? options.landmark : null
        });
      }
      return this;
    }

    /**
     * 7. Add Tunnel Section: Enclosed Structure with Rafters
     */
    addTunnel(lengthInSegments, curve = 0, sectionName = 'TUNNEL', options = {}) {
      const startIdx = this.rawSegments.length;
      this.addCurve(lengthInSegments, curve, options.elevationDelta || 0, sectionName, {
        isTunnel: true,
        ...options
      });
      const endIdx = this.rawSegments.length - 1;
      if (this.rawSegments[startIdx]) {
        this.rawSegments[startIdx].isTunnelEntrance = true;
      }
      if (this.rawSegments[endIdx]) {
        this.rawSegments[endIdx].isTunnelExit = true;
      }
      return this;
    }

    /**
     * 8. Add Bridge Section: Suspended Causeway
     */
    addBridge(lengthInSegments, curve = 0, bridgeElevation = 80, sectionName = 'BRIDGE', options = {}) {
      const rampLen = Math.floor(lengthInSegments * 0.25);
      const spanLen = lengthInSegments - rampLen * 2;

      // Ramp up
      this.addStraight(rampLen, bridgeElevation, `${sectionName} APPROACH`, { isBridge: true, ...options });
      // Bridge span
      this.addCurve(spanLen, curve, 0, `${sectionName} SPAN`, { isBridge: true, ...options });
      // Ramp down
      this.addStraight(rampLen, -bridgeElevation, `${sectionName} EXIT`, { isBridge: true, ...options });
      return this;
    }

    /**
     * Mark Checkpoint (Sector End)
     */
    addSectorCheckpoint(checkpointNumber) {
      if (this.rawSegments.length > 0) {
        const lastSeg = this.rawSegments[this.rawSegments.length - 1];
        lastSeg.checkpoint = checkpointNumber;
      }
      this.currentSector = Math.min(3, checkpointNumber + 1);
      return this;
    }

    /**
     * Finalize track geometry:
     * - Smooth loop closure for elevation (y_end == y_start)
     * - Calculate 2D circuit path (mapX, mapZ) for minimap
     * - Generate roadside scenery, curbs, and visual props
     */
    finalize() {
      const count = this.rawSegments.length;
      const colors = this.config.colors;
      const roadWidth = this.roadWidth;

      // 1. Ensure smooth elevation loop closure
      const elevEnd = this.currentElevation;
      if (Math.abs(elevEnd) > 0.001) {
        // Distribute elevation correction across the entire track
        for (let i = 0; i < count; i++) {
          const factor = i / count;
          this.rawSegments[i].elevation -= elevEnd * factor;
        }
      }

      // 2. Compute 2D circuit coordinates (X, Z) by integrating curvature heading
      let heading = 0;
      let curX = 0;
      let curZ = 0;
      const path2D = [];

      for (let i = 0; i < count; i++) {
        const seg = this.rawSegments[i];
        // Curvature scales heading change (calibrated for natural loop turning)
        const dAngle = (seg.curve * 0.0032);
        heading += dAngle;

        curX += Math.sin(heading) * this.segmentLength;
        curZ += Math.cos(heading) * this.segmentLength;

        path2D.push({ x: curX, z: curZ, heading: heading });
      }

      // 3. Proportional loop closure for 2D minimap polygon
      const endDx = curX;
      const endDz = curZ;
      for (let i = 0; i < count; i++) {
        const t = (i + 1) / count;
        path2D[i].x -= endDx * t;
        path2D[i].z -= endDz * t;
      }

      // 4. Build output 3D segments for RoadRenderer
      const segments = [];
      const rumblePeriod = 6;

      for (let i = 0; i < count; i++) {
        const raw = this.rawSegments[i];
        const z1 = i * this.segmentLength;
        const z2 = (i + 1) * this.segmentLength;
        const y1 = raw.elevation;
        const y2 = this.rawSegments[(i + 1) % count].elevation;

        const isAlternate = Math.floor(i / rumblePeriod) % 2 === 0;

        const segColor = {
          road: isAlternate ? colors.roadDark : colors.roadLight,
          grass: isAlternate ? colors.groundDark : colors.groundLight,
          rumble: isAlternate ? colors.rumble1 : colors.rumble2,
          curbLed: colors.curbLed !== undefined ? colors.curbLed : null,
          lane: isAlternate ? (colors.lane || '#ffffff') : 'transparent',
          edgeLine: colors.edgeLine || '#ffffff',
          fog: colors.fog,
          shoulder: colors.shoulder || '#0e111a',
          barrier: colors.barrier || '#334155',
          barrierTop: colors.barrierTop || '#64748b'
        };

        const segment = {
          index: i,
          p1: {
            world: { x: 0, y: y1, z: z1 },
            screen: { x: 0, y: 0, w: 0, scale: 0 }
          },
          p2: {
            world: { x: 0, y: y2, z: z2 },
            screen: { x: 0, y: 0, w: 0, scale: 0 }
          },
          baseZ1: z1,
          baseZ2: z2,
          curve: raw.curve,
          turnChevron: raw.turnChevron || null,
          elevation: raw.elevation,
          banking: raw.banking || 0,
          color: segColor,
          sprites: [],
          isFinishLine: (i < 4),
          checkpoint: raw.checkpoint || 0,
          sector: raw.sector || 1,
          sectionName: raw.sectionName || 'TRACK',
          isTunnel: raw.isTunnel || false,
          isTunnelEntrance: raw.isTunnelEntrance || false,
          isTunnelExit: raw.isTunnelExit || false,
          isBridge: raw.isBridge || false,
          isIce: raw.isIce || false,
          mapX: path2D[i].x,
          mapZ: path2D[i].z,
          waypoint: {
            idealX: raw.idealX || 0,
            recommendedSpeedRatio: raw.recommendedSpeedRatio || 1.0,
            isBrakingZone: raw.isBrakingZone || false,
            isApex: raw.isApex || false
          }
        };

        // Populate scenery, landmarks, chevrons, and braking boards
        this.populateSegmentScenery(segment, raw, i, count);

        segments.push(segment);
      }

      // Compute normalized bounding box of 2D circuit for minimap
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const pt of path2D) {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.z < minZ) minZ = pt.z;
        if (pt.z > maxZ) maxZ = pt.z;
      }

      const minimapBounds = {
        minX, maxX, minZ, maxZ,
        width: Math.max(10, maxX - minX),
        height: Math.max(10, maxZ - minZ)
      };

      return {
        config: this.config,
        segments: segments,
        length: count * this.segmentLength,
        segmentLength: this.segmentLength,
        roadWidth: roadWidth,
        totalCheckpoints: 3,
        minimapPath: path2D,
        minimapBounds: minimapBounds
      };
    }

    /**
     * Populate visual sprites, banners, chevrons, and landmark models
     */
    populateSegmentScenery(segment, raw, index, totalCount) {
      const type = this.config.sceneryConfig.type;

      // 1. Start / Finish Gantry at Index 0
      if (index === 0) {
        segment.sprites.push({
          type: 'start_arch',
          offset: 0,
          scale: 1.85,
          text: 'INFINITYPLAY RACING'
        });
        return;
      }

      // 2. Checkpoint Gantry Arches
      if (segment.checkpoint > 0) {
        segment.sprites.push({
          type: 'checkpoint_arch',
          offset: 0,
          scale: 1.75,
          checkpointNum: segment.checkpoint,
          text: `SECTOR ${segment.checkpoint} TIMING`
        });
        return;
      }

      // 3. Braking Distance Marker Boards (150m, 100m, 50m)
      if (raw.brakeMarker) {
        segment.sprites.push({
          type: 'brake_board',
          offset: raw.brakeMarker.offset,
          scale: 1.3,
          distance: raw.brakeMarker.distance
        });
      }

      // 4. Turn Chevron Warning Signs on Curve Outside
      if (raw.turnChevron) {
        const chevronOffset = raw.curve > 0 ? -1.55 : 1.55;
        segment.sprites.push({
          type: raw.turnChevron,
          offset: chevronOffset,
          scale: 1.4
        });
      }

      // 5. Tunnel Portals and Overhead Ribs
      if (raw.isTunnelEntrance) {
        segment.sprites.push({
          type: 'tunnel_portal',
          offset: 0,
          scale: 2.1,
          isEntrance: true,
          text: type === 'city' ? 'CYBER TUNNEL' : 'CANYON TUNNEL'
        });
        return;
      } else if (raw.isTunnelExit) {
        segment.sprites.push({
          type: 'tunnel_portal',
          offset: 0,
          scale: 2.1,
          isEntrance: false,
          text: 'TUNNEL EXIT'
        });
        return;
      }

      if (segment.isTunnel && index % 4 === 0) {
        let ribColor = '#94a3b8';
        if (type === 'city' || type === 'cyberpunk') ribColor = '#00f0ff';
        else if (type === 'volcanic') ribColor = '#ff4400';
        else if (type === 'desert') ribColor = '#f59e0b';
        else if (type === 'arctic') ribColor = '#38bdf8';
        else if (type === 'jungle') ribColor = '#10b981';
        else if (type === 'skyway') ribColor = '#c084fc';
        else if (type === 'grand_prix') ribColor = '#fbbf24';

        segment.sprites.push({
          type: 'tunnel_rib',
          offset: 0,
          scale: 1.9,
          color: ribColor
        });
        return;
      }

      // 6. Bridge Side Railings & Pillars
      if (segment.isBridge && index % 6 === 0) {
        segment.sprites.push({
          type: 'bridge_pillar',
          offset: -1.45,
          scale: 1.5
        });
        segment.sprites.push({
          type: 'bridge_pillar',
          offset: 1.45,
          scale: 1.5
        });
        return;
      }

      // 7. Trackside Landmarks
      if (raw.landmark) {
        segment.sprites.push({
          type: raw.landmark,
          offset: (index % 2 === 0 ? 2.4 : -2.4),
          scale: 3.2
        });
        return;
      }

      // 8. Thematic Roadside Scenery (Periodic, safely set back from tarmac)
      if (index % 10 === 0) {
        const side = index % 20 === 0 ? -1 : 1;
        const offsetDist = side * (1.85 + (index % 7) * 0.18);

        if (type === 'city') {
          const props = ['skyscraper', 'neon_ad', 'light_pole', 'cyber_tower'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'skyscraper' ? 2.8 : 1.3
          });
        } else if (type === 'mountain') {
          const props = ['pine_tree', 'rock_cliff', 'guard_rail'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'rock_cliff' ? 2.4 : 1.5
          });
        } else if (type === 'coastal') {
          const props = ['palm_tree', 'cliff_rock', 'beach_umbrella', 'coastal_light'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'palm_tree' ? 1.7 : 1.4
          });
        } else if (type === 'desert') {
          const props = ['canyon_wall', 'cactus', 'sand_dune', 'abandoned_tower'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'canyon_wall' ? 2.6 : (pType === 'abandoned_tower' ? 2.2 : 1.4)
          });
        } else if (type === 'arctic') {
          const props = ['ice_spire', 'snow_pine', 'glacier_wall'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'glacier_wall' ? 2.8 : (pType === 'ice_spire' ? 2.4 : 1.6)
          });
        } else if (type === 'jungle') {
          const props = ['jungle_tree', 'ancient_ruin', 'waterfall_rock'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'jungle_tree' ? 2.5 : (pType === 'ancient_ruin' ? 2.2 : 1.8)
          });
        } else if (type === 'volcanic') {
          const props = ['volcano_peak', 'magma_spire', 'rock_cliff'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'volcano_peak' ? 3.0 : (pType === 'magma_spire' ? 2.2 : 1.8)
          });
        } else if (type === 'cyberpunk') {
          const props = ['skyscraper', 'hologram_tower', 'neon_ad', 'light_pole'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'skyscraper' ? 2.9 : (pType === 'hologram_tower' ? 2.5 : 1.3)
          });
        } else if (type === 'skyway') {
          const props = ['cloud_pylon', 'sky_platform', 'light_pole'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'cloud_pylon' ? 2.6 : 2.0
          });
        } else if (type === 'grand_prix') {
          const props = ['grand_stand', 'light_pole', 'championship_monolith'];
          const pType = props[Math.floor(index / 10) % props.length];
          segment.sprites.push({
            type: pType,
            offset: offsetDist,
            scale: pType === 'grand_stand' ? 2.8 : (pType === 'championship_monolith' ? 2.5 : 1.4)
          });
        }
      }
    }
  }

  window.UR = window.UR || {};
  window.UR.TrackBuilder = TrackBuilder;
})();
