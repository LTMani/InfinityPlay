/**
 * Whack-a-Mole: Arcade Edition - Mole Archetypes & Character Renderer
 * Manages 7 distinct mole species with specialized attributes, hit points,
 * vector renderings, and behavioral properties.
 */

(function(window) {
  'use strict';

  const MOLE_TYPES = {
    normal: {
      id: 'normal',
      name: 'Normal Mole',
      hp: 1,
      scoreValue: 100,
      speedMultiplier: 1.0,
      color: '#78350f',
      accentColor: '#eab308',
      isDangerous: false,
      badge: 'NORMAL',
      desc: 'Standard yard mole. 1 hit required.'
    },
    golden: {
      id: 'golden',
      name: 'Golden Mole',
      hp: 1,
      scoreValue: 300,
      speedMultiplier: 1.25,
      color: '#d97706',
      accentColor: '#facc15',
      isDangerous: false,
      badge: 'GOLDEN',
      desc: 'Rare shimmering mole. Yields +300 points and combo energy!'
    },
    speed: {
      id: 'speed',
      name: 'Speed Mole',
      hp: 1,
      scoreValue: 200,
      speedMultiplier: 1.6,
      color: '#0284c7',
      accentColor: '#38bdf8',
      isDangerous: false,
      badge: 'SPEED',
      desc: 'Equipped with aviator goggles. Pops up and vanishes in a flash!'
    },
    armored: {
      id: 'armored',
      name: 'Armored Mole',
      hp: 2,
      scoreValue: 250,
      speedMultiplier: 0.85,
      color: '#475569',
      accentColor: '#94a3b8',
      isDangerous: false,
      badge: 'ARMORED (2 HITS)',
      desc: 'Wears a heavy steel mining helmet. Requires two mallet strikes!'
    },
    bonus: {
      id: 'bonus',
      name: 'Bonus Mole',
      hp: 1,
      scoreValue: 500,
      speedMultiplier: 1.1,
      color: '#be185d',
      accentColor: '#f472b6',
      isDangerous: false,
      badge: 'BONUS GEM',
      desc: 'Carries precious gems. High value +500 points!'
    },
    trick: {
      id: 'trick',
      name: 'Trick Mole',
      hp: 1,
      scoreValue: 150,
      speedMultiplier: 1.35,
      color: '#6b21a8',
      accentColor: '#c084fc',
      isDangerous: false,
      badge: 'TRICK',
      desc: 'Feints an emergence before darting. Tests true timing discipline.'
    },
    bomb: {
      id: 'bomb',
      name: 'Bomb Mole',
      hp: 1,
      scoreValue: -300,
      speedMultiplier: 0.9,
      color: '#18181b',
      accentColor: '#ef4444',
      isDangerous: true,
      badge: 'DANGER! BOMB',
      desc: 'Ticking explosive! Whacking it causes -300 pts and life loss!'
    }
  };

  const MoleManager = {
    types: MOLE_TYPES,

    getDef(type) {
      return MOLE_TYPES[type] || MOLE_TYPES.normal;
    },

    /**
     * Pick a mole type based on current world / level configuration and weightings
     */
    pickRandomType(allowedTypes = ['normal']) {
      if (!allowedTypes || allowedTypes.length === 0) return 'normal';
      if (allowedTypes.length === 1) return allowedTypes[0];

      // Default weights
      const weights = {
        normal: 60,
        golden: 12,
        speed: 16,
        armored: 14,
        bonus: 8,
        trick: 12,
        bomb: 14
      };

      const pool = [];
      allowedTypes.forEach(type => {
        const weight = weights[type] || 10;
        for (let i = 0; i < weight; i++) {
          pool.push(type);
        }
      });

      return pool[Math.floor(Math.random() * pool.length)];
    },

    /**
     * Generate detailed SVG markup for a mole
     */
    renderMoleSvg(type, currentHp = 1, isWhacked = false) {
      const def = this.getDef(type);

      if (type === 'bomb') {
        return `
          <svg viewBox="0 0 120 140" class="mole-svg mole-bomb ${isWhacked ? 'whacked' : ''}">
            <defs>
              <radialGradient id="bombGlow" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stop-color="#450a0a"/>
                <stop offset="60%" stop-color="#18181b"/>
                <stop offset="100%" stop-color="#09090b"/>
              </radialGradient>
            </defs>
            <!-- Fuse -->
            <path d="M60,40 Q75,20 85,15" fill="none" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
            <!-- Fuse Spark -->
            <circle cx="85" cy="15" r="7" fill="#facc15" class="fuse-spark"/>
            <circle cx="85" cy="15" r="4" fill="#ef4444"/>
            <!-- Bomb Body -->
            <circle cx="60" cy="85" r="45" fill="url(#bombGlow)" stroke="#ef4444" stroke-width="3"/>
            <!-- Cap -->
            <rect x="50" y="36" width="20" height="8" rx="2" fill="#71717a"/>
            <!-- Hazard Warning Skull / Cross -->
            <g transform="translate(60, 85)">
              <circle cx="0" cy="-6" r="14" fill="#ffffff"/>
              <circle cx="-5" cy="-8" r="3.5" fill="#000000"/>
              <circle cx="5" cy="-8" r="3.5" fill="#000000"/>
              <path d="M-6,4 L6,4 L4,10 L-4,10 Z" fill="#ffffff"/>
              <line x1="-14" y1="12" x2="14" y2="-4" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
              <line x1="-14" y1="-4" x2="14" y2="12" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            </g>
          </svg>
        `;
      }

      // Standard mole base colors
      let bodyColor = def.color;
      let snoutColor = '#fde68a';
      let hatMarkup = '';
      let accessoryMarkup = '';

      if (type === 'normal') {
        hatMarkup = `
          <!-- Miner Hard Hat -->
          <path d="M32,45 C32,25 44,16 60,16 C76,16 88,25 88,45 Z" fill="#eab308"/>
          <rect x="26" y="43" width="68" height="6" rx="3" fill="#ca8a04"/>
          <circle cx="60" cy="30" r="7" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        `;
      } else if (type === 'golden') {
        bodyColor = '#f59e0b';
        snoutColor = '#fef3c7';
        hatMarkup = `
          <!-- Golden Royal Crown -->
          <polygon points="34,44 30,18 46,30 60,10 74,30 90,18 86,44" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="60" cy="12" r="4.5" fill="#ef4444"/>
          <circle cx="30" cy="20" r="3.5" fill="#3b82f6"/>
          <circle cx="90" cy="20" r="3.5" fill="#10b981"/>
        `;
        accessoryMarkup = `
          <!-- Golden Sparkles -->
          <circle cx="20" cy="30" r="3" fill="#fef08a" class="gold-sparkle"/>
          <circle cx="100" cy="40" r="3.5" fill="#fef08a" class="gold-sparkle"/>
        `;
      } else if (type === 'speed') {
        hatMarkup = `
          <!-- Racing Helmet with Goggles -->
          <path d="M34,42 C34,22 46,14 60,14 C74,14 86,22 86,42 Z" fill="#0284c7"/>
          <rect x="30" y="40" width="60" height="12" rx="6" fill="#1e293b"/>
          <circle cx="48" cy="46" r="6.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="72" cy="46" r="6.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
        `;
      } else if (type === 'armored') {
        const isCracked = (currentHp === 1);
        hatMarkup = `
          <!-- Steel Armor Helmet -->
          <path d="M30,46 C30,20 44,12 60,12 C76,12 90,20 90,46 Z" fill="#64748b" stroke="#334155" stroke-width="2.5"/>
          <rect x="25" y="44" width="70" height="8" rx="3" fill="#475569"/>
          <!-- Metal rivets -->
          <circle cx="36" cy="30" r="2.5" fill="#cbd5e1"/>
          <circle cx="84" cy="30" r="2.5" fill="#cbd5e1"/>
          <rect x="45" y="32" width="30" height="6" rx="2" fill="#1e293b"/>
          ${isCracked ? '<path d="M50,16 L56,26 L52,34 L62,42" fill="none" stroke="#ef4444" stroke-width="2.5"/>' : ''}
        `;
      } else if (type === 'bonus') {
        accessoryMarkup = `
          <!-- Gem Bag -->
          <g transform="translate(76, 85)">
            <ellipse cx="14" cy="12" rx="14" ry="12" fill="#be185d" stroke="#f472b6" stroke-width="1.5"/>
            <polygon points="14,0 8,14 20,14" fill="#f472b6"/>
            <text x="14" y="16" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">💎</text>
          </g>
        `;
      } else if (type === 'trick') {
        accessoryMarkup = `
          <!-- Trick Masquerade Mask -->
          <path d="M36,52 Q48,46 60,52 Q72,46 84,52 Q72,62 60,56 Q48,62 36,52 Z" fill="#6b21a8" stroke="#c084fc" stroke-width="1.5"/>
        `;
      }

      return `
        <svg viewBox="0 0 120 140" class="mole-svg mole-${type} ${isWhacked ? 'whacked' : ''}">
          <!-- Mole Body -->
          <path d="M28,125 C28,60 38,36 60,36 C82,36 92,60 92,125 Z" fill="${bodyColor}" stroke="#291307" stroke-width="2"/>

          <!-- Hat / Headgear -->
          ${hatMarkup}

          <!-- Snout -->
          <ellipse cx="60" cy="76" rx="24" ry="16" fill="${snoutColor}"/>
          <!-- Nose -->
          <ellipse cx="60" cy="70" rx="9" ry="6" fill="#18181b"/>
          <ellipse cx="58" cy="68" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.6"/>

          <!-- Whiskers -->
          <line x1="38" y1="74" x2="22" y2="72" stroke="#18181b" stroke-width="1.5"/>
          <line x1="38" y1="78" x2="20" y2="80" stroke="#18181b" stroke-width="1.5"/>
          <line x1="82" y1="74" x2="98" y2="72" stroke="#18181b" stroke-width="1.5"/>
          <line x1="82" y1="78" x2="100" y2="80" stroke="#18181b" stroke-width="1.5"/>

          <!-- Eyes -->
          ${isWhacked ? `
            <!-- Whacked Dizzy Eyes (X) -->
            <g stroke="#18181b" stroke-width="2.5" stroke-linecap="round">
              <line x1="42" y1="52" x2="50" y2="60"/>
              <line x1="50" y1="52" x2="42" y2="60"/>
              <line x1="70" y1="52" x2="78" y2="60"/>
              <line x1="78" y1="52" x2="70" y2="60"/>
            </g>
          ` : `
            <!-- Alert Eyes -->
            <circle cx="46" cy="56" r="6" fill="#18181b"/>
            <circle cx="48" cy="54" r="2.2" fill="#ffffff"/>
            <circle cx="74" cy="56" r="6" fill="#18181b"/>
            <circle cx="76" cy="54" r="2.2" fill="#ffffff"/>
          `}

          <!-- Smile / Open Mouth -->
          ${isWhacked ? `
            <ellipse cx="60" cy="85" rx="6" ry="4" fill="#450a0a"/>
          ` : `
            <path d="M52,82 Q60,88 68,82" fill="none" stroke="#18181b" stroke-width="2" stroke-linecap="round"/>
            <rect x="57" y="82" width="6" height="4" fill="#ffffff" rx="1"/>
          `}

          <!-- Paws -->
          <ellipse cx="32" cy="115" rx="12" ry="8" fill="${snoutColor}" stroke="#291307" stroke-width="1.5"/>
          <ellipse cx="88" cy="115" rx="12" ry="8" fill="${snoutColor}" stroke="#291307" stroke-width="1.5"/>

          <!-- Accessories -->
          ${accessoryMarkup}
        </svg>
      `;
    }
  };

  window.MoleManager = MoleManager;
})(typeof window !== 'undefined' ? window : this);

