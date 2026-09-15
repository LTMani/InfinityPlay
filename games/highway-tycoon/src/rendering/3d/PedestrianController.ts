import * as THREE from 'three';
import { ParkingBay } from './ParkingBayManager';

export interface CustomerPedestrian {
  id: string;
  vehicleId: string;
  mesh: THREE.Group;
  statusSprite: THREE.Sprite;
  bay: ParkingBay;
  state: 'WALKING_TO_SERVICE' | 'SERVICING' | 'WALKING_BACK' | 'DONE';
  progress: number;
  timer: number;
  walkTime: number;
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  legL: THREE.Group;
  legR: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  torso: THREE.Mesh;
}

export interface AmbientHuman {
  mesh: THREE.Group;
  legL?: THREE.Group;
  legR?: THREE.Group;
  armL?: THREE.Group;
  armR?: THREE.Group;
  isSitting: boolean;
  isWalking: boolean;
  walkStart?: THREE.Vector3;
  walkEnd?: THREE.Vector3;
  progress: number;
  direction: number;
}

export class PedestrianController {
  public group: THREE.Group = new THREE.Group();
  public pedestrians: CustomerPedestrian[] = [];
  public ambientHumans: AmbientHuman[] = [];

  private skinTones = [0xf1c27d, 0xe0ac69, 0xc68642, 0xd4a373, 0x8d5524];
  private hairColors = [0x1e293b, 0x78350f, 0xd97706, 0x0f172a, 0x475569];
  private shirtColors = [
    0xef4444, // Bright Red
    0x2563eb, // Royal Blue
    0x059669, // Forest Green
    0xd97706, // Desert Amber
    0x7c3aed, // Purple
    0xdb2777, // Pink
    0x475569, // Slate Grey
    0x0284c7  // Sky Blue
  ];
  private pantsColors = [0x1e293b, 0x334155, 0x1e3a5f, 0x4a4a4a, 0x3b3024];

  constructor() {
    this.spawnAmbientHumans();
  }

  /**
   * Spawns realistic ambient people: Fuel station attendants, diner patrons, park relaxers
   */
  public spawnAmbientHumans(): void {
    // 1. Fuel Station Attendants wearing High-Vis Neon Vests
    const att1 = this.createHumanFigure(0xfacc15, true); // Neon Yellow Hi-Vis
    att1.group.position.set(20.0, 0.05, -58.0);
    att1.group.rotation.y = Math.PI / 4;
    this.group.add(att1.group);
    this.ambientHumans.push({
      mesh: att1.group,
      legL: att1.legL,
      legR: att1.legR,
      armL: att1.armL,
      armR: att1.armR,
      isSitting: false,
      isWalking: false,
      progress: 0,
      direction: 1
    });

    const att2 = this.createHumanFigure(0xf97316, true); // Neon Orange Hi-Vis
    att2.group.position.set(38.0, 0.05, -62.0);
    att2.group.rotation.y = -Math.PI / 4;
    this.group.add(att2.group);
    this.ambientHumans.push({
      mesh: att2.group,
      legL: att2.legL,
      legR: att2.legR,
      armL: att2.armL,
      armR: att2.armR,
      isSitting: false,
      isWalking: false,
      progress: 0,
      direction: 1
    });

    // 2. Diners sitting outside at Route 66 Patio Tables (Zone 2)
    const dinerCust1 = this.createHumanFigure(0xef4444, false);
    dinerCust1.group.position.set(34.0, 0.45, 27.5);
    dinerCust1.group.rotation.y = Math.PI / 2;
    dinerCust1.legL.rotation.x = Math.PI / 2;
    dinerCust1.legR.rotation.x = Math.PI / 2;
    this.group.add(dinerCust1.group);
    this.ambientHumans.push({
      mesh: dinerCust1.group,
      isSitting: true,
      isWalking: false,
      progress: 0,
      direction: 1
    });

    const dinerCust2 = this.createHumanFigure(0x0284c7, false);
    dinerCust2.group.position.set(36.0, 0.45, 27.5);
    dinerCust2.group.rotation.y = -Math.PI / 2;
    dinerCust2.legL.rotation.x = Math.PI / 2;
    dinerCust2.legR.rotation.x = Math.PI / 2;
    this.group.add(dinerCust2.group);
    this.ambientHumans.push({
      mesh: dinerCust2.group,
      isSitting: true,
      isWalking: false,
      progress: 0,
      direction: 1
    });

    // 3. Strolling Pedestrians along Plaza Sidewalk (Zone 2 to Zone 3)
    const walker1 = this.createHumanFigure(0x059669, false);
    this.group.add(walker1.group);
    this.ambientHumans.push({
      mesh: walker1.group,
      legL: walker1.legL,
      legR: walker1.legR,
      armL: walker1.armL,
      armR: walker1.armR,
      isSitting: false,
      isWalking: true,
      walkStart: new THREE.Vector3(11.0, 0.05, -10.0),
      walkEnd: new THREE.Vector3(11.0, 0.05, 50.0),
      progress: 0.2,
      direction: 1
    });

    // 4. Park Visitor Relaxing on Bench in Zone 3
    const parkGuest = this.createHumanFigure(0x7c3aed, false);
    parkGuest.group.position.set(35.0, 0.45, 52.0);
    parkGuest.legL.rotation.x = Math.PI / 2;
    parkGuest.legR.rotation.x = Math.PI / 2;
    this.group.add(parkGuest.group);
    this.ambientHumans.push({
      mesh: parkGuest.group,
      isSitting: true,
      isWalking: false,
      progress: 0,
      direction: 1
    });
  }

  /**
   * Spawns a customer pedestrian when a vehicle parks in a bay
   */
  public spawnCustomer(vehicleId: string, bay: ParkingBay): CustomerPedestrian {
    const shirtColor = this.shirtColors[Math.floor(Math.random() * this.shirtColors.length)];
    const { group: charMesh, legL, legR, armL, armR, torso } = this.createHumanFigure(shirtColor, false);

    // Initial position: next to driver side of vehicle
    const startPos = bay.position.clone();
    startPos.x -= 1.6;
    startPos.y = 0.05;

    // Target service position
    const targetPos = bay.position.clone();
    targetPos.y = 0.05;

    if (bay.category === 'FUEL') {
      targetPos.x = bay.position.x > 25 ? bay.position.x - 2.2 : bay.position.x + 2.2;
    } else if (bay.category === 'EV') {
      targetPos.x += 1.8;
    } else if (bay.category === 'DINER') {
      targetPos.set(28.0, 0.05, 28.0);
    } else if (bay.category === 'SHOP') {
      targetPos.set(28.0, 0.05, 5.0);
    } else if (bay.category === 'MOTEL') {
      targetPos.set(28.0, 0.05, 75.0);
    } else {
      targetPos.set(26.0, 0.05, Math.min(105, Math.max(52, bay.position.z)));
    }

    charMesh.position.copy(startPos);
    this.group.add(charMesh);

    // Overhead Status Bubble
    const initialText = this.getInitialStatusText(bay.category);
    const statusSprite = this.createStatusSprite(initialText);
    statusSprite.position.set(0, 2.7, 0);
    charMesh.add(statusSprite);

    const pedestrian: CustomerPedestrian = {
      id: `cust_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      vehicleId,
      mesh: charMesh,
      statusSprite,
      bay,
      state: 'WALKING_TO_SERVICE',
      progress: 0,
      timer: 0,
      walkTime: 1.8,
      startPos,
      targetPos,
      legL,
      legR,
      armL,
      armR,
      torso
    };

    this.pedestrians.push(pedestrian);
    return pedestrian;
  }

  public update(dt: number, camera: THREE.Camera): void {
    // 1. Update Customer Pedestrians
    for (let i = this.pedestrians.length - 1; i >= 0; i--) {
      const p = this.pedestrians[i];

      if (p.state === 'WALKING_TO_SERVICE') {
        p.progress += dt / p.walkTime;
        const t = Math.min(1.0, p.progress);

        p.mesh.position.lerpVectors(p.startPos, p.targetPos, t);
        const dir = new THREE.Vector3().subVectors(p.targetPos, p.startPos).normalize();
        if (dir.lengthSq() > 0.001) {
          p.mesh.rotation.y = Math.atan2(dir.x, dir.z);
        }

        this.animateLimbs(p, true);

        if (p.progress >= 1.0) {
          p.state = 'SERVICING';
          p.timer = Math.max(1.5, p.bay.dwellTime - 3.2);
          this.resetLimbs(p);
          this.updateSpriteText(p.statusSprite, this.getServicingStatusText(p.bay.category));
        }
      } else if (p.state === 'SERVICING') {
        p.timer -= dt;

        // Subtle idling motion
        p.armR.rotation.x = Math.sin(performance.now() * 0.005) * 0.15 - 0.3;

        if (p.timer <= 0) {
          p.state = 'WALKING_BACK';
          p.progress = 0;
          this.updateSpriteText(p.statusSprite, '👍 Satisfied');
        }
      } else if (p.state === 'WALKING_BACK') {
        p.progress += dt / p.walkTime;
        const t = Math.min(1.0, p.progress);

        p.mesh.position.lerpVectors(p.targetPos, p.startPos, t);
        const dir = new THREE.Vector3().subVectors(p.startPos, p.targetPos).normalize();
        if (dir.lengthSq() > 0.001) {
          p.mesh.rotation.y = Math.atan2(dir.x, dir.z);
        }

        this.animateLimbs(p, true);

        if (p.progress >= 1.0) {
          p.state = 'DONE';
          this.group.remove(p.mesh);
          this.pedestrians.splice(i, 1);
        }
      }
    }

    // 2. Update Ambient Walking Pedestrians
    const time = performance.now() * 0.007;
    for (const amb of this.ambientHumans) {
      if (amb.isWalking && amb.walkStart && amb.walkEnd && amb.legL && amb.legR && amb.armL && amb.armR) {
        amb.progress += dt * 0.12 * amb.direction;
        if (amb.progress >= 1.0) {
          amb.progress = 1.0;
          amb.direction = -1;
        } else if (amb.progress <= 0.0) {
          amb.progress = 0.0;
          amb.direction = 1;
        }

        amb.mesh.position.lerpVectors(amb.walkStart, amb.walkEnd, amb.progress);
        const yaw = amb.direction > 0 ? 0 : Math.PI;
        amb.mesh.rotation.y = yaw;

        const stride = Math.sin(time) * 0.5;
        amb.legL.rotation.x = stride;
        amb.legR.rotation.x = -stride;
        amb.armL.rotation.x = -stride * 0.7;
        amb.armR.rotation.x = stride * 0.7;
      }
    }
  }

  public removeCustomerByVehicle(vehicleId: string): void {
    for (let i = this.pedestrians.length - 1; i >= 0; i--) {
      if (this.pedestrians[i].vehicleId === vehicleId) {
        this.group.remove(this.pedestrians[i].mesh);
        this.pedestrians.splice(i, 1);
      }
    }
  }

  /**
   * Constructs a realistic humanoid 3D model with head, hair/cap, neck, torso/jacket, arms with hands, pants, and shoes!
   */
  public createHumanFigure(shirtColor: number, isHiVisWorker: boolean = false): {
    group: THREE.Group;
    legL: THREE.Group;
    legR: THREE.Group;
    armL: THREE.Group;
    armR: THREE.Group;
    torso: THREE.Mesh;
  } {
    const figure = new THREE.Group();

    const skinColor = this.skinTones[Math.floor(Math.random() * this.skinTones.length)];
    const hairColor = this.hairColors[Math.floor(Math.random() * this.hairColors.length)];
    const pantsColor = isHiVisWorker ? 0x1e293b : this.pantsColors[Math.floor(Math.random() * this.pantsColors.length)];

    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.5 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.7 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    // 1. Head (Smooth rounded shape)
    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.76;
    head.scale.set(1.0, 1.15, 1.0);
    head.castShadow = true;
    figure.add(head);

    // Hair / Cap
    if (isHiVisWorker || Math.random() < 0.6) {
      // Baseball cap with front brim
      const capMat = new THREE.MeshStandardMaterial({ 
        color: isHiVisWorker ? 0xf97316 : hairColor, 
        roughness: 0.8 
      });
      const capDome = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), capMat);
      capDome.position.set(0, 1.84, 0);
      capDome.scale.set(1.02, 0.6, 1.02);
      figure.add(capDome);

      const brim = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.22), capMat);
      brim.position.set(0, 1.82, 0.25);
      figure.add(brim);
    } else {
      // Styled hair
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 14), hairMat);
      hair.position.set(0, 1.84, -0.04);
      hair.scale.set(1.02, 0.75, 1.04);
      figure.add(hair);
    }

    // 2. Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.16, 12), skinMat);
    neck.position.y = 1.52;
    figure.add(neck);

    // 3. Torso / Shirt / Jacket
    const torsoGeo = new THREE.BoxGeometry(0.56, 0.74, 0.32);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 1.12;
    torso.castShadow = true;
    figure.add(torso);

    // If Hi-Vis worker: add reflective silver safety stripes
    if (isHiVisWorker) {
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
      for (const sy of [1.22, 1.02]) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.34), stripeMat);
        stripe.position.set(0, sy, 0);
        figure.add(stripe);
      }
    }

    // 4. Waist / Belt
    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(0.57, 0.08, 0.33),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
    );
    belt.position.y = 0.74;
    figure.add(belt);

    // 5. Left Leg (Pants + Foot/Shoe)
    const legL = new THREE.Group();
    legL.position.set(-0.16, 0.70, 0);

    const legUpperL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.70, 0.24), pantsMat);
    legUpperL.position.y = -0.35;
    legUpperL.castShadow = true;
    legL.add(legUpperL);

    const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.34), shoeMat);
    shoeL.position.set(0, -0.68, 0.05);
    shoeL.castShadow = true;
    legL.add(shoeL);
    figure.add(legL);

    // 6. Right Leg (Pants + Foot/Shoe)
    const legR = new THREE.Group();
    legR.position.set(0.16, 0.70, 0);

    const legUpperR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.70, 0.24), pantsMat);
    legUpperR.position.y = -0.35;
    legUpperR.castShadow = true;
    legR.add(legUpperR);

    const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.34), shoeMat);
    shoeR.position.set(0, -0.68, 0.05);
    shoeR.castShadow = true;
    legR.add(shoeR);
    figure.add(legR);

    // 7. Left Arm (Sleeve + Hand)
    const armL = new THREE.Group();
    armL.position.set(-0.36, 1.40, 0);

    const armUpperL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.60, 0.18), shirtMat);
    armUpperL.position.y = -0.30;
    armUpperL.castShadow = true;
    armL.add(armUpperL);

    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skinMat);
    handL.position.set(0, -0.64, 0);
    armL.add(handL);
    figure.add(armL);

    // 8. Right Arm (Sleeve + Hand)
    const armR = new THREE.Group();
    armR.position.set(0.36, 1.40, 0);

    const armUpperR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.60, 0.18), shirtMat);
    armUpperR.position.y = -0.30;
    armUpperR.castShadow = true;
    armR.add(armUpperR);

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skinMat);
    handR.position.set(0, -0.64, 0);
    armR.add(handR);
    figure.add(armR);

    return { group: figure, legL, legR, armL, armR, torso };
  }

  private animateLimbs(p: CustomerPedestrian, isWalking: boolean): void {
    if (!isWalking) {
      this.resetLimbs(p);
      return;
    }
    const time = performance.now() * 0.009;
    const stride = Math.sin(time) * 0.55;

    p.legL.rotation.x = stride;
    p.legR.rotation.x = -stride;
    p.armL.rotation.x = -stride * 0.75;
    p.armR.rotation.x = stride * 0.75;

    // Gentle torso walking bob
    p.torso.position.y = 1.12 + Math.abs(Math.sin(time * 2)) * 0.04;
  }

  private resetLimbs(p: CustomerPedestrian): void {
    p.legL.rotation.x = 0;
    p.legR.rotation.x = 0;
    p.armL.rotation.x = 0;
    p.armR.rotation.x = 0;
    p.torso.position.y = 1.12;
  }

  /**
   * Creates an overhead 3D billboard sprite with high-contrast text and emoji
   */
  public createStatusSprite(text: string): THREE.Sprite {
    if (typeof document === 'undefined') {
      const mat = new THREE.SpriteMaterial();
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(4.2, 1.05, 1.0);
      return sprite;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d')!;

    this.drawSpriteCanvas(ctx, canvas.width, canvas.height, text);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.8, 0.95, 1.0);
    return sprite;
  }

  private updateSpriteText(sprite: THREE.Sprite, newText: string): void {
    if (typeof document === 'undefined') return;
    const mat = sprite.material as THREE.SpriteMaterial;
    if (mat.map && mat.map.image) {
      const canvas = mat.map.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      this.drawSpriteCanvas(ctx, canvas.width, canvas.height, newText);
      mat.map.needsUpdate = true;
    }
  }

  private drawSpriteCanvas(ctx: CanvasRenderingContext2D, w: number, h: number, text: string): void {
    ctx.clearRect(0, 0, w, h);

    // Rounded speech bubble background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    this.roundRect(ctx, 6, 6, w - 12, h - 12, 22);
    ctx.fill();
    ctx.stroke();

    // High contrast glowing text
    ctx.font = 'bold 36px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  private getInitialStatusText(cat: string): string {
    switch (cat) {
      case 'FUEL': return '⛽ Fueling Up';
      case 'EV': return '⚡ Charging EV';
      case 'DINER': return '🍔 Getting Food';
      case 'SHOP': return '🛒 QuickMart Run';
      case 'MOTEL': return '🏨 Checking In';
      default: return '🚶 Strolling';
    }
  }

  private getServicingStatusText(cat: string): string {
    switch (cat) {
      case 'FUEL': return '⛽ Pumping Fuel';
      case 'EV': return '⚡ 350kW Charging';
      case 'DINER': return '🍔 Eating Lunch';
      case 'SHOP': return '☕ Coffee & Snacks';
      case 'MOTEL': return '🛏️ Resting in Room';
      default: return '🌲 In Rest Park';
    }
  }
}
