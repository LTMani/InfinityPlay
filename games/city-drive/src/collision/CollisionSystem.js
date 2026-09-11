/**
 * CollisionSystem.js
 * 2D OBB/AABB collision detection between vehicle and road obstacles.
 * Handles penetration resolution, speed damping, visual spark particles,
 * and impact camera shake.
 */

import * as THREE from 'three';

export class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
    this.obstacles = []; // Active obstacle definitions: { id, x, z, hw, hl, mesh, box }

    // Reusable particle system for collision sparks/debris
    this._initImpactParticles();
    this._initMaterials();
  }

  _initMaterials() {
    // Striped construction barrier material
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Orange & white diagonal safety hazard stripes
    ctx.fillStyle = '#f97316';
    ctx.fillRect(0, 0, 128, 64);
    ctx.fillStyle = '#ffffff';
    for (let i = -64; i < 192; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 32, 0);
      ctx.lineTo(i, 64);
      ctx.lineTo(i - 32, 64);
      ctx.closePath();
      ctx.fill();
    }

    this.stripeTexture = new THREE.CanvasTexture(canvas);
    this.barrierMat = new THREE.MeshStandardMaterial({
      map: this.stripeTexture,
      roughness: 0.4
    });

    this.concreteMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.9,
      metalness: 0.1
    });

    this.coneOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.3
    });

    this.coneReflectiveMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.1,
      metalness: 0.8
    });

    this.warningLightMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 2.5
    });
  }

  _initImpactParticles() {
    // Particle pool for collision bursts
    this.maxParticles = 80;
    this.particlePositions = new Float32Array(this.maxParticles * 3);
    this.particleVelocities = [];
    this.particleLifetimes = new Float32Array(this.maxParticles);

    for (let i = 0; i < this.maxParticles; i++) {
      this.particleVelocities.push(new THREE.Vector3());
      this.particleLifetimes[i] = 0;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.28,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(pGeo, pMat);
    this.particleSystem.frustumCulled = false;
    this.scene.add(this.particleSystem);
  }

  /**
   * Spawns a construction roadblock barrier obstacle.
   */
  createRoadblock(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main board with orange/white stripes (Width: 3.2m, Height: 0.8m, Thickness: 0.15m)
    const boardGeo = new THREE.BoxGeometry(3.2, 0.8, 0.15);
    const boardMesh = new THREE.Mesh(boardGeo, this.barrierMat);
    boardMesh.position.set(0, 0.9, 0);
    boardMesh.castShadow = true;
    group.add(boardMesh);

    // Sturdy A-frame legs
    [-1.3, 1.3].forEach(legX => {
      const legGeo = new THREE.BoxGeometry(0.12, 1.3, 0.9);
      const legMesh = new THREE.Mesh(legGeo, this.concreteMat);
      legMesh.position.set(legX, 0.65, 0);
      legMesh.castShadow = true;
      group.add(legMesh);
    });

    // Flashing amber hazard beacons on top
    [-1.2, 1.2].forEach(lx => {
      const beaconGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12);
      const beacon = new THREE.Mesh(beaconGeo, this.warningLightMat);
      beacon.position.set(lx, 1.45, 0);
      group.add(beacon);
    });

    const obstacle = {
      id: `roadblock_${Math.random().toString(36).substr(2, 6)}`,
      x,
      z,
      hw: 1.6, // half-width
      hl: 0.45,// half-length
      group,
      lastImpactTime: 0
    };

    this.obstacles.push(obstacle);
    this.scene.add(group);
    return obstacle;
  }

  /**
   * Spawns a cluster of 3 traffic cones.
   */
  createConeCluster(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const offsets = [
      { dx: -0.6, dz: 0 },
      { dx: 0, dz: 0.5 },
      { dx: 0.6, dz: 0 }
    ];

    offsets.forEach(off => {
      const coneGroup = new THREE.Group();
      coneGroup.position.set(off.dx, 0, off.dz);

      // Square rubber base
      const baseGeo = new THREE.BoxGeometry(0.5, 0.05, 0.5);
      const baseMesh = new THREE.Mesh(baseGeo, this.coneOrangeMat);
      baseMesh.position.set(0, 0.025, 0);
      coneGroup.add(baseMesh);

      // Orange cone body
      const coneGeo = new THREE.ConeGeometry(0.22, 0.8, 12);
      const coneMesh = new THREE.Mesh(coneGeo, this.coneOrangeMat);
      coneMesh.position.set(0, 0.45, 0);
      coneMesh.castShadow = true;
      coneGroup.add(coneMesh);

      // Reflective white safety collar
      const collarGeo = new THREE.CylinderGeometry(0.14, 0.17, 0.18, 12);
      const collarMesh = new THREE.Mesh(collarGeo, this.coneReflectiveMat);
      collarMesh.position.set(0, 0.48, 0);
      coneGroup.add(collarMesh);

      group.add(coneGroup);
    });

    const obstacle = {
      id: `cones_${Math.random().toString(36).substr(2, 6)}`,
      x,
      z,
      hw: 1.1,
      hl: 0.8,
      group,
      lastImpactTime: 0
    };

    this.obstacles.push(obstacle);
    this.scene.add(group);
    return obstacle;
  }

  /**
   * Spawns heavy concrete jersey barrier.
   */
  createConcreteBarrier(x, z, length = 4.0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const barrierGeo = new THREE.BoxGeometry(0.8, 1.0, length);
    const barrierMesh = new THREE.Mesh(barrierGeo, this.concreteMat);
    barrierMesh.position.set(0, 0.5, 0);
    barrierMesh.castShadow = true;
    group.add(barrierMesh);

    const obstacle = {
      id: `concrete_${Math.random().toString(36).substr(2, 6)}`,
      x,
      z,
      hw: 0.4,
      hl: length / 2,
      group,
      lastImpactTime: 0
    };

    this.obstacles.push(obstacle);
    this.scene.add(group);
    return obstacle;
  }

  /**
   * Main collision test and resolution against vehicle.
   * @param {VehicleController} vehicleController
   * @param {FollowCamera} followCamera
   * @param {number} dt
   * @param {TrafficManager} trafficManager
   * @param {function} onHitCallback
   */
  update(vehicleController, followCamera, dt, trafficManager, onHitCallback) {
    const physics = vehicleController.physics;
    const vX = physics.position.x;
    const vZ = physics.position.z;
    const vHw = 0.95; // Car half width
    const vHl = 2.15; // Car half length

    // Update particle spark animations
    this._updateParticles(dt);

    const now = performance.now();

    // 1. Road side curb barrier constraint
    // If car drives off the road boundaries (x < -7.6 or x > 7.6), prevent passing through outer barriers!
    const roadHalfWidth = 7.6;
    if (vX - vHw < -roadHalfWidth) {
      physics.position.x = -roadHalfWidth + vHw;
      physics.speed *= 0.5; // Scrape barrier
      followCamera.triggerImpactShake(0.18, 0.25);
      this._emitSparks(-roadHalfWidth, 0.5, vZ, 1, 0);
      if (onHitCallback) onHitCallback('GUARDRAIL');
    } else if (vX + vHw > roadHalfWidth) {
      physics.position.x = roadHalfWidth - vHw;
      physics.speed *= 0.5;
      followCamera.triggerImpactShake(0.18, 0.25);
      this._emitSparks(roadHalfWidth, 0.5, vZ, -1, 0);
      if (onHitCallback) onHitCallback('GUARDRAIL');
    }

    // 2. Obstacles check (broadphase distance filter)
    for (let i = 0; i < this.obstacles.length; i++) {
      const obs = this.obstacles[i];
      const dx = vX - obs.x;
      const dz = vZ - obs.z;

      // Quick circle reject
      const maxRadius = vHl + Math.max(obs.hw, obs.hl);
      if (dx * dx + dz * dz > maxRadius * maxRadius) continue;

      // 2D AABB / Box Penetration test
      const overlapX = (vHw + obs.hw) - Math.abs(dx);
      const overlapZ = (vHl + obs.hl) - Math.abs(dz);

      if (overlapX > 0 && overlapZ > 0) {
        // Collision confirmed! Determine separation normal (smallest penetration axis)
        let normalX = 0;
        let normalZ = 0;

        if (overlapX < overlapZ) {
          normalX = dx > 0 ? 1 : -1;
          physics.position.x += normalX * overlapX;
        } else {
          normalZ = dz > 0 ? 1 : -1;
          physics.position.z += normalZ * overlapZ;
        }

        // Apply physics restitution & impact damping
        physics.onCollision(normalX, normalZ, 0.2);

        // Screen shake
        followCamera.triggerImpactShake(0.42, 0.45);

        // Spawn visual spark particles at contact point
        const contactX = obs.x + (dx > 0 ? obs.hw : -obs.hw);
        const contactZ = obs.z + (dz > 0 ? obs.hl : -obs.hl);
        this._emitSparks(contactX, 0.6, contactZ, normalX, normalZ);

        // Debounced hit notification
        if (now - obs.lastImpactTime > 800) {
          obs.lastImpactTime = now;
          if (onHitCallback) onHitCallback('OBSTACLE');
        }
      }
    }

    // 3. Dynamic Traffic Vehicles check
    if (trafficManager && trafficManager.vehicles) {
      for (let i = 0; i < trafficManager.vehicles.length; i++) {
        const tv = trafficManager.vehicles[i];
        if (!tv.isActive) continue;

        const dx = vX - tv.position.x;
        const dz = vZ - tv.position.z;

        const maxR = vHl + tv.hl;
        if (dx * dx + dz * dz > maxR * maxR) continue;

        const overlapX = (vHw + tv.hw) - Math.abs(dx);
        const overlapZ = (vHl + tv.hl) - Math.abs(dz);

        if (overlapX > 0 && overlapZ > 0) {
          let normalX = 0;
          let normalZ = 0;

          if (overlapX < overlapZ) {
            normalX = dx > 0 ? 1 : -1;
            physics.position.x += normalX * overlapX * 0.7;
            tv.position.x -= normalX * overlapX * 0.3;
          } else {
            normalZ = dz > 0 ? 1 : -1;
            physics.position.z += normalZ * overlapZ * 0.7;
            tv.position.z -= normalZ * overlapZ * 0.3;
          }

          physics.onCollision(normalX, normalZ, 0.35);
          tv.onImpact(physics.speed);

          followCamera.triggerImpactShake(0.48, 0.5);

          const contactX = tv.position.x + (dx > 0 ? tv.hw : -tv.hw);
          const contactZ = tv.position.z + (dz > 0 ? tv.hl : -tv.hl);
          this._emitSparks(contactX, 0.6, contactZ, normalX, normalZ);

          if (now - (tv.lastImpactTime || 0) > 800) {
            tv.lastImpactTime = now;
            if (onHitCallback) onHitCallback('TRAFFIC');
          }
        }
      }
    }
  }

  _emitSparks(x, y, z, nx, nz) {
    let spawned = 0;
    const count = 18;

    for (let i = 0; i < this.maxParticles && spawned < count; i++) {
      if (this.particleLifetimes[i] <= 0) {
        const idx = i * 3;
        this.particlePositions[idx] = x;
        this.particlePositions[idx + 1] = y;
        this.particlePositions[idx + 2] = z;

        // Spread velocities in outward direction
        const speed = 4 + Math.random() * 8;
        const spreadAngle = (Math.random() - 0.5) * Math.PI;
        const dirX = nx * Math.cos(spreadAngle) - nz * Math.sin(spreadAngle);
        const dirZ = nx * Math.sin(spreadAngle) + nz * Math.cos(spreadAngle);

        this.particleVelocities[i].set(
          dirX * speed,
          2 + Math.random() * 5, // upward bounce
          dirZ * speed
        );

        this.particleLifetimes[i] = 0.35 + Math.random() * 0.25;
        spawned++;
      }
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  _updateParticles(dt) {
    let hasActive = false;
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.particleLifetimes[i] > 0) {
        this.particleLifetimes[i] -= dt;
        const idx = i * 3;

        // Apply gravity and velocity
        this.particleVelocities[i].y -= 14.0 * dt;
        this.particlePositions[idx] += this.particleVelocities[i].x * dt;
        this.particlePositions[idx + 1] += this.particleVelocities[i].y * dt;
        this.particlePositions[idx + 2] += this.particleVelocities[i].z * dt;

        if (this.particlePositions[idx + 1] < 0.05) {
          this.particlePositions[idx + 1] = 0.05;
          this.particleVelocities[i].y *= -0.3; // Floor bounce
        }

        hasActive = true;
      }
    }

    if (hasActive) {
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
  }

  clear() {
    this.obstacles.forEach(obs => {
      this.scene.remove(obs.group);
    });
    this.obstacles = [];
  }
}

