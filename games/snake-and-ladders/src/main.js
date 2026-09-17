// main.js - Master Application Lifecycle and Component Orchestration

import * as THREE from 'three';
import { GameEngine } from './game/GameEngine.js';
import { AIPlayer } from './game/AIPlayer.js';
import { SoundManager } from './audio/SoundManager.js';
import { BoardRenderer } from './render/BoardRenderer.js';
import { SnakeRenderer } from './render/SnakeRenderer.js';
import { LadderRenderer } from './render/LadderRenderer.js';
import { DiceRenderer } from './render/DiceRenderer.js';
import { TokenRenderer } from './render/TokenRenderer.js';
import { CameraManager } from './render/CameraManager.js';
import { UIManager } from './ui/UIManager.js';

class GameApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.boardRenderer = null;
    this.snakeRenderer = null;
    this.ladderRenderer = null;
    this.diceRenderer = null;
    this.tokenRenderer = null;
    this.cameraManager = null;
    this.soundManager = null;
    this.gameEngine = null;
    this.aiPlayer = null;
    this.uiManager = null;

    this.initThree();
    this.initSystems();
    this.setupGameHandlers();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x140e0b); // Deep luxury mahogany room ambiance
    this.scene.fog = new THREE.FogExp2(0x140e0b, 0.022);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.scene.userData.camera = this.camera;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initSystems() {
    this.boardRenderer = new BoardRenderer(this.scene);
    this.snakeRenderer = new SnakeRenderer(this.scene);
    this.ladderRenderer = new LadderRenderer(this.scene);

    this.diceRenderer = new DiceRenderer(this.scene, this.boardRenderer, () => {
      this.handlePlayerRollTrigger();
    });

    this.tokenRenderer = new TokenRenderer(this.scene);
    this.cameraManager = new CameraManager(this.camera, this.renderer.domElement);
    this.soundManager = new SoundManager();

    this.gameEngine = new GameEngine();
    this.aiPlayer = new AIPlayer(this.gameEngine, () => {
      this.executeRoll();
    });

    this.uiManager = new UIManager({
      gameEngine: this.gameEngine,
      soundManager: this.soundManager,
      cameraManager: this.cameraManager,
      onStartGame: (config) => this.startGame(config),
      onRollDice: () => this.handlePlayerRollTrigger()
    });

    // Audio unlock on user interaction
    window.addEventListener('pointerdown', () => {
      this.soundManager.ensureContext();
    }, { once: true });
  }

  startGame(config) {
    this.gameEngine.startNewGame(config);
    this.tokenRenderer.createTokens(this.gameEngine.players);
    this.tokenRenderer.setActivePlayer(0);
    this.cameraManager.setPreset('tabletop');
  }

  handlePlayerRollTrigger() {
    if (!this.gameEngine.canRoll()) return;
    const cur = this.gameEngine.getCurrentPlayer();
    if (cur && cur.isAI) return; // Prevent human rolling on AI turn
    this.executeRoll();
  }

  executeRoll() {
    if (!this.gameEngine.canRoll()) return;

    this.uiManager.hideDiceResult();

    const rolledValue = this.gameEngine.rollDice();
    if (!rolledValue) return;

    this.soundManager.playDiceRoll();

    // Physically roll the 3D die
    this.diceRenderer.roll(rolledValue, async () => {
      // Announce roll and display matching popup count now that die has landed
      this.gameEngine.announceRoll(rolledValue);
      const curPlayer = this.gameEngine.getCurrentPlayer();
      this.uiManager.showDiceResult(curPlayer, rolledValue);

      // Brief pause so player can clearly see the matching 3D die and pop up
      await new Promise(res => setTimeout(res, 650));

      // Process step hops, ladder climbs, snake slides
      await this.gameEngine.processMove(rolledValue);
    });
  }

  setupGameHandlers() {
    // Single step hop
    this.gameEngine.on('stepMove', async ({ player, square }) => {
      this.soundManager.playTokenHop();
      await this.tokenRenderer.animateHop(player.id, square);

      // Smooth dynamic camera follow
      const token = this.tokenRenderer.tokens[player.id];
      const camFollow = document.getElementById('toggle-cam-follow')?.checked ?? true;
      if (camFollow && token) {
        this.cameraManager.focusOnPosition(token.group.position, 600);
      }
    });

    // Ladder climb
    this.gameEngine.on('ladderClimb', async ({ player, fromSquare, toSquare }) => {
      this.soundManager.playLadderStep(1);
      await this.tokenRenderer.animateLadderClimb(
        player.id,
        fromSquare,
        toSquare,
        this.ladderRenderer
      );
      this.tokenRenderer.updateMultiTokenOffsets(this.gameEngine.players);
    });

    // Snake slide
    this.gameEngine.on('snakeSlide', async ({ player, fromSquare, toSquare }) => {
      this.soundManager.playSnakeHiss();
      await this.tokenRenderer.animateSnakeSlide(
        player.id,
        fromSquare,
        toSquare,
        this.snakeRenderer
      );
      this.tokenRenderer.updateMultiTokenOffsets(this.gameEngine.players);
    });

    // Turn change
    this.gameEngine.on('turnChange', ({ player }) => {
      if (player) {
        this.tokenRenderer.setActivePlayer(player.id);
        this.tokenRenderer.updateMultiTokenOffsets(this.gameEngine.players);

        // Smoothly return camera to board overview
        setTimeout(() => {
          this.cameraManager.returnToBoard(800);
        }, 300);
      }
    });

    // Game over
    this.gameEngine.on('gameOver', () => {
      this.soundManager.playVictory();
    });
  }

  animate(now) {
    requestAnimationFrame(this.animate);

    const timeInSec = now * 0.001;
    this.diceRenderer.update(now);
    this.tokenRenderer.update(now);
    this.snakeRenderer.update(timeInSec);
    this.cameraManager.update(now);

    this.renderer.render(this.scene, this.camera);
  }
}

// Boot up once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
