/**
 * InfinityPlay Ultimate Racing - Cars Dataset
 * Defines the 5 fictional high-performance supercars
 */

(function() {
  const CARS = [
    {
      id: 'velocity-x',
      name: 'Velocity X',
      tagline: 'Balanced Cyber Interceptor',
      description: 'The iconic InfinityPlay prototype featuring twin vector turbines, ideal balance, and sharp turn-in handling for any track.',
      unlock: { type: 'free', wins: 0, text: 'Unlocked by Default' },
      stats: {
        topSpeed: 235,       // Max base speed in km/h
        acceleration: 7.2,   // 0-100 acceleration rate
        handling: 7.5,       // Lateral grip and responsiveness
        braking: 7.0,        // Deceleration power
        nitro: 7.0           // Boost multiplier & duration
      },
      visuals: {
        bodyColor: '#00f0ff',
        accentColor: '#4f46e5',
        glowColor: 'rgba(0, 240, 255, 0.75)',
        stripes: '#ffffff',
        windshield: 'rgba(15, 23, 42, 0.85)',
        tailLights: '#ec4899',
        headlights: '#00f0ff',
        exhaustFlame: '#00f0ff',
        style: 'coupe'
      }
    },
    {
      id: 'nitro-gt',
      name: 'Nitro GT',
      tagline: 'Turbocharged Muscle Spec',
      description: 'High-torque brute engineered with heavy hyper-fuel injectors. Explosive off the line and possesses massive nitro surge.',
      unlock: { type: 'wins', wins: 5, text: 'Win 5 Races to Unlock' },
      stats: {
        topSpeed: 250,
        acceleration: 8.8,
        handling: 6.8,
        braking: 7.5,
        nitro: 9.2
      },
      visuals: {
        bodyColor: '#ec4899',
        accentColor: '#9d174d',
        glowColor: 'rgba(236, 72, 153, 0.75)',
        stripes: '#fbcfe8',
        windshield: 'rgba(20, 10, 25, 0.85)',
        tailLights: '#ef4444',
        headlights: '#f43f5e',
        exhaustFlame: '#ec4899',
        style: 'muscle'
      }
    },
    {
      id: 'phantom-r',
      name: 'Phantom R',
      tagline: 'Apex Drift Specialist',
      description: 'Ultra-lightweight composite chassis with active aerodynamic canards for razor-sharp drift angles and sustained slide control.',
      unlock: { type: 'wins', wins: 10, text: 'Win 10 Races to Unlock' },
      stats: {
        topSpeed: 255,
        acceleration: 8.0,
        handling: 9.4,
        braking: 8.6,
        nitro: 8.0
      },
      visuals: {
        bodyColor: '#8b5cf6',
        accentColor: '#4c1d95',
        glowColor: 'rgba(139, 92, 246, 0.8)',
        stripes: '#c4b5fd',
        windshield: 'rgba(15, 10, 30, 0.85)',
        tailLights: '#f43f5e',
        headlights: '#c084fc',
        exhaustFlame: '#a855f7',
        style: 'gt'
      }
    },
    {
      id: 'cyberbolt',
      name: 'Cyberbolt',
      tagline: 'Supersonic Interceptor',
      description: 'Aerodynamic wind-tunnel shaped hypercar built for pure terminal velocity. Unrivaled top speed along long highway stretches.',
      unlock: { type: 'wins', wins: 15, text: 'Win 15 Races to Unlock' },
      stats: {
        topSpeed: 285,
        acceleration: 8.6,
        handling: 7.8,
        braking: 8.2,
        nitro: 8.8
      },
      visuals: {
        bodyColor: '#fbbf24',
        accentColor: '#b45309',
        glowColor: 'rgba(251, 191, 36, 0.8)',
        stripes: '#fef3c7',
        windshield: 'rgba(20, 18, 10, 0.85)',
        tailLights: '#ef4444',
        headlights: '#fde047',
        exhaustFlame: '#f59e0b',
        style: 'hyper'
      }
    },
    {
      id: 'apex-rs',
      name: 'Apex RS',
      tagline: 'The Championship Pinnacle',
      description: 'State-of-the-art quad-motor hyper-chassis awarded exclusively to Grand Champions. Masterful power, braking, and cornering.',
      unlock: { type: 'championship', wins: 1, text: 'Complete Championship to Unlock' },
      stats: {
        topSpeed: 298,
        acceleration: 9.6,
        handling: 9.6,
        braking: 9.5,
        nitro: 9.6
      },
      visuals: {
        bodyColor: '#ffffff',
        accentColor: '#00f0ff',
        glowColor: 'rgba(0, 240, 255, 0.9)',
        stripes: '#38bdf8',
        windshield: 'rgba(5, 15, 25, 0.9)',
        tailLights: '#00f0ff',
        headlights: '#38bdf8',
        exhaustFlame: '#00f0ff',
        style: 'prototype'
      }
    }
  ];

  window.UR = window.UR || {};
  window.UR.CARS = CARS;
})();

