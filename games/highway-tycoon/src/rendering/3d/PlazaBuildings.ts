import * as THREE from 'three';

export class PlazaBuildings {
  public group: THREE.Group = new THREE.Group();
  public dynamicGroup: THREE.Group = new THREE.Group();
  public placedMeshes: Map<string, THREE.Group> = new Map();

  // Level-specific facility groups
  public zone1GasGroup: THREE.Group = new THREE.Group();
  public zone1DieselAndEVGroup: THREE.Group = new THREE.Group();
  public zone2StoreGroup: THREE.Group = new THREE.Group();
  public zone3RestGroup: THREE.Group = new THREE.Group();
  public zone2LockBanner: THREE.Group | null = null;
  public zone3LockBanner: THREE.Group | null = null;

  public landParcelsGroup: THREE.Group = new THREE.Group();
  public parcelMeshes: Map<string, { unownedMesh: THREE.Group; ownedMesh: THREE.Group }> = new Map();

  public currentLevel: number = 1;

  constructor() {
    this.group.add(this.dynamicGroup);
    this.group.add(this.zone1GasGroup);
    this.group.add(this.zone1DieselAndEVGroup);
    this.group.add(this.zone2StoreGroup);
    this.group.add(this.zone3RestGroup);
    this.group.add(this.landParcelsGroup);
    this.buildLandParcels();

    // === ZONE 1: FUEL (Level 1: Regular Gas Station) ===
    const gasStation = this.createPumpIslandMesh(new THREE.Vector3(22, 0.0, -60), false);
    this.zone1GasGroup.add(gasStation);

    // === ZONE 1: EXPANSION (Level 2: Commercial Diesel Truck Lane + EV Hub) ===
    // Deep Commercial Diesel Lane for 18-Wheelers (36m away from service road!)
    const dieselLane = this.createTruckDieselCanopyMesh(new THREE.Vector3(39.5, 0.0, -60));
    const evStalls = this.createEVStationMesh(new THREE.Vector3(22, 0.0, -35));
    this.zone1DieselAndEVGroup.add(dieselLane);
    this.zone1DieselAndEVGroup.add(evStalls);

    // === ZONE 2: STORE & FOOD PLAZA (Level 3: QuickMart & Route 66 Diner) ===
    const store = this.createStoreMesh(new THREE.Vector3(35, 0.0, 5));
    const diner = this.createDinerMesh(new THREE.Vector3(35, 0.0, 28));
    this.zone2StoreGroup.add(store);
    this.zone2StoreGroup.add(diner);

    // === ZONE 3: REST & LODGING PLAZA (Level 4: Motel, Cabins & Rest Park) ===
    const restPark = this.buildRestParkGroup(new THREE.Vector3(35, 0.0, 52));
    const motel = this.createMotelRoomMesh(new THREE.Vector3(35, 0.0, 75), false);
    const cabin1 = this.createMotelRoomMesh(new THREE.Vector3(42, 0.0, 102), true);
    this.zone3RestGroup.add(restPark);
    this.zone3RestGroup.add(motel);
    this.zone3RestGroup.add(cabin1);

    // Construction lock banners for unreached zones
    this.zone2LockBanner = this.createLockBannerMesh(new THREE.Vector3(32, 0.0, 15), 'ZONE 2: STORE & FOOD (Unlocks at Level 3)');
    this.zone3LockBanner = this.createLockBannerMesh(new THREE.Vector3(32, 0.0, 80), 'ZONE 3: MOTEL & REST AREA (Unlocks at Level 4)');
    this.group.add(this.zone2LockBanner);
    this.group.add(this.zone3LockBanner);

    // Highway Entrance Roadside Billboard
    this.buildRoadsideBillboard(new THREE.Vector3(-8, 0.0, -110));

    // Initialize visibility for Level 1
    this.setPlazaLevel(1);
  }

  /**
   * Dynamically reveals facilities and removes lock banners as the player levels up
   */
  public setPlazaLevel(level: number): void {
    this.currentLevel = level;

    // Zone 1: Gas always open
    this.zone1GasGroup.visible = true;

    // Zone 1: Diesel & EV open at Level 2+
    this.zone1DieselAndEVGroup.visible = level >= 2;

    // Zone 2: Store & Diner open at Level 3+
    this.zone2StoreGroup.visible = level >= 3;
    if (this.zone2LockBanner) {
      this.zone2LockBanner.visible = level < 3;
    }

    // Zone 3: Motel & Rest Area open at Level 4+
    this.zone3RestGroup.visible = level >= 4;
    if (this.zone3LockBanner) {
      this.zone3LockBanner.visible = level < 4;
    }
  }

  /**
   * Procedural 3D Generator for ANY placed building definition
   */
  public addPlacedBuilding(id: string, defId: string, x: number, z: number): THREE.Group {
    if (this.placedMeshes.has(id)) {
      this.removePlacedBuilding(id);
    }

    const pos = new THREE.Vector3(x, 0.0, z);
    const mesh = this.generateMeshForDef(defId, pos);
    mesh.name = id;
    this.dynamicGroup.add(mesh);
    this.placedMeshes.set(id, mesh);
    return mesh;
  }

  public removePlacedBuilding(id: string): void {
    const mesh = this.placedMeshes.get(id);
    if (mesh) {
      this.dynamicGroup.remove(mesh);
      this.placedMeshes.delete(id);
    }
  }

  public generateMeshForDef(defId: string, pos: THREE.Vector3): THREE.Group {
    switch (defId) {
      case 'PUMP_ISLAND':
        return this.createPumpIslandMesh(pos, false);
      case 'DIESEL_ISLAND':
        return this.createPumpIslandMesh(pos, true);
      case 'EV_STATION':
        return this.createEVStationMesh(pos);
      case 'CONVENIENCE_STORE':
        return this.createStoreMesh(pos);
      case 'DINER':
        return this.createDinerMesh(pos);
      case 'MOTEL_ROOM':
        return this.createMotelRoomMesh(pos, false);
      case 'MOTEL_CABIN':
        return this.createMotelRoomMesh(pos, true);
      case 'CAR_WASH':
        return this.createCarWashMesh(pos);
      case 'RESTROOM':
        return this.createRestroomMesh(pos);
      case 'BILLBOARD':
        return this.createBillboardMesh(pos);
      case 'TREE':
        return this.createPalmTreeMesh(pos);
      case 'PARKING_CAR':
        return this.createParkingBayMesh(pos, false);
      case 'PARKING_TRUCK':
        return this.createParkingBayMesh(pos, true);
      case 'DRIVEWAY':
        return this.createDrivewayPadMesh(pos);
      default:
        return this.createGenericBuildingMesh(pos, 0x64748b);
    }
  }

  // --- MODULAR PROCEDURAL 3D GENERATORS ---

  public createPumpIslandMesh(pos: THREE.Vector3, isDiesel: boolean): THREE.Group {
    const group = new THREE.Group();
    const canopyColor = isDiesel ? 0x059669 : 0xdc2626;

    // Asphalt forecourt pad
    const pad = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 18),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.05;
    pad.receiveShadow = true;
    group.add(pad);

    // Concrete Island
    const island = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.5, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 })
    );
    island.position.y = 0.25;
    island.receiveShadow = true;
    group.add(island);

    // Yellow Curbs
    const curb = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.25, 12.4),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 })
    );
    curb.position.y = 0.12;
    group.add(curb);

    // Fuel Dispensers
    for (const dz of [-3.5, 3.5]) {
      const pump = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 3.4, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
      );
      pump.position.set(0, 1.95, dz);
      pump.castShadow = true;
      group.add(pump);

      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(1.65, 1.0, 1.6),
        new THREE.MeshBasicMaterial({ color: isDiesel ? 0x10b981 : 0xf59e0b })
      );
      screen.position.set(0, 2.6, dz);
      group.add(screen);
    }

    // 4 White Steel Columns
    const colMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.6, roughness: 0.3 });
    for (const cx of [-2.4, 2.4]) {
      for (const cz of [-5.0, 5.0]) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 9.0, 16), colMat);
        col.position.set(cx, 4.5, cz);
        col.castShadow = true;
        group.add(col);
      }
    }

    // Canopy Roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(11, 1.4, 16),
      new THREE.MeshStandardMaterial({ color: canopyColor, roughness: 0.4 })
    );
    roof.position.y = 9.7;
    roof.castShadow = true;
    group.add(roof);

    const rim = new THREE.Mesh(
      new THREE.BoxGeometry(11.3, 0.6, 16.3),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    rim.position.y = 9.7;
    group.add(rim);

    group.position.copy(pos);
    return group;
  }

  public createEVStationMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();

    // Green Asphalt Stall
    const pad = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 10),
      new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.8 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.06;
    pad.receiveShadow = true;
    group.add(pad);

    // Two 350kW White Charging Pedestals
    for (const dx of [-2.2, 2.2]) {
      const ped = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 3.2, 1.0),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
      );
      ped.position.set(dx, 1.6, -3.8);
      ped.castShadow = true;
      group.add(ped);

      // Glowing Cyan LED Core
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.7, 16),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
      );
      led.rotation.z = Math.PI / 2;
      led.position.set(dx, 2.2, -3.8);
      group.add(led);
    }

    group.position.copy(pos);
    return group;
  }

  public createStoreMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(16, 6.5, 14),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
    );
    body.position.y = 3.25;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Cyan header
    const header = new THREE.Mesh(
      new THREE.BoxGeometry(16.3, 1.8, 14.3),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 })
    );
    header.position.y = 5.8;
    group.add(header);

    // Glass storefront
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(13, 3.8, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.8 })
    );
    glass.position.set(0, 2.4, 7.15);
    group.add(glass);

    group.position.copy(pos);
    return group;
  }

  public createDinerMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();

    // Sandstone walls
    const bldg = new THREE.Mesh(
      new THREE.BoxGeometry(15, 5.8, 14),
      new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.75 })
    );
    bldg.position.y = 2.9;
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    group.add(bldg);

    // Red mansard roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(12.8, 4.2, 4),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
    );
    roof.position.y = 7.8;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Windows
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(11, 3.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.75 })
    );
    glass.position.set(0, 2.8, 7.12);
    group.add(glass);

    group.position.copy(pos);
    return group;
  }

  public createMotelRoomMesh(pos: THREE.Vector3, isCabin: boolean): THREE.Group {
    const group = new THREE.Group();
    const color = isCabin ? 0x6366f1 : 0x475569;

    const bldg = new THREE.Mesh(
      new THREE.BoxGeometry(12, 7.5, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
    );
    bldg.position.y = 3.75;
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    group.add(bldg);

    // Doors and lamps
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.8, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 })
    );
    door.position.set(0, 1.6, 6.12);
    group.add(door);

    // Warm entrance light
    const lamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    lamp.position.set(1.4, 2.5, 6.15);
    group.add(lamp);

    group.position.copy(pos);
    return group;
  }

  public createCarWashMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();

    // Wash Tunnel Frame (Open ended)
    const tunnel = new THREE.Mesh(
      new THREE.BoxGeometry(10, 6.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 })
    );
    tunnel.position.y = 3.25;
    tunnel.castShadow = true;
    group.add(tunnel);

    // Tunnel Opening Hollow
    const cut = new THREE.Mesh(
      new THREE.BoxGeometry(7, 5.0, 16.5),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
    );
    cut.position.y = 2.8;
    group.add(cut);

    group.position.copy(pos);
    return group;
  }

  public createRestroomMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();

    const bldg = new THREE.Mesh(
      new THREE.BoxGeometry(8, 4.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.8 })
    );
    bldg.position.y = 2.4;
    bldg.castShadow = true;
    group.add(bldg);

    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sign.position.set(0, 3.2, 4.05);
    group.add(sign);

    group.position.copy(pos);
    return group;
  }

  public createBillboardMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();

    for (const px of [-3.2, 3.2]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 10, 16),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 })
      );
      post.position.set(px, 5.0, 0);
      post.castShadow = true;
      group.add(post);
    }

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(11, 5.8, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    board.position.set(0, 10.5, 0);
    board.castShadow = true;
    group.add(board);

    const ad = new THREE.Mesh(
      new THREE.PlaneGeometry(10.4, 5.2),
      new THREE.MeshBasicMaterial({ color: 0xd97706 })
    );
    ad.position.set(0, 10.5, 0.32);
    group.add(ad);

    group.position.copy(pos);
    return group;
  }

  public createPalmTreeMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();

    // Curved Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.5, 6.0, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
    );
    trunk.position.y = 3.0;
    trunk.castShadow = true;
    group.add(trunk);

    // Green Foliage Crown
    for (let a = 0; a < 6; a++) {
      const frond = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 4.0, 4),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
      );
      frond.rotation.z = Math.PI / 3;
      frond.rotation.y = (a * Math.PI) / 3;
      frond.position.set(0, 6.0, 0);
      frond.castShadow = true;
      group.add(frond);
    }

    group.position.copy(pos);
    return group;
  }

  public createParkingBayMesh(pos: THREE.Vector3, isTruck: boolean): THREE.Group {
    const group = new THREE.Group();
    const w = isTruck ? 6.0 : 4.2;
    const l = isTruck ? 14.0 : 7.0;

    const pad = new THREE.Mesh(
      new THREE.PlaneGeometry(w, l),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.06;
    pad.receiveShadow = true;
    group.add(pad);

    // White stall lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (const dx of [-w / 2 + 0.15, w / 2 - 0.15]) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.2, l), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(dx, 0.08, 0);
      group.add(line);
    }

    group.position.copy(pos);
    return group;
  }

  public createDrivewayPadMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();
    const pad = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.88 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.07;
    pad.receiveShadow = true;
    group.add(pad);

    group.position.copy(pos);
    return group;
  }

  public createGenericBuildingMesh(pos: THREE.Vector3, color: number): THREE.Group {
    const group = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(8, 5, 8),
      new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
    );
    box.position.y = 2.5;
    box.castShadow = true;
    group.add(box);
    group.position.copy(pos);
    return group;
  }

  // --- INITIAL PHOTO-MATCHED ASSETS ---

  private buildRedRoofDiner(pos: THREE.Vector3): void {
    const group = this.createDinerMesh(pos);
    this.group.add(group);
  }

  private buildOpenAirGasStation(pos: THREE.Vector3): void {
    const group = this.createPumpIslandMesh(pos, false);
    this.group.add(group);
  }

  private buildQuickMartStore(pos: THREE.Vector3): void {
    const group = this.createStoreMesh(pos);
    this.group.add(group);
  }

  private buildMotelLodge(pos: THREE.Vector3): void {
    const group = this.createMotelRoomMesh(pos, false);
    this.group.add(group);
  }

  private buildTruckerCabins(pos: THREE.Vector3): void {
    const cabin1 = this.createMotelRoomMesh(pos, true);
    this.group.add(cabin1);

    const cabin2 = this.createMotelRoomMesh(new THREE.Vector3(pos.x, pos.y, pos.z + 14), true);
    this.group.add(cabin2);
  }
  public createTruckDieselCanopyMesh(pos: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();

    // Large commercial asphalt pad for 18-wheelers
    const pad = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.05;
    pad.receiveShadow = true;
    group.add(pad);

    // Concrete islands with high-flow commercial diesel dispensers
    for (const dx of [-4.0, 4.0]) {
      const island = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.45, 18),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 })
      );
      island.position.set(dx, 0.22, 0);
      island.receiveShadow = true;
      group.add(island);

      // Yellow safety curbs
      const curb = new THREE.Mesh(
        new THREE.BoxGeometry(3.7, 0.25, 18.4),
        new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 })
      );
      curb.position.set(dx, 0.12, 0);
      group.add(curb);

      // Dual commercial high-speed diesel dispensers
      for (const dz of [-4.5, 4.5]) {
        const pump = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 3.8, 2.0),
          new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5 })
        );
        pump.position.set(dx, 2.1, dz);
        pump.castShadow = true;
        group.add(pump);

        const screen = new THREE.Mesh(
          new THREE.BoxGeometry(1.52, 0.9, 1.4),
          new THREE.MeshBasicMaterial({ color: 0x10b981 })
        );
        screen.position.set(dx, 2.8, dz);
        group.add(screen);
      }
    }

    // High-clearance steel columns (10.5m tall for tall semi-truck trailers)
    const colMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.6, roughness: 0.3 });
    for (const cx of [-7.5, 7.5]) {
      for (const cz of [-10, 10]) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 11.0, 16), colMat);
        col.position.set(cx, 5.5, cz);
        col.castShadow = true;
        group.add(col);
      }
    }

    // High-clearance illuminated diesel canopy
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(18, 1.6, 26),
      new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.4 })
    );
    roof.position.y = 11.5;
    roof.castShadow = true;
    group.add(roof);

    const rim = new THREE.Mesh(
      new THREE.BoxGeometry(18.4, 0.7, 26.4),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    rim.position.y = 11.5;
    group.add(rim);

    group.position.copy(pos);
    return group;
  }

  public buildRestParkGroup(pos: THREE.Vector3): THREE.Group {
    const parkGroup = new THREE.Group();

    // Vibrant Grass Lawn Pad
    const lawn = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 20),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.95 })
    );
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = 0.04;
    lawn.receiveShadow = true;
    parkGroup.add(lawn);

    // Picnic Benches
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
    for (const bz of [-6, 5]) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.9, 2.0), woodMat);
      bench.position.set(0, 0.45, bz);
      bench.castShadow = true;
      parkGroup.add(bench);
    }

    // Shade Trees
    const tree1 = this.createPalmTreeMesh(new THREE.Vector3(-7, 0, -5));
    const tree2 = this.createPalmTreeMesh(new THREE.Vector3(7, 0, 6));
    parkGroup.add(tree1);
    parkGroup.add(tree2);

    parkGroup.position.copy(pos);
    return parkGroup;
  }

  public createLockBannerMesh(pos: THREE.Vector3, text: string): THREE.Group {
    const bannerGroup = new THREE.Group();

    // Concrete barrier posts
    const postMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    for (const px of [-6, 6]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 4.0, 16), postMat);
      post.position.set(px, 2.0, 0);
      post.castShadow = true;
      bannerGroup.add(post);
    }

    // Warning sign board
    const boardGeo = new THREE.BoxGeometry(13.0, 3.2, 0.4);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 3.5, 0);
    bannerGroup.add(board);

    // Orange/yellow hazard stripes border
    const borderGeo = new THREE.BoxGeometry(13.3, 0.4, 0.42);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const borderTop = new THREE.Mesh(borderGeo, borderMat);
    borderTop.position.set(0, 4.9, 0);
    const borderBot = new THREE.Mesh(borderGeo, borderMat);
    borderBot.position.set(0, 2.1, 0);
    bannerGroup.add(borderTop);
    bannerGroup.add(borderBot);

    // Hazard traffic cones on ground
    const coneGeo = new THREE.ConeGeometry(0.5, 1.4, 8);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    for (let cx = -7; cx <= 7; cx += 3.5) {
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(cx, 0.7, 1.5);
      cone.castShadow = true;
      bannerGroup.add(cone);
    }

    bannerGroup.position.copy(pos);
    return bannerGroup;
  }

  private buildRoadsideBillboard(pos: THREE.Vector3): void {
    const group = this.createBillboardMesh(pos);
    group.rotation.y = -Math.PI / 8;
    this.group.add(group);
  }

  private buildEVParkingStalls(pos: THREE.Vector3): void {
    const group = this.createEVStationMesh(pos);
    this.group.add(group);
  }

  /**
   * Constructs the 4 expandable territory plots surrounding the central travel plaza
   */
  public buildLandParcels(): void {
    const plots = [
      { id: 'plot_north', name: 'North Commercial Acreage', x: 40, z: -105, w: 34, d: 38 },
      { id: 'plot_east', name: 'East Highway Retail Strip', x: 65, z: -15, w: 28, d: 90 },
      { id: 'plot_south', name: 'South Logistics Truck Terminal', x: 40, z: 145, w: 34, d: 38 },
      { id: 'plot_deep_east', name: 'Deep East Resort & Oasis Park', x: 65, z: 85, w: 28, d: 90 }
    ];

    plots.forEach(plot => {
      // 1. Unowned Visual: Surveyor Stakes with Yellow/Black Ribbon
      const unownedGroup = new THREE.Group();
      unownedGroup.position.set(plot.x, 0, plot.z);

      // Boundary line wireframe
      const borderGeo = new THREE.BoxGeometry(plot.w, 0.1, plot.d);
      const borderMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
      const border = new THREE.Mesh(borderGeo, borderMat);
      border.position.y = 0.05;
      unownedGroup.add(border);

      // Wooden corner surveyor pegs
      const pegMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
      for (const dx of [-plot.w / 2, plot.w / 2]) {
        for (const dz of [-plot.d / 2, plot.d / 2]) {
          const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 2.2, 8), pegMat);
          peg.position.set(dx, 1.1, dz);
          peg.castShadow = true;
          unownedGroup.add(peg);
        }
      }

      // 2. Owned Visual: Paved Asphalt Apron with Yellow Safety Markings
      const ownedGroup = new THREE.Group();
      ownedGroup.position.set(plot.x, 0, plot.z);

      const padGeo = new THREE.PlaneGeometry(plot.w, plot.d);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.88 });
      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.rotation.x = -Math.PI / 2;
      padMesh.position.y = 0.045;
      padMesh.receiveShadow = true;
      ownedGroup.add(padMesh);

      // Perimeter curbs
      const curbMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.6 });
      const curbGeo = new THREE.BoxGeometry(plot.w, 0.18, 0.4);
      const curbN = new THREE.Mesh(curbGeo, curbMat);
      curbN.position.set(0, 0.09, -plot.d / 2);
      const curbS = new THREE.Mesh(curbGeo, curbMat);
      curbS.position.set(0, 0.09, plot.d / 2);
      ownedGroup.add(curbN);
      ownedGroup.add(curbS);

      ownedGroup.visible = false; // Initially unowned

      this.landParcelsGroup.add(unownedGroup);
      this.landParcelsGroup.add(ownedGroup);
      this.parcelMeshes.set(plot.id, { unownedMesh: unownedGroup, ownedMesh: ownedGroup });
    });
  }

  public updatePurchasedParcels(purchased: Set<string>): void {
    this.parcelMeshes.forEach((meshPair, id) => {
      const isOwned = purchased.has(id);
      meshPair.unownedMesh.visible = !isOwned;
      meshPair.ownedMesh.visible = isOwned;
    });
  }
}
