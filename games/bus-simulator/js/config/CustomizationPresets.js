/**
 * Bus Simulator - Customization Presets Config
 * Pre-configured livery, color, and interior combinations for quick selection
 *
 * SKELETON - Preset definitions
 */

(function () {
  'use strict';

  const CustomizationPresets = {

    // ===== RTC-Style Presets =====
    rtcPresets: [
      {
        id: 'rtc-red',
        name: 'RTC Red Standard',
        busType: 'rtc',
        exterior: {
          paintColor: '#dc2626',
          livery: 'rtc',
          lights: 'stock',
          wheels: 'steel'
        },
        interior: {
          seatStyle: 'fabric-red',
          interiorColor: 'beige',
          lighting: 'warm-white'
        }
      },
      {
        id: 'rtc-green',
        name: 'RTC Green Express',
        busType: 'rtc',
        exterior: {
          paintColor: '#16a34a',
          livery: 'standard',
          lights: 'led-white',
          wheels: 'alloy-silver'
        },
        interior: {
          seatStyle: 'fabric-blue',
          interiorColor: 'gray',
          lighting: 'warm-white'
        }
      },
      {
        id: 'rtc-yellow',
        name: 'RTC Yellow Pallevelugu',
        busType: 'rtc',
        exterior: {
          paintColor: '#f59e0b',
          livery: 'standard',
          lights: 'halogen',
          wheels: 'steel'
        },
        interior: {
          seatStyle: 'fabric-red',
          interiorColor: 'beige',
          lighting: 'warm-white'
        }
      }
    ],

    // ===== Private Travels Presets =====
    privatePresets: [
      {
        id: 'superia-red',
        name: 'Superia Travels Classic',
        busType: 'private',
        exterior: {
          paintColor: '#dc2626',
          livery: 'custom-gradient',
          lights: 'led-blue',
          wheels: 'spoke',
          accessories: ['roof_ac', 'led_sign']
        },
        interior: {
          seatStyle: 'leather-black',
          interiorColor: 'black',
          lighting: 'rgb',
          theme: 'carbon-fiber'
        }
      },
      {
        id: 'green-line-blue',
        name: 'Green Line Executive',
        busType: 'private',
        exterior: {
          paintColor: '#0e4a6e',
          livery: 'racing-stripes',
          lights: 'led-white',
          wheels: 'alloy-black',
          accessories: ['side_skirts', 'bullbar']
        },
        interior: {
          seatStyle: 'leather-brown',
          interiorColor: 'beige',
          lighting: 'cool-white',
          theme: 'wood'
        }
      },
      {
        id: 'orange-sleeper',
        name: 'Orange Travels Sleeper',
        busType: 'private',
        exterior: {
          paintColor: '#ea580c',
          livery: 'racing-stripes',
          lights: 'halogen',
          wheels: 'alloy-silver',
          accessories: ['roof_ac']
        },
        interior: {
          seatStyle: 'sleeper',
          interiorColor: 'blue',
          lighting: 'blue-ambient',
          theme: 'wood'
        }
      }
    ],

    // ===== Company Identity Presets =====
    companyPresets: [
      {
        id: 'classic-red',
        name: 'Classic Red Lines',
        company: {
          name: 'Red Line Travels',
          tagline: 'Fast & Reliable',
          livery: {
            primaryColor: '#dc2626',
            secondaryColor: '#ffffff',
            stripePattern: 'wave'
          }
        }
      },
      {
        id: 'telangana-green',
        name: 'Telangana Green Express',
        company: {
          name: 'Green Express',
          tagline: 'Connecting Telangana',
          livery: {
            primaryColor: '#16a34a',
            secondaryColor: '#0f172a',
            stripePattern: 'solid'
          }
        }
      },
      {
        id: 'andhra-orange',
        name: 'Andhra Orange Lines',
        company: {
          name: 'Orange Lines',
          tagline: 'Serving Andhra Pradesh',
          livery: {
            primaryColor: '#ea580c',
            secondaryColor: '#1e293b',
            stripePattern: 'wave'
          }
        }
      }
    ],

    getAllPresets() {
      return [...this.rtcPresets, ...this.privatePresets];
    },

    getPreset(id) {
      return [...this.rtcPresets, ...this.privatePresets].find(p => p.id === id) || null;
    },

    getCompanyPreset(id) {
      return this.companyPresets.find(p => p.id === id) || null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.CustomizationPresets = CustomizationPresets;
  }
  if (typeof module !== 'undefined') {
    module.exports = CustomizationPresets;
  }
})();
