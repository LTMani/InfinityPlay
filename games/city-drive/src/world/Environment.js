/**
 * Environment.js
 * Generates stylized urban scenery including skyscrapers, modern office towers,
 * streetlights, trees, highway signs, atmospheric lighting, and horizon fog.
 */

import * as THREE from 'three';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.buildingMaterials = [];
    this.windowTexture = null;

    this._setupLighting();
    this._initTexturesAndMaterials();
  }

  _setupLighting() {
    // 1. Ambient Hemisphere Light (Sky vs Ground color bounce)
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 0.75);
    hemiLight.position.set(0, 100, 0);
    this.scene.add(hemiLight);

    // 2. Main Sun Directional Light with real-time soft shadows
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    this.sunLight.position.set(45, 80, -35);
    this.sunLight.castShadow = true;

    // Optimize shadow map resolution and frustum
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 250;

    const d = 40;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0004;

    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);

    // 3. Stylized Horizon Fog for smooth distance culling
    this.scene.background = new THREE.Color(0x93c5fd);
    this.scene.fog = new THREE.FogExp2(0x93c5fd, 0.0035);
  }

  _initTexturesAndMaterials() {
    // Generate lightweight procedural illuminated window grid texture using HTML5 Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 128, 256);

    const cols = 4;
    const rows = 12;
    const cellW = 128 / cols;
    const cellH = 256 / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Randomly lit or unlit modern windows
        const isLit = Math.random() > 0.35;
        if (isLit) {
          const warmOrCool = Math.random() > 0.5 ? '#fef08a' : '#bae6fd';
          ctx.fillStyle = warmOrCool;
        } else {
          ctx.fillStyle = '#0f172a';
        }
        ctx.fillRect(c * cellW + 4, r * cellH + 4, cellW - 8, cellH - 8);
      }
    }

    this.windowTexture = new THREE.CanvasTexture(canvas);
    this.windowTexture.wrapS = THREE.RepeatWrapping;
    this.windowTexture.wrapT = THREE.RepeatWrapping;

    // Distinct stylized building facade materials
    const buildingColors = [0x1e293b, 0x334155, 0x0f172a, 0x1e1b4b, 0x27272a, 0x374151];
    this.buildingMaterials = buildingColors.map(col => new THREE.MeshStandardMaterial({
      color: col,
      roughness: 0.3,
      metalness: 0.5,
      map: this.windowTexture
    }));

    this.antennaMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2
    });

    this.streetlampPoleMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.7,
      roughness: 0.3
    });

    this.streetlampLightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 2.2
    });

    this.treeTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x5a3825,
      roughness: 0.9
    });

    this.treeLeavesMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.85
    });
  }

  /**
   * Generates city scenery (buildings, streetlights, trees) for a chunk.
   * @param {THREE.Group} chunkGroup
   * @param {number} chunkLength
   * @param {number} roadHalfWidth
   * @param {number} sidewalkWidth
   */
  populateChunk(chunkGroup, chunkLength = 120, roadHalfWidth = 7.6, sidewalkWidth = 3.6) {
    const minBuildingX = roadHalfWidth + sidewalkWidth + 4.0;

    // 1. Streetlights along sidewalks
    const lampSpacing = 32;
    const numLamps = Math.floor(chunkLength / lampSpacing);

    [-1, 1].forEach(side => {
      const lampX = side * (roadHalfWidth + 0.6);

      for (let i = 0; i < numLamps; i++) {
        const lampZ = -chunkLength / 2 + 10 + i * lampSpacing;
        const lamp = this._createStreetlight(side);
        lamp.position.set(lampX, 0, lampZ);
        chunkGroup.add(lamp);
      }
    });

    // 2. Urban Sidewalk Trees
    const treeSpacing = 28;
    const numTrees = Math.floor(chunkLength / treeSpacing);

    [-1, 1].forEach(side => {
      const treeX = side * (roadHalfWidth + sidewalkWidth * 0.7);

      for (let i = 0; i < numTrees; i++) {
        const treeZ = -chunkLength / 2 + 22 + i * treeSpacing;
        const tree = this._createStylizedTree();
        tree.position.set(treeX, 0, treeZ);
        chunkGroup.add(tree);
      }
    });

    // 3. Buildings on Left and Right sides
    [-1, 1].forEach(side => {
      let currentZ = -chunkLength / 2 + 8;

      while (currentZ < chunkLength / 2 - 12) {
        const width = 14 + Math.random() * 14;
        const depth = 16 + Math.random() * 12;
        const height = 24 + Math.random() * 65; // 24m to ~90m skyscrapers

        const buildingX = side * (minBuildingX + depth / 2 + Math.random() * 6);
        const building = this._createBuilding(width, height, depth);
        building.position.set(buildingX, 0, currentZ + width / 2);
        chunkGroup.add(building);

        currentZ += width + 4 + Math.random() * 6;
      }
    });
  }

  _createBuilding(width, height, depth) {
    const buildingGroup = new THREE.Group();

    // Select random building material
    const matIndex = Math.floor(Math.random() * this.buildingMaterials.length);
    const baseMat = this.buildingMaterials[matIndex].clone();
    // Configure texture repeat based on dimensions
    if (baseMat.map) {
      baseMat.map = baseMat.map.clone();
      baseMat.map.repeat.set(Math.max(1, Math.round(width / 5)), Math.max(2, Math.round(height / 6)));
      baseMat.map.needsUpdate = true;
    }

    // Main tower volume
    const geo = new THREE.BoxGeometry(depth, height, width);
    const mesh = new THREE.Mesh(geo, baseMat);
    mesh.position.set(0, height / 2, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    buildingGroup.add(mesh);

    // Architectural rooftop structure (HVAC, Helipad, or Spire)
    const roofType = Math.random();
    if (roofType > 0.6) {
      // Rooftop communication spire / antenna
      const spireH = 8 + Math.random() * 12;
      const spireGeo = new THREE.CylinderGeometry(0.12, 0.45, spireH, 8);
      const spireMesh = new THREE.Mesh(spireGeo, this.antennaMaterial);
      spireMesh.position.set(0, height + spireH / 2, 0);
      spireMesh.castShadow = true;
      buildingGroup.add(spireMesh);

      // Warning beacon light on tip
      const beaconGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(0, height + spireH, 0);
      buildingGroup.add(beaconMesh);
    } else if (roofType > 0.3) {
      // Rooftop mechanical penthouse
      const pentW = width * 0.55;
      const pentD = depth * 0.55;
      const pentH = 4.0;
      const pentGeo = new THREE.BoxGeometry(pentD, pentH, pentW);
      const pentMesh = new THREE.Mesh(pentGeo, this.streetlampPoleMat);
      pentMesh.position.set(0, height + pentH / 2, 0);
      pentMesh.castShadow = true;
      buildingGroup.add(pentMesh);
    }

    return buildingGroup;
  }

  _createStreetlight(side) {
    const lampGroup = new THREE.Group();

    // Vertical pole (height 6.5m)
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.14, 6.5, 12);
    const poleMesh = new THREE.Mesh(poleGeo, this.streetlampPoleMat);
    poleMesh.position.set(0, 3.25, 0);
    poleMesh.castShadow = true;
    lampGroup.add(poleMesh);

    // Horizontal arm reaching toward the road
    const armLen = 2.4;
    const armGeo = new THREE.BoxGeometry(armLen, 0.12, 0.12);
    const armMesh = new THREE.Mesh(armGeo, this.streetlampPoleMat);
    armMesh.position.set(-side * (armLen / 2 - 0.1), 6.4, 0);
    lampGroup.add(armMesh);

    // Downward lamp fixture with emissive glow
    const headGeo = new THREE.BoxGeometry(0.8, 0.16, 0.35);
    const headMesh = new THREE.Mesh(headGeo, this.streetlampLightMat);
    headMesh.position.set(-side * (armLen - 0.2), 6.32, 0);
    lampGroup.add(headMesh);

    return lampGroup;
  }

  _createStylizedTree() {
    const treeGroup = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.26, 2.4, 8);
    const trunkMesh = new THREE.Mesh(trunkGeo, this.treeTrunkMat);
    trunkMesh.position.set(0, 1.2, 0);
    trunkMesh.castShadow = true;
    treeGroup.add(trunkMesh);

    // Foliage canopy (layered low-poly cones or octahedrons)
    const foliageGeo = new THREE.ConeGeometry(1.6, 3.5, 8);
    const foliageMesh = new THREE.Mesh(foliageGeo, this.treeLeavesMat);
    foliageMesh.position.set(0, 3.8, 0);
    foliageMesh.castShadow = true;
    treeGroup.add(foliageMesh);

    const foliageGeo2 = new THREE.ConeGeometry(1.3, 2.8, 8);
    const foliageMesh2 = new THREE.Mesh(foliageGeo2, this.treeLeavesMat);
    foliageMesh2.position.set(0, 5.0, 0);
    foliageMesh2.castShadow = true;
    treeGroup.add(foliageMesh2);

    return treeGroup;
  }

  /**
   * Syncs directional sun light position with vehicle to optimize shadow map usage.
   */
  update(vehiclePos) {
    this.sunLight.position.set(vehiclePos.x + 45, 80, vehiclePos.z - 35);
    this.sunLight.target.position.set(vehiclePos.x, 0, vehiclePos.z);
  }
}

