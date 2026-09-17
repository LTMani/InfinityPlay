// TextureGenerator.js - Procedural Canvas PBR Textures for Photorealistic Board & Environment

import * as THREE from 'three';
import { BOARD_CONFIG, getSquareCoordinates } from '../game/BoardData.js';

export class TextureGenerator {
  /**
   * Generates a high-resolution wood grain texture with natural fibers and color depth.
   */
  static createWoodTexture(baseColor = '#4a2311', grainColor = '#2b1206', width = 1024, height = 1024, rings = 28) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Base background
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // Natural wood grain rings and fibers
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Parse base and grain colors
    const c1 = new THREE.Color(baseColor);
    const c2 = new THREE.Color(grainColor);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Stretched coordinates for linear wood grain
        const nx = x * 0.003;
        const ny = y * 0.04;
        const dist = Math.sqrt(nx * nx + ny * ny) * rings;
        const grain = Math.sin(dist + Math.sin(nx * 8 + ny * 2) * 2.0);
        
        // Fine fiber noise
        const fiber = (Math.random() * 0.12 - 0.06);
        const t = Math.max(0, Math.min(1, (grain * 0.5 + 0.5) + fiber));

        const r = (c1.r * (1 - t) + c2.r * t) * 255;
        const g = (c1.g * (1 - t) + c2.g * t) * 255;
        const b = (c1.b * (1 - t) + c2.b * t) * 255;

        const idx = (y * width + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * Generates a wood bump/normal map for realistic surface relief
   */
  static createWoodBumpMap(width = 512, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 600; i++) {
      const y = Math.random() * height;
      const h = Math.random() * 2 + 1;
      const alpha = Math.random() * 0.35 + 0.05;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, y, width, h);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * Generates the master 10x10 board face canvas:
   * Alternating inlaid luxury wooden tiles, gold inlaid grooves, and clear engraved numbers 1-100.
   */
  static createBoardFaceTexture(width = 2048, height = 2048) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const gridSize = BOARD_CONFIG.gridSize;
    const cellW = width / gridSize;
    const cellH = height / gridSize;

    // Outer warm border
    ctx.fillStyle = '#261208';
    ctx.fillRect(0, 0, width, height);

    // Render 100 individual inlaid squares
    for (let sq = 1; sq <= 100; sq++) {
      const sqIndex = sq - 1;
      const row = Math.floor(sqIndex / gridSize);
      let col = sqIndex % gridSize;
      if (row % 2 === 1) col = gridSize - 1 - col;

      // Board coordinates: row 0 is at the bottom of the board (highest Y on 2D canvas)
      // row 9 is at the top of the board (lowest Y on 2D canvas)
      const canvasRow = gridSize - 1 - row;
      const x = col * cellW;
      const y = canvasRow * cellH;

      // Alternating wood tones: rich honey maple vs golden amber walnut
      const isAlt = (row + col) % 2 === 0;
      const grad = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
      if (isAlt) {
        grad.addColorStop(0, '#e8cfad');
        grad.addColorStop(1, '#d8bc95');
      } else {
        grad.addColorStop(0, '#f2dec2');
        grad.addColorStop(1, '#e3c9a6');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);

      // Subtle gold bevel border for each square
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 3, y + 3, cellW - 6, cellH - 6);

      // Subtle corner flourish on special squares (1, 100, ladder starts, snake heads)
      if (sq === 1) {
        ctx.fillStyle = 'rgba(46, 125, 50, 0.18)';
        ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
      } else if (sq === 100) {
        ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
        ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
      }

      // Draw clearly readable square number
      ctx.save();
      const fontSize = Math.floor(cellH * 0.28);
      ctx.font = `bold ${fontSize}px "Outfit", "Segoe UI", Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Slight drop shadow for legibility
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(sq.toString(), x + cellW / 2 + 1, y + cellH / 2 + 1);

      // Main number color: dark engraved rosewood with gold tint
      if (sq === 100) {
        ctx.fillStyle = '#9e6200';
      } else if (sq === 1) {
        ctx.fillStyle = '#1b5e20';
      } else {
        ctx.fillStyle = '#3c2011';
      }
      ctx.fillText(sq.toString(), x + cellW / 2, y + cellH / 2);

      // Start / Finish label badges
      if (sq === 1) {
        ctx.font = `bold ${Math.floor(fontSize * 0.42)}px "Outfit", sans-serif`;
        ctx.fillStyle = '#1b5e20';
        ctx.fillText('START', x + cellW / 2, y + cellH * 0.82);
      } else if (sq === 100) {
        ctx.font = `bold ${Math.floor(fontSize * 0.42)}px "Outfit", sans-serif`;
        ctx.fillStyle = '#b7791f';
        ctx.fillText('FINISH ★', x + cellW / 2, y + cellH * 0.82);
      }

      ctx.restore();
    }

    // Outer gold trim around the entire 10x10 field
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }

  /**
   * Generates a reptile scales texture for the 3D snakes
   */
  static createSnakeScalesTexture(baseHex = '#1c4a27', highlightHex = '#eab308', width = 512, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, width, height);

    // Diamond scale lattice
    const scaleSize = 16;
    ctx.lineWidth = 1.5;

    for (let y = 0; y < height; y += scaleSize) {
      for (let x = 0; x < width; x += scaleSize) {
        const cx = x + (Math.floor(y / scaleSize) % 2 === 0 ? scaleSize / 2 : 0);
        const cy = y;

        // Scale diamond
        ctx.beginPath();
        ctx.moveTo(cx, cy - scaleSize / 2);
        ctx.lineTo(cx + scaleSize / 2, cy);
        ctx.lineTo(cx, cy + scaleSize / 2);
        ctx.lineTo(cx - scaleSize / 2, cy);
        ctx.closePath();

        // Shading gradient
        const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, scaleSize / 2);
        grad.addColorStop(0, (x + y) % (scaleSize * 4) === 0 ? highlightHex : '#2d6a4f');
        grad.addColorStop(0.7, baseHex);
        grad.addColorStop(1, '#081c15');

        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 12);
    return texture;
  }

  /**
   * Generates vintage luxury board game box lid art
   */
  static createGameBoxTexture(width = 1024, height = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Royal deep navy/burgundy leather texture
    ctx.fillStyle = '#1c1514';
    ctx.fillRect(0, 0, width, height);

    // Ornamental gold filigree frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Corner rosettes
    const corners = [
      [45, 45],
      [width - 45, 45],
      [45, height - 45],
      [width - 45, height - 45]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#d4af37';
      ctx.fill();
    });

    // Box Title
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#f5e6be';
    ctx.font = 'bold 72px "Cinzel", "Times New Roman", serif';
    ctx.fillText('SNAKES & LADDERS', width / 2, height * 0.4);

    ctx.font = 'italic 28px "Georgia", serif';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('THE CLASSIC GAME OF LUCK', width / 2, height * 0.48);

    ctx.font = 'bold 20px "Cinzel", serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
    ctx.fillText('DELUXE HERITAGE EDITION', width / 2, height * 0.58);

    // Embellishment divider
    ctx.beginPath();
    ctx.moveTo(width * 0.25, height * 0.52);
    ctx.lineTo(width * 0.75, height * 0.52);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}
