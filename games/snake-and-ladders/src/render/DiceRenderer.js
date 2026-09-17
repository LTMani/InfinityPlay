// DiceRenderer.js - 3D Realistic Ivory Tumbling Die with Pip Textures and Physics Settle

import * as THREE from 'three';

export class DiceRenderer {
  constructor(scene, boardRenderer, onDiceClick) {
    this.scene = scene;
    this.boardRenderer = boardRenderer;
    this.onDiceClick = onDiceClick;

    this.trayCenter = this.boardRenderer.getDiceTrayCenter();
    this.dieSize = 0.85;

    this.dieMesh = null;
    this.isRolling = false;
    this.rollStartTime = 0;
    this.rollDuration = 1200; // ms

    // Animation physics state
    this.currentPos = new THREE.Vector3(this.trayCenter.x, this.trayCenter.y + this.dieSize / 2, this.trayCenter.z);
    this.targetQuat = new THREE.Quaternion();
    this.settleStartQuat = null;
    this.spinVel = new THREE.Vector3();
    this.landingPos = this.currentPos.clone();
    this.startPos = this.currentPos.clone();
    this.apexHeight = 2.8;

    this.createDie();
    this.setupInteractivity();
  }

  /**
   * Generates a canvas texture for a single die face with indented pips
   */
  createFaceTexture(pipCount) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Ivory bone base with subtle vignette
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 160);
    grad.addColorStop(0, '#faf7ee');
    grad.addColorStop(0.85, '#ede6d4');
    grad.addColorStop(1, '#dfd6bf');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Subtle edge bevel
    ctx.strokeStyle = 'rgba(180, 165, 140, 0.4)';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 246, 246);

    // Pip coordinates mapping (normalized 0 to 256)
    const pips = {
      1: [[128, 128]],
      2: [[75, 75], [181, 181]],
      3: [[75, 75], [128, 128], [181, 181]],
      4: [[75, 75], [181, 75], [75, 181], [181, 181]],
      5: [[75, 75], [181, 75], [128, 128], [75, 181], [181, 181]],
      6: [[75, 70], [181, 70], [75, 128], [181, 128], [75, 186], [181, 186]]
    };

    const dotRadius = pipCount === 1 ? 26 : 20;
    const coords = pips[pipCount] || [];

    coords.forEach(([px, py]) => {
      // Indented 3D shadow for pip
      ctx.beginPath();
      ctx.arc(px, py + 2, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();

      // Deep dark pip cavity (Face 1 is imperial burgundy red, others are deep charcoal)
      ctx.beginPath();
      ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
      const pipGrad = ctx.createRadialGradient(px - 3, py - 3, 2, px, py, dotRadius);
      if (pipCount === 1) {
        pipGrad.addColorStop(0, '#b71c1c');
        pipGrad.addColorStop(1, '#5f0909');
      } else {
        pipGrad.addColorStop(0, '#2b2b2b');
        pipGrad.addColorStop(1, '#111111');
      }
      ctx.fillStyle = pipGrad;
      ctx.fill();

      // Specular highlight on pip rim
      ctx.beginPath();
      ctx.arc(px - 4, py - 4, dotRadius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  createDie() {
    const geo = new THREE.BoxGeometry(this.dieSize, this.dieSize, this.dieSize);

    // Standard dice arrangement: opposite sides sum to 7
    // Three.js BoxGeometry material indices:
    // 0: +X (Right) -> 2
    // 1: -X (Left)  -> 5
    // 2: +Y (Top)   -> 1
    // 3: -Y (Bottom)-> 6
    // 4: +Z (Front) -> 3
    // 5: -Z (Back)  -> 4
    const faces = [2, 5, 1, 6, 3, 4];
    const materials = faces.map(pip => {
      return new THREE.MeshStandardMaterial({
        map: this.createFaceTexture(pip),
        roughness: 0.22,
        metalness: 0.05
      });
    });

    this.dieMesh = new THREE.Mesh(geo, materials);
    this.dieMesh.castShadow = true;
    this.dieMesh.receiveShadow = true;
    this.dieMesh.position.copy(this.currentPos);
    this.dieMesh.quaternion.copy(this.getFaceUpQuaternion(1));
    this.scene.add(this.dieMesh);
  }

  /**
   * Returns target quaternion to make the desired face (1-6) face strictly upwards (+Y)
   * while resting flat on the table, plus a natural slight random heading around the vertical Y axis
   */
  getFaceUpQuaternion(value) {
    const baseEuler = new THREE.Euler();
    switch (value) {
      case 1: // Face 2 (+Y) -> default up
        baseEuler.set(0, 0, 0);
        break;
      case 6: // Face 3 (-Y) -> rotate 180° around X
        baseEuler.set(Math.PI, 0, 0);
        break;
      case 2: // Face 0 (+X) -> rotate +90° around Z to bring +X up to +Y
        baseEuler.set(0, 0, Math.PI / 2);
        break;
      case 5: // Face 1 (-X) -> rotate -90° around Z to bring -X up to +Y
        baseEuler.set(0, 0, -Math.PI / 2);
        break;
      case 3: // Face 4 (+Z) -> rotate -90° around X to bring +Z up to +Y
        baseEuler.set(-Math.PI / 2, 0, 0);
        break;
      case 4: // Face 5 (-Z) -> rotate +90° around X to bring -Z up to +Y
        baseEuler.set(Math.PI / 2, 0, 0);
        break;
      default:
        baseEuler.set(0, 0, 0);
    }

    const baseQuat = new THREE.Quaternion().setFromEuler(baseEuler);
    // Tabletop heading slant around world Y axis (0, 1, 0)
    const randomHeading = (Math.random() - 0.5) * 0.45;
    const headingQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), randomHeading);
    // Multiplying headingQuat * baseQuat leaves the normal (0, 1, 0) pointing strictly up (+Y)
    return headingQuat.multiply(baseQuat);
  }

  getFaceUpRotation(value) {
    const quat = this.getFaceUpQuaternion(value);
    const euler = new THREE.Euler();
    euler.setFromQuaternion(quat);
    return euler;
  }

  roll(targetValue, onComplete = null) {
    if (this.isRolling) return;
    this.isRolling = true;
    this.rollStartTime = performance.now();
    this.targetQuat = this.getFaceUpQuaternion(targetValue);
    this.settleStartQuat = null;

    // Random angular tumbling velocity
    this.spinVel.set(
      (Math.random() * 10 + 14) * (Math.random() < 0.5 ? 1 : -1),
      (Math.random() * 8 + 10) * (Math.random() < 0.5 ? 1 : -1),
      (Math.random() * 10 + 14) * (Math.random() < 0.5 ? 1 : -1)
    );

    // Subtle landing variation within the dice tray
    this.landingPos.set(
      this.trayCenter.x + (Math.random() - 0.5) * 0.6,
      this.trayCenter.y + this.dieSize / 2,
      this.trayCenter.z + (Math.random() - 0.5) * 0.6
    );

    this.startPos.copy(this.dieMesh.position);
    this.apexHeight = 2.6 + Math.random() * 0.6;
    this.onRollComplete = onComplete;
  }

  setupInteractivity() {
    window.addEventListener('click', (e) => {
      // Check if click was on 3D die
      if (!this.onDiceClick || this.isRolling) return;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      const camera = this.scene.userData.camera;
      if (!camera) return;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(this.dieMesh);
      if (intersects.length > 0) {
        this.onDiceClick();
      }
    });
  }

  update(now) {
    if (!this.isRolling) return;

    const elapsed = now - this.rollStartTime;
    const progress = Math.min(1.0, elapsed / this.rollDuration);

    if (progress < 1.0) {
      // Physical parabolic toss with multiple damping bounces
      let height = 0;
      if (progress < 0.5) {
        const t = progress / 0.5;
        height = Math.sin(t * Math.PI) * this.apexHeight;
      } else if (progress < 0.78) {
        const t = (progress - 0.5) / 0.28;
        height = Math.sin(t * Math.PI) * (this.apexHeight * 0.28);
      } else {
        const t = (progress - 0.78) / 0.22;
        height = Math.sin(t * Math.PI) * (this.apexHeight * 0.06);
      }

      const posT = 1 - Math.pow(1 - progress, 2);
      this.dieMesh.position.x = THREE.MathUtils.lerp(this.startPos.x, this.landingPos.x, posT);
      this.dieMesh.position.z = THREE.MathUtils.lerp(this.startPos.z, this.landingPos.z, posT);
      this.dieMesh.position.y = this.landingPos.y + height;

      // Tumbling rotation & smooth quaternion slerp settle
      if (progress < 0.7) {
        const dt = 0.016;
        const tumbleEuler = new THREE.Euler(
          this.spinVel.x * dt,
          this.spinVel.y * dt,
          this.spinVel.z * dt
        );
        const tumbleQuat = new THREE.Quaternion().setFromEuler(tumbleEuler);
        this.dieMesh.quaternion.multiply(tumbleQuat);
      } else {
        if (!this.settleStartQuat) {
          this.settleStartQuat = this.dieMesh.quaternion.clone();
        }
        const settleProgress = (progress - 0.7) / 0.3;
        const ease = 1 - Math.pow(1 - settleProgress, 3);
        this.dieMesh.quaternion.slerpQuaternions(this.settleStartQuat, this.targetQuat, ease);
      }
    } else {
      // Finished rolling: cleanly lock onto exact target face and position
      this.isRolling = false;
      this.dieMesh.position.copy(this.landingPos);
      this.dieMesh.quaternion.copy(this.targetQuat);

      if (this.onRollComplete) {
        const cb = this.onRollComplete;
        this.onRollComplete = null;
        cb();
      }
    }
  }
}
