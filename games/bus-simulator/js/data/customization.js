/**
 * Bus Simulator - Customization Data
 * Exterior, interior, performance, and private travels options
 */

(function () {
  'use strict';

  const CustomizationData = {

    // ===== Exterior Customization =====
    exterior: {
      paintColors: [
        { id: 'white', name: 'Pearl White', color: '#ffffff', price: 0 },
        { id: 'black', name: 'Midnight Black', color: '#0a0a14', price: 5000 },
        { id: 'red', name: 'Racing Red', color: '#dc2626', price: 8000 },
        { id: 'blue', name: 'Ocean Blue', color: '#0e4a6e', price: 8000 },
        { id: 'yellow', name: 'Sunflower Yellow', color: '#f59e0b', price: 10000 },
        { id: 'green', name: 'Forest Green', color: '#16a34a', price: 8000 },
        { id: 'purple', name: 'Royal Purple', color: '#7c3aed', price: 12000 },
        { id: 'orange', name: 'Flame Orange', color: '#ea580c', price: 10000 },
        { id: 'silver', name: 'Metallic Silver', color: '#94a3b8', price: 15000 },
        { id: 'multi-color', name: 'South Indian Gradient', color: 'linear-gradient(90deg, #f59e0b, #dc2626)', price: 20000 }
      ],

      liveries: [
        { id: 'standard', name: 'Standard', price: 0, preview: '#cbd5e1' },
        { id: 'rtc', name: 'RTC Stripes', price: 5000, preview: 'rtc-stripes' },
        { id: 'racing-stripes', name: 'Racing Stripes', price: 7500, preview: 'racing-stripes' },
        { id: 'custom-gradient', name: 'Custom Gradient', price: 12000, preview: 'gradient' }
      ],

      lights: [
        { id: 'stock', name: 'Stock Headlights', price: 0, color: '#e5e7eb' },
        { id: 'led-white', name: 'LED White', price: 3000, color: '#ffffff' },
        { id: 'led-blue', name: 'LED Blue', price: 4500, color: '#00f0ff' },
        { id: 'halogen', name: 'Halogen Yellow', price: 2000, color: '#fbbf24' }
      ],

      wheels: [
        { id: 'steel', name: 'Steel Rims', price: 0, color: '#475569' },
        { id: 'alloy-silver', name: 'Alloy Silver', price: 8000, color: '#cbd5e1' },
        { id: 'alloy-black', name: 'Alloy Black', price: 8000, color: '#1e293b' },
        { id: 'spoke', name: 'Classic Spoke', price: 12000, color: '#fbbf24' }
      ],

      accessories: [
        { id: 'none', name: 'None', price: 0 },
        { id: 'roof_ac', name: 'Roof AC Unit', price: 15000 },
        { id: 'side_skirts', name: 'Side Skirts', price: 10000 },
        { id: 'led_sign', name: 'LED Route Sign', price: 20000 },
        { id: 'bullbar', name: 'Front Bullbar', price: 18000 }
      ],

      fleetNumberStyles: [
        { id: 'white-block', name: 'White Block Numbers', price: 0 },
        { id: 'chrome', name: 'Chrome Numbers', price: 3000 },
        { id: 'led-display', name: 'LED Display', price: 15000 }
      ]
    },

    // ===== Interior Customization =====
    interior: {
      seatStyles: [
        { id: 'fabric-red', name: 'Red Fabric', color: '#dc2626', price: 0 },
        { id: 'fabric-blue', name: 'Blue Fabric', color: '#0e4a6e', price: 5000 },
        { id: 'leather-black', name: 'Black Leather', color: '#1e293b', price: 25000 },
        { id: 'leather-brown', name: 'Brown Leather', color: '#8b5a2b', price: 25000 },
        { id: 'sleeper', name: 'Sleeper Berth', color: '#374151', price: 40000 }
      ],

      interiorColors: [
        { id: 'beige', name: 'Beige', color: '#d4b996', price: 0 },
        { id: 'gray', name: 'Gray', color: '#4b5563', price: 5000 },
        { id: 'black', name: 'Black', color: '#111827', price: 8000 },
        { id: 'blue', name: 'Blue', color: '#0e4a6e', price: 5000 }
      ],

      lighting: [
        { id: 'warm-white', name: 'Warm White', color: '#ffdf96', price: 0 },
        { id: 'cool-white', name: 'Cool White', color: '#d1fae5', price: 3000 },
        { id: 'blue-ambient', name: 'Blue Ambient', color: '#00f0ff', price: 8000 },
        { id: 'purple-ambient', name: 'Purple Ambient', color: '#8b5cf6', price: 8000 },
        { id: 'rgb', name: 'RGB Strip', color: 'rgb', price: 15000 }
      ],

      decorations: [
        { id: 'none', name: 'None', price: 0 },
        { id: 'wall_stickers', name: 'Wall Stickers', price: 5000 },
        { id: 'reading_lights', name: 'Reading Lights', price: 12000 },
        { id: 'usb_ports', name: 'USB Charging Ports', price: 10000 }
      ],

      comfortConfigs: [
        { id: 'basic', name: 'Basic Comfort', passengerComfort: 3, price: 0 },
        { id: 'standard', name: 'Standard Comfort', passengerComfort: 5, price: 15000 },
        { id: 'premium', name: 'Premium Comfort', passengerComfort: 7, price: 45000 },
        { id: 'luxury', name: 'Luxury Comfort', passengerComfort: 9, price: 80000 }
      ]
    },

    // ===== Performance Upgrades =====
    performance: {
      engineTunings: [
        { id: 'stock', name: 'Stock Engine', speedBonus: 0, fuelPenalty: 0, price: 0 },
        { id: 'sport', name: 'Sport Tune', speedBonus: 5, fuelPenalty: 0.1, price: 25000 },
        { id: 'turbo', name: 'Turbo Kit', speedBonus: 12, fuelPenalty: 0.25, price: 65000 },
        { id: 'performance', name: 'Performance Tune', speedBonus: 20, fuelPenalty: 0.4, price: 120000 }
      ],

      transmissionUpgrades: [
        { id: 'manual-5', name: '5-Speed Manual', efficiency: 1.0, price: 0 },
        { id: 'manual-6', name: '6-Speed Manual', efficiency: 1.05, price: 20000 },
        { id: 'auto-4', name: '4-Speed Automatic', efficiency: 1.08, price: 30000 },
        { id: 'auto-6', name: '6-Speed Automatic', efficiency: 1.12, price: 50000 }
      ],

      brakeUpgrades: [
        { id: 'drum', name: 'Drum Brakes', stoppingPower: 1.0, price: 0 },
        { id: 'disc', name: 'Ventilated Disc', stoppingPower: 1.5, price: 25000 },
        { id: 'air', name: 'Air Disc Brakes', stoppingPower: 2.0, price: 50000 }
      ],

      suspensionUpgrades: [
        { id: 'leaf', name: 'Leaf Spring', handling: 1.0, ride: 1.0, price: 0 },
        { id: 'coil', name: 'Coil Spring', handling: 1.2, ride: 1.1, price: 20000 },
        { id: 'air', name: 'Air Suspension', handling: 1.4, ride: 1.5, price: 45000 }
      ]
    },

    // ===== Driver Uniforms =====
    driverUniforms: [
      { id: 'rtc-standard', name: 'RTC Standard', shirtColor: '#1e3a8a', pantColor: '#0f172a', cap: '#ffffff', price: 0 },
      { id: 'rtc-modern', name: 'RTC Modern', shirtColor: '#0e4a6e', pantColor: '#1e293b', cap: '#00f0ff', price: 5000 },
      { id: 'private-red', name: 'Private - Red', shirtColor: '#dc2626', pantColor: '#1e293b', cap: '#dc262c', price: 8000 },
      { id: 'private-blue', name: 'Private - Blue', shirtColor: '#0e4a6e', pantColor: '#0f172a', cap: '#0e4a6e', price: 8000 }
    ],

    // ===== Interior Themes =====
    interiorThemes: [
      { id: 'standard', name: 'Standard', price: 0 },
      { id: 'wood', name: 'Walnut Wood', price: 15000 },
      { id: 'carbon', name: 'Carbon Fiber', price: 25000 },
      { id: 'metal', name: 'Brushed Metal', price: 20000 }
    ],

    getById(category, id) {
      const cat = this[category];
      if (!cat) return null;
      for (const key of Object.keys(cat)) {
        const item = cat[key].find(i => i.id === id);
        if (item) return item;
      }
      return null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.CustomizationData = CustomizationData;
  }
  if (typeof module !== 'undefined') {
    module.exports = CustomizationData;
  }
})();
