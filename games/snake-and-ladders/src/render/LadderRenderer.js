// LadderRenderer.js - 3D Realistic Wooden & Brass Ladders with Climb Path Sampling

import * as THREE from 'three';
import { BOARD_CONFIG, getSquareCoordinates } from '../game/BoardData.js';

export class LadderRenderer {
  constructor(scene) {
    this.scene = scene;
    this.laddersGroup = new THREE.Group();
    this.laddersGroup.name = 'LaddersGroup';
    this.scene.add(this.laddersGroup);

    this.ladderDataMap = new Map(); // baseSquare -> { startPos, endPos, rungsCount, group }

    this.initMaterials();
    this.createLadders();
  }

  initMaterials() {
    // Rich aged oak wood for side rails
    this.woodMat = new THREE.MeshStandardMaterial({
      color: 0x5c3317,
      roughness: 0.45,
      metalness: 0.05
    });

    // Polished brass rungs and joints
    this.brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.8
    });
  }

  createLadders() {
    const ladderPairs = Object.entries(BOARD_CONFIG.ladders);

    ladderPairs.forEach(([baseSqStr, topSq]) => {
      const baseSq = parseInt(baseSqStr, 10);
      this.createSingleLadder(baseSq, topSq);
    });
  }

  createSingleLadder(baseSquare, topSquare) {
    const baseCoord = getSquareCoordinates(baseSquare);
    const topCoord = getSquareCoordinates(topSquare);

    const startPos = new THREE.Vector3(
      baseCoord.x,
      BOARD_CONFIG.boardHeight + 0.16,
      baseCoord.z
    );

    const endPos = new THREE.Vector3(
      topCoord.x,
      BOARD_CONFIG.boardHeight + 0.38,
      topCoord.z
    );

    const ladderGroup = new THREE.Group();

    // Vector along ladder incline
    const dir = new THREE.Vector3().subVectors(endPos, startPos);
    const length = dir.length();
    const ladderDir = dir.clone().normalize();

    // Perpendicular horizontal vector for ladder width
    const up = new THREE.Vector3(0, 1, 0);
    const sideDir = new THREE.Vector3().crossVectors(ladderDir, up).normalize();
    const ladderWidth = 0.55;

    // Center position
    const centerPos = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);

    // 1. Two Wooden Side Rails
    const railThick = 0.06;
    const railHeight = 0.12;
    const railGeo = new THREE.BoxGeometry(railThick, railHeight, length);

    // Left Rail
    const leftRail = new THREE.Mesh(railGeo, this.woodMat);
    leftRail.castShadow = true;
    leftRail.receiveShadow = true;

    // Right Rail
    const rightRail = new THREE.Mesh(railGeo, this.woodMat);
    rightRail.castShadow = true;
    rightRail.receiveShadow = true;

    // Create container aligned with ladder rotation
    const railsContainer = new THREE.Group();
    railsContainer.position.copy(centerPos);
    railsContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), ladderDir);

    leftRail.position.set(-ladderWidth / 2, 0, 0);
    rightRail.position.set(ladderWidth / 2, 0, 0);

    railsContainer.add(leftRail);
    railsContainer.add(rightRail);
    ladderGroup.add(railsContainer);

    // 2. Brass Rungs evenly spaced
    const rungSpacing = 0.42;
    const numRungs = Math.max(3, Math.floor(length / rungSpacing));
    const rungRadius = 0.032;
    const rungGeo = new THREE.CylinderGeometry(rungRadius, rungRadius, ladderWidth, 8);
    rungGeo.rotateZ(Math.PI / 2); // align along side axis

    for (let i = 1; i <= numRungs; i++) {
      const t = i / (numRungs + 1);
      const zOffset = (t - 0.5) * length;

      const rungMesh = new THREE.Mesh(rungGeo, this.brassMat);
      rungMesh.position.set(0, 0, zOffset);
      rungMesh.castShadow = true;
      railsContainer.add(rungMesh);
    }

    this.laddersGroup.add(ladderGroup);

    this.ladderDataMap.set(baseSquare, {
      baseSquare,
      topSquare,
      startPos,
      endPos,
      numRungs,
      group: ladderGroup
    });
  }

  /**
   * Samples 3D position along the ladder:
   * t = 0 at baseSquare, t = 1 at topSquare.
   * Adds natural vertical stepping bounce as rungs are climbed.
   */
  getClimbPosition(baseSquare, t) {
    const ladder = this.ladderDataMap.get(baseSquare);
    if (!ladder) return null;

    const currentPos = new THREE.Vector3().lerpVectors(ladder.startPos, ladder.endPos, t);

    // Subtle physical hop over each rung
    const rungStep = Math.sin(t * Math.PI * ladder.numRungs);
    const rungHop = Math.max(0, rungStep) * 0.12;
    currentPos.y += rungHop + 0.15; // Clearance above rungs

    return currentPos;
  }
}
