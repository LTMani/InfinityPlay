import * as THREE from 'three';
import { GameEngine } from '../../core/GameEngine';
import { PlazaBuildings } from './PlazaBuildings';
import { RoadwaySystem } from './RoadwaySystem';
import { ParkingBayManager } from './ParkingBayManager';
import { BuildingDefinition } from '../../types';
import { sound } from '../../audio/SoundEngine';

export class BuildingPlacer {
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private groundPlane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.0); // y = 0.0

  public previewMesh: THREE.Group = new THREE.Group();
  public previewBox: THREE.Mesh;
  public activeDef: BuildingDefinition | null = null;
  public isDemolishMode: boolean = false;

  private camera: THREE.Camera;
  private scene: THREE.Scene;
  private engine: GameEngine;
  private plazaBuildings: PlazaBuildings;
  private roadways: RoadwaySystem;
  private bayManager: ParkingBayManager;

  constructor(
    camera: THREE.Camera,
    scene: THREE.Scene,
    engine: GameEngine,
    plazaBuildings: PlazaBuildings,
    roadways: RoadwaySystem,
    bayManager: ParkingBayManager
  ) {
    this.camera = camera;
    this.scene = scene;
    this.engine = engine;
    this.plazaBuildings = plazaBuildings;
    this.roadways = roadways;
    this.bayManager = bayManager;

    // Create Holographic Placement Preview Box
    const geo = new THREE.BoxGeometry(8, 4, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });
    this.previewBox = new THREE.Mesh(geo, mat);
    this.previewMesh.add(this.previewBox);
    this.previewMesh.visible = false;
    this.scene.add(this.previewMesh);

    // Sync any pre-existing placed buildings from save/engine
    this.syncInitialPlacedBuildings();
  }

  private syncInitialPlacedBuildings(): void {
    this.engine.buildings.forEach(b => {
      // Map grid (x, y) to 3D world (X, Z)
      const worldX = (b.x - 10) * 4 + 25;
      const worldZ = (b.y - 10) * 4 + 10;
      this.plazaBuildings.addPlacedBuilding(b.id, b.defId, worldX, worldZ);
    });
  }

  public setActiveDef(def: BuildingDefinition | null): void {
    this.activeDef = def;
    this.previewMesh.visible = def !== null && !this.isDemolishMode;

    if (def) {
      // Adjust preview box size to building dimensions (scaled to 3D units)
      const w = def.width * 4.5;
      const d = def.height * 4.5;
      this.previewBox.scale.set(w / 8, 1, d / 8);
    }
  }

  public setDemolishMode(demolish: boolean): void {
    this.isDemolishMode = demolish;
    if (demolish) {
      this.setActiveDef(null);
    }
  }

  /**
   * Updates holographic placement preview position based on mouse raycast
   */
  public handlePointerMove(e: MouseEvent, canvas: HTMLCanvasElement): void {
    if (!this.activeDef && !this.isDemolishMode) {
      this.previewMesh.visible = false;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersection = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(this.groundPlane, intersection);

    if (hit && this.activeDef) {
      // Snap to 4m plaza grid
      const snappedX = Math.round(intersection.x / 4) * 4;
      const snappedZ = Math.round(intersection.z / 4) * 4;

      // Restrict placement to the wide plaza apron (X between 12 and 60, Z between -90 and 120)
      const clampedX = Math.max(12, Math.min(60, snappedX));
      const clampedZ = Math.max(-90, Math.min(120, snappedZ));

      this.previewMesh.position.set(clampedX, 2.0, clampedZ);
      this.previewMesh.visible = true;

      // Check affordability and collision
      const canAfford = this.engine.economy.cash >= this.activeDef.cost;
      const mat = this.previewBox.material as THREE.MeshBasicMaterial;
      mat.color.setHex(canAfford ? 0x22c55e : 0xef4444);
    }
  }

  /**
   * Handles building construction or demolition on click
   */
  public handleClick(e: MouseEvent, canvas: HTMLCanvasElement): boolean {
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Demolish Mode
    if (this.isDemolishMode) {
      const intersects = this.raycaster.intersectObjects(this.plazaBuildings.dynamicGroup.children, true);
      if (intersects.length > 0) {
        let topGroup: THREE.Object3D | null = intersects[0].object;
        while (topGroup && topGroup.parent !== this.plazaBuildings.dynamicGroup) {
          topGroup = topGroup.parent;
        }

        if (topGroup && topGroup.name) {
          const bldId = topGroup.name;
          this.engine.demolishBuilding(bldId);
          this.plazaBuildings.removePlacedBuilding(bldId);
          sound.playDemolishSound();
          return true;
        }
      }
      return false;
    }

    // 2. Construction Placement Mode
    if (this.activeDef) {
      const intersection = new THREE.Vector3();
      const hit = this.raycaster.ray.intersectPlane(this.groundPlane, intersection);

      if (hit) {
        const snappedX = Math.round(intersection.x / 4) * 4;
        const snappedZ = Math.round(intersection.z / 4) * 4;
        const worldX = Math.max(12, Math.min(60, snappedX));
        const worldZ = Math.max(-90, Math.min(120, snappedZ));

        // Map world to simulation grid
        const gridX = Math.round((worldX - 25) / 4) + 10;
        const gridY = Math.round((worldZ - 10) / 4) + 10;

        const success = this.engine.buildBuilding(this.activeDef.id, gridX, gridY);
        if (success) {
          const placedBld = this.engine.buildings[this.engine.buildings.length - 1];

          // 1. Add 3D Building Mesh
          this.plazaBuildings.addPlacedBuilding(placedBld.id, this.activeDef.id, worldX, worldZ);

          // 2. Automatically Add Asphalt Driveway from Service Road (X = 5.0) to this new building!
          this.roadways.addDriveway(5.0, worldZ, worldX, worldZ);

          // 3. Register functional customer bay in ParkingBayManager!
          this.registerDynamicBay(placedBld.id, this.activeDef.id, worldX, worldZ);

          sound.playCashSound();
          return true;
        }
      }
    }

    return false;
  }

  private registerDynamicBay(id: string, defId: string, x: number, z: number): void {
    if (defId === 'PUMP_ISLAND' || defId === 'DIESEL_ISLAND') {
      this.bayManager.bays.push({
        id: `dyn_pump_${id}`,
        category: 'FUEL',
        name: `Expanded Fuel Island (${x}, ${z})`,
        position: new THREE.Vector3(x, 0.08, z),
        rotationY: 0,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 8),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 8),
        occupiedBy: null,
        dwellTime: 5.5
      });
    } else if (defId === 'EV_STATION') {
      this.bayManager.bays.push({
        id: `dyn_ev_${id}`,
        category: 'EV',
        name: `Expanded EV Station (${x}, ${z})`,
        position: new THREE.Vector3(x, 0.08, z),
        rotationY: Math.PI / 2,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 6),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 6),
        occupiedBy: null,
        dwellTime: 6.5
      });
    } else if (defId === 'DINER') {
      this.bayManager.bays.push({
        id: `dyn_diner_${id}`,
        category: 'DINER',
        name: `Expanded Diner Bay (${x}, ${z})`,
        position: new THREE.Vector3(x, 0.08, z - 4),
        rotationY: Math.PI / 2,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 8),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 8),
        occupiedBy: null,
        dwellTime: 7.0
      });
    } else if (defId === 'CONVENIENCE_STORE') {
      this.bayManager.bays.push({
        id: `dyn_shop_${id}`,
        category: 'SHOP',
        name: `Expanded Store Bay (${x}, ${z})`,
        position: new THREE.Vector3(x, 0.08, z),
        rotationY: Math.PI / 2,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 6),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 6),
        occupiedBy: null,
        dwellTime: 5.0
      });
    } else if (defId === 'MOTEL_ROOM' || defId === 'MOTEL_CABIN') {
      this.bayManager.bays.push({
        id: `dyn_motel_${id}`,
        category: 'MOTEL',
        name: `Expanded Motel Bay (${x}, ${z})`,
        position: new THREE.Vector3(x, 0.08, z),
        rotationY: Math.PI / 2,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 6),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 8),
        occupiedBy: null,
        dwellTime: 8.0
      });
    } else if (defId === 'PARKING_CAR' || defId === 'PARKING_TRUCK') {
      this.bayManager.bays.push({
        id: `dyn_parking_${id}`,
        category: 'PARKING',
        name: `Expanded Parking Stall (${x}, ${z})`,
        position: new THREE.Vector3(x, 0.08, z),
        rotationY: 0,
        approachPoint: new THREE.Vector3(5.0, 0.08, z - 6),
        exitPoint: new THREE.Vector3(5.0, 0.08, z + 6),
        occupiedBy: null,
        dwellTime: 6.0
      });
    }
  }
}
