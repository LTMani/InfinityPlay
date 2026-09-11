/**
 * World.js
 * Manages the endless modular city environment, road chunk streaming,
 * dynamic obstacle spawning, and world resets.
 */

import * as THREE from 'three';
import { Road } from './Road.js';
import { Environment } from './Environment.js';

export class World {
  constructor(scene, collisionSystem) {
    this.scene = scene;
    this.collisionSystem = collisionSystem;

    this.road = new Road({
      laneCount: 4,
      laneWidth: 3.8,
      sidewalkWidth: 3.6,
      segmentLength: 120
    });

    this.environment = new Environment(this.scene);

    this.chunkLength = this.road.segmentLength;
    this.chunkCount = 7; // Total active streamed chunks (~840m road)
    this.chunks = []; // Array of active chunk groups
    this.chunkIndices = []; // Track chunk index for deterministic obstacle layouts

    this.worldGroup = new THREE.Group();
    this.worldGroup.name = 'WorldRoot';
    this.scene.add(this.worldGroup);

    this.initWorld();
  }

  initWorld() {
    this.clearWorld();

    // Start with chunks centered around 0 and extending forward (along -Z)
    // Chunks at: z = +120 (behind start), z = 0, z = -120, z = -240, z = -360, z = -480, z = -600
    for (let i = -1; i < this.chunkCount - 1; i++) {
      const centerZ = -i * this.chunkLength;
      this._createChunkAt(centerZ, i);
    }
  }

  _createChunkAt(centerZ, chunkIdx) {
    // 1. Create road geometry & markings
    const chunkGroup = this.road.createChunk(centerZ);

    // 2. Populate stylized buildings, streetlights, and trees
    this.environment.populateChunk(
      chunkGroup,
      this.chunkLength,
      this.road.roadWidth / 2,
      this.road.sidewalkWidth
    );

    this.worldGroup.add(chunkGroup);
    this.chunks.push(chunkGroup);
    this.chunkIndices.push(chunkIdx);

    // 3. Spawn Obstacles on this chunk (leave initial starting chunks 0 and -1 clear)
    if (chunkIdx > 0) {
      this._spawnChunkObstacles(centerZ, chunkIdx);
    }
  }

  _spawnChunkObstacles(centerZ, chunkIdx) {
    // Deterministic placement based on chunk index
    const lanePositions = [-5.7, -1.9, 1.9, 5.7]; // Centers of 4 lanes

    // Chunk layout variations
    const pattern = chunkIdx % 4;

    if (pattern === 1) {
      // Single lane roadblock barrier + caution lights
      const lane = lanePositions[1]; // Left-center lane
      this.collisionSystem.createRoadblock(lane, centerZ - 20);

      // Warning cones leading up to it
      this.collisionSystem.createConeCluster(lane, centerZ - 4);
    } else if (pattern === 2) {
      // Dual lane maintenance zone on right lanes
      this.collisionSystem.createRoadblock(lanePositions[2], centerZ - 30);
      this.collisionSystem.createRoadblock(lanePositions[3], centerZ - 30);
      this.collisionSystem.createConeCluster(lanePositions[2], centerZ - 10);
    } else if (pattern === 3) {
      // Slalom obstacle course with concrete barrier and cones
      this.collisionSystem.createConcreteBarrier(lanePositions[0], centerZ - 15, 6.0);
      this.collisionSystem.createRoadblock(lanePositions[3], centerZ - 45);
      this.collisionSystem.createConeCluster(lanePositions[1], centerZ - 35);
    }
  }

  /**
   * Updates world chunk streaming based on vehicle Z position.
   * @param {Object} vehiclePos Vehicle position { x, y, z }
   */
  update(vehiclePos) {
    this.environment.update(vehiclePos);

    // Check if the farthest-behind chunk needs to be recycled forward
    // Since vehicle travels along -Z, chunks behind have higher Z (more positive)
    const recycleThreshold = vehiclePos.z + this.chunkLength * 1.5;

    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      if (chunk.position.z > recycleThreshold) {
        // Find leading (farthest forward along -Z) chunk position
        let minZ = 0;
        let maxIndex = 0;
        for (let j = 0; j < this.chunks.length; j++) {
          if (this.chunks[j].position.z < minZ) {
            minZ = this.chunks[j].position.z;
            maxIndex = Math.max(maxIndex, this.chunkIndices[j]);
          }
        }

        const newZ = minZ - this.chunkLength;
        const newIdx = maxIndex + 1;

        // Move chunk forward
        chunk.position.z = newZ;
        this.chunkIndices[i] = newIdx;

        // Spawn new obstacles at new position
        this._spawnChunkObstacles(newZ, newIdx);
      }
    }
  }

  clearWorld() {
    this.chunks.forEach(chunk => {
      this.worldGroup.remove(chunk);
    });
    this.chunks = [];
    this.chunkIndices = [];
    this.collisionSystem.clear();
  }

  reset() {
    this.initWorld();
  }
}

