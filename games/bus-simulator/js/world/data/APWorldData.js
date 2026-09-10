/**
 * Bus Simulator - AP World Data
 * Fictional locations and world layout inspired by Andhra Pradesh transportation
 * All locations are original/fictional - no real-world copyrighted data
 */

(function () {
  'use strict';

  const APWorldData = {
    region: {
      id: 'andhra-pradesh-fictional',
      name: 'Andhra Pradesh',
      width: 8000,
      height: 6000
    },

    cities: [
      {
        id: 'gautamiputra',
        name: 'Gautamiputra',
        type: 'capital',
        x: 2000,
        y: 3000,
        population: 1800000,
        color: '#fbbf24'
      },
      {
        id: 'amruthapuri',
        name: 'Amruthapuri',
        type: 'metropolitan',
        x: 800,
        y: 3200,
        population: 1500000,
        color: '#10b981'
      },
      {
        id: 'hanamakonda',
        name: 'Hanamakonda',
        type: 'metropolitan',
        x: 3200,
        y: 2800,
        population: 1200000,
        color: '#00f0ff'
      }
    ],

    towns: [
      {
        id: 'tenali',
        name: 'Tenali',
        type: 'town',
        x: 1600,
        y: 3200,
        population: 380000,
        color: '#60a5fa'
      },
      {
        id: 'suryavaram',
        name: 'Suryavaram',
        type: 'town',
        x: 2000,
        y: 1800,
        population: 220000,
        color: '#60a5fa'
      },
      {
        id: 'narsipatnam',
        name: 'Narsipatnam',
        type: 'town',
        x: 3200,
        y: 3800,
        population: 180000,
        color: '#60a5fa'
      }
    ],

    villages: [
      {
        id: 'chennaram',
        name: 'Chennaram',
        type: 'village',
        x: 1200,
        y: 3600,
        population: 12000,
        color: '#a78bfa'
      },
      {
        id: 'kolladu',
        name: 'Kolladu',
        type: 'village',
        x: 1600,
        y: 2000,
        population: 8500,
        color: '#a78bfa'
      },
      {
        id: 'kodumur',
        name: 'Kodumur',
        type: 'village',
        x: 2400,
        y: 4000,
        population: 6000,
        color: '#a78bfa'
      },
      {
        id: 'venkatagopalashte',
        name: 'Venkatagopalashte',
        type: 'village',
        x: 2800,
        y: 3400,
        population: 5000,
        color: '#a78bfa'
      }
    ],

    // Road network definition
    // Each segment: { id, type, points: [[x,y],...], width, lanes, speedLimit, surface }
    roads: [
      // Main NH-16 Highway (Gautamiputra -> Amruthapuri -> Hanamakonda)
      {
        id: 'nh16_east_west',
        type: 'highway',
        points: [
          [800, 3200],   // Amruthapuri
          [2000, 3000],  // Gautamiputra (midpoint)
          [3200, 2800]   // Hanamakonda
        ],
        width: 28,
        lanes: 4,
        speedLimit: 80,
        surface: 'asphalt'
      },
      // NH-16 Extension (Hanamakonda -> Narsipatnam)
      {
        id: 'nh16_east_extension',
        type: 'highway',
        points: [
          [3200, 2800],  // Hanamakonda
          [3200, 3800]   // Narsipatnam
        ],
        width: 28,
        lanes: 4,
        speedLimit: 80,
        surface: 'asphalt'
      },
      // State Highway to Tenali (Gautamiputra -> Tenali)
      {
        id: 'sh_gautamiputra_tenali',
        type: 'state_highway',
        points: [
          [2000, 3000],  // Gautamiputra
          [1600, 3200]   // Tenali
        ],
        width: 16,
        lanes: 2,
        speedLimit: 60,
        surface: 'asphalt'
      },
      // State Highway to Suryavaram (Gautamiputra -> Suryavaram)
      {
        id: 'sh_gautamiputra_suryavaram',
        type: 'state_highway',
        points: [
          [2000, 3000],  // Gautamiputra
          [2000, 1800]   // Suryavaram
        ],
        width: 16,
        lanes: 2,
        speedLimit: 60,
        surface: 'asphalt'
      },
      // Local road: Tenali -> Chennaram village
      {
        id: 'lr_tenali_chennaram',
        type: 'local_road',
        points: [
          [1600, 3200],  // Tenali
          [1200, 3600]   // Chennaram
        ],
        width: 12,
        lanes: 2,
        speedLimit: 40,
        surface: 'asphalt'
      },
      // Village road: Suryavaram -> Kolladu
      {
        id: 'vr_suryavaram_kolladu',
        type: 'village_road',
        points: [
          [2000, 1800],  // Suryavaram
          [1600, 2000]   // Kolladu
        ],
        width: 8,
        lanes: 1,
        speedLimit: 30,
        surface: 'gravel'
      },
      // Local road: Narsipatnam -> Kodumur
      {
        id: 'lr_narsipatnam_kodumur',
        type: 'local_road',
        points: [
          [3200, 3800],  // Narsipatnam
          [2400, 4000]   // Kodumur
        ],
        width: 12,
        lanes: 2,
        speedLimit: 40,
        surface: 'asphalt'
      },
      // Local road: Kodumur -> Venkatagopalashte
      {
        id: 'lr_kodumur_venkatagopalashte',
        type: 'local_road',
        points: [
          [2400, 4000],  // Kodumur
          [2800, 3400]   // Venkatagopalashte
        ],
        width: 12,
        lanes: 2,
        speedLimit: 40,
        surface: 'asphalt'
      },
      // Local road: Hanamakonda -> Venkatagopalashte
      {
        id: 'lr_hanamakonda_venkatagopalashte',
        type: 'local_road',
        points: [
          [3200, 2800],  // Hanamakonda
          [2800, 3400]   // Venkatagopalashte
        ],
        width: 12,
        lanes: 2,
        speedLimit: 40,
        surface: 'asphalt'
      }
    ],

    // Intersections (where roads meet)
    intersections: [
      { id: 'int_gautamiputra_center', x: 2000, y: 3000, connectedRoads: ['nh16_east_west', 'sh_gautamiputra_tenali', 'sh_gautamiputra_suryavaram'] },
      { id: 'int_suryavaram', x: 2000, y: 1800, connectedRoads: ['sh_gautamiputra_suryavaram', 'vr_suryavaram_kolladu'] },
      { id: 'int_tenali', x: 1600, y: 3200, connectedRoads: ['sh_gautamiputra_tenali', 'lr_tenali_chennaram'] },
      { id: 'int_narsipatnam', x: 3200, y: 3800, connectedRoads: ['nh16_east_extension', 'lr_narsipatnam_kodumur'] },
      { id: 'int_kodumur', x: 2400, y: 4000, connectedRoads: ['lr_narsipatnam_kodumur', 'lr_kodumur_venkatagopalashte'] },
      { id: 'int_venkatagopalashte', x: 2800, y: 3400, connectedRoads: ['lr_kodumur_venkatagopalashte', 'lr_hanamakonda_venkatagopalashte'] }
    ],

    // Roundabouts
    roundabouts: [
      { id: 'rt_gautamiputra', x: 1950, y: 2950, radius: 25, connectingRoads: ['sh_gautamiputra_tenali', 'sh_gautamiputra_suryavaram'] }
    ],

    // Bus Stations
    busStations: [
      {
        id: 'station_gautamiputra_central',
        name: 'Gautamiputra Central Bus Station',
        type: 'major',
        x: 2000,
        y: 3300,
        platforms: 8,
        entryRoad: 'sh_gautamiputra_tenali',
        exitRoad: 'sh_gautamiputra_suryavaram'
      },
      {
        id: 'station_tenali',
        name: 'Tenali Bus Stand',
        type: 'town',
        x: 1550,
        y: 3250,
        platforms: 4,
        entryRoad: 'sh_gautamiputra_tenali',
        exitRoad: 'lr_tenali_chennaram'
      }
    ],

    // Landmarks/Environment objects placed along roads
    landmarks: [
      // Highway amenities on NH-16
      { id: 'toll_nh16_west', type: 'toll', x: 1200, y: 3100, name: 'NH-16 Toll Plaza', fee: 15 },
      { id: 'toll_nh16_east', type: 'toll', x: 3000, y: 2900, name: 'NH-16 Toll Plaza', fee: 20 },
      { id: 'fuel_amruthapuri', type: 'fuel', x: 1000, y: 3300, name: 'HP Petrol Pump', fuel: 20000 },
      { id: 'fuel_hanamakonda', type: 'fuel', x: 3100, y: 2900, name: 'Indian Oil Petrol Pump', fuel: 15000 },
      { id: 'restaurant_roadside_1', type: 'restaurant', x: 1400, y: 3100, name: 'Anjana Foods', cuisine: 'Andhra' },
      { id: 'restaurant_roadside_2', type: 'restaurant', x: 2600, y: 2900, name: 'Highway Dhaba', cuisine: 'Punjabi' },
      { id: 'tea_stall_1', type: 'tea_stall', x: 1800, y: 3100, name: 'Sri Sri Tiffins', specialty: 'Idli' },
      { id: 'tea_stall_2', type: 'tea_stall', x: 2200, y: 2900, name: 'Gautami Tea Shop', specialty: 'Filter Coffee' },

      // Town amenities
      { id: 'fuel_tenali', type: 'fuel', x: 1500, y: 3300, name: 'Tenali Petrol Pump', fuel: 10000 },
      { id: 'tea_stall_tenali', type: 'tea_stall', x: 1580, y: 3180, name: 'Tenali Center Cafe', specialty: 'Ponganalu' },
      { id: 'restaurant_tenali', type: 'restaurant', x: 1620, y: 3280, name: 'Surya Restaurant', cuisine: 'Seafood' },

      // Village amenities
      { id: 'fuel_chennaram', type: 'fuel', x: 1150, y: 3650, name: 'Chennaram Fuel Stop', fuel: 5000 },
      { id: 'tea_stall_chennaram', type: 'tea_stall', x: 1220, y: 3580, name: 'Village Tea Shop', specialty: 'Tea' },
      { id: 'market_chennaram', type: 'market', x: 1200, y: 3600, name: 'Chennaram Weekly Market' }
    ],

    // Environment objects (trees, fields, etc.) - placed in patterns
    environment: [
      // Coconut tree lines along NH-16
      { type: 'tree_group', x: 900, y: 3150, treeType: 'coconut', count: 5, spacing: 8 },
      { type: 'tree_group', x: 1080, y: 3100, treeType: 'coconut', count: 5, spacing: 8 },
      { type: 'tree_group', x: 3100, y: 2750, treeType: 'coconut', count: 5, spacing: 8 },
      { type: 'tree_group', x: 3280, y: 2700, treeType: 'coconut', count: 5, spacing: 8 },

      // Agricultural fields near villages
      { type: 'field', x: 1100, y: 3500, width: 120, height: 80, crop: 'paddy' },
      { type: 'field', x: 1300, y: 3700, width: 100, height: 60, crop: 'cotton' },
      { type: 'field', x: 2500, y: 3900, width: 140, height: 100, crop: 'paddy' },
      { type: 'field', x: 2950, y: 4100, width: 80, height: 60, crop: 'groundnut' },
      { type: 'field', x: 1750, y: 1900, width: 150, height: 100, crop: 'flowers' }
    ],

    // Spawn position (in Gautamiputra)
    spawnPosition: { x: 2000, y: 3000 }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.APWorldData = APWorldData;
  }
  if (typeof module !== 'undefined') {
    module.exports = APWorldData;
  }
})();
