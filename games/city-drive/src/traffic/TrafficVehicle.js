/**
 * TrafficVehicle.js
 * Procedural 3D model and autonomous driving behaviors for ambient city traffic.
 * Supports Sedans, Taxis, and Delivery Vans with lane following, obstacle avoidance,
 * turn signals, and reactive brake lights.
 */

import * as THREE from 'three';

export class TrafficVehicle {
  /**
   * @param {THREE.Scene} scene
   * @param {string} type 'sedan' | 'taxi' | 'van'
   * @param {number} color Hex color
   */
  constructor(scene, type = 'sedan', color = 0x3b82f6) {
    this.scene = scene;
    this.type = type;
    this.color = color;

    // Root Three.js container
    this.root = new THREE.Group();
    this.root.name = `Traffic_${type}_${Math.random().toString(36).substr(2, 5)}`;

    // Chassis group
    this.chassis = new THREE.Group();
    this.root.add(this.chassis);

    // Dimensions
    this.width = 1.84;
    this.length = 4.2;
    this.height = 1.35;
    this.hw = this.width / 2;
    this.hl = this.length / 2;

    if (type === 'taxi') {
      this.length = 4.3;
      this.hl = this.length / 2;
    } else if (type === 'van') {
      this.width = 1.96;
      this.length = 4.8;
      this.height = 2.05;
      this.hw = this.width / 2;
      this.hl = this.length / 2;
    }

    // Wheel assemblies for spin and steer animation
    this.steerableWheelGroups = [];
    this.rotatingWheelMeshes = [];
    this.wheelRotationAccumulator = 0;
    this.wheelRadius = 0.34;

    // Lights
    this.brakeLightMat = null;
    this.turnSignalLeftMat = null;
    this.turnSignalRightMat = null;
    this.headlightMat = null;

    // AI & Kinematics State
    this.position = new THREE.Vector3(0, 0, 0);
    this.speed = 18; // m/s (~65 km/h)
    this.targetSpeed = 18;
    this.maxSpeed = 24;
    this.minSpeed = 0;
    this.accel = 7.0;
    this.brakeForce = 18.0;

    this.currentLaneIndex = 1;
    this.targetLaneIndex = 1;
    this.isChangingLanes = false;
    this.laneChangeTimer = 0;
    this.laneChangeDuration = 1.8;
    this.laneChangeStartX = 0;

    this.lanePositions = [-5.7, -1.9, 1.9, 5.7];

    this.turnSignal = 0; // -1: left, 1: right, 0: off
    this.signalBlinkTimer = 0;
    this.signalBlinkState = false;

    this.isBraking = false;
    this.isStopped = false;
    this.isActive = true;

    this._buildModel();
    this.scene.add(this.root);
  }

  _buildModel() {
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.3,
      metalness: 0.55
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      metalness: 0.2
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.95
    });

    this.headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.4,
      roughness: 0.2
    });

    this.brakeLightMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      emissive: 0xef4444,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });

    this.turnSignalLeftMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.0
    });

    this.turnSignalRightMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.0
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
      metalness: 0.1
    });

    if (this.type === 'van') {
      // ----------------------------------------------------
      // Delivery Van Model
      // ----------------------------------------------------
      // Lower van chassis
      const baseGeo = new THREE.BoxGeometry(this.width, 0.6, this.length);
      const baseMesh = new THREE.Mesh(baseGeo, bodyMat);
      baseMesh.position.set(0, 0.55, 0);
      baseMesh.castShadow = true;
      this.chassis.add(baseMesh);

      // Van high cargo box
      const cargoGeo = new THREE.BoxGeometry(this.width * 0.96, 1.25, this.length * 0.68);
      const cargoMesh = new THREE.Mesh(cargoGeo, bodyMat);
      cargoMesh.position.set(0, 1.4, 0.55);
      cargoMesh.castShadow = true;
      this.chassis.add(cargoMesh);

      // Cabin / windshield
      const cabinGeo = new THREE.BoxGeometry(this.width * 0.94, 0.9, this.length * 0.28);
      const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
      cabinMesh.position.set(0, 1.25, -1.35);
      cabinMesh.castShadow = true;
      this.chassis.add(cabinMesh);

      // Front bumper
      const bumperGeo = new THREE.BoxGeometry(this.width * 1.02, 0.3, 0.35);
      const bumperMesh = new THREE.Mesh(bumperGeo, darkMat);
      bumperMesh.position.set(0, 0.35, -this.hl - 0.1);
      bumperMesh.castShadow = true;
      this.chassis.add(bumperMesh);
    } else {
      // ----------------------------------------------------
      // Sedan / Taxi Model
      // ----------------------------------------------------
      // Lower body
      const baseGeo = new THREE.BoxGeometry(this.width, 0.52, this.length);
      const baseMesh = new THREE.Mesh(baseGeo, bodyMat);
      baseMesh.position.set(0, 0.5, 0);
      baseMesh.castShadow = true;
      this.chassis.add(baseMesh);

      // Cabin / greenhouse
      const cabinGeo = new THREE.BoxGeometry(this.width * 0.82, 0.52, this.length * 0.52);
      const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
      cabinMesh.position.set(0, 0.98, 0.05);
      cabinMesh.castShadow = true;
      this.chassis.add(cabinMesh);

      // Roof panel
      const roofGeo = new THREE.BoxGeometry(this.width * 0.78, 0.06, this.length * 0.42);
      const roofMesh = new THREE.Mesh(roofGeo, bodyMat);
      roofMesh.position.set(0, 1.26, 0.05);
      roofMesh.castShadow = true;
      this.chassis.add(roofMesh);

      // Front hood slope
      const hoodGeo = new THREE.BoxGeometry(this.width * 0.92, 0.18, this.length * 0.3);
      const hoodMesh = new THREE.Mesh(hoodGeo, bodyMat);
      hoodMesh.position.set(0, 0.68, -this.length * 0.32);
      hoodMesh.rotation.x = 0.05;
      hoodMesh.castShadow = true;
      this.chassis.add(hoodMesh);

      // Taxi rooftop illuminated sign
      if (this.type === 'taxi') {
        const signBaseGeo = new THREE.BoxGeometry(0.7, 0.18, 0.28);
        const signMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xfacc15,
          emissiveIntensity: 2.0
        });
        const signMesh = new THREE.Mesh(signBaseGeo, signMat);
        signMesh.position.set(0, 1.38, 0);
        this.chassis.add(signMesh);

        // Checkerboard side stripe
        const stripeGeo = new THREE.BoxGeometry(this.width + 0.02, 0.1, this.length * 0.85);
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
        const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
        stripeMesh.position.set(0, 0.52, 0);
        this.chassis.add(stripeMesh);
      }
    }

    // ----------------------------------------------------
    // Headlights & Taillights
    // ----------------------------------------------------
    [-this.hw * 0.72, this.hw * 0.72].forEach((xOffset, idx) => {
      // Front headlights
      const hlGeo = new THREE.BoxGeometry(0.32, 0.12, 0.1);
      const hlMesh = new THREE.Mesh(hlGeo, this.headlightMat);
      hlMesh.position.set(xOffset, 0.52, -this.hl);
      this.chassis.add(hlMesh);

      // Front amber turn signal
      const tsGeo = new THREE.BoxGeometry(0.12, 0.1, 0.1);
      const isLeft = idx === 0;
      const tsMesh = new THREE.Mesh(tsGeo, isLeft ? this.turnSignalLeftMat : this.turnSignalRightMat);
      tsMesh.position.set(xOffset + (isLeft ? -0.22 : 0.22), 0.52, -this.hl);
      this.chassis.add(tsMesh);

      // Rear taillights / brake lights
      const tlGeo = new THREE.BoxGeometry(0.35, 0.14, 0.1);
      const tlMesh = new THREE.Mesh(tlGeo, this.brakeLightMat);
      tlMesh.position.set(xOffset, 0.56, this.hl);
      this.chassis.add(tlMesh);

      // Rear amber turn signals
      const rtsMesh = new THREE.Mesh(tsGeo, isLeft ? this.turnSignalLeftMat : this.turnSignalRightMat);
      rtsMesh.position.set(xOffset + (isLeft ? -0.22 : 0.22), 0.56, this.hl);
      this.chassis.add(rtsMesh);
    });

    // ----------------------------------------------------
    // Wheels (4 independent assemblies)
    // ----------------------------------------------------
    const wheelTrackX = this.hw - 0.05;
    const axleZFront = -this.hl * 0.65;
    const axleZRear = this.hl * 0.65;
    const wheelY = this.wheelRadius;

    const createWheel = (isFront, isLeft) => {
      const steerGroup = new THREE.Group();
      steerGroup.position.set(isLeft ? -wheelTrackX : wheelTrackX, wheelY, isFront ? axleZFront : axleZRear);

      const wheelGroup = new THREE.Group();

      const tireGeo = new THREE.CylinderGeometry(this.wheelRadius, this.wheelRadius, 0.24, 18);
      const tireMesh = new THREE.Mesh(tireGeo, tireMat);
      tireMesh.rotation.z = Math.PI / 2;
      tireMesh.castShadow = true;
      wheelGroup.add(tireMesh);

      const rimGeo = new THREE.CylinderGeometry(this.wheelRadius * 0.62, this.wheelRadius * 0.62, 0.25, 12);
      const rimMesh = new THREE.Mesh(rimGeo, chromeMat);
      rimMesh.rotation.z = Math.PI / 2;
      wheelGroup.add(rimMesh);

      steerGroup.add(wheelGroup);
      this.chassis.add(steerGroup);

      if (isFront) {
        this.steerableWheelGroups.push(steerGroup);
      }
      this.rotatingWheelMeshes.push(wheelGroup);
    };

    createWheel(true, true);
    createWheel(true, false);
    createWheel(false, true);
    createWheel(false, false);

    // Ground contact shadow
    const shadowGeo = new THREE.PlaneGeometry(this.width * 1.15, this.length * 1.08);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.38,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.03, 0);
    this.root.add(shadowMesh);
  }

  /**
   * Resets vehicle position, lane, and speed.
   */
  spawn(laneIndex, z, speedKmh = 65) {
    this.currentLaneIndex = Math.max(0, Math.min(3, laneIndex));
    this.targetLaneIndex = this.currentLaneIndex;
    this.position.x = this.lanePositions[this.currentLaneIndex];
    this.position.y = 0;
    this.position.z = z;

    this.speed = (speedKmh / 3.6);
    this.targetSpeed = this.speed;
    this.isChangingLanes = false;
    this.turnSignal = 0;
    this.isBraking = false;
    this.isActive = true;

    this.root.position.copy(this.position);
    this.root.rotation.set(0, 0, 0);
  }

  /**
   * AI step: updates driving decisions, obstacle awareness, lane changes, and kinematics.
   * @param {number} dt Delta time
   * @param {Array<TrafficVehicle>} allTraffic
   * @param {Object} playerPhysics
   * @param {Array<Object>} worldObstacles
   */
  update(dt, allTraffic, playerPhysics, worldObstacles) {
    if (!this.isActive || dt <= 0) return;
    dt = Math.min(dt, 0.1);

    // 1. Forward radar / scanning for vehicle or obstacle ahead in current target lane
    let distanceAhead = 999;
    let speedAhead = this.targetSpeed;
    let shouldChangeLane = false;

    // Check other AI traffic ahead
    for (let i = 0; i < allTraffic.length; i++) {
      const other = allTraffic[i];
      if (other === this || !other.isActive) continue;

      // Same lane (or moving into same lane)
      const sameLane = Math.abs(other.position.x - this.position.x) < 2.0;
      const isAhead = other.position.z < this.position.z; // -Z is forward
      const gap = this.position.z - other.position.z; // positive when other is ahead

      if (sameLane && isAhead && gap < distanceAhead) {
        distanceAhead = gap;
        speedAhead = other.speed;
      }
    }

    // Check player vehicle ahead
    if (playerPhysics) {
      const playerSameLane = Math.abs(playerPhysics.position.x - this.position.x) < 2.2;
      const playerIsAhead = playerPhysics.position.z < this.position.z;
      const playerGap = this.position.z - playerPhysics.position.z;

      if (playerSameLane && playerIsAhead && playerGap < distanceAhead) {
        distanceAhead = playerGap;
        speedAhead = playerPhysics.speed;
      }
    }

    // Check stationary roadblocks on the road ahead
    if (worldObstacles) {
      for (let i = 0; i < worldObstacles.length; i++) {
        const obs = worldObstacles[i];
        const obsSameLane = Math.abs(obs.x - this.position.x) < 2.0;
        const obsIsAhead = obs.z < this.position.z;
        const obsGap = this.position.z - obs.z;

        if (obsSameLane && obsIsAhead && obsGap < distanceAhead) {
          distanceAhead = obsGap;
          speedAhead = 0;
        }
      }
    }

    // 2. Speed and braking decisions
    const safeFollowDist = Math.max(14.0, this.speed * 1.5);

    if (distanceAhead < safeFollowDist) {
      // Danger / slow vehicle or obstacle ahead!
      this.isBraking = true;
      if (distanceAhead < 8.0) {
        // Urgent emergency stop
        this.speed = Math.max(0, this.speed - this.brakeForce * 1.4 * dt);
      } else {
        // Smoothly match speed of leader
        const targetFollowSpeed = Math.min(speedAhead, this.targetSpeed);
        if (this.speed > targetFollowSpeed) {
          this.speed = Math.max(0, this.speed - this.brakeForce * dt);
        } else {
          this.speed += this.accel * 0.4 * dt;
        }
      }

      // Consider lane change if blocked
      if (distanceAhead < safeFollowDist * 1.3 && !this.isChangingLanes) {
        shouldChangeLane = true;
      }
    } else {
      // Clear road ahead: cruise smoothly towards target speed
      this.isBraking = false;
      if (this.speed < this.targetSpeed) {
        this.speed = Math.min(this.targetSpeed, this.speed + this.accel * dt);
      } else if (this.speed > this.targetSpeed) {
        this.speed = Math.max(this.targetSpeed, this.speed - 3.0 * dt);
      }
    }

    // 3. Autonomous Lane Changing Logic
    if (shouldChangeLane && !this.isChangingLanes) {
      // Evaluate left and right lane availability
      const canGoLeft = this.currentLaneIndex > 0;
      const canGoRight = this.currentLaneIndex < 3;

      let chosenLane = -1;

      // Prefer overtaking on the left if possible, else right
      const checkCandidate = (laneIdx) => {
        const testX = this.lanePositions[laneIdx];
        // Ensure no vehicle within 25m in candidate lane
        for (let i = 0; i < allTraffic.length; i++) {
          const t = allTraffic[i];
          if (t === this || !t.isActive) continue;
          if (Math.abs(t.position.x - testX) < 2.0 && Math.abs(t.position.z - this.position.z) < 22.0) {
            return false;
          }
        }
        return true;
      };

      if (canGoLeft && checkCandidate(this.currentLaneIndex - 1)) {
        chosenLane = this.currentLaneIndex - 1;
      } else if (canGoRight && checkCandidate(this.currentLaneIndex + 1)) {
        chosenLane = this.currentLaneIndex + 1;
      }

      if (chosenLane !== -1) {
        this.isChangingLanes = true;
        this.targetLaneIndex = chosenLane;
        this.laneChangeTimer = 0;
        this.laneChangeStartX = this.position.x;
        this.turnSignal = chosenLane < this.currentLaneIndex ? -1 : 1;
      }
    }

    // Execute lane change transition
    if (this.isChangingLanes) {
      this.laneChangeTimer += dt;
      const progress = Math.min(1.0, this.laneChangeTimer / this.laneChangeDuration);
      // Smooth sinusoidal lane transition curve
      const smoothAlpha = 0.5 * (1 - Math.cos(progress * Math.PI));
      const targetX = this.lanePositions[this.targetLaneIndex];

      this.position.x = this.laneChangeStartX + (targetX - this.laneChangeStartX) * smoothAlpha;

      // Slight yaw angle during lane change for realism
      const laneDelta = targetX - this.laneChangeStartX;
      const maxTilt = 0.12 * Math.sign(laneDelta);
      this.root.rotation.y = Math.sin(progress * Math.PI) * -maxTilt;

      // Front wheel steer animation during transition
      const steerAngle = Math.sin(progress * Math.PI) * -maxTilt * 1.5;
      this.steerableWheelGroups.forEach(g => g.rotation.y = steerAngle);

      if (progress >= 1.0) {
        this.isChangingLanes = false;
        this.currentLaneIndex = this.targetLaneIndex;
        this.position.x = targetX;
        this.root.rotation.y = 0;
        this.turnSignal = 0;
        this.steerableWheelGroups.forEach(g => g.rotation.y = 0);
      }
    } else {
      // Lane keep alignment
      const desiredX = this.lanePositions[this.currentLaneIndex];
      this.position.x += (desiredX - this.position.x) * Math.min(1.0, 4.0 * dt);
      this.root.rotation.y = 0;
    }

    // 4. Longitudinal movement (traveling along -Z)
    this.position.z -= this.speed * dt;
    this.root.position.copy(this.position);

    // 5. Wheel spin animation
    const spinDelta = (this.speed * dt) / this.wheelRadius;
    this.wheelRotationAccumulator += spinDelta;
    this.rotatingWheelMeshes.forEach(m => m.rotation.x = -this.wheelRotationAccumulator);

    // 6. Reactive brake lights
    if (this.brakeLightMat) {
      this.brakeLightMat.emissiveIntensity = this.isBraking ? 2.6 : 0.4;
    }

    // 7. Turn signal blinking (4 Hz)
    if (this.turnSignal !== 0) {
      this.signalBlinkTimer += dt;
      if (this.signalBlinkTimer > 0.25) {
        this.signalBlinkTimer = 0;
        this.signalBlinkState = !this.signalBlinkState;
      }
      const intensity = this.signalBlinkState ? 2.5 : 0.0;
      if (this.turnSignal === -1 && this.turnSignalLeftMat) {
        this.turnSignalLeftMat.emissiveIntensity = intensity;
      } else if (this.turnSignal === 1 && this.turnSignalRightMat) {
        this.turnSignalRightMat.emissiveIntensity = intensity;
      }
    } else {
      if (this.turnSignalLeftMat) this.turnSignalLeftMat.emissiveIntensity = 0;
      if (this.turnSignalRightMat) this.turnSignalRightMat.emissiveIntensity = 0;
    }
  }

  /**
   * Called when player collides with this traffic car.
   */
  onImpact(playerSpeed) {
    this.isBraking = true;
    this.speed = Math.max(0, this.speed * 0.4);
    // Slight lateral displacement
    this.position.x += (Math.random() - 0.5) * 0.8;
  }

  dispose() {
    this.scene.remove(this.root);
  }
}

