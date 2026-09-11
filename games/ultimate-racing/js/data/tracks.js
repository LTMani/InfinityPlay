/**
 * InfinityPlay Ultimate Racing - Professional Track Layouts Dataset
 * Authored circuits for all 10 championship levels:
 * Level 1: Neon City (Easy)
 * Level 2: Mountain Pass (Easy-Medium)
 * Level 3: Coastal Highway (Medium)
 * Level 4: Desert Storm (Medium)
 * Level 5: Arctic Run (Hard)
 * Level 6: Jungle Rush (Hard)
 * Level 7: Volcanic Circuit (Hard)
 * Level 8: Cyberpunk District (Very Hard)
 * Level 9: Skyway Extreme (Very Hard)
 * Level 10: Infinity Grand Prix (Extreme)
 */

(function() {
  const TRACKS = [
    // =========================================================================
    // LEVEL 1: NEON CITY
    // =========================================================================
    {
      level: 1,
      id: 'neon-city',
      name: 'Neon City',
      tagline: 'Cyberpunk Metropolis Circuit',
      difficulty: 'Easy',
      laps: 3,
      weather: 'rain',
      timeOfDay: 'night',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 300,
      fogDensity: 0.12,
      colors: {
        skyTop: '#03050c',
        skyBottom: '#0a0e1c',
        horizonGlow: 'rgba(30, 27, 75, 0.35)',
        roadDark: '#11141e',
        roadLight: '#141723',
        shoulder: '#0e111a',
        groundDark: '#070910',
        groundLight: '#0a0d16',
        rumble1: '#dc2626',
        rumble2: '#f8fafc',
        curbLed: null,
        lane: 'rgba(240, 245, 255, 0.75)',
        edgeLine: '#ffffff',
        fog: 'rgba(3, 5, 12, 0.85)',
        barrier: '#334155',
        barrierTop: '#64748b'
      },
      sceneryConfig: {
        type: 'city',
        hasRain: true,
        hasReflections: true,
        skyscrapers: true,
        neonAds: true,
        streetlights: true
      },
      build: function(builder) {
        // Sector 1
        builder.addStraight(90, 0, 'AVENUE STRAIGHT', { bannerText: 'GRAND PRIX START' });
        builder.addCurve(100, 4.4, 180, 'PLAZA TURN 1');
        builder.addStraight(60, 60, 'VIADUCT STRAIGHT');
        builder.addCurve(80, -2.4, -40, 'METRO SWEEPER', { landmark: 'cyber_tower' });
        builder.addSCurve(90, 3.2, -3.2, -40, 'PLAZA ESSES');
        builder.addStraight(70, 0, 'CITY PLAZA');
        builder.addSectorCheckpoint(1);

        // Sector 2
        builder.addHairpin(110, 1, -120, 'GRAND HAIRPIN', { landmark: 'skyscraper' });
        builder.addStraight(80, 240, 'SKYWAY OVERPASS');
        builder.addTunnel(130, 3.6, 'CYBER TUNNEL', { landmark: 'neon_ad' });
        builder.addCurve(80, 3.2, -120, 'TUNNEL OUT');
        builder.addSectorCheckpoint(2);

        // Sector 3
        builder.addChicane(80, -1, 0, 'METRO CHICANE');
        builder.addCurve(100, 4.2, -200, 'FINAL CORNER');
        builder.addStraight(80, 0, 'FINISH STRAIGHT');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 2: MOUNTAIN PASS
    // =========================================================================
    {
      level: 2,
      id: 'mountain-pass',
      name: 'Mountain Pass',
      tagline: 'Alpine Ridge & Canyon Falls',
      difficulty: 'Medium',
      laps: 3,
      weather: 'fog',
      timeOfDay: 'sunset',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 300,
      fogDensity: 0.22,
      colors: {
        skyTop: '#140824',
        skyBottom: '#831843',
        horizonGlow: 'rgba(249, 115, 22, 0.25)',
        roadDark: '#131620',
        roadLight: '#161924',
        shoulder: '#0e111a',
        groundDark: '#0c120e',
        groundLight: '#111814',
        rumble1: '#dc2626',
        rumble2: '#f8fafc',
        curbLed: null,
        lane: 'rgba(251, 191, 36, 0.85)',
        edgeLine: '#ffffff',
        fog: 'rgba(20, 10, 32, 0.7)',
        barrier: '#475569',
        barrierTop: '#94a3b8'
      },
      sceneryConfig: {
        type: 'mountain',
        hasRain: false,
        hasFog: true,
        mountains: true,
        trees: true,
        guardRails: true,
        rockWalls: true
      },
      build: function(builder) {
        // Sector 1
        builder.addStraight(80, 0, 'VALLEY START');
        builder.addCurve(110, -4.2, 480, 'CLIFFSIDE ASCENT', { landmark: 'rock_cliff' });
        builder.addSCurve(110, 3.2, -3.8, 300, 'ALPINE SWITCHBACKS');
        builder.addHill(80, 420, 'MOUNTAIN CREST', { landmark: 'pine_tree' });
        builder.addCurve(100, -3.8, -380, 'RIDGE DESCENT');
        builder.addSectorCheckpoint(1);

        // Sector 2
        builder.addHairpin(110, -1, -220, 'DEVIL’S HAIRPIN');
        builder.addBridge(140, -2.4, 380, 'CANYON FALLS BRIDGE', { landmark: 'bridge_pillar' });
        builder.addTunnel(130, -3.6, 'CANYON TUNNEL');
        builder.addCurve(90, 2.6, -180, 'CANYON RUN');
        builder.addSectorCheckpoint(2);

        // Sector 3
        builder.addStraight(90, 0, 'VALLEY OVERTAKE');
        builder.addChicane(80, -1, 0, 'VALLEY CHICANE');
        builder.addSCurve(100, -3.6, 2.8, -140, 'FOREST ESSES', { landmark: 'pine_tree' });
        builder.addCurve(100, -4.4, 180, 'SUMMIT TURN');
        builder.addStraight(80, 0, 'ALPINE FINISH');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 3: COASTAL HIGHWAY
    // =========================================================================
    {
      level: 3,
      id: 'coastal-highway',
      name: 'Coastal Highway',
      tagline: 'Sunburst Ocean Shoreline',
      difficulty: 'Medium',
      laps: 3,
      weather: 'clear',
      timeOfDay: 'day',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 320,
      fogDensity: 0.08,
      colors: {
        skyTop: '#0c4a6e',
        skyBottom: '#0284c7',
        horizonGlow: 'rgba(254, 240, 138, 0.3)',
        roadDark: '#131620',
        roadLight: '#161925',
        shoulder: '#0e111a',
        groundDark: '#08121d',
        groundLight: '#0d1a28',
        rumble1: '#dc2626',
        rumble2: '#f8fafc',
        curbLed: null,
        lane: 'rgba(245, 248, 255, 0.8)',
        edgeLine: '#ffffff',
        fog: 'rgba(12, 74, 110, 0.35)',
        barrier: '#334155',
        barrierTop: '#64748b'
      },
      sceneryConfig: {
        type: 'coastal',
        hasRain: false,
        ocean: true,
        palmTrees: true,
        bridges: true,
        cliffs: true,
        speedwayArches: true
      },
      build: function(builder) {
        // Sector 1
        builder.addStraight(90, 0, 'OCEAN BOULEVARD');
        builder.addCurve(110, 4.4, 180, 'PACIFIC SWEEPER', { landmark: 'palm_tree' });
        builder.addCurve(90, -2.4, 60, 'SHORELINE BEND');
        builder.addHill(90, -360, 'BEACH DESCENT');
        builder.addStraight(80, 0, 'BOARDWALK STRAIGHT');
        builder.addSectorCheckpoint(1);

        // Sector 2
        builder.addStraight(100, 0, 'PALM BEACH STRIP', { bannerText: 'SPEED TRAP ZONE' });
        builder.addHairpin(110, 1, 0, 'SEA-WALL HAIRPIN', { landmark: 'cliff_rock' });
        builder.addBridge(140, 2.8, 300, 'OCEAN CAUSEWAY');
        builder.addCurve(90, 4.2, -120, 'HARBOR APPROACH');
        builder.addSectorCheckpoint(2);

        // Sector 3
        builder.addSCurve(110, -3.0, 4.2, 60, 'COASTAL ESSES');
        builder.addStraight(100, 0, 'HARBOR PROMENADE');
        builder.addChicane(80, 1, 0, 'MARINA CHICANE');
        builder.addCurve(100, 4.4, -120, 'FINAL PROMENADE', { landmark: 'cliff_rock' });
        builder.addStraight(90, 0, 'OCEAN FINISH');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 4: DESERT STORM
    // =========================================================================
    {
      level: 4,
      id: 'desert-storm',
      name: 'Desert Storm',
      tagline: 'Scorched Sands & Canyon Gorge',
      difficulty: 'Medium',
      laps: 3,
      weather: 'dust',
      timeOfDay: 'day',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 300,
      fogDensity: 0.16,
      colors: {
        skyTop: '#78350f',
        skyBottom: '#d97706',
        horizonGlow: 'rgba(251, 191, 36, 0.4)',
        roadDark: '#1c1714',
        roadLight: '#221d19',
        shoulder: '#18120e',
        groundDark: '#451a03',
        groundLight: '#78350f',
        rumble1: '#f59e0b',
        rumble2: '#fef3c7',
        curbLed: null,
        lane: 'rgba(254, 240, 138, 0.85)',
        edgeLine: '#ffffff',
        fog: 'rgba(120, 53, 15, 0.65)',
        barrier: '#7c2d12',
        barrierTop: '#9a3412'
      },
      sceneryConfig: {
        type: 'desert',
        hasDust: true,
        canyons: true,
        dunes: true
      },
      build: function(builder) {
        // Sector 1: Dune Straight & Canyon Approach
        builder.addStraight(90, 0, 'DUNE HIGHWAY', { bannerText: 'DESERT SPEED ZONE' });
        builder.addCurve(110, 4.2, 140, 'DUNE SWEEPER', { landmark: 'sand_dune' });
        builder.addStraight(80, 0, 'MIRAGE RUN');
        builder.addSCurve(90, 3.2, -3.2, -60, 'SANDSTONE ESSES');
        builder.addChicane(80, 1, 0, 'OASIS CHICANE');
        builder.addSectorCheckpoint(1);

        // Sector 2: Canyon Gorge & Sunken Cavern
        builder.addStraight(80, 0, 'CANYON GAP');
        builder.addHairpin(110, 1, -160, 'RED ROCK HAIRPIN', { landmark: 'canyon_wall' });
        builder.addTunnel(130, 3.4, 'SUNKEN GORGE TUNNEL');
        builder.addCurve(90, 2.8, 120, 'GORGE ASCENT');
        builder.addStraight(80, 140, 'MESA OVERLOOK');
        builder.addSectorCheckpoint(2);

        // Sector 3: High-Speed Basin Sprint
        builder.addSCurve(100, -3.4, 3.2, -80, 'BASIN ESSES');
        builder.addCurve(100, 4.4, -140, 'FINAL DUNES', { landmark: 'abandoned_tower' });
        builder.addStraight(90, 0, 'MIRAGE SPRINT');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 5: ARCTIC RUN
    // =========================================================================
    {
      level: 5,
      id: 'arctic-run',
      name: 'Arctic Run',
      tagline: 'Glacial Tundra & Frozen Lake',
      difficulty: 'Hard',
      laps: 3,
      weather: 'snow',
      timeOfDay: 'day',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 290,
      fogDensity: 0.18,
      colors: {
        skyTop: '#0f172a',
        skyBottom: '#38bdf8',
        horizonGlow: 'rgba(186, 230, 253, 0.4)',
        roadDark: '#0f172a',
        roadLight: '#1e293b',
        shoulder: '#0b1120',
        groundDark: '#cbd5e1',
        groundLight: '#f1f5f9',
        rumble1: '#0284c7',
        rumble2: '#f8fafc',
        curbLed: null,
        lane: 'rgba(224, 242, 254, 0.85)',
        edgeLine: '#ffffff',
        fog: 'rgba(15, 23, 42, 0.75)',
        barrier: '#38bdf8',
        barrierTop: '#93c5fd'
      },
      sceneryConfig: {
        type: 'arctic',
        hasSnow: true,
        glaciers: true
      },
      build: function(builder) {
        // Sector 1: Glacier Start & Frozen Lake
        builder.addStraight(90, 0, 'GLACIER GRID');
        builder.addCurve(110, -4.2, 0, 'FROZEN LAKE', { landmark: 'glacier_wall', isIce: true });
        builder.addSCurve(100, 3.4, -3.4, 180, 'SNOWDRIFT ESSES');
        builder.addHill(80, 280, 'ICE RIDGE CLIMB', { landmark: 'ice_spire' });
        builder.addSectorCheckpoint(1);

        // Sector 2: Crevasse Bridge & Ice Tunnel
        builder.addBridge(140, 2.4, 0, 'CREVASSE BRIDGE');
        builder.addHairpin(110, -1, -220, 'BLIZZARD HAIRPIN');
        builder.addTunnel(130, -3.8, 'GLACIER CAVERN');
        builder.addCurve(90, 2.6, -120, 'CAVERN EXIT');
        builder.addSectorCheckpoint(2);

        // Sector 3: Alpine Pine Descent
        builder.addSCurve(100, -3.2, 3.6, -140, 'PINE RUN', { landmark: 'snow_pine' });
        builder.addChicane(80, -1, 0, 'AVALANCHE CHICANE');
        builder.addCurve(100, 4.4, -120, 'ICEWALL CORNER');
        builder.addStraight(90, 0, 'GLACIER FINISH');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 6: JUNGLE RUSH
    // =========================================================================
    {
      level: 6,
      id: 'jungle-rush',
      name: 'Jungle Rush',
      tagline: 'Emerald Canopy & Ancient Ruins',
      difficulty: 'Hard',
      laps: 3,
      weather: 'rain',
      timeOfDay: 'day',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 310,
      fogDensity: 0.15,
      colors: {
        skyTop: '#064e3b',
        skyBottom: '#047857',
        horizonGlow: 'rgba(52, 211, 153, 0.3)',
        roadDark: '#111a14',
        roadLight: '#152219',
        shoulder: '#0e1610',
        groundDark: '#022c22',
        groundLight: '#064e3b',
        rumble1: '#059669',
        rumble2: '#fbbf24',
        curbLed: null,
        lane: 'rgba(254, 240, 138, 0.8)',
        edgeLine: '#ffffff',
        fog: 'rgba(6, 78, 59, 0.7)',
        barrier: '#1f2937',
        barrierTop: '#4b5563'
      },
      sceneryConfig: {
        type: 'jungle',
        hasMist: true,
        ruins: true
      },
      build: function(builder) {
        // Sector 1: Canopy Start & Waterfall
        builder.addStraight(90, 0, 'CANOPY GRID');
        builder.addCurve(110, 4.4, -140, 'WATERFALL SWEEPER', { landmark: 'waterfall_rock' });
        builder.addSCurve(100, -3.6, 3.4, 80, 'BANYAN ESSES', { landmark: 'jungle_tree' });
        builder.addStraight(80, 0, 'RIVER GORGE RUN');
        builder.addSectorCheckpoint(1);

        // Sector 2: Temple Cavern & River Bridge
        builder.addTunnel(130, 2.8, 'TEMPLE CAVERN', { landmark: 'ancient_ruin' });
        builder.addChicane(80, -1, 0, 'RUINS CHICANE');
        builder.addBridge(140, 3.2, 180, 'CANOPY SUSPENSION BRIDGE');
        builder.addCurve(90, 3.0, 60, 'CLIFF FACE BEND');
        builder.addSectorCheckpoint(2);

        // Sector 3: Temple Hairpin & Final Sprint
        builder.addHairpin(110, 1, -160, 'RUINS HAIRPIN');
        builder.addSCurve(100, 3.2, -3.4, -120, 'VINE VALLEY');
        builder.addCurve(100, 4.4, -160, 'EMERALD TURN');
        builder.addStraight(90, 0, 'CANOPY FINISH');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 7: VOLCANIC CIRCUIT
    // =========================================================================
    {
      level: 7,
      id: 'volcanic-circuit',
      name: 'Volcanic Circuit',
      tagline: 'Magma Caldera & Obsidian Ridge',
      difficulty: 'Hard',
      laps: 3,
      weather: 'ash',
      timeOfDay: 'night',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 310,
      fogDensity: 0.18,
      colors: {
        skyTop: '#180808',
        skyBottom: '#7f1d1d',
        horizonGlow: 'rgba(239, 68, 68, 0.45)',
        roadDark: '#120e0e',
        roadLight: '#181212',
        shoulder: '#0f0a0a',
        groundDark: '#261515',
        groundLight: '#381a1a',
        rumble1: '#dc2626',
        rumble2: '#f59e0b',
        curbLed: null,
        lane: 'rgba(254, 215, 170, 0.85)',
        edgeLine: '#ffffff',
        fog: 'rgba(24, 8, 8, 0.8)',
        barrier: '#7f1d1d',
        barrierTop: '#b91c1c'
      },
      sceneryConfig: {
        type: 'volcanic',
        hasAsh: true,
        magma: true
      },
      build: function(builder) {
        // Sector 1: Caldera Start & Magma River
        builder.addStraight(90, 0, 'CALDERA GRID');
        builder.addCurve(110, -4.6, 220, 'MAGMA RIVER', { landmark: 'volcano_peak' });
        builder.addSCurve(100, 3.8, -3.6, 80, 'OBSIDIAN ESSES');
        builder.addHill(90, 260, 'BASALT RIDGE', { landmark: 'magma_spire' });
        builder.addSectorCheckpoint(1);

        // Sector 2: Lava Hairpin & Cavern
        builder.addHairpin(110, -1, -260, 'LAVA HAIRPIN');
        builder.addTunnel(130, -3.6, 'OBSIDIAN TUNNEL');
        builder.addBridge(140, -2.4, 0, 'MAGMA FALLS BRIDGE');
        builder.addCurve(90, 2.4, 80, 'VENT RUN');
        builder.addSectorCheckpoint(2);

        // Sector 3: Caldera Chicane & Finish
        builder.addChicane(80, 1, 0, 'CALDERA CHICANE');
        builder.addSCurve(100, 3.4, -3.8, -140, 'EMBER VALLEY');
        builder.addCurve(100, 4.8, -120, 'SCORCHED TURN');
        builder.addStraight(90, 0, 'CALDERA FINISH');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 8: CYBERPUNK DISTRICT
    // =========================================================================
    {
      level: 8,
      id: 'cyberpunk-district',
      name: 'Cyberpunk District',
      tagline: 'Neo-Tokyo Overpass & Hologram Alley',
      difficulty: 'Very Hard',
      laps: 3,
      weather: 'rain',
      timeOfDay: 'night',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 320,
      fogDensity: 0.14,
      colors: {
        skyTop: '#020617',
        skyBottom: '#1e1b4b',
        horizonGlow: 'rgba(236, 72, 153, 0.4)',
        roadDark: '#0a0d14',
        roadLight: '#0d101a',
        shoulder: '#07090f',
        groundDark: '#020617',
        groundLight: '#0f172a',
        rumble1: '#ec4899',
        rumble2: '#00f0ff',
        curbLed: null,
        lane: 'rgba(240, 245, 255, 0.85)',
        edgeLine: '#ffffff',
        fog: 'rgba(2, 6, 23, 0.85)',
        barrier: '#4f46e5',
        barrierTop: '#6366f1'
      },
      sceneryConfig: {
        type: 'cyberpunk',
        hasRain: true,
        holograms: true
      },
      build: function(builder) {
        // Sector 1: Neo-Shinjuku Straight & Skyway
        builder.addStraight(100, 0, 'NEO-SHINJUKU GRID', { bannerText: 'NEO-TOKYO GP' });
        builder.addCurve(110, 4.6, 240, 'SKYWAY SWEEPER', { landmark: 'hologram_tower' });
        builder.addChicane(90, -1, 0, 'HOLOGRAM CHICANE');
        builder.addStraight(80, 80, 'VIADUCT HIGHWAY');
        builder.addSectorCheckpoint(1);

        // Sector 2: Dragon Hairpin & Multi-level Tunnel
        builder.addHairpin(110, 1, -140, 'DRAGON HAIRPIN');
        builder.addTunnel(140, 3.8, 'CYBER HIGHWAY TUNNEL');
        builder.addCurve(90, 3.2, -100, 'EXPRESSWAY EXIT');
        builder.addStraight(80, 120, 'OVERPASS PLAZA');
        builder.addSectorCheckpoint(2);

        // Sector 3: Multi-tier Esses & Grand Finale
        builder.addSCurve(110, -3.8, 3.6, -160, 'NEON ESSES', { landmark: 'cyber_advert' });
        builder.addCurve(110, 4.8, -120, 'APEX BANKING');
        builder.addStraight(90, 0, 'CYBERPUNK FINISH');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 9: SKYWAY EXTREME
    // =========================================================================
    {
      level: 9,
      id: 'skyway-extreme',
      name: 'Skyway Extreme',
      tagline: 'Stratosphere Viaduct & Cloud Canyon',
      difficulty: 'Very Hard',
      laps: 3,
      weather: 'clouds',
      timeOfDay: 'sunset',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 320,
      fogDensity: 0.16,
      colors: {
        skyTop: '#0f172a',
        skyBottom: '#60a5fa',
        horizonGlow: 'rgba(244, 114, 182, 0.4)',
        roadDark: '#0f172a',
        roadLight: '#1e293b',
        shoulder: '#0a0f1d',
        groundDark: '#1e3a8a',
        groundLight: '#38bdf8',
        rumble1: '#0ea5e9',
        rumble2: '#ffffff',
        curbLed: null,
        lane: 'rgba(255, 255, 255, 0.9)',
        edgeLine: '#ffffff',
        fog: 'rgba(15, 23, 42, 0.7)',
        barrier: '#0284c7',
        barrierTop: '#38bdf8'
      },
      sceneryConfig: {
        type: 'skyway',
        hasClouds: true,
        platforms: true
      },
      build: function(builder) {
        // Sector 1: Stratosphere Runway & Cloud Rim
        builder.addStraight(100, 0, 'RUNWAY GRID');
        builder.addCurve(110, -4.6, 280, 'CLOUD RIM SWEEPER', { landmark: 'cloud_pylon' });
        builder.addBridge(140, 2.4, 80, 'STRATOSPHERE BRIDGE');
        builder.addStraight(80, 0, 'SKY PLATFORM RUN');
        builder.addSectorCheckpoint(1);

        // Sector 2: High Altitude S-Curves & Apex Hairpin
        builder.addSCurve(110, 3.8, -3.8, 160, 'STRATO ESSES');
        builder.addHairpin(110, -1, -260, 'APEX PYLON HAIRPIN');
        builder.addTunnel(130, -3.6, 'SKY TUNNEL');
        builder.addSectorCheckpoint(2);

        // Sector 3: Plunging Descent & Final Sweeper
        builder.addHill(100, -340, 'PLUNGING SKYWAY', { landmark: 'sky_platform' });
        builder.addChicane(80, 1, 0, 'AEROPULSE CHICANE');
        builder.addCurve(110, 4.8, 80, 'ZENITH BANKING');
        builder.addStraight(90, 0, 'ZENITH FINISH');
        builder.addSectorCheckpoint(3);
      }
    },

    // =========================================================================
    // LEVEL 10: INFINITY GRAND PRIX
    // =========================================================================
    {
      level: 10,
      id: 'infinity-grand-prix',
      name: 'Infinity Grand Prix',
      tagline: 'Championship Apex Circuit',
      difficulty: 'Extreme',
      laps: 3,
      weather: 'dynamic',
      timeOfDay: 'twilight',
      roadWidth: 520,
      lanes: 3,
      drawDistance: 340,
      fogDensity: 0.12,
      colors: {
        skyTop: '#030712',
        skyBottom: '#312e81',
        horizonGlow: 'rgba(245, 158, 11, 0.45)',
        roadDark: '#0d1117',
        roadLight: '#161b22',
        shoulder: '#080c12',
        groundDark: '#030712',
        groundLight: '#0f172a',
        rumble1: '#f59e0b',
        rumble2: '#ffffff',
        curbLed: null,
        lane: 'rgba(254, 243, 199, 0.95)',
        edgeLine: '#ffffff',
        fog: 'rgba(3, 7, 18, 0.85)',
        barrier: '#d97706',
        barrierTop: '#fbbf24'
      },
      sceneryConfig: {
        type: 'grand_prix',
        hasChampionship: true,
        grandstands: true
      },
      build: function(builder) {
        // Sector 1: Championship Boulevard & Eau-Rouge Apex
        builder.addStraight(100, 0, 'CHAMPIONSHIP BOULEVARD', { bannerText: 'INFINITY WORLD CHAMPIONSHIP' });
        builder.addCurve(120, 4.8, 360, 'EAU ROUGE APEX', { landmark: 'championship_monolith' });
        builder.addSCurve(110, -4.2, 4.0, -120, 'ARENA ESSES');
        builder.addStraight(80, 0, 'GRANDSTAND STRAIGHT');
        builder.addSectorCheckpoint(1);

        // Sector 2: Infinity Hairpin & Supersonic Tunnel
        builder.addHairpin(120, 1, -180, 'INFINITY HAIRPIN');
        builder.addTunnel(140, 3.6, 'SUPERSONIC ARENA TUNNEL');
        builder.addCurve(120, 4.6, 140, 'VELODROME BANKING', { landmark: 'grand_stand' });
        builder.addSectorCheckpoint(2);

        // Sector 3: Stadium Chicanes & Grand Prix Finale
        builder.addChicane(90, -1, 0, 'STADIUM CHICANE');
        builder.addSCurve(110, -3.8, 3.8, -200, 'PODIUM ESSES');
        builder.addCurve(110, 4.8, 0, 'FINAL CHAMPIONSHIP CORNER');
        builder.addStraight(100, 0, 'CHAMPIONSHIP ARENA FINISH');
        builder.addSectorCheckpoint(3);
      }
    }
  ];

  window.UR = window.UR || {};
  window.UR.TRACKS = TRACKS;
})();
