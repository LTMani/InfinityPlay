// TokenRenderer.js - 3D Luxury Turned-Wood Pawns with Hop, Climb, and Serpentine Slide Physics

import * as THREE from 'three';
import { BOARD_CONFIG, getSquareCoordinates, getTokenOffsetOnSquare } from '../game/BoardData.js';

export class TokenRenderer {
  constructor(scene) {
    this.scene = scene;
    this.tokensGroup = new THREE.Group();
    this.tokensGroup.name = 'TokensGroup';
    this.scene.add(this.tokensGroup);

    this.tokens = []; // array of token objects { id, group, mesh, halo, currentPos, targetPos, animState }
    this.activeAnimations = [];
  }

  createTokens(players) {
    // Clear any previous tokens
    while (this.tokensGroup.children.length > 0) {
      this.tokensGroup.remove(this.tokensGroup.children[0]);
    }
    this.tokens = [];

    players.forEach((player, idx) => {
      const tokenGroup = new THREE.Group();
      tokenGroup.name = `Token_Player_${idx}`;

      // 1. Turned luxury pawn geometry
      // Base brass ring
      const baseGeo = new THREE.CylinderGeometry(0.26, 0.32, 0.12, 24);
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.85,
        roughness: 0.2
      });
      const baseMesh = new THREE.Mesh(baseGeo, brassMat);
      baseMesh.position.y = 0.06;
      baseMesh.castShadow = true;
      tokenGroup.add(baseMesh);

      // Main Pawn Body (lathe / combined cylinders + spheres)
      const bodyGeo = new THREE.CylinderGeometry(0.14, 0.24, 0.38, 24);
      const pawnMat = new THREE.MeshStandardMaterial({
        color: player.colorHex,
        roughness: 0.15,
        metalness: 0.3,
        emissive: player.emissiveHex,
        emissiveIntensity: 0.2
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, pawnMat);
      bodyMesh.position.y = 0.28;
      bodyMesh.castShadow = true;
      tokenGroup.add(bodyMesh);

      // Pawn Head Sphere
      const headGeo = new THREE.SphereGeometry(0.18, 24, 24);
      const headMesh = new THREE.Mesh(headGeo, pawnMat);
      headMesh.position.y = 0.52;
      headMesh.castShadow = true;
      tokenGroup.add(headMesh);

      // Active player subtle glowing crown halo ring
      const ringGeo = new THREE.TorusGeometry(0.36, 0.025, 8, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffe066,
        transparent: true,
        opacity: 0.0
      });
      const halo = new THREE.Mesh(ringGeo, ringMat);
      halo.position.y = 0.02;
      tokenGroup.add(halo);

      // Initial placement at square 1
      const initialSquare = player.position || 1;
      const coord = getSquareCoordinates(initialSquare);
      const offset = getTokenOffsetOnSquare(idx, players.length);

      const targetX = coord.x + offset.ox;
      const targetY = coord.y;
      const targetZ = coord.z + offset.oz;

      tokenGroup.position.set(targetX, targetY, targetZ);
      this.tokensGroup.add(tokenGroup);

      this.tokens.push({
        id: player.id,
        player,
        group: tokenGroup,
        pawnMat,
        halo,
        baseY: targetY,
        currentPos: new THREE.Vector3(targetX, targetY, targetZ),
        currentSquare: initialSquare
      });
    });
  }

  setActivePlayer(playerIndex) {
    this.tokens.forEach((token, idx) => {
      if (idx === playerIndex) {
        token.halo.material.opacity = 0.85;
        token.pawnMat.emissiveIntensity = 0.45;
      } else {
        token.halo.material.opacity = 0.0;
        token.pawnMat.emissiveIntensity = 0.15;
      }
    });
  }

  updateMultiTokenOffsets(allPlayers) {
    // Count players per square
    const counts = {};
    allPlayers.forEach(p => {
      counts[p.position] = (counts[p.position] || 0) + 1;
    });

    const indexOnSquare = {};
    allPlayers.forEach((p, pIdx) => {
      const sq = p.position;
      const currentIdx = indexOnSquare[sq] || 0;
      indexOnSquare[sq] = currentIdx + 1;

      const offset = getTokenOffsetOnSquare(currentIdx, counts[sq]);
      const coord = getSquareCoordinates(sq);
      const token = this.tokens[pIdx];

      if (token && !this.isTokenAnimating(pIdx)) {
        token.group.position.set(coord.x + offset.ox, coord.y, coord.z + offset.oz);
        token.currentPos.copy(token.group.position);
      }
    });
  }

  isTokenAnimating(playerIndex) {
    return this.activeAnimations.some(a => a.playerIndex === playerIndex);
  }

  /**
   * Hop animation for a single step
   */
  animateHop(playerIndex, toSquare, duration = 320) {
    return new Promise((resolve) => {
      const token = this.tokens[playerIndex];
      if (!token) return resolve();

      const startPos = token.group.position.clone();
      const coord = getSquareCoordinates(toSquare);
      // Keep subtle offset
      const offset = getTokenOffsetOnSquare(playerIndex, this.tokens.length);
      const targetPos = new THREE.Vector3(coord.x + offset.ox, coord.y, coord.z + offset.oz);

      const anim = {
        type: 'hop',
        playerIndex,
        startTime: performance.now(),
        duration,
        startPos,
        targetPos,
        onComplete: () => {
          token.currentSquare = toSquare;
          token.currentPos.copy(targetPos);
          resolve();
        }
      };

      this.activeAnimations.push(anim);
    });
  }

  /**
   * Smooth ladder climb along rungs
   */
  animateLadderClimb(playerIndex, baseSquare, topSquare, ladderRenderer, duration = 1300) {
    return new Promise((resolve) => {
      const token = this.tokens[playerIndex];
      if (!token) return resolve();

      const coord = getSquareCoordinates(topSquare);
      const offset = getTokenOffsetOnSquare(playerIndex, this.tokens.length);
      const finalPos = new THREE.Vector3(coord.x + offset.ox, coord.y, coord.z + offset.oz);

      const anim = {
        type: 'ladder',
        playerIndex,
        baseSquare,
        ladderRenderer,
        finalPos,
        startTime: performance.now(),
        duration,
        onComplete: () => {
          token.currentSquare = topSquare;
          token.currentPos.copy(finalPos);
          token.group.position.copy(finalPos);
          resolve();
        }
      };

      this.activeAnimations.push(anim);
    });
  }

  /**
   * Serpentine snake slide down the body curve
   */
  animateSnakeSlide(playerIndex, headSquare, tailSquare, snakeRenderer, duration = 1500) {
    return new Promise((resolve) => {
      const token = this.tokens[playerIndex];
      if (!token) return resolve();

      const coord = getSquareCoordinates(tailSquare);
      const offset = getTokenOffsetOnSquare(playerIndex, this.tokens.length);
      const finalPos = new THREE.Vector3(coord.x + offset.ox, coord.y, coord.z + offset.oz);

      const anim = {
        type: 'snake',
        playerIndex,
        headSquare,
        snakeRenderer,
        finalPos,
        startTime: performance.now(),
        duration,
        onComplete: () => {
          token.currentSquare = tailSquare;
          token.currentPos.copy(finalPos);
          token.group.position.copy(finalPos);
          token.group.quaternion.identity(); // reset orientation
          resolve();
        }
      };

      this.activeAnimations.push(anim);
    });
  }

  update(now) {
    const finishedIndices = [];

    this.activeAnimations.forEach((anim, idx) => {
      const token = this.tokens[anim.playerIndex];
      if (!token) {
        finishedIndices.push(idx);
        return;
      }

      const elapsed = now - anim.startTime;
      const t = Math.min(1.0, elapsed / anim.duration);

      if (anim.type === 'hop') {
        // Parabolic trajectory
        const easeT = t;
        token.group.position.x = THREE.MathUtils.lerp(anim.startPos.x, anim.targetPos.x, easeT);
        token.group.position.z = THREE.MathUtils.lerp(anim.startPos.z, anim.targetPos.z, easeT);

        // Arc height + slight landing bounce
        const hopHeight = 0.65;
        const arc = Math.sin(t * Math.PI) * hopHeight;
        token.group.position.y = anim.startPos.y + arc;

        // Slight squash and stretch
        if (t > 0.85) {
          const settleT = (t - 0.85) / 0.15;
          const squash = 1.0 - Math.sin(settleT * Math.PI) * 0.15;
          token.group.scale.set(1 / squash, squash, 1 / squash);
        } else {
          token.group.scale.set(1, 1, 1);
        }
      } else if (anim.type === 'ladder') {
        const climbPos = anim.ladderRenderer.getClimbPosition(anim.baseSquare, t);
        if (climbPos) {
          token.group.position.copy(climbPos);
        }
      } else if (anim.type === 'snake') {
        const slideData = anim.snakeRenderer.getSlidePosition(anim.headSquare, t);
        if (slideData) {
          token.group.position.copy(slideData.point);
          token.group.position.y += 0.25; // Ride atop the snake body
        }
      }

      if (t >= 1.0) {
        finishedIndices.push(idx);
        token.group.scale.set(1, 1, 1);
        if (anim.onComplete) anim.onComplete();
      }
    });

    // Remove completed animations in reverse order
    for (let i = finishedIndices.length - 1; i >= 0; i--) {
      this.activeAnimations.splice(finishedIndices[i], 1);
    }

    // Active player halo rotation
    this.tokens.forEach(token => {
      if (token.halo.material.opacity > 0) {
        token.halo.rotation.z += 0.02;
      }
    });
  }
}
