/**
 * Color Match: Spectrum Arena - Color Catalog & Accessibility System
 * Centralized catalog of 24 distinct colors with rich visual properties,
 * perceived luminance calculations, and geometric symbols for color-blind accessibility.
 */

(function(window) {
  'use strict';

  const COLOR_CATALOG = [
    {
      id: 'crimson',
      name: 'Crimson',
      hex: '#dc2626',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      glow: 'rgba(239, 68, 68, 0.55)',
      textColor: '#ffffff',
      symbol: '◆',
      hue: 0,
      luminance: 0.28
    },
    {
      id: 'coral',
      name: 'Coral',
      hex: '#f87171',
      gradient: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
      glow: 'rgba(248, 113, 113, 0.55)',
      textColor: '#0f172a',
      symbol: '▲',
      hue: 0,
      luminance: 0.52
    },
    {
      id: 'ruby',
      name: 'Ruby',
      hex: '#991b1b',
      gradient: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
      glow: 'rgba(153, 27, 27, 0.55)',
      textColor: '#ffffff',
      symbol: '●',
      hue: 355,
      luminance: 0.16
    },
    {
      id: 'orange',
      name: 'Orange',
      hex: '#f97316',
      gradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
      glow: 'rgba(249, 115, 22, 0.55)',
      textColor: '#0f172a',
      symbol: '■',
      hue: 25,
      luminance: 0.46
    },
    {
      id: 'amber',
      name: 'Amber',
      hex: '#d97706',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
      glow: 'rgba(217, 119, 6, 0.55)',
      textColor: '#0f172a',
      symbol: '★',
      hue: 38,
      luminance: 0.44
    },
    {
      id: 'gold',
      name: 'Gold',
      hex: '#eab308',
      gradient: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
      glow: 'rgba(234, 179, 8, 0.55)',
      textColor: '#0f172a',
      symbol: '⬢',
      hue: 48,
      luminance: 0.58
    },
    {
      id: 'yellow',
      name: 'Yellow',
      hex: '#fef08a',
      gradient: 'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)',
      glow: 'rgba(254, 240, 138, 0.55)',
      textColor: '#0f172a',
      symbol: '☀',
      hue: 55,
      luminance: 0.88
    },
    {
      id: 'lime',
      name: 'Lime',
      hex: '#84cc16',
      gradient: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)',
      glow: 'rgba(132, 204, 22, 0.55)',
      textColor: '#0f172a',
      symbol: '✦',
      hue: 84,
      luminance: 0.55
    },
    {
      id: 'emerald',
      name: 'Emerald',
      hex: '#10b981',
      gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
      glow: 'rgba(16, 185, 129, 0.55)',
      textColor: '#0f172a',
      symbol: '✚',
      hue: 160,
      luminance: 0.45
    },
    {
      id: 'mint',
      name: 'Mint',
      hex: '#6ee7b7',
      gradient: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)',
      glow: 'rgba(110, 231, 183, 0.55)',
      textColor: '#0f172a',
      symbol: '▼',
      hue: 156,
      luminance: 0.72
    },
    {
      id: 'forest',
      name: 'Forest',
      hex: '#065f46',
      gradient: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)',
      glow: 'rgba(6, 95, 70, 0.55)',
      textColor: '#ffffff',
      symbol: '♣',
      hue: 165,
      luminance: 0.15
    },
    {
      id: 'teal',
      name: 'Teal',
      hex: '#14b8a6',
      gradient: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
      glow: 'rgba(20, 184, 166, 0.55)',
      textColor: '#0f172a',
      symbol: '⬟',
      hue: 174,
      luminance: 0.46
    },
    {
      id: 'cyan',
      name: 'Cyan',
      hex: '#06b6d4',
      gradient: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
      glow: 'rgba(6, 182, 212, 0.55)',
      textColor: '#0f172a',
      symbol: '◈',
      hue: 189,
      luminance: 0.51
    },
    {
      id: 'sky',
      name: 'Sky Blue',
      hex: '#38bdf8',
      gradient: 'linear-gradient(135deg, #7dd3fc 0%, #0284c7 100%)',
      glow: 'rgba(56, 189, 248, 0.55)',
      textColor: '#0f172a',
      symbol: '◎',
      hue: 199,
      luminance: 0.58
    },
    {
      id: 'sapphire',
      name: 'Sapphire',
      hex: '#2563eb',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      glow: 'rgba(37, 99, 235, 0.55)',
      textColor: '#ffffff',
      symbol: '♠',
      hue: 221,
      luminance: 0.27
    },
    {
      id: 'navy',
      name: 'Navy',
      hex: '#1e3a8a',
      gradient: 'linear-gradient(135deg, #1e40af 0%, #172554 100%)',
      glow: 'rgba(30, 58, 138, 0.55)',
      textColor: '#ffffff',
      symbol: '✖',
      hue: 224,
      luminance: 0.12
    },
    {
      id: 'indigo',
      name: 'Indigo',
      hex: '#6366f1',
      gradient: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
      glow: 'rgba(99, 102, 241, 0.55)',
      textColor: '#ffffff',
      symbol: '⬡',
      hue: 239,
      luminance: 0.32
    },
    {
      id: 'purple',
      name: 'Purple',
      hex: '#9333ea',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
      glow: 'rgba(147, 51, 234, 0.55)',
      textColor: '#ffffff',
      symbol: '⬒',
      hue: 271,
      luminance: 0.28
    },
    {
      id: 'violet',
      name: 'Violet',
      hex: '#7c3aed',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      glow: 'rgba(124, 58, 237, 0.55)',
      textColor: '#ffffff',
      symbol: '◬',
      hue: 263,
      luminance: 0.26
    },
    {
      id: 'magenta',
      name: 'Magenta',
      hex: '#c026d3',
      gradient: 'linear-gradient(135deg, #d946ef 0%, #a21caf 100%)',
      glow: 'rgba(192, 38, 211, 0.55)',
      textColor: '#ffffff',
      symbol: '♥',
      hue: 293,
      luminance: 0.31
    },
    {
      id: 'pink',
      name: 'Pink',
      hex: '#ec4899',
      gradient: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
      glow: 'rgba(236, 72, 153, 0.55)',
      textColor: '#ffffff',
      symbol: '♦',
      hue: 330,
      luminance: 0.38
    },
    {
      id: 'rose',
      name: 'Rose',
      hex: '#f43f5e',
      gradient: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
      glow: 'rgba(244, 63, 94, 0.55)',
      textColor: '#ffffff',
      symbol: '❖',
      hue: 349,
      luminance: 0.36
    },
    {
      id: 'silver',
      name: 'Silver',
      hex: '#94a3b8',
      gradient: 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)',
      glow: 'rgba(148, 163, 184, 0.55)',
      textColor: '#0f172a',
      symbol: '◖',
      hue: 215,
      luminance: 0.61
    },
    {
      id: 'charcoal',
      name: 'Charcoal',
      hex: '#334155',
      gradient: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
      glow: 'rgba(51, 65, 85, 0.55)',
      textColor: '#ffffff',
      symbol: '◗',
      hue: 217,
      luminance: 0.17
    }
  ];

  const ColorSystem = {
    catalog: COLOR_CATALOG,

    /**
     * Get a color entry by id
     */
    getById(id) {
      return COLOR_CATALOG.find(c => c.id === id) || null;
    },

    /**
     * Get a random color from the catalog
     */
    getRandom(excludeIds = []) {
      const available = COLOR_CATALOG.filter(c => !excludeIds.includes(c.id));
      if (available.length === 0) return COLOR_CATALOG[Math.floor(Math.random() * COLOR_CATALOG.length)];
      return available[Math.floor(Math.random() * available.length)];
    },

    /**
     * Pick N unique random colors, optionally excluding some IDs
     */
    getMultipleRandom(count, excludeIds = []) {
      const pool = COLOR_CATALOG.filter(c => !excludeIds.includes(c.id));
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    /**
     * Select distractors for a target color based on difficulty level
     * High difficulty picks closer hues or luminances
     */
    getDistractors(target, count, difficulty = 'easy') {
      const others = COLOR_CATALOG.filter(c => c.id !== target.id);

      if (difficulty === 'hard' || difficulty === 'expert') {
        // Sort by hue distance (smaller difference = more subtle/harder)
        others.sort((a, b) => {
          const distA = Math.abs(a.hue - target.hue);
          const distB = Math.abs(b.hue - target.hue);
          return distA - distB;
        });
        // Add slight randomness within top candidates
        const candidates = others.slice(0, Math.max(count + 2, 6));
        return candidates.sort(() => 0.5 - Math.random()).slice(0, count);
      }

      // Normal or easy: random distinct distractors
      return [...others].sort(() => 0.5 - Math.random()).slice(0, count);
    },

    /**
     * Get colors that are extremely similar in hue or tone (for Worlds 4 and 7)
     */
    getSimilarShades(target, count, maxDeltaHue = 40) {
      const others = COLOR_CATALOG.filter(c => c.id !== target.id);
      
      // Calculate angular hue distance (0-180 deg)
      others.sort((a, b) => {
        const diffA = Math.min(Math.abs(a.hue - target.hue), 360 - Math.abs(a.hue - target.hue));
        const diffB = Math.min(Math.abs(b.hue - target.hue), 360 - Math.abs(b.hue - target.hue));
        return diffA - diffB;
      });

      // Take closest candidates
      const candidates = others.slice(0, Math.max(count, 4));
      return candidates.sort(() => 0.5 - Math.random()).slice(0, count);
    },

    /**
     * Find the color with the highest perceived luminance
     */
    findBrightest(colors) {
      if (!colors || colors.length === 0) return null;
      return colors.reduce((brightest, curr) => (curr.luminance > brightest.luminance ? curr : brightest), colors[0]);
    },

    /**
     * Find the color with the lowest perceived luminance
     */
    findDarkest(colors) {
      if (!colors || colors.length === 0) return null;
      return colors.reduce((darkest, curr) => (curr.luminance < darkest.luminance ? curr : darkest), colors[0]);
    },

    /**
     * Calculate Euclidean color distance between two hex codes
     */
    hexDistance(hex1, hex2) {
      const rgb1 = this.hexToRgb(hex1);
      const rgb2 = this.hexToRgb(hex2);
      return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
      );
    },

    /**
     * Parse hex string to RGB object
     */
    hexToRgb(hex) {
      let cleanHex = hex.replace('#', '');
      if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
      }
      const num = parseInt(cleanHex, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    }
  };

  window.ColorSystem = ColorSystem;
})(typeof window !== 'undefined' ? window : this);

