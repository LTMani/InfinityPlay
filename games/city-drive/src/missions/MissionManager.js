/**
 * MissionManager.js
 * Manages game modes, objectives, 3D animated checkpoint gates,
 * countdown timers, courier pickup/drop-off waypoints, and scoring.
 */

import * as THREE from 'three';

export class MissionManager {
  /**
   * @param {THREE.Scene} scene
   * @param {Object} callbacks { onCheckpoint, onMissionSuccess, onMissionFail, onScoreChange }
   */
  constructor(scene, callbacks = {}) {
    this.scene = scene;
    this.callbacks = callbacks;

    // Modes: 'FREE_CRUISE' | 'TIME_ATTACK' | 'COURIER'
    this.mode = 'TIME_ATTACK';
    this.isActive = false;
    this.isCompleted = false;
    this.isFailed = false;

    // Stats
    this.score = 0;
    this.cash = 0;
    this.nearMissCount = 0;
    this.checkpointsCleared = 0;
    this.deliveriesCompleted = 0;

    // Time Attack State
    this.timeRemaining = 45; // seconds
    this.checkpointSpacing = 260; // meters between gates
    this.nextCheckpointIndex = 1;
    this.nextCheckpointZ = -260;
    this.activeCheckpointGroup = null;

    // Courier State ('PICKUP' | 'DROPOFF')
    this.courierPhase = 'PICKUP';
    this.courierTargetZ = -180;
    this.courierTargetX = 5.7; // Right shoulder lane
    this.activeWaypointGroup = null;

    // Materials
    this._initMaterials();
  }

  _initMaterials() {
    this.archFrameMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x0891b2,
      emissiveIntensity: 0.8
    });

    this.holoGateMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });

    this.beaconGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 2.2
    });

    this.waypointHoloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
  }

  /**
   * Starts chosen mission mode.
   */
  startMission(mode = 'TIME_ATTACK') {
    this.mode = mode;
    this.isActive = true;
    this.isCompleted = false;
    this.isFailed = false;
    this.score = 0;
    this.cash = 0;
    this.nearMissCount = 0;
    this.checkpointsCleared = 0;
    this.deliveriesCompleted = 0;

    this._clear3DObjects();

    if (this.mode === 'TIME_ATTACK') {
      this.timeRemaining = 45;
      this.nextCheckpointIndex = 1;
      this.nextCheckpointZ = -this.checkpointSpacing;
      this._spawnCheckpointGate(this.nextCheckpointZ);
    } else if (this.mode === 'COURIER') {
      this.timeRemaining = 50;
      this.courierPhase = 'PICKUP';
      this.courierTargetZ = -160;
      this.courierTargetX = 5.7;
      this._spawnWaypoint(this.courierTargetX, this.courierTargetZ, 'PICKUP');
    } else {
      // FREE_CRUISE
      this.timeRemaining = 99999;
    }
  }

  /**
   * Spawns holographic 3D checkpoint arch gate.
   */
  _spawnCheckpointGate(z) {
    if (this.activeCheckpointGroup) {
      this.scene.remove(this.activeCheckpointGroup);
    }

    const group = new THREE.Group();
    group.position.set(0, 0, z);

    // Arch width across road = 17m, height = 6.2m
    const gateW = 16.8;
    const gateH = 6.4;
    const postRadius = 0.28;

    // Left & Right upright columns
    [-gateW / 2, gateW / 2].forEach(colX => {
      const colGeo = new THREE.CylinderGeometry(postRadius, postRadius * 1.2, gateH, 16);
      const colMesh = new THREE.Mesh(colGeo, this.archFrameMat);
      colMesh.position.set(colX, gateH / 2, 0);
      colMesh.castShadow = true;
      group.add(colMesh);

      // Glowing beacon orb on top
      const orbGeo = new THREE.SphereGeometry(0.55, 12, 12);
      const orbMesh = new THREE.Mesh(orbGeo, this.beaconGoldMat);
      orbMesh.position.set(colX, gateH + 0.3, 0);
      group.add(orbMesh);
    });

    // Top crossbeam truss
    const beamGeo = new THREE.BoxGeometry(gateW + 0.6, 0.48, 0.48);
    const beamMesh = new THREE.Mesh(beamGeo, this.archFrameMat);
    beamMesh.position.set(0, gateH - 0.2, 0);
    group.add(beamMesh);

    // Holographic energy curtain
    const holoGeo = new THREE.PlaneGeometry(gateW - 0.4, gateH - 0.8);
    const holoMesh = new THREE.Mesh(holoGeo, this.holoGateMat);
    holoMesh.position.set(0, (gateH - 0.8) / 2 + 0.2, 0);
    group.add(holoMesh);

    this.activeCheckpointGroup = group;
    this.scene.add(group);
  }

  /**
   * Spawns glowing roadside courier waypoint marker.
   */
  _spawnWaypoint(x, z, phase) {
    if (this.activeWaypointGroup) {
      this.scene.remove(this.activeWaypointGroup);
    }

    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Holographic vertical light cylinder
    const cylGeo = new THREE.CylinderGeometry(2.4, 2.4, 6.0, 24, 1, true);
    const mat = phase === 'PICKUP' ? this.waypointHoloMat : this.holoGateMat;
    const cylMesh = new THREE.Mesh(cylGeo, mat);
    cylMesh.position.set(0, 3.0, 0);
    group.add(cylMesh);

    // Pulsing ground target rings
    const ringGeo = new THREE.RingGeometry(1.6, 2.4, 32);
    const ringMesh = new THREE.Mesh(ringGeo, mat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(0, 0.05, 0);
    group.add(ringMesh);

    // Floating diamond beacon
    const diamondGeo = new THREE.OctahedronGeometry(0.8);
    const diamondMesh = new THREE.Mesh(diamondGeo, this.beaconGoldMat);
    diamondMesh.position.set(0, 3.5, 0);
    diamondMesh.name = 'DiamondBeacon';
    group.add(diamondMesh);

    this.activeWaypointGroup = group;
    this.scene.add(group);
  }

  /**
   * Main mission update step.
   * @param {number} dt Delta time
   * @param {Object} playerPhysics Player state { position, speed }
   */
  update(dt, playerPhysics) {
    if (!this.isActive || this.isCompleted || this.isFailed || !playerPhysics) return;

    // 1. Mission Timer Countdown
    if (this.mode !== 'FREE_CRUISE') {
      this.timeRemaining -= dt;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.failMission('TIME EXPIRED!');
        return;
      }
    }

    // 2. Animate 3D Gate / Waypoint visuals
    if (this.activeWaypointGroup) {
      const beacon = this.activeWaypointGroup.getObjectByName('DiamondBeacon');
      if (beacon) {
        beacon.rotation.y += 2.0 * dt;
        beacon.position.y = 3.5 + Math.sin(performance.now() * 0.004) * 0.35;
      }
    }

    // 3. Time Attack Checkpoint detection
    if (this.mode === 'TIME_ATTACK') {
      // Player passes through gate when playerZ <= nextCheckpointZ (since moving along -Z)
      if (playerPhysics.position.z <= this.nextCheckpointZ) {
        this.checkpointsCleared++;
        const bonusTime = 15;
        this.timeRemaining += bonusTime;
        this.score += 250;

        if (this.callbacks.onCheckpoint) {
          this.callbacks.onCheckpoint(this.checkpointsCleared, bonusTime, 250);
        }

        // Spawn next gate
        this.nextCheckpointIndex++;
        this.nextCheckpointZ = -this.nextCheckpointIndex * this.checkpointSpacing;
        this._spawnCheckpointGate(this.nextCheckpointZ);
      }
    }

    // 4. Courier Pickup / Dropoff detection
    if (this.mode === 'COURIER') {
      const dx = playerPhysics.position.x - this.courierTargetX;
      const dz = playerPhysics.position.z - this.courierTargetZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const isSlowEnough = Math.abs(playerPhysics.speed) < 5.0; // < 18 km/h

      if (dist < 3.8 && isSlowEnough) {
        if (this.courierPhase === 'PICKUP') {
          // Passenger / cargo boarded!
          this.courierPhase = 'DROPOFF';
          this.timeRemaining += 25;
          this.score += 150;
          this.courierTargetZ = playerPhysics.position.z - 360;
          this.courierTargetX = Math.random() > 0.5 ? -5.7 : 5.7;

          this._spawnWaypoint(this.courierTargetX, this.courierTargetZ, 'DROPOFF');

          if (this.callbacks.onCourierPhase) {
            this.callbacks.onCourierPhase('DROPOFF', 'PASSENGER ON BOARD - RUSH TO DESTINATION!');
          }
        } else {
          // Delivery completed!
          this.deliveriesCompleted++;
          this.cash += 350;
          this.score += 500;
          this.timeRemaining += 30;

          if (this.callbacks.onCourierPhase) {
            this.callbacks.onCourierPhase('PICKUP', `DELIVERY COMPLETE! +$350 (FARES: ${this.deliveriesCompleted})`);
          }

          // Next pickup target
          this.courierPhase = 'PICKUP';
          this.courierTargetZ = playerPhysics.position.z - 300;
          this.courierTargetX = Math.random() > 0.5 ? -5.7 : 5.7;
          this._spawnWaypoint(this.courierTargetX, this.courierTargetZ, 'PICKUP');
        }
      }
    }

    // 5. Free Cruise score accumulation from distance and speed
    if (this.mode === 'FREE_CRUISE' && playerPhysics.speed > 0) {
      this.score += Math.round(playerPhysics.speed * dt * 2);
    }
  }

  /**
   * Registers a high-speed near miss with AI traffic.
   */
  recordNearMiss() {
    this.nearMissCount++;
    const bonus = 50;
    this.score += bonus;
    return { count: this.nearMissCount, bonus, totalScore: this.score };
  }

  failMission(reason = 'MISSION FAILED') {
    this.isFailed = true;
    this.isActive = false;
    if (this.callbacks.onMissionFail) {
      this.callbacks.onMissionFail(reason, this.getSummaryStats());
    }
  }

  completeMission() {
    this.isCompleted = true;
    this.isActive = false;
    if (this.callbacks.onMissionSuccess) {
      this.callbacks.onMissionSuccess(this.getSummaryStats());
    }
  }

  getSummaryStats() {
    return {
      mode: this.mode,
      score: this.score,
      cash: this.cash,
      checkpoints: this.checkpointsCleared,
      deliveries: this.deliveriesCompleted,
      nearMisses: this.nearMissCount,
      timeRemaining: Math.ceil(this.timeRemaining)
    };
  }

  getDistanceToNextObjective(playerPhysics) {
    if (!playerPhysics) return 0;
    if (this.mode === 'TIME_ATTACK') {
      return Math.max(0, Math.round(playerPhysics.position.z - this.nextCheckpointZ));
    }
    if (this.mode === 'COURIER') {
      const dz = playerPhysics.position.z - this.courierTargetZ;
      return Math.max(0, Math.round(Math.abs(dz)));
    }
    return 0;
  }

  _clear3DObjects() {
    if (this.activeCheckpointGroup) {
      this.scene.remove(this.activeCheckpointGroup);
      this.activeCheckpointGroup = null;
    }
    if (this.activeWaypointGroup) {
      this.scene.remove(this.activeWaypointGroup);
      this.activeWaypointGroup = null;
    }
  }

  reset() {
    this._clear3DObjects();
    this.isActive = false;
    this.isCompleted = false;
    this.isFailed = false;
  }
}

