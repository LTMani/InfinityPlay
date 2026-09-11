/**
 * Vehicle.js
 * Creates a stylized 3D procedural sports coupe model with chassis, cabin, wheels,
 * brake lights, headlights with road-projecting SpotLights, and realistic suspension dynamics.
 */

import * as THREE from 'three';

export class Vehicle {
  constructor(scene, color = 0x2563eb) {
    this.scene = scene;
    this.carColor = color;

    // Root container (tracks world X, Y, Z and yaw heading)
    this.root = new THREE.Group();
    this.root.name = 'PlayerVehicle';

    // Dynamic chassis group (handles pitch dive & roll tilt)
    this.chassis = new THREE.Group();
    this.root.add(this.chassis);

    // Wheel collections for animation
    this.steerableWheelGroups = []; // Front wheels pivot for steering
    this.rotatingWheelMeshes = [];  // All 4 wheels spin when rolling

    // Dynamic materials for live garage customization & lighting
    this.bodyMaterial = null;
    this.brakeLightMaterial = null;
    this.reverseLightMaterial = null;
    this.headlightMaterial = null;

    // Spotlights projecting road illumination in night/dusk
    this.leftHeadlightBeam = null;
    this.rightHeadlightBeam = null;
    this.headlightTarget = null;

    this.wheelRadius = 0.35;
    this.wheelRotationAccumulator = 0;

    this._buildVehicleModel();
    this._initProjectorHeadlights();
    this.scene.add(this.root);
  }

  _buildVehicleModel() {
    // ----------------------------------------------------
    // Shared Materials
    // ----------------------------------------------------
    this.bodyMaterial = new THREE.MeshStandardMaterial({
      color: this.carColor,
      roughness: 0.22,
      metalness: 0.7
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.3
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.82
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      roughness: 0.2,
      metalness: 0.95
    });

    this.headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xecfeff,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });

    this.brakeLightMaterial = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      emissive: 0xef4444,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });

    this.reverseLightMaterial = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      emissive: 0xffffff,
      emissiveIntensity: 0.0,
      roughness: 0.3
    });

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.1
    });

    // ----------------------------------------------------
    // 1. Lower Main Body / Chassis
    // ----------------------------------------------------
    const lowerBodyGeo = new THREE.BoxGeometry(1.84, 0.58, 4.3);
    const lowerBodyMesh = new THREE.Mesh(lowerBodyGeo, this.bodyMaterial);
    lowerBodyMesh.position.set(0, 0.52, 0);
    lowerBodyMesh.castShadow = true;
    lowerBodyMesh.receiveShadow = true;
    this.chassis.add(lowerBodyMesh);

    // Front hood slope
    const hoodGeo = new THREE.BoxGeometry(1.76, 0.22, 1.4);
    const hoodMesh = new THREE.Mesh(hoodGeo, this.bodyMaterial);
    hoodMesh.position.set(0, 0.72, -1.3);
    hoodMesh.rotation.x = 0.06;
    hoodMesh.castShadow = true;
    this.chassis.add(hoodMesh);

    // Front aerodynamic bumper & lower splitter
    const bumperGeo = new THREE.BoxGeometry(1.86, 0.26, 0.45);
    const bumperMesh = new THREE.Mesh(bumperGeo, darkTrimMaterial);
    bumperMesh.position.set(0, 0.32, -2.12);
    bumperMesh.castShadow = true;
    this.chassis.add(bumperMesh);

    const grilleGeo = new THREE.BoxGeometry(1.2, 0.18, 0.1);
    const grilleMesh = new THREE.Mesh(grilleGeo, darkTrimMaterial);
    grilleMesh.position.set(0, 0.44, -2.36);
    this.chassis.add(grilleMesh);

    // Rear diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.86, 0.24, 0.4);
    const diffuserMesh = new THREE.Mesh(diffuserGeo, darkTrimMaterial);
    diffuserMesh.position.set(0, 0.34, 2.12);
    diffuserMesh.castShadow = true;
    this.chassis.add(diffuserMesh);

    // Dual chrome exhaust pipes
    [-0.55, 0.55].forEach(xOffset => {
      const exhaustGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.3, 16);
      const exhaustMesh = new THREE.Mesh(exhaustGeo, chromeMaterial);
      exhaustMesh.rotation.x = Math.PI / 2;
      exhaustMesh.position.set(xOffset, 0.28, 2.3);
      this.chassis.add(exhaustMesh);
    });

    // ----------------------------------------------------
    // 2. Cabin & Roof (Glass Greenhouse)
    // ----------------------------------------------------
    const cabinGeo = new THREE.BoxGeometry(1.5, 0.58, 2.1);
    const cabinMesh = new THREE.Mesh(cabinGeo, glassMaterial);
    cabinMesh.position.set(0, 1.05, 0.1);
    cabinMesh.castShadow = true;
    this.chassis.add(cabinMesh);

    // Roof panel
    const roofGeo = new THREE.BoxGeometry(1.42, 0.08, 1.7);
    const roofMesh = new THREE.Mesh(roofGeo, this.bodyMaterial);
    roofMesh.position.set(0, 1.36, 0.1);
    roofMesh.castShadow = true;
    this.chassis.add(roofMesh);

    // Windshield frame A-pillars
    const windshieldGeo = new THREE.BoxGeometry(1.46, 0.52, 0.1);
    const windshieldMesh = new THREE.Mesh(windshieldGeo, glassMaterial);
    windshieldMesh.rotation.x = 0.55;
    windshieldMesh.position.set(0, 1.02, -0.92);
    this.chassis.add(windshieldMesh);

    // Rear window slope
    const rearGlassGeo = new THREE.BoxGeometry(1.44, 0.55, 0.1);
    const rearGlassMesh = new THREE.Mesh(rearGlassGeo, glassMaterial);
    rearGlassMesh.rotation.x = -0.58;
    rearGlassMesh.position.set(0, 1.02, 1.12);
    this.chassis.add(rearGlassMesh);

    // ----------------------------------------------------
    // 3. Side Mirrors & Rear Spoiler
    // ----------------------------------------------------
    [-0.96, 0.96].forEach(xOffset => {
      const mirrorGeo = new THREE.BoxGeometry(0.18, 0.12, 0.22);
      const mirrorMesh = new THREE.Mesh(mirrorGeo, this.bodyMaterial);
      mirrorMesh.position.set(xOffset, 0.88, -0.7);
      this.chassis.add(mirrorMesh);
    });

    // Sport rear spoiler wing
    const wingGeo = new THREE.BoxGeometry(1.72, 0.06, 0.32);
    const wingMesh = new THREE.Mesh(wingGeo, darkTrimMaterial);
    wingMesh.position.set(0, 0.98, 2.05);
    this.chassis.add(wingMesh);

    [-0.65, 0.65].forEach(xOffset => {
      const strutGeo = new THREE.BoxGeometry(0.04, 0.2, 0.15);
      const strutMesh = new THREE.Mesh(strutGeo, darkTrimMaterial);
      strutMesh.position.set(xOffset, 0.88, 2.02);
      this.chassis.add(strutMesh);
    });

    // ----------------------------------------------------
    // 4. Lights (Headlights & Taillights)
    // ----------------------------------------------------
    [-0.68, 0.68].forEach(xOffset => {
      // Front headlights
      const hlGeo = new THREE.BoxGeometry(0.36, 0.14, 0.15);
      const hlMesh = new THREE.Mesh(hlGeo, this.headlightMaterial);
      hlMesh.position.set(xOffset, 0.58, -2.16);
      this.chassis.add(hlMesh);

      // Rear tail / brake light strip
      const tlGeo = new THREE.BoxGeometry(0.42, 0.14, 0.12);
      const tlMesh = new THREE.Mesh(tlGeo, this.brakeLightMaterial);
      tlMesh.position.set(xOffset, 0.62, 2.16);
      this.chassis.add(tlMesh);

      // Reverse indicator light
      const revGeo = new THREE.BoxGeometry(0.16, 0.08, 0.12);
      const revMesh = new THREE.Mesh(revGeo, this.reverseLightMaterial);
      revMesh.position.set(xOffset * 0.55, 0.62, 2.16);
      this.chassis.add(revMesh);
    });

    // ----------------------------------------------------
    // 5. Wheels (Front Steerable + Rear Fixed)
    // ----------------------------------------------------
    const wheelTrackX = 0.92;
    const axleZFront = -1.35;
    const axleZRear = 1.35;
    const wheelY = this.wheelRadius;

    const createWheelAssembly = (isFront, isLeft) => {
      const steerGroup = new THREE.Group();
      steerGroup.position.set(isLeft ? -wheelTrackX : wheelTrackX, wheelY, isFront ? axleZFront : axleZRear);

      const wheelAssembly = new THREE.Group();

      const tireGeo = new THREE.CylinderGeometry(this.wheelRadius, this.wheelRadius, 0.28, 24);
      const tireMesh = new THREE.Mesh(tireGeo, tireMaterial);
      tireMesh.rotation.z = Math.PI / 2;
      tireMesh.castShadow = true;
      wheelAssembly.add(tireMesh);

      const rimGeo = new THREE.CylinderGeometry(this.wheelRadius * 0.65, this.wheelRadius * 0.65, 0.29, 16);
      const rimMesh = new THREE.Mesh(rimGeo, chromeMaterial);
      rimMesh.rotation.z = Math.PI / 2;
      wheelAssembly.add(rimMesh);

      const spokeGeo = new THREE.BoxGeometry(0.06, this.wheelRadius * 1.15, 0.3);
      const spokeMesh1 = new THREE.Mesh(spokeGeo, darkTrimMaterial);
      wheelAssembly.add(spokeMesh1);

      const spokeMesh2 = spokeMesh1.clone();
      spokeMesh2.rotation.x = Math.PI / 2;
      wheelAssembly.add(spokeMesh2);

      steerGroup.add(wheelAssembly);
      this.chassis.add(steerGroup);

      if (isFront) {
        this.steerableWheelGroups.push(steerGroup);
      }
      this.rotatingWheelMeshes.push(wheelAssembly);
    };

    createWheelAssembly(true, true);   // Front Left
    createWheelAssembly(true, false);  // Front Right
    createWheelAssembly(false, true);  // Rear Left
    createWheelAssembly(false, false); // Rear Right

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.4, 4.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.03, 0);
    this.root.add(shadowMesh);
  }

  _initProjectorHeadlights() {
    // Target anchor positioned ahead of car
    this.headlightTarget = new THREE.Object3D();
    this.headlightTarget.position.set(0, 0.2, -26);
    this.root.add(this.headlightTarget);

    // Left high-beam spotlight
    this.leftHeadlightBeam = new THREE.SpotLight(0xfffbeb, 0, 50, Math.PI / 7, 0.45, 1.2);
    this.leftHeadlightBeam.position.set(-0.68, 0.6, -2.1);
    this.leftHeadlightBeam.target = this.headlightTarget;
    this.chassis.add(this.leftHeadlightBeam);

    // Right high-beam spotlight
    this.rightHeadlightBeam = new THREE.SpotLight(0xfffbeb, 0, 50, Math.PI / 7, 0.45, 1.2);
    this.rightHeadlightBeam.position.set(0.68, 0.6, -2.1);
    this.rightHeadlightBeam.target = this.headlightTarget;
    this.chassis.add(this.rightHeadlightBeam);
  }

  /**
   * Sets vehicle paint color (for Garage customization).
   */
  setColor(hexColor) {
    this.carColor = hexColor;
    if (this.bodyMaterial) {
      this.bodyMaterial.color.setHex(hexColor);
    }
  }

  /**
   * Toggles or dims projected headlights based on time of day.
   */
  setHeadlightIntensity(intensity) {
    if (this.leftHeadlightBeam) this.leftHeadlightBeam.intensity = intensity;
    if (this.rightHeadlightBeam) this.rightHeadlightBeam.intensity = intensity;
    if (this.headlightMaterial) {
      this.headlightMaterial.emissiveIntensity = intensity > 0.5 ? 2.5 : 1.0;
    }
  }

  /**
   * Synchronize visual representation with physics state.
   */
  update(physics, dt) {
    // 1. Root vehicle positioning and yaw heading
    this.root.position.set(physics.position.x, physics.position.y, physics.position.z);
    this.root.rotation.y = physics.heading;

    // 2. Chassis suspension roll & pitch response
    this.chassis.rotation.z = physics.chassisRoll;
    this.chassis.rotation.x = physics.chassisPitch;

    // 3. Wheel steering angle (pivot front wheels around Y axis)
    this.steerableWheelGroups.forEach(group => {
      group.rotation.y = physics.steeringAngle;
    });

    // 4. Wheel rolling rotation around X axis
    const distanceDelta = physics.speed * dt;
    const spinDelta = distanceDelta / this.wheelRadius;
    this.wheelRotationAccumulator += spinDelta;

    this.rotatingWheelMeshes.forEach(mesh => {
      mesh.rotation.x = this.wheelRotationAccumulator;
    });

    // 5. Dynamic brake & reverse lights
    const isBraking = (physics.speed > 0.5 && physics.gear === 'D' && physics.chassisPitch > 0.01) ||
                      (physics.speed < -0.5 && physics.gear === 'R' && physics.chassisPitch > 0.01);
    const isReversing = physics.gear === 'R';

    if (this.brakeLightMaterial) {
      this.brakeLightMaterial.emissiveIntensity = isBraking ? 2.8 : 0.4;
    }

    if (this.reverseLightMaterial) {
      this.reverseLightMaterial.emissiveIntensity = isReversing ? 2.0 : 0.0;
    }
  }

  getWorldBounds(targetBox = new THREE.Box3()) {
    targetBox.setFromObject(this.root);
    return targetBox;
  }
}
