import * as THREE from 'three';

export class RoadwaySystem {
  public group: THREE.Group = new THREE.Group();
  public drivewaysGroup: THREE.Group = new THREE.Group();
  public extraLanesGroup: THREE.Group = new THREE.Group();

  // Spline paths for highway, off-ramp / service drive, and merge return
  public highwayCurve: THREE.CatmullRomCurve3;
  public offRampCurve: THREE.CatmullRomCurve3;
  public plazaReturnCurve: THREE.CatmullRomCurve3;

  constructor() {
    this.group.add(this.drivewaysGroup);
    this.group.add(this.extraLanesGroup);

    // 1. Extended Ground-Level Highway (Length = 900m, Z from -450 to +450):
    // Cruising straight along X = -18. Far-distance entry and exit prevents any sudden vanishing!
    this.highwayCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, 0.05, -450),
      new THREE.Vector3(-18, 0.05, -300),
      new THREE.Vector3(-18, 0.05, -160),
      new THREE.Vector3(-18, 0.05, 0),
      new THREE.Vector3(-18, 0.05, 160),
      new THREE.Vector3(-18, 0.05, 300),
      new THREE.Vector3(-18, 0.05, 450)
    ]);

    // 2. Seamless Deceleration Turnoff & Plaza Service Boulevard:
    // Diverges smoothly from highway right lane (X = -13, Z = -165), curves across shoulder into service road at X = 5.0 (Z = -85)
    this.offRampCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-13, 0.05, -165),
      new THREE.Vector3(-9, 0.05, -140),
      new THREE.Vector3(-3, 0.05, -118),
      new THREE.Vector3(2, 0.05, -100),
      new THREE.Vector3(5, 0.05, -85),  // Entrance to Zone 1 (Fuel & EV)
      new THREE.Vector3(5, 0.05, -40),  // Fuel & EV frontage
      new THREE.Vector3(5, 0.05, 15),   // Zone 2 (Store & Food) frontage
      new THREE.Vector3(5, 0.05, 75),   // Zone 3 (Rest & Lodging) frontage
      new THREE.Vector3(5, 0.05, 125)   // Exit of Plaza
    ]);

    // 3. Seamless Plaza Acceleration Slip Lane & Highway Merge:
    // Curves gently out from service road at Z = 125, merges smoothly into right highway lane by Z = 205
    this.plazaReturnCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5, 0.05, 125),
      new THREE.Vector3(2, 0.05, 145),
      new THREE.Vector3(-3, 0.05, 165),
      new THREE.Vector3(-9, 0.05, 185),
      new THREE.Vector3(-13, 0.05, 205)
    ]);

    this.buildGroundHighway();
    this.buildPlazaRoadways();
    this.buildParkingLots();
    this.buildCrosswalks();
    this.buildRoadMarkingsAndArrows();
  }

  /**
   * Flat ground-level arterial highway with dark charcoal asphalt tarmac,
   * double solid yellow centerline, white dashed lane dividers, and outer white shoulder lines.
   */
  private buildGroundHighway(): void {
    const roadWidth = 22;
    const roadLength = 900; // 900m long highway spanning Z = -450 to +450

    // Highway Asphalt Surface Mesh
    const hGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
    const hMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.1
    });
    const highwayMesh = new THREE.Mesh(hGeo, hMat);
    highwayMesh.rotation.x = -Math.PI / 2;
    highwayMesh.position.set(-18, 0.04, 0);
    highwayMesh.receiveShadow = true;
    this.group.add(highwayMesh);

    // Double Solid Yellow Center Line along highway at X = -18
    for (const offset of [-0.3, 0.3]) {
      const yellowLineGeo = new THREE.PlaneGeometry(0.25, roadLength);
      const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const yellowLine = new THREE.Mesh(yellowLineGeo, yellowLineMat);
      yellowLine.rotation.x = -Math.PI / 2;
      yellowLine.position.set(-18 + offset, 0.06, 0);
      this.group.add(yellowLine);
    }

    // White Dashed Lane Dividers (Lane 1 & Lane 2 on both sides)
    for (const laneX of [-23.5, -12.5]) {
      for (let z = -440; z < 440; z += 9) {
        const dashGeo = new THREE.PlaneGeometry(0.3, 4.2);
        const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const dash = new THREE.Mesh(dashGeo, dashMat);
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(laneX, 0.06, z);
        this.group.add(dash);
      }
    }

    // Outer Solid White Shoulder Lines
    for (const shoulderX of [-28.8, -7.2]) {
      const whiteLineGeo = new THREE.PlaneGeometry(0.28, roadLength);
      const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
      const whiteLine = new THREE.Mesh(whiteLineGeo, whiteLineMat);
      whiteLine.rotation.x = -Math.PI / 2;
      whiteLine.position.set(shoulderX, 0.06, 0);
      this.group.add(whiteLine);
    }
  }

  /**
   * Plaza service road boulevard and continuous seamless connection aprons
   */
  private buildPlazaRoadways(): void {
    const serviceWidth = 11;
    const serviceLength = 220; // Z from -90 to +130

    const sMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.88 });

    // 1. Straight Service Boulevard Asphalt along X = 5.0 (spanning X = -0.5 to 10.5)
    const sGeo = new THREE.PlaneGeometry(serviceWidth, serviceLength);
    const serviceMesh = new THREE.Mesh(sGeo, sMat);
    serviceMesh.rotation.x = -Math.PI / 2;
    serviceMesh.position.set(5.0, 0.04, 20);
    serviceMesh.receiveShadow = true;
    this.group.add(serviceMesh);

    // 2. Seamless Deceleration Turnoff Apron (Fully continuous from X = -7.2 to 10.5, Z = -165 to -85)
    // Connects highway right shoulder directly to the service road with zero gaps!
    const decelGeo = new THREE.BufferGeometry();
    const decelVertices = new Float32Array([
      // Triangle 1: Highway shoulder to turnoff entrance
      -7.2, 0.04, -165,
      -7.2, 0.04, -85,
      10.5, 0.04, -85,

      // Triangle 2: Filling the throat between highway and service road
      -7.2, 0.04, -165,
      10.5, 0.04, -85,
      -0.5, 0.04, -85,

      // Triangle 3: Tapering lead-in
      -13.0, 0.04, -165,
      -7.2, 0.04, -165,
      -0.5, 0.04, -125
    ]);
    decelGeo.setAttribute('position', new THREE.BufferAttribute(decelVertices, 3));
    decelGeo.computeVertexNormals();
    const decelMesh = new THREE.Mesh(decelGeo, sMat);
    decelMesh.receiveShadow = true;
    this.group.add(decelMesh);

    // 3. Seamless Acceleration Merge Apron (Connecting Service Road Exit at Z = 125 back to Highway at Z = 205)
    const accelGeo = new THREE.BufferGeometry();
    const accelVertices = new Float32Array([
      // Triangle 1: Service road exit to highway shoulder
      -0.5, 0.04, 125,
      10.5, 0.04, 125,
      -7.2, 0.04, 205,

      // Triangle 2: Highway merge throat
      -0.5, 0.04, 125,
      -7.2, 0.04, 205,
      -7.2, 0.04, 125,

      // Triangle 3: Tapering merge back into right lane
      -7.2, 0.04, 205,
      -13.0, 0.04, 205,
      -7.2, 0.04, 150
    ]);
    accelGeo.setAttribute('position', new THREE.BufferAttribute(accelVertices, 3));
    accelGeo.computeVertexNormals();
    const accelMesh = new THREE.Mesh(accelGeo, sMat);
    accelMesh.receiveShadow = true;
    this.group.add(accelMesh);

    // 4. Pedestrian Sidewalk Islands along the eastern side (X = 11.2) - NOT blocking any road!
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
    // Safe sections between zone driveways
    const sidewalkSections = [
      { z: -15, length: 30 },
      { z: 45, length: 24 }
    ];
    sidewalkSections.forEach(sec => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, sec.length), curbMat);
      curb.position.set(11.0, 0.11, sec.z);
      curb.receiveShadow = true;
      this.group.add(curb);
    });

    // White dashed center line along service road (Z = -80 to +120)
    for (let z = -80; z < 120; z += 6) {
      const dashGeo = new THREE.PlaneGeometry(0.3, 3.2);
      const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(5.0, 0.06, z);
      this.group.add(dash);
    }
  }

  /**
   * Paved customer parking lots in Zone 2 and Zone 3
   */
  private buildParkingLots(): void {
    const lotW = 12;
    const lotL = 80;
    const lotGeo = new THREE.PlaneGeometry(lotW, lotL);
    const lotMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const lotMesh = new THREE.Mesh(lotGeo, lotMat);
    lotMesh.rotation.x = -Math.PI / 2;
    lotMesh.position.set(17, 0.045, 45);
    lotMesh.receiveShadow = true;
    this.group.add(lotMesh);

    // White Painted Angled Parking Stall Lines (30° angle)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const stallLen = 5.5;

    for (let z = 10; z < 80; z += 4.5) {
      const stallGeo = new THREE.PlaneGeometry(0.2, stallLen);
      const stall = new THREE.Mesh(stallGeo, lineMat);
      stall.rotation.x = -Math.PI / 2;
      stall.rotation.z = Math.PI / 6;
      stall.position.set(17, 0.06, z);
      this.group.add(stall);
    }
  }

  /**
   * Zebra pedestrian crosswalks connecting parking to zone facilities
   */
  private buildCrosswalks(): void {
    const crosswalkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const crosswalkZs = [-45, 15, 75];

    crosswalkZs.forEach(z => {
      for (let x = 0.5; x <= 9.5; x += 1.2) {
        const barGeo = new THREE.PlaneGeometry(0.65, 3.8);
        const bar = new THREE.Mesh(barGeo, crosswalkMat);
        bar.rotation.x = -Math.PI / 2;
        bar.position.set(x, 0.06, z);
        this.group.add(bar);
      }
    });
  }

  /**
   * Painted Directional Navigation Arrows on Road Surface
   */
  private buildRoadMarkingsAndArrows(): void {
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (const z of [-300, -180, -60, 60, 180, 300]) {
      const arrowGeo = new THREE.PlaneGeometry(0.7, 2.8);
      const arrow = new THREE.Mesh(arrowGeo, arrowMat);
      arrow.rotation.x = -Math.PI / 2;
      arrow.position.set(-13, 0.06, z);
      this.group.add(arrow);

      const headGeo = new THREE.ConeGeometry(1.0, 1.6, 3);
      const head = new THREE.Mesh(headGeo, arrowMat);
      head.rotation.x = -Math.PI / 2;
      head.position.set(-13, 0.06, z + 1.8);
      this.group.add(head);
    }

    // Turn-Right navigation arrow pointing into the deceleration slip lane
    const exitArrow = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 2.5), arrowMat);
    exitArrow.rotation.x = -Math.PI / 2;
    exitArrow.rotation.z = -Math.PI / 4;
    exitArrow.position.set(-11.5, 0.06, -150);
    this.group.add(exitArrow);
  }

  /**
   * Dynamically constructs an asphalt driveway pad connecting from service road to a newly placed building
   */
  public addDriveway(startX: number, startZ: number, endX: number, endZ: number): void {
    const dx = endX - startX;
    const dz = endZ - startZ;
    const len = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);

    const drivewayGeo = new THREE.PlaneGeometry(5.0, len);
    const drivewayMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.88 });
    const driveway = new THREE.Mesh(drivewayGeo, drivewayMat);
    driveway.rotation.x = -Math.PI / 2;
    driveway.rotation.z = -angle;
    driveway.position.set((startX + endX) / 2, 0.05, (startZ + endZ) / 2);
    driveway.receiveShadow = true;
    this.drivewaysGroup.add(driveway);
  }

  /**
   * Activates 6-Lane Expanded Highway Superhighway
   */
  public setHighwayLanes(lanes: number): void {
    if (lanes < 6) return;
    if (this.extraLanesGroup.children.length > 0) return; // Already created

    const extraW = 6.0;
    const roadLength = 900;
    const extraMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });

    // Additional outer lanes on western and eastern sides
    for (const x of [-32.0, -4.0]) {
      const extraGeo = new THREE.PlaneGeometry(extraW, roadLength);
      const mesh = new THREE.Mesh(extraGeo, extraMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0.042, 0);
      mesh.receiveShadow = true;
      this.extraLanesGroup.add(mesh);
    }
  }
}
