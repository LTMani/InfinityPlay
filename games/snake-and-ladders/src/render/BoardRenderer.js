// BoardRenderer.js - 3D Tabletop, Wooden Board, Frame, Dice Tray, Box, and Lighting

import * as THREE from 'three';
import { BOARD_CONFIG, getSquareCoordinates } from '../game/BoardData.js';
import { TextureGenerator } from './TextureGenerator.js';

export class BoardRenderer {
  constructor(scene) {
    this.scene = scene;
    this.boardGroup = new THREE.Group();
    this.boardGroup.name = 'BoardGroup';
    this.scene.add(this.boardGroup);

    this.tableMesh = null;
    this.boardFrame = null;
    this.boardFace = null;
    this.diceTray = null;
    this.boxProp = null;

    this.initLighting();
    this.createTable();
    this.createBoard();
    this.createDiceTray();
    this.createGameBoxProp();
  }

  initLighting() {
    // Ambient Light - Warm, soft room reflection
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2);
    this.scene.add(ambientLight);

    // Directional Key Light - Tabletop lamp with soft shadows
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(12, 22, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.camera.left = -16;
    keyLight.shadow.camera.right = 16;
    keyLight.shadow.camera.top = 16;
    keyLight.shadow.camera.bottom = -16;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.radius = 2.0;
    this.scene.add(keyLight);

    // Overhead Table Pendant Fill Light
    const fillLight = new THREE.PointLight(0xffd59e, 1.4, 35, 1.2);
    fillLight.position.set(0, 15, 0);
    this.scene.add(fillLight);

    // Soft Rim / Specular Light
    const rimLight = new THREE.DirectionalLight(0xb0c4de, 0.9);
    rimLight.position.set(-15, 10, -15);
    this.scene.add(rimLight);
  }

  createTable() {
    // Large dining table surface
    const tableGeo = new THREE.BoxGeometry(60, 2, 50);
    const woodTex = TextureGenerator.createWoodTexture('#3a1f12', '#1e0e07', 1024, 1024, 18);
    woodTex.repeat.set(4, 3);

    const bumpTex = TextureGenerator.createWoodBumpMap(512, 512);
    bumpTex.repeat.set(4, 3);

    const tableMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      bumpMap: bumpTex,
      bumpScale: 0.02,
      roughness: 0.45,
      metalness: 0.05
    });

    this.tableMesh = new THREE.Mesh(tableGeo, tableMat);
    this.tableMesh.position.y = -1.0;
    this.tableMesh.receiveShadow = true;
    this.boardGroup.add(this.tableMesh);
  }

  createBoard() {
    const boardTotalSize = BOARD_CONFIG.cellSize * BOARD_CONFIG.gridSize; // 12.0
    const framePadding = 0.8;
    const frameSize = boardTotalSize + framePadding * 2; // 13.6
    const boardH = BOARD_CONFIG.boardHeight; // 0.3

    // 1. Mahogany / Walnut Board Frame with beveled edges
    const frameGeo = new THREE.BoxGeometry(frameSize, boardH, frameSize);
    const frameWood = TextureGenerator.createWoodTexture('#3d1c0c', '#200d05', 1024, 1024, 32);
    const frameBump = TextureGenerator.createWoodBumpMap(512, 512);

    const frameMat = new THREE.MeshStandardMaterial({
      map: frameWood,
      bumpMap: frameBump,
      bumpScale: 0.03,
      roughness: 0.3,
      metalness: 0.08
    });

    this.boardFrame = new THREE.Mesh(frameGeo, frameMat);
    this.boardFrame.position.y = boardH / 2;
    this.boardFrame.castShadow = true;
    this.boardFrame.receiveShadow = true;
    this.boardGroup.add(this.boardFrame);

    // 2. Gold inlay border strip
    const goldStripGeo = new THREE.BoxGeometry(boardTotalSize + 0.16, boardH + 0.02, boardTotalSize + 0.16);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });
    const goldStrip = new THREE.Mesh(goldStripGeo, goldMat);
    goldStrip.position.y = boardH / 2;
    goldStrip.receiveShadow = true;
    this.boardGroup.add(goldStrip);

    // 3. Board Face with high-res tiles and embossed numbers
    const faceGeo = new THREE.PlaneGeometry(boardTotalSize, boardTotalSize);
    const faceTex = TextureGenerator.createBoardFaceTexture(2048, 2048);

    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.35,
      metalness: 0.05
    });

    this.boardFace = new THREE.Mesh(faceGeo, faceMat);
    this.boardFace.rotation.x = -Math.PI / 2;
    this.boardFace.position.y = boardH + 0.015; // Slightly elevated above frame
    this.boardFace.receiveShadow = true;
    this.boardGroup.add(this.boardFace);
  }

  createDiceTray() {
    // Elegant octagonal / rectangular felt dice tray positioned next to the board
    const trayGroup = new THREE.Group();
    trayGroup.name = 'DiceTray';
    trayGroup.position.set(10.5, 0, 0);

    const trayW = 5.2;
    const trayD = 6.8;
    const trayH = 0.55;
    const wallThick = 0.4;

    // Wooden Outer Frame
    const frameGeo = new THREE.BoxGeometry(trayW, trayH, trayD);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x2b1308,
      roughness: 0.35,
      metalness: 0.1
    });
    const trayOuter = new THREE.Mesh(frameGeo, frameMat);
    trayOuter.position.y = trayH / 2;
    trayOuter.castShadow = true;
    trayOuter.receiveShadow = true;
    trayGroup.add(trayOuter);

    // Green Velvet Felt Rolling Floor
    const feltGeo = new THREE.PlaneGeometry(trayW - wallThick * 2, trayD - wallThick * 2);
    const feltMat = new THREE.MeshStandardMaterial({
      color: 0x184224, // Forest green casino felt
      roughness: 0.88,
      metalness: 0.02
    });
    const felt = new THREE.Mesh(feltGeo, feltMat);
    felt.rotation.x = -Math.PI / 2;
    felt.position.y = trayH * 0.45;
    felt.receiveShadow = true;
    trayGroup.add(felt);

    // Gold Trim Ring around tray
    const trimGeo = new THREE.BoxGeometry(trayW - wallThick * 1.5, 0.05, trayD - wallThick * 1.5);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.3
    });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.y = trayH;
    trayGroup.add(trim);

    this.diceTray = trayGroup;
    this.boardGroup.add(trayGroup);
  }

  createGameBoxProp() {
    // Realistic luxury board-game box lid resting on the table
    const boxGroup = new THREE.Group();
    boxGroup.name = 'GameBoxProp';
    boxGroup.position.set(-11.5, 0.35, -2.5);
    boxGroup.rotation.y = 0.18; // Subtle natural tabletop slant

    const boxW = 8.5;
    const boxD = 8.5;
    const boxH = 0.7;

    const boxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
    const boxTex = TextureGenerator.createGameBoxTexture(1024, 1024);

    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x140e0c,
      roughness: 0.5,
      metalness: 0.1
    });

    const topMat = new THREE.MeshStandardMaterial({
      map: boxTex,
      roughness: 0.38,
      metalness: 0.15
    });

    const materials = [
      sideMat, sideMat,
      topMat, sideMat,
      sideMat, sideMat
    ];

    const boxMesh = new THREE.Mesh(boxGeo, materials);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxGroup.add(boxMesh);

    this.boxProp = boxGroup;
    this.boardGroup.add(boxGroup);
  }

  getDiceTrayCenter() {
    return {
      x: 10.5,
      y: 0.28,
      z: 0,
      width: 4.4,
      depth: 6.0
    };
  }
}
