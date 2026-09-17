// CameraManager.js - Dynamic Tabletop Camera with Smooth Follow, Zoom, and Orbit Controls

import * as THREE from 'three';

export class CameraManager {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // View presets
    this.presets = {
      tabletop: {
        pos: new THREE.Vector3(1.5, 15, 14),
        lookAt: new THREE.Vector3(1.0, 0.2, 0.2)
      },
      topDown: {
        pos: new THREE.Vector3(0, 18.5, 0.2),
        lookAt: new THREE.Vector3(0, 0, 0)
      },
      cinematic: {
        pos: new THREE.Vector3(9, 7.5, 12),
        lookAt: new THREE.Vector3(0, 0.5, 0)
      }
    };

    this.currentPreset = 'tabletop';

    // Current and target camera states
    this.currentPos = this.presets.tabletop.pos.clone();
    this.targetPos = this.presets.tabletop.pos.clone();
    this.currentLookAt = this.presets.tabletop.lookAt.clone();
    this.targetLookAt = this.presets.tabletop.lookAt.clone();

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentLookAt);

    // Orbit/Pan/Zoom state
    this.isUserInteracting = false;
    this.isTransitioning = false;
    this.transitionStartTime = 0;
    this.transitionDuration = 1000;
    this.startPos = this.currentPos.clone();
    this.startLookAt = this.currentLookAt.clone();

    // Mouse drag state
    this.isDragging = false;
    this.previousMouse = { x: 0, y: 0 };
    this.spherical = new THREE.Spherical(20, Math.PI / 3.2, 0);

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Pointer drag for rotating camera around board
    this.domElement.addEventListener('pointerdown', (e) => {
      // Only drag if not clicking on UI
      if (e.target.closest('#ui-container') && !e.target.closest('#canvas-container')) return;
      this.isDragging = true;
      this.previousMouse.x = e.clientX;
      this.previousMouse.y = e.clientY;
      this.isUserInteracting = true;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMouse.x;
      const deltaY = e.clientY - this.previousMouse.y;
      this.previousMouse.x = e.clientX;
      this.previousMouse.y = e.clientY;

      // Rotate camera around targetLookAt
      const rotSpeed = 0.005;
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.targetLookAt);
      this.spherical.setFromVector3(offset);

      this.spherical.theta -= deltaX * rotSpeed;
      this.spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.08, this.spherical.phi - deltaY * rotSpeed));

      offset.setFromSpherical(this.spherical);
      this.targetPos.addVectors(this.targetLookAt, offset);
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Mouse Wheel / Pinch Zoom
    this.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.012;
      const offset = new THREE.Vector3().subVectors(this.targetPos, this.targetLookAt);
      const newLen = THREE.MathUtils.clamp(offset.length() + zoomFactor, 7.5, 30);
      offset.setLength(newLen);
      this.targetPos.addVectors(this.targetLookAt, offset);
    }, { passive: false });
  }

  setPreset(presetName, duration = 1000) {
    if (!this.presets[presetName]) return;
    this.currentPreset = presetName;
    const preset = this.presets[presetName];

    this.transitionTo(preset.pos, preset.lookAt, duration);
  }

  focusOnPosition(pos3D, duration = 800) {
    const focusLookAt = new THREE.Vector3(pos3D.x, pos3D.y + 0.3, pos3D.z);
    // Move camera closer angled above the target
    const cameraOffset = new THREE.Vector3(2.5, 8.0, 7.0);
    const focusPos = new THREE.Vector3().addVectors(focusLookAt, cameraOffset);

    this.transitionTo(focusPos, focusLookAt, duration);
  }

  returnToBoard(duration = 900) {
    const preset = this.presets[this.currentPreset] || this.presets.tabletop;
    this.transitionTo(preset.pos, preset.lookAt, duration);
  }

  transitionTo(pos, lookAt, duration = 1000) {
    this.isTransitioning = true;
    this.transitionStartTime = performance.now();
    this.transitionDuration = duration;
    this.startPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);
    this.targetPos.copy(pos);
    this.targetLookAt.copy(lookAt);
  }

  update(now) {
    if (this.isTransitioning) {
      const elapsed = now - this.transitionStartTime;
      const t = Math.min(1.0, elapsed / this.transitionDuration);
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - t, 3);

      this.camera.position.lerpVectors(this.startPos, this.targetPos, ease);
      this.currentLookAt.lerpVectors(this.startLookAt, this.targetLookAt, ease);
      this.camera.lookAt(this.currentLookAt);

      if (t >= 1.0) {
        this.isTransitioning = false;
      }
    } else {
      // Gentle damping towards target during dragging or zooming
      this.camera.position.lerp(this.targetPos, 0.12);
      this.currentLookAt.lerp(this.targetLookAt, 0.12);
      this.camera.lookAt(this.currentLookAt);
    }
  }
}
