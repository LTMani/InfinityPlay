/**
 * Bus Simulator - Regions Data
 * Cities, towns, and villages of Andhra Pradesh & Telangana
 * Designed for future expansion into Karnataka, Tamil Nadu, Kerala
 */

(function () {
  'use strict';

  const regions = {
    ap: {
      id: 'ap',
      name: 'Andhra Pradesh',
      color: '#f4a261',
      textColor: '#ffffff',
      cities: [
        { id: 'vijayawada', name: 'Vijayawada', type: 'metropolitan', x: 520, y: 380, population: 1200000 },
        { id: 'guntur', name: 'Guntur', type: 'major', x: 500, y: 410, population: 740000 },
        { id: 'visakhapatnam', name: 'Visakhapatnam', type: 'metropolitan', x: 380, y: 200, population: 1830000 },
        { id: 'tirupati', name: 'Tirupati', type: 'major', x: 560, y: 560, population: 530000 },
        { id: 'nellore', name: 'Nellore', type: 'major', x: 590, y: 680, population: 550000 },
        { id: 'kurnool', name: 'Kurnool', type: 'major', x: 420, y: 580, population: 640000 },
        { id: 'rajahmundry', name: 'Rajahmundry', type: 'major', x: 310, y: 330, population: 410000 },
        { id: 'kadapa', name: 'Kadapa', type: 'major', x: 490, y: 530, population: 390000 },
        { id: 'anantapur', name: 'Anantapur', type: 'major', x: 370, y: 700, population: 480000 },
        { id: 'amaravati', name: 'Amaravati', type: 'capital', x: 510, y: 390, population: 450000 }
      ],
      towns: [
        { id: 'machilipatnam', name: 'Machilipatnam', x: 530, y: 440 },
        { id: 'eluru', name: 'Eluru', x: 440, y: 350 },
        { id: 'vijayanagaram', name: 'Vijayanagaram', x: 360, y: 150 },
        { id: 'tenali', name: 'Tenali', x: 510, y: 410 },
        { id: 'osp', name: 'Ongole', x: 580, y: 470 }
      ],
      villages: [
        { id: 'vijayawada_rural', name: 'Vijayawada Rural', x: 520, y: 400 },
        { id: 'guntur_rural', name: 'Guntur Rural', x: 505, y: 425 }
      ]
    },

    tz: {
      id: 'tz',
      name: 'Telangana',
      color: '#2a9d8f',
      textColor: '#ffffff',
      cities: [
        { id: 'hyderabad', name: 'Hyderabad', type: 'metropolitan', x: 560, y: 470, population: 6800000 },
        { id: 'warangal', name: 'Warangal', type: 'metropolitan', x: 430, y: 300, population: 1560000 },
        { id: 'karimnagar', name: 'Karimnagar', type: 'major', x: 620, y: 280, population: 420000 },
        { id: 'nizamabad', name: 'Nizamabad', type: 'major', x: 640, y: 200, population: 420000 },
        { id: 'khammam', name: 'Khammam', type: 'major', x: 480, y: 250, population: 360000 },
        { id: 'nalgonda', name: 'Nalgonda', type: 'major', x: 540, y: 420, population: 330000 }
      ],
      towns: [
        { id: 'mahabubnagar', name: 'Mahabubnagar', x: 530, y: 570 },
        { id: 'adilabad', name: 'Adilabad', x: 680, y: 180 },
        { id: 'nirmal', name: 'Nirmal', x: 600, y: 270 },
        { id: 'sangareddy', name: 'Sangareddy', x: 590, y: 490 },
        { id: 'zhambad', name: 'Jambagh', x: 440, y: 310 }
      ],
      villages: [
        { id: 'hydrabad_rural', name: 'Hyderabad Rural', x: 565, y: 490 },
        { id: 'warangal_rural', name: 'Warangal Rural', x: 435, y: 320 }
      ]
    },

    // Future expansion placeholders
    karnataka: { id: 'karnataka', name: 'Karnataka', color: '#8d99ae', textColor: '#ffffff', cities: [] },
    tamil_nadu: { id: 'tamil_nadu', name: 'Tamil Nadu', color: '#a855f7', textColor: '#ffffff', cities: [] },
    kerala: { id: 'kerala', name: 'Kerala', color: '#16a34a', textColor: '#ffffff', cities: [] }
  };

  const RegionData = {
    regions: regions,

    getAllCities() {
      const all = [];
      Object.keys(regions).forEach(key => {
        const region = regions[key];
        if (region.cities) {
          all.push(...region.cities.map(c => ({ ...c, region: key, regionName: region.name, regionColor: region.color })));
        }
      });
      return all;
    },

    getRegion(regionId) {
      return regions[regionId] || null;
    },

    getCity(cityId) {
      const allCities = this.getAllCities();
      return allCities.find(c => c.id === cityId) || null;
    },

    getCitiesByRegion(regionId) {
      const region = regions[regionId];
      if (!region || !region.cities) return [];
      return region.cities;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.RegionData = RegionData;
  }
  if (typeof module !== 'undefined') {
    module.exports = RegionData;
  }
})();
