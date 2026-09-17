/**
 * CONNECTING Puzzle Game - Input Controller
 * Handles mouse and touch drag events with passive:false scroll prevention.
 */

(function() {
  'use strict';

  class InputController {
    constructor(canvas, renderer) {
      this.canvas = canvas;
      this.renderer = renderer;
      this.isInteracting = false;
      this.initEvents();
    }

    initEvents() {
      const cvs = this.canvas;

      // Mouse events
      cvs.addEventListener('mousedown', (e) => this.onPointerDown(e.clientX, e.clientY));
      window.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', () => this.onPointerUp());

      // Touch events with passive:false to prevent scrolling during game drag
      cvs.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          e.preventDefault();
          const t = e.touches[0];
          this.onPointerDown(t.clientX, t.clientY);
        }
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (this.isInteracting && e.touches.length > 0) {
          e.preventDefault();
          const t = e.touches[0];
          this.onPointerMove(t.clientX, t.clientY);
        }
      }, { passive: false });

      window.addEventListener('touchend', (e) => {
        if (this.isInteracting) {
          this.onPointerUp();
        }
      });

      window.addEventListener('touchcancel', (e) => {
        if (this.isInteracting) {
          this.onPointerUp();
        }
      });
    }

    onPointerDown(clientX, clientY) {
      if (!window.ConnectingEngine || window.ConnectingEngine.status !== 'PLAYING') return;

      const cell = this.renderer.screenToGrid(clientX, clientY);
      if (cell) {
        this.isInteracting = true;
        window.ConnectingAudio.ensureRunning();
        window.ConnectingEngine.startPath(cell.r, cell.c);
      }
    }

    onPointerMove(clientX, clientY) {
      if (!this.isInteracting || !window.ConnectingEngine) return;
      if (window.ConnectingEngine.status !== 'PLAYING') return;

      const cell = this.renderer.screenToGrid(clientX, clientY);
      if (cell) {
        window.ConnectingEngine.extendPath(cell.r, cell.c);
      }
    }

    onPointerUp() {
      if (!this.isInteracting) return;
      this.isInteracting = false;
      if (window.ConnectingEngine) {
        window.ConnectingEngine.endPath();
      }
    }
  }

  window.InputController = InputController;
})();
