/**
 * CONNECTING Puzzle Game - HTML5 Canvas Renderer
 * High-DPI sharp rendering, glowing pipes, cylindrical 3D gloss, colorblind symbols.
 */

(function() {
  'use strict';

  // Geometric symbols for colorblind mode
  const COLORBLIND_SYMBOLS = {
    red: '▲',
    blue: '■',
    green: '●',
    yellow: '★',
    purple: '◆',
    orange: '⬟',
    cyan: '✚',
    pink: '✿',
    silver: '⬢',
    maroon: '▼'
  };

  class BoardRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.dpr = window.devicePixelRatio || 1;
      this.width = 0;
      this.height = 0;
      this.cellSize = 0;
      this.padding = 16;
      this.gridSize = 5;
      this.pulsePhase = 0;
      this.animId = null;

      this.startPulseAnimation();
    }

    startPulseAnimation() {
      const step = () => {
        this.pulsePhase = (this.pulsePhase + 0.05) % (Math.PI * 2);
        this.render();
        this.animId = requestAnimationFrame(step);
      };
      this.animId = requestAnimationFrame(step);
    }

    destroy() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    resize(pixelSize) {
      this.dpr = window.devicePixelRatio || 1;
      this.width = pixelSize;
      this.height = pixelSize;

      this.canvas.width = Math.floor(pixelSize * this.dpr);
      this.canvas.height = Math.floor(pixelSize * this.dpr);
      this.canvas.style.width = `${pixelSize}px`;
      this.canvas.style.height = `${pixelSize}px`;

      this.ctx.scale(this.dpr, this.dpr);
      this.render();
    }

    getCellCenter(r, c) {
      const x = this.padding + c * this.cellSize + this.cellSize / 2;
      const y = this.padding + r * this.cellSize + this.cellSize / 2;
      return { x, y };
    }

    screenToGrid(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left - this.padding;
      const y = clientY - rect.top - this.padding;

      if (x < 0 || y < 0) return null;

      const c = Math.floor(x / this.cellSize);
      const r = Math.floor(y / this.cellSize);

      if (r < 0 || r >= this.gridSize || c < 0 || c >= this.gridSize) return null;

      return { r, c };
    }

    render() {
      if (!this.ctx || !window.ConnectingEngine) return;
      const engine = window.ConnectingEngine;
      const level = engine.currentLevel;
      if (!level) return;

      const size = level.size;
      this.gridSize = size;
      const boardPlayableArea = this.width - this.padding * 2;
      this.cellSize = boardPlayableArea / size;

      const ctx = this.ctx;
      ctx.save();
      ctx.clearRect(0, 0, this.width, this.height);

      // 1. Draw Board Background
      this.drawBoardBackground(ctx, boardPlayableArea);

      // 2. Draw Grid Cells & Cell Dividers
      this.drawGrid(ctx, size);

      // 3. Draw Paths (Pipes)
      this.drawPaths(ctx, level, engine);

      // 4. Draw Endpoints (Nodes)
      this.drawEndpoints(ctx, level, engine);

      ctx.restore();
    }

    drawBoardBackground(ctx, areaSize) {
      ctx.save();
      const pad = this.padding;
      const rad = 14;

      // Rounded dark board container
      ctx.beginPath();
      ctx.roundRect(pad, pad, areaSize, areaSize, rad);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Outer border glow
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();
      ctx.restore();
    }

    drawGrid(ctx, size) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';

      for (let i = 1; i < size; i++) {
        // Vertical lines
        const x = this.padding + i * this.cellSize;
        ctx.beginPath();
        ctx.moveTo(x, this.padding);
        ctx.lineTo(x, this.padding + size * this.cellSize);
        ctx.stroke();

        // Horizontal lines
        const y = this.padding + i * this.cellSize;
        ctx.beginPath();
        ctx.moveTo(this.padding, y);
        ctx.lineTo(this.padding + size * this.cellSize, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawPaths(ctx, level, engine) {
      const paths = engine.paths;
      const isColorblind = window.ConnectingStorage.getSettings().colorblind;
      const pipeWidth = this.cellSize * 0.38;
      const innerCoreWidth = this.cellSize * 0.12;

      for (const pair of level.pairs) {
        const path = paths[pair.id];
        if (!path || path.length < 2) continue;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer Neon Glow Pass
        ctx.beginPath();
        const start = this.getCellCenter(path[0].r, path[0].c);
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i < path.length; i++) {
          const pt = this.getCellCenter(path[i].r, path[i].c);
          ctx.lineTo(pt.x, pt.y);
        }

        ctx.shadowColor = pair.color;
        ctx.shadowBlur = 12;
        ctx.strokeStyle = pair.color;
        ctx.lineWidth = pipeWidth;
        ctx.stroke();

        // Inner Cylindrical Highlight Pass (Gloss effect)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = innerCoreWidth;
        ctx.stroke();

        ctx.restore();

        // If currently dragging this path, draw glowing active tip
        if (engine.isDragging && engine.activeColorId === pair.id && path.length > 0) {
          const tip = path[path.length - 1];
          const center = this.getCellCenter(tip.r, tip.c);
          const pulseR = this.cellSize * 0.22 + Math.sin(this.pulsePhase * 2) * 2;

          ctx.save();
          ctx.beginPath();
          ctx.arc(center.x, center.y, pulseR, 0, Math.PI * 2);
          ctx.fillStyle = pair.color;
          ctx.shadowColor = pair.color;
          ctx.shadowBlur = 15;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(center.x, center.y, pulseR * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();
        }
      }
    }

    drawEndpoints(ctx, level, engine) {
      const isColorblind = window.ConnectingStorage.getSettings().colorblind;
      const nodeRadius = this.cellSize * 0.36;
      const innerRadius = this.cellSize * 0.16;

      for (const pair of level.pairs) {
        const isCompleted = engine.isPathCompleted(pair.id);
        const symbol = COLORBLIND_SYMBOLS[pair.id] || '●';

        [pair.start, pair.end].forEach((ep) => {
          const center = this.getCellCenter(ep.r, ep.c);

          ctx.save();

          // Completed Pulse / Outer Ring
          if (isCompleted) {
            const glowRing = nodeRadius + 3 + Math.sin(this.pulsePhase) * 1.5;
            ctx.beginPath();
            ctx.arc(center.x, center.y, glowRing, 0, Math.PI * 2);
            ctx.strokeStyle = pair.color;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = pair.color;
            ctx.shadowBlur = 10;
            ctx.stroke();
          }

          // Main Colored Circle
          ctx.beginPath();
          ctx.arc(center.x, center.y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = pair.color;
          ctx.shadowColor = pair.color;
          ctx.shadowBlur = isCompleted ? 14 : 6;
          ctx.fill();

          // Inner Highlight or Symbol
          if (isColorblind) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.floor(this.cellSize * 0.34)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, center.x, center.y + 1);
          } else {
            // Bright Inner Dot
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(center.x, center.y, innerRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fill();

            // Completed Checkmark indicator in center
            if (isCompleted) {
              ctx.fillStyle = '#0f172a';
              ctx.font = `bold ${Math.floor(this.cellSize * 0.22)}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('✓', center.x, center.y + 1);
            }
          }

          ctx.restore();
        });
      }
    }
  }

  window.BoardRenderer = BoardRenderer;
})();
