import * as THREE from 'three';
import { RoadwaySystem } from './RoadwaySystem';
import { PlazaBuildings } from './PlazaBuildings';
import { VehicleController } from './VehicleController';
import { ParkingBayManager } from './ParkingBayManager';
import { PedestrianController } from './PedestrianController';
import { BuildingPlacer } from './BuildingPlacer';
import { GameEngine } from '../../core/GameEngine';

export class ThreeScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  public roadways: RoadwaySystem;
  public buildings: PlazaBuildings;
  public vehicleController: VehicleController;
  public bayManager: ParkingBayManager;
  public pedestrianController: PedestrianController;
  public buildingPlacer: BuildingPlacer;
  private engine: GameEngine | null = null;

  // Camera Orbit / Pan Controls State
  private isMouseDown: boolean = false;
  private isRightMouseDown: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };

  // Panoramic Camera Calibration for Big Map (Southwest Diagonal Front Overview)
  private readonly DEFAULT_TARGET = new THREE.Vector3(15, 0, -25);
  private readonly DEFAULT_RADIUS = 95;
  private readonly DEFAULT_THETA = -Math.PI * 0.65; // Southwest diagonal front overview
  private readonly DEFAULT_PHI = Math.PI / 3.3;     // ~54° elevation pitch

  private cameraTarget: THREE.Vector3 = this.DEFAULT_TARGET.clone();
  private cameraRadius: number = this.DEFAULT_RADIUS;
  private cameraTheta: number = this.DEFAULT_THETA;
  private cameraPhi: number = this.DEFAULT_PHI;

  public targetCameraTarget: THREE.Vector3 = this.DEFAULT_TARGET.clone();
  public targetCameraRadius: number = this.DEFAULT_RADIUS;
  public targetCameraTheta: number = this.DEFAULT_THETA;
  public targetCameraPhi: number = this.DEFAULT_PHI;

  public onSelectFacility?: (type: 'FUEL' | 'SHOP' | 'MOTEL' | null) => void;

  constructor(canvas: HTMLCanvasElement, engine?: GameEngine) {
    this.engine = engine || null;

    // 1. WebGL Renderer with Soft Shadows & Antialiasing
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Open Sunny Atmosphere & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7dd3fc); // Bright sky blue
    this.scene.fog = new THREE.FogExp2(0xbae6fd, 0.0012);

    // 3. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.5,
      2000
    );
    this.updateCameraPosition();

    // 4. Sunny Warm Lighting
    this.setupLighting();

    // 5. Build Big Spacious Open Terrain (600m x 600m)
    this.buildSpaciousEnvironment();

    // 6. Build Single Roadway System, Zoned Buildings, and Traffic
    this.bayManager = new ParkingBayManager();
    this.pedestrianController = new PedestrianController();
    this.scene.add(this.pedestrianController.group);

    this.roadways = new RoadwaySystem();
    this.scene.add(this.roadways.group);

    this.buildings = new PlazaBuildings();
    this.scene.add(this.buildings.group);

    this.vehicleController = new VehicleController(
      this.roadways,
      this.bayManager,
      this.pedestrianController,
      engine
    );
    this.scene.add(this.vehicleController.group);

    // 7. Interactive 3D Building Placement & Raycasting (Ground plane y = 0.0)
    this.buildingPlacer = new BuildingPlacer(
      this.camera,
      this.scene,
      engine || new GameEngine(),
      this.buildings,
      this.roadways,
      this.bayManager
    );

    // 8. Mouse Orbit, Pan & Zoom Handlers
    this.setupMouseControls(canvas);
  }

  private setupLighting(): void {
    // Ambient Hemisphere Light (Warm Sky Light + Grass Bounce)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x86efac, 0.95);
    this.scene.add(hemiLight);

    // Sun Directional Light with Shadows
    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    sunLight.position.set(-90, 180, -60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 600;
    sunLight.shadow.camera.left = -220;
    sunLight.shadow.camera.right = 220;
    sunLight.shadow.camera.top = 220;
    sunLight.shadow.camera.bottom = -220;
    this.scene.add(sunLight);
  }

  /**
   * Big Spacious Map:
   * Flat 600m x 600m lush landscape, spacious open field, trees along boundaries,
   * no cliffs, no suspension bridges, no giant skyscrapers looming over the road.
   */
  private buildSpaciousEnvironment(): void {
    // 1. Vast Terrain Ground Plane (600m x 600m) at y = 0
    const terrainGeo = new THREE.PlaneGeometry(600, 600, 32, 32);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x34d399, // Fresh vibrant meadow green
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(terrainGeo, terrainMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, 0);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Concrete Plaza Foundation Apron under the entire travel plaza area
    // Spans X from -5 to 65, Z from -100 to 140
    const apronGeo = new THREE.PlaneGeometry(74, 250);
    const apronMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Dark slate asphalt paving for plaza lots
      roughness: 0.9
    });
    const apron = new THREE.Mesh(apronGeo, apronMat);
    apron.rotation.x = -Math.PI / 2;
    apron.position.set(30, 0.02, 20);
    apron.receiveShadow = true;
    this.scene.add(apron);

    // 3. Perimeter Ambient Trees & Foliage (Natural park border)
    this.buildPerimeterTrees();
  }

  /**
   * Trees placed naturally around the perimeter and between zones
   */
  private buildPerimeterTrees(): void {
    const treeGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });

    const createTree = (x: number, z: number, scale: number = 1.0) => {
      const tree = new THREE.Group();
      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * scale, 0.5 * scale, 4 * scale, 8), trunkMat);
      trunk.position.y = 2 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      // Layered conical foliage
      for (let j = 0; j < 3; j++) {
        const r = (2.2 - j * 0.5) * scale;
        const h = 3.0 * scale;
        const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), foliageMat);
        cone.position.y = (3.5 + j * 1.8) * scale;
        cone.castShadow = true;
        tree.add(cone);
      }
      tree.position.set(x, 0, z);
      treeGroup.add(tree);
    };

    // Far West Tree Line (beyond the highway)
    for (let z = -200; z <= 200; z += 18) {
      createTree(-45 + (Math.sin(z) * 4), z, 1.2 + Math.cos(z) * 0.2);
      createTree(-60 + (Math.cos(z) * 5), z + 6, 1.4);
    }

    // Far East Tree Line (beyond the plaza)
    for (let z = -180; z <= 180; z += 20) {
      createTree(75 + (Math.sin(z) * 4), z, 1.3);
      createTree(90 + (Math.cos(z) * 6), z + 8, 1.5);
    }

    // North & South Perimeter Groves
    for (let x = -30; x <= 70; x += 15) {
      createTree(x, -160 + Math.sin(x) * 5, 1.3);
      createTree(x, 180 + Math.cos(x) * 5, 1.3);
    }

    this.scene.add(treeGroup);
  }

  private updateCameraPosition(): void {
    const x = this.cameraTarget.x + this.cameraRadius * Math.sin(this.cameraPhi) * Math.sin(this.cameraTheta);
    const y = this.cameraTarget.y + this.cameraRadius * Math.cos(this.cameraPhi);
    const z = this.cameraTarget.z + this.cameraRadius * Math.sin(this.cameraPhi) * Math.cos(this.cameraTheta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.cameraTarget);
  }

  private setupMouseControls(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.isMouseDown = true;
      } else if (e.button === 2) {
        this.isRightMouseDown = true;
      }
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      // 1. Update 3D Building Placement Preview
      this.buildingPlacer.handlePointerMove(e, canvas);

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };

      if (this.isMouseDown) {
        // Smooth Orbit Rotation
        this.targetCameraTheta -= deltaX * 0.005;
        this.targetCameraPhi = Math.max(0.12, Math.min(Math.PI / 2.05, this.targetCameraPhi + deltaY * 0.005));
      } else if (this.isRightMouseDown) {
        // Smooth Pan Camera
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        this.targetCameraTarget.addScaledVector(right, -deltaX * 0.22);
        this.targetCameraTarget.addScaledVector(forward, deltaY * 0.22);
      }
    });

    // 2. Click to Select Facility or Place/Demolish
    canvas.addEventListener('click', (e) => {
      if (this.buildingPlacer.activeDef || this.buildingPlacer.isDemolishMode) {
        this.buildingPlacer.handleClick(e, canvas);
        return;
      }

      // Raycast against ground plane to detect which facility was clicked
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      const hitPoint = new THREE.Vector3();
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      if (raycaster.ray.intersectPlane(plane, hitPoint)) {
        if (hitPoint.x > 8 && hitPoint.x < 65) {
          if (hitPoint.z < -20) {
            this.onSelectFacility?.('FUEL');
          } else if (hitPoint.z >= -20 && hitPoint.z < 45) {
            this.onSelectFacility?.('SHOP');
          } else {
            this.onSelectFacility?.('MOTEL');
          }
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.isRightMouseDown = false;
    });

    // Smooth Zoom on Wheel
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.12 : 0.88;
      this.targetCameraRadius = Math.max(30, Math.min(300, this.targetCameraRadius * zoomFactor));
    }, { passive: false });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  public handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public render(dt: number): void {
    // Smooth camera glide
    const lerpSpeed = Math.min(1.0, dt * 7.5);
    this.cameraTarget.lerp(this.targetCameraTarget, lerpSpeed);
    this.cameraRadius = THREE.MathUtils.lerp(this.cameraRadius, this.targetCameraRadius, lerpSpeed);
    this.cameraTheta = THREE.MathUtils.lerp(this.cameraTheta, this.targetCameraTheta, lerpSpeed);
    this.cameraPhi = THREE.MathUtils.lerp(this.cameraPhi, this.targetCameraPhi, lerpSpeed);
    this.updateCameraPosition();

    // Sync plaza level changes
    if (this.engine && this.buildings.currentLevel !== this.engine.plazaLevel) {
      this.buildings.setPlazaLevel(this.engine.plazaLevel);
    }

    // Sync purchased land parcels & highway lanes
    if (this.engine) {
      this.buildings.updatePurchasedParcels(this.engine.purchasedParcels);
      this.roadways.setHighwayLanes(this.engine.highwayLanesLevel);
    }

    // 1. Advance vehicles with collision-avoidance and car-following
    this.vehicleController.update(dt, this.camera);

    // 2. Advance animated 3D pedestrian customers
    this.pedestrianController.update(dt, this.camera);

    // 3. Render 3D scene
    this.renderer.render(this.scene, this.camera);
  }

  public setCameraPreset(preset: 'OVERVIEW' | 'FUEL' | 'STORE' | 'MOTEL'): void {
    if (preset === 'OVERVIEW') {
      this.targetCameraTarget.set(16, 0, 10);
      this.targetCameraRadius = 135;
      this.targetCameraTheta = -Math.PI * 0.65;
      this.targetCameraPhi = Math.PI / 3.2;
    } else if (preset === 'FUEL') {
      this.targetCameraTarget.set(22, 0, -55);
      this.targetCameraRadius = 65;
      this.targetCameraTheta = -Math.PI * 0.65;
      this.targetCameraPhi = Math.PI / 3.5;
    } else if (preset === 'STORE') {
      this.targetCameraTarget.set(32, 0, 15);
      this.targetCameraRadius = 65;
      this.targetCameraTheta = -Math.PI * 0.65;
      this.targetCameraPhi = Math.PI / 3.5;
    } else if (preset === 'MOTEL') {
      this.targetCameraTarget.set(32, 0, 75);
      this.targetCameraRadius = 70;
      this.targetCameraTheta = -Math.PI * 0.65;
      this.targetCameraPhi = Math.PI / 3.5;
    }
  }

  public rotateCamera(degrees: number): void {
    this.targetCameraTheta += THREE.MathUtils.degToRad(degrees);
  }

  public zoomCamera(factor: number): void {
    this.targetCameraRadius = Math.max(30, Math.min(300, this.targetCameraRadius * factor));
  }

  public resetToPhotoView(): void {
    this.targetCameraTarget.copy(this.DEFAULT_TARGET);
    this.targetCameraRadius = this.DEFAULT_RADIUS;
    this.targetCameraTheta = this.DEFAULT_THETA;
    this.targetCameraPhi = this.DEFAULT_PHI;
  }

  public destroy(): void {
    this.renderer.dispose();
  }
}
