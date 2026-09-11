/**
 * Road.js
 * Generates modular multi-lane urban road segments with
 * asphalt surface, lane dividers, double yellow center line,
 * solid edge lines, curbs, sidewalks, and crosswalks.
 */

import * as THREE from 'three';

export class Road {
  constructor(config = {}) {
    this.laneCount = config.laneCount || 4;
    this.laneWidth = config.laneWidth || 3.8;
    this.roadWidth = this.laneCount * this.laneWidth; // 15.2m
    this.sidewalkWidth = config.sidewalkWidth || 3.6;
    this.curbHeight = 0.22;
    this.segmentLength = config.segmentLength || 120; // Length of each chunk

    this._initMaterials();
  }

  _initMaterials() {
    // High-performance procedural materials
    this.asphaltMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.85,
      metalness: 0.15
    });

    this.sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
      metalness: 0.05
    });

    this.curbMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8,
      metalness: 0.1
    });

    this.whiteMarkingMat = new THREE.MeshBasicMaterial({
      color: 0xf1f5f9
    });

    this.yellowMarkingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24
    });

    this.grassMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.95,
      metalness: 0.02
    });
  }

  /**
   * Creates a single modular road chunk group at a given center Z position.
   */
  createChunk(centerZ) {
    const chunkGroup = new THREE.Group();
    chunkGroup.name = `RoadChunk_${centerZ}`;

    const halfRoad = this.roadWidth / 2;
    const len = this.segmentLength;

    // 1. Asphalt Road Surface
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, len);
    const roadMesh = new THREE.Mesh(roadGeo, this.asphaltMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0.01, 0);
    roadMesh.receiveShadow = true;
    chunkGroup.add(roadMesh);

    // 2. Sidewalks and Curbs (Left & Right)
    [-1, 1].forEach(side => {
      const curbX = side * (halfRoad + 0.15);
      const sidewalkX = side * (halfRoad + 0.3 + this.sidewalkWidth / 2);

      // Raised Curb stone
      const curbGeo = new THREE.BoxGeometry(0.3, this.curbHeight, len);
      const curbMesh = new THREE.Mesh(curbGeo, this.curbMat);
      curbMesh.position.set(curbX, this.curbHeight / 2, 0);
      curbMesh.receiveShadow = true;
      chunkGroup.add(curbMesh);

      // Sidewalk walking pavement
      const sidewalkGeo = new THREE.BoxGeometry(this.sidewalkWidth, this.curbHeight - 0.02, len);
      const sidewalkMesh = new THREE.Mesh(sidewalkGeo, this.sidewalkMat);
      sidewalkMesh.position.set(sidewalkX, (this.curbHeight - 0.02) / 2, 0);
      sidewalkMesh.receiveShadow = true;
      chunkGroup.add(sidewalkMesh);

      // Outer Grass Verge extending into city background
      const grassGeo = new THREE.PlaneGeometry(60, len);
      const grassMesh = new THREE.Mesh(grassGeo, this.grassMat);
      grassMesh.rotation.x = -Math.PI / 2;
      grassMesh.position.set(side * (halfRoad + this.sidewalkWidth + 30), 0.005, 0);
      grassMesh.receiveShadow = true;
      chunkGroup.add(grassMesh);
    });

    // 3. Road Markings
    // Center Double Yellow Lines
    [-0.14, 0.14].forEach(yOffset => {
      const centerLineGeo = new THREE.PlaneGeometry(0.12, len);
      const centerLine = new THREE.Mesh(centerLineGeo, this.yellowMarkingMat);
      centerLine.rotation.x = -Math.PI / 2;
      centerLine.position.set(yOffset, 0.02, 0);
      chunkGroup.add(centerLine);
    });

    // Outer Solid White Shoulder Lines
    [-halfRoad + 0.35, halfRoad - 0.35].forEach(xPos => {
      const edgeLineGeo = new THREE.PlaneGeometry(0.15, len);
      const edgeLine = new THREE.Mesh(edgeLineGeo, this.whiteMarkingMat);
      edgeLine.rotation.x = -Math.PI / 2;
      edgeLine.position.set(xPos, 0.02, 0);
      chunkGroup.add(edgeLine);
    });

    // Dashed White Lane Dividers
    // Lane boundaries at x = -halfRoad + laneWidth (e.g. -3.8) and x = +3.8
    const dashedPositions = [-this.laneWidth, this.laneWidth];
    const stripeLength = 4.0;
    const stripeGap = 6.0;
    const stripePeriod = stripeLength + stripeGap;
    const stripeCount = Math.floor(len / stripePeriod);

    dashedPositions.forEach(xPos => {
      for (let i = 0; i < stripeCount; i++) {
        const stripeGeo = new THREE.PlaneGeometry(0.14, stripeLength);
        const stripe = new THREE.Mesh(stripeGeo, this.whiteMarkingMat);
        stripe.rotation.x = -Math.PI / 2;
        const zOffset = -len / 2 + i * stripePeriod + stripeLength / 2 + 2.0;
        stripe.position.set(xPos, 0.02, zOffset);
        chunkGroup.add(stripe);
      }
    });

    // Zebra Crosswalk near one end of the segment
    const crosswalkZ = -len / 2 + 12;
    const barWidth = 0.55;
    const barLength = 3.6;
    const barSpacing = 0.9;
    const barCount = Math.floor(this.roadWidth / barSpacing) - 2;

    for (let b = 0; b < barCount; b++) {
      const barX = -halfRoad + 1.2 + b * barSpacing;
      const barGeo = new THREE.PlaneGeometry(barWidth, barLength);
      const barMesh = new THREE.Mesh(barGeo, this.whiteMarkingMat);
      barMesh.rotation.x = -Math.PI / 2;
      barMesh.position.set(barX, 0.021, crosswalkZ);
      chunkGroup.add(barMesh);
    }

    chunkGroup.position.z = centerZ;
    return chunkGroup;
  }
}

