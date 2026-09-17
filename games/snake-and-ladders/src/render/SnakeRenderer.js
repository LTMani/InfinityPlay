// SnakeRenderer.js - 3D Sculpted Serpentine Snakes with Scales, Sculpted Head, and Idle Motion

import * as THREE from 'three';
import { BOARD_CONFIG, getSquareCoordinates } from '../game/BoardData.js';
import { TextureGenerator } from './TextureGenerator.js';

export class SnakeRenderer {
  constructor(scene) {
    this.scene = scene;
    this.snakesGroup = new THREE.Group();
    this.snakesGroup.name = 'SnakesGroup';
    this.scene.add(this.snakesGroup);

    this.snakeDataMap = new Map(); // headSquare -> { curve, mesh, headMesh, length, points }
    this.scalesTexture = TextureGenerator.createSnakeScalesTexture('#1b4332', '#d4af37', 512, 512);

    this.createSnakes();
  }

  createSnakes() {
    const snakePairs = Object.entries(BOARD_CONFIG.snakes);

    snakePairs.forEach(([headSqStr, tailSq]) => {
      const headSq = parseInt(headSqStr, 10);
      this.createSingleSnake(headSq, tailSq);
    });
  }

  createSingleSnake(headSquare, tailSquare) {
    const headCoord = getSquareCoordinates(headSquare);
    const tailCoord = getSquareCoordinates(tailSquare);

    // Calculate intermediate control points for natural S-curve undulation
    const numMidPoints = 4;
    const points = [];

    // Tail anchor point (low on board)
    points.push(new THREE.Vector3(tailCoord.x, BOARD_CONFIG.boardHeight + 0.08, tailCoord.z));

    const dx = headCoord.x - tailCoord.x;
    const dz = headCoord.z - tailCoord.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Perpendicular vector for serpentine wiggles
    const perpX = -dz / (dist || 1);
    const perpZ = dx / (dist || 1);

    for (let i = 1; i <= numMidPoints; i++) {
      const t = i / (numMidPoints + 1);
      const baseX = tailCoord.x + dx * t;
      const baseZ = tailCoord.z + dz * t;

      // Serpentine sine wave sideways offset
      const wiggleAmp = 0.55 * Math.sin(t * Math.PI * 2);
      const wx = baseX + perpX * wiggleAmp;
      const wz = baseZ + perpZ * wiggleAmp;

      // Elevated arch above board so numbers below are visible
      const wy = BOARD_CONFIG.boardHeight + 0.35 + Math.sin(t * Math.PI) * 0.55;
      points.push(new THREE.Vector3(wx, wy, wz));
    }

    // Head anchor point (elevated, poised to strike)
    const headPos = new THREE.Vector3(
      headCoord.x,
      BOARD_CONFIG.boardHeight + 0.38,
      headCoord.z
    );
    points.push(headPos);

    // Catmull-Rom Spline
    const curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = 'centripetal';

    // 3D Tube for body
    const tubularSegments = 64;
    const radius = 0.18;
    const radialSegments = 12;
    const tubeGeo = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);

    // Realistic snake scales material with specular sheen
    const snakeMat = new THREE.MeshStandardMaterial({
      map: this.scalesTexture,
      roughness: 0.35,
      metalness: 0.25,
      bumpScale: 0.04
    });

    const bodyMesh = new THREE.Mesh(tubeGeo, snakeMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.snakesGroup.add(bodyMesh);

    // Sculpted 3D Snake Head at head square
    const headGroup = this.createSnakeHead(headPos, points[points.length - 2]);
    this.snakesGroup.add(headGroup);

    this.snakeDataMap.set(headSquare, {
      headSquare,
      tailSquare,
      curve,
      bodyMesh,
      headGroup,
      initialPoints: points.map(p => p.clone())
    });
  }

  createSnakeHead(headPos, prevPoint) {
    const headGroup = new THREE.Group();
    headGroup.position.copy(headPos);

    // Orient head facing forward along direction from prev point
    const dir = new THREE.Vector3().subVectors(headPos, prevPoint).normalize();
    headGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);

    // Head sculpted shape
    const headGeo = new THREE.ConeGeometry(0.24, 0.55, 6);
    headGeo.rotateX(Math.PI / 2); // Point forward
    headGeo.scale(1.2, 0.65, 1.0); // Flatten slightly like a viper/cobra

    const headMat = new THREE.MeshStandardMaterial({
      color: 0x143625,
      roughness: 0.3,
      metalness: 0.2
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Glossy predatory amber eyes
    const eyeGeo = new THREE.SphereGeometry(0.065, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      roughness: 0.1,
      metalness: 0.8
    });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.13, 0.08, 0.12);
    headGroup.add(leftEye);

    const rightEye = leftEye.clone();
    rightEye.position.x = -0.13;
    headGroup.add(rightEye);

    // Forked red tongue
    const tongueGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.28, 4);
    tongueGeo.rotateX(Math.PI / 2);
    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xd90429,
      roughness: 0.4
    });
    const tongue = new THREE.Mesh(tongueGeo, tongueMat);
    tongue.position.set(0, -0.02, 0.35);
    headGroup.add(tongue);

    return headGroup;
  }

  /**
   * Samples a point on the snake curve:
   * t = 0 at head (square where bitten), t = 1 at tail (destination square)
   */
  getSlidePosition(headSquare, t) {
    const snake = this.snakeDataMap.get(headSquare);
    if (!snake) return null;

    // The spline points were constructed from tail (0) to head (1),
    // so sliding from head to tail is sampled at (1 - t)
    const curveT = Math.max(0, Math.min(1, 1 - t));
    const point = snake.curve.getPoint(curveT);
    const tangent = snake.curve.getTangent(curveT).negate(); // facing toward tail

    return { point, tangent };
  }

  /**
   * Subtle natural breathing/idle animation
   */
  update(time) {
    this.snakeDataMap.forEach(snake => {
      // Gentle subtle breathing motion on the mid-points
      const headGroup = snake.headGroup;
      if (headGroup) {
        headGroup.rotation.z = Math.sin(time * 1.5 + snake.headSquare) * 0.04;
      }
    });
  }
}
