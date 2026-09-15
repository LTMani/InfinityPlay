import * as THREE from 'three';
import { RoadwaySystem } from './RoadwaySystem';
import { ParkingBayManager, ParkingBay, BayCategory } from './ParkingBayManager';
import { PedestrianController } from './PedestrianController';
import { GameEngine } from '../../core/GameEngine';
import { sound } from '../../audio/SoundEngine';

export interface FloatingCashText {
  sprite: THREE.Sprite;
  timer: number;
  maxTimer: number;
  initialY: number;
}

export interface Car3D {
  id: string;
  mesh: THREE.Group;
  curve: THREE.CatmullRomCurve3;
  progress: number;
  speed: number;
  isTruck: boolean;
  isTanker?: boolean;
  color: number;
  state: 'HIGHWAY' | 'OFF_RAMP' | 'APPROACHING_BAY' | 'PARKED' | 'QUEUED' | 'PULLING_OUT' | 'RETURN';
  serviceTime: number;
  laneOffset: number;
  assignedBay: ParkingBay | null;
  desiredCategory: BayCategory;
  transitionStart: THREE.Vector3;
  transitionEnd: THREE.Vector3;
  transitionProgress: number;
  transitionStartRot: number;
  transitionEndRot: number;
  queueSprite?: THREE.Sprite;
}

export class VehicleController {
  public group: THREE.Group = new THREE.Group();
  public cars: Car3D[] = [];
  public floatingTexts: FloatingCashText[] = [];
  private spawnTimer: number = 0;
  private tankerTimer: number = 0;
  private roadways: RoadwaySystem;
  private bayManager: ParkingBayManager;
  private pedestrianController: PedestrianController;
  private engine: GameEngine | null = null;

  private carColors = [
    0xec4899, // Vibrant Hot Pink (matches reference photo!)
    0x0284c7, // Sky Metallic Blue
    0xdc2626, // Racing Red
    0xf59e0b, // Amber Gold
    0x10b981, // Emerald Green
    0xf8fafc, // Pearl White
    0x1e293b  // Midnight Black
  ];

  constructor(
    roadways: RoadwaySystem,
    bayManager: ParkingBayManager,
    pedestrianController: PedestrianController,
    engine?: GameEngine
  ) {
    this.roadways = roadways;
    this.bayManager = bayManager;
    this.pedestrianController = pedestrianController;
    this.engine = engine || null;

    // Spawn initial prominent vehicles along the single highway & 3 zones:
    // 1. Scaled Hot Pink sports sedan cruising in right lane
    this.spawnCar(0.12, 0xec4899, false, 2.5);

    // 2. Scaled Ocean Blue sedan further down highway in fast lane
    this.spawnCar(0.45, 0x0284c7, false, -2.5);

    // 3. Scaled 18-wheeler semi-truck on highway
    this.spawnCar(0.72, 0xf8fafc, true, 2.5);

    // 4. Starter parked vehicle in Zone 1 (Fuel Pump #1)
    this.spawnStarterParkedCar('fuel_pump_1', 0x0284c7, false);

    // 5. Starter parked vehicle in Zone 2 (Diner)
    this.spawnStarterParkedCar('diner_stall_1', 0xdc2626, false);

    // 6. Starter parked vehicle in Zone 3 (Motel)
    this.spawnStarterParkedCar('motel_stall_1', 0xf59e0b, false);
  }

  public setEngine(engine: GameEngine): void {
    this.engine = engine;
  }

  /**
   * Calculates car-following speed multiplier to strictly prevent vehicles from overlapping.
   * If lead car is stopped or close, trailing car slows down and stops with safe headway.
   */
  private getCarFollowingSpeedMultiplier(car: Car3D): number {
    let minDist = Infinity;

    for (const other of this.cars) {
      if (other === car) continue;
      if (other.state === 'PARKED') continue;

      // Check if on same spline curve
      if (other.curve === car.curve) {
        const isSameLane = Math.abs(other.laneOffset - car.laneOffset) < 2.2;
        if (isSameLane) {
          const progressDelta = other.progress - car.progress;
          // Other car is ahead on the same lane
          if (progressDelta > 0 && progressDelta < 0.28) {
            const dist = car.mesh.position.distanceTo(other.mesh.position);
            if (dist < minDist) {
              minDist = dist;
            }
          }
        }
      } else if (
        (car.state === 'OFF_RAMP' || car.state === 'QUEUED') &&
        (other.state === 'OFF_RAMP' || other.state === 'QUEUED' || other.state === 'APPROACHING_BAY')
      ) {
        // Along service boulevard: check forward distance along Z
        const dz = other.mesh.position.z - car.mesh.position.z;
        const dx = Math.abs(other.mesh.position.x - car.mesh.position.x);
        if (dz > 0 && dz < 35.0 && dx < 5.0) {
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < minDist) {
            minDist = dist;
          }
        }
      }
    }

    const safeDist = car.isTruck ? 22.0 : 14.0;
    const stopDist = car.isTruck ? 11.0 : 7.0;

    if (minDist < stopDist) {
      return 0.0; // Complete stop! Never overlap lead car!
    } else if (minDist < safeDist) {
      const factor = (minDist - stopDist) / (safeDist - stopDist);
      return Math.max(0.05, factor * factor);
    }

    return 1.0;
  }

  public update(dt: number, camera: THREE.Camera): void {
    // 1. Spawning Highway Traffic
    this.spawnTimer += dt;
    if (this.spawnTimer >= 3.2) {
      this.spawnTimer = 0;
      if (this.cars.length < 16) {
        const isTruck = Math.random() > 0.65;
        const color = this.carColors[Math.floor(Math.random() * this.carColors.length)];
        // Alternate between right cruising lane (2.5) and left passing lane (-2.5)
        const laneOffset = Math.random() > 0.4 ? 2.5 : -2.5;

        // Ensure no spawn overlap: verify spawn area is clear
        const spawnClear = !this.cars.some(c =>
          c.curve === this.roadways.highwayCurve &&
          c.progress < 0.08 &&
          Math.abs(c.laneOffset - laneOffset) < 2.0
        );

        if (spawnClear) {
          this.spawnCar(0, color, isTruck, laneOffset);
        }
      }
    }

    // 2. Automated Wholesale Fuel Delivery Tanker Truck (Every 50 seconds)
    this.tankerTimer += dt;
    if (this.tankerTimer >= 50.0) {
      this.tankerTimer = 0;
      this.spawnFuelTankerTruck();
    }

    // 3. Update Active Vehicles with Intelligent Collision Avoidance
    for (let i = this.cars.length - 1; i >= 0; i--) {
      const car = this.cars[i];
      const speedMult = this.getCarFollowingSpeedMultiplier(car);

      // === A. HIGHWAY CRUISE ===
      if (car.state === 'HIGHWAY') {
        car.progress += car.speed * speedMult * dt;

        // Off-ramp decision point at deceleration turnoff (Z = -165, progress 0.29 to 0.34 on 900m highway)
        const lvl = this.engine ? this.engine.plazaLevel : 1;
        // Trucks turn off if Level >= 2 (commercial diesel unlocked)
        const canTurnOff = !car.isTanker && car.laneOffset > 0 && car.progress >= 0.29 && car.progress <= 0.34 && (!car.isTruck || lvl >= 2);

        if (canTurnOff) {
          if (Math.random() < 0.50) {
            car.state = 'OFF_RAMP';
            car.curve = this.roadways.offRampCurve;
            car.progress = 0;
            car.speed = 0.036;
            car.laneOffset = 0;

            const r = Math.random();
            if (car.isTruck) {
              car.desiredCategory = lvl >= 4 && r < 0.35 ? 'PARKING' : 'FUEL';
            } else if (lvl === 1) {
              car.desiredCategory = 'FUEL';
            } else if (lvl === 2) {
              car.desiredCategory = r < 0.65 ? 'FUEL' : 'EV';
            } else if (lvl === 3) {
              if (r < 0.40) car.desiredCategory = 'FUEL';
              else if (r < 0.55) car.desiredCategory = 'EV';
              else if (r < 0.78) car.desiredCategory = 'SHOP';
              else car.desiredCategory = 'DINER';
            } else {
              if (r < 0.30) car.desiredCategory = 'FUEL';
              else if (r < 0.45) car.desiredCategory = 'EV';
              else if (r < 0.65) car.desiredCategory = 'SHOP';
              else if (r < 0.82) car.desiredCategory = 'DINER';
              else car.desiredCategory = 'MOTEL';
            }
          }
        }

        // End of highway -> despawn
        if (car.progress >= 1.0) {
          this.removeCar(i);
          continue;
        }

        this.updateCurveTransform(car);
      }

      // === B. OFF-RAMP & PLAZA SERVICE BOULEVARD ===
      else if (car.state === 'OFF_RAMP') {
        car.progress += car.speed * speedMult * dt;

        // Reserve bay when approaching service boulevard
        if (!car.assignedBay && car.progress >= 0.30) {
          const lvl = this.engine ? this.engine.plazaLevel : 1;
          const bay = this.bayManager.requestBay(car.desiredCategory, car.id, lvl, car.isTruck);
          if (bay) {
            car.assignedBay = bay;
          } else {
            // Queue up when full
            car.state = 'QUEUED';
            if (!car.queueSprite) {
              car.queueSprite = this.pedestrianController.createStatusSprite('⏳ Waiting (Bays Full)');
              car.queueSprite.position.set(0, 3.8, 0);
              car.mesh.add(car.queueSprite);
            }
          }
        }

        // Steer off service road into assigned bay when reaching approach point
        if (car.assignedBay) {
          const currentPos = car.curve.getPointAt(Math.min(1.0, car.progress));
          const distToApproach = currentPos.distanceTo(car.assignedBay.approachPoint);
          if (distToApproach < 4.5 || currentPos.z >= car.assignedBay.approachPoint.z) {
            car.state = 'APPROACHING_BAY';
            car.transitionStart = currentPos.clone();
            car.transitionEnd = car.assignedBay.position.clone();
            car.transitionProgress = 0;
            car.transitionStartRot = car.mesh.rotation.y;
            car.transitionEndRot = car.assignedBay.rotationY;
            continue;
          }
        }

        if (car.progress >= 1.0) {
          car.state = 'RETURN';
          car.curve = this.roadways.plazaReturnCurve;
          car.progress = 0;
          car.speed = 0.042;
          continue;
        }

        this.updateCurveTransform(car);
      }

      // === C. QUEUED (WAITING FOR CAPACITY WITH SPACING) ===
      else if (car.state === 'QUEUED') {
        car.progress += car.speed * 0.25 * speedMult * dt;
        this.updateCurveTransform(car);

        const lvl = this.engine ? this.engine.plazaLevel : 1;
        const bay = this.bayManager.requestBay(car.desiredCategory, car.id, lvl, car.isTruck);
        if (bay) {
          car.assignedBay = bay;
          car.state = 'OFF_RAMP';
          if (car.queueSprite) {
            car.mesh.remove(car.queueSprite);
            car.queueSprite = undefined;
          }
        } else if (car.progress >= 0.95) {
          if (car.queueSprite) {
            car.mesh.remove(car.queueSprite);
            car.queueSprite = undefined;
          }
          car.state = 'RETURN';
          car.curve = this.roadways.plazaReturnCurve;
          car.progress = 0;
          car.speed = 0.042;
        }
      }

      // === D. PULLING OFF ROAD INTO BAY ===
      else if (car.state === 'APPROACHING_BAY') {
        car.transitionProgress += dt * 0.45;
        const t = Math.min(1.0, car.transitionProgress);
        const easeT = t * t * (3 - 2 * t);

        car.mesh.position.lerpVectors(car.transitionStart, car.transitionEnd, easeT);
        car.mesh.position.y = 0.05;
        car.mesh.rotation.y = THREE.MathUtils.lerp(car.transitionStartRot, car.transitionEndRot, easeT);
        car.mesh.rotation.x = 0;
        car.mesh.rotation.z = 0;

        if (car.transitionProgress >= 1.0 && car.assignedBay) {
          car.state = 'PARKED';
          car.serviceTime = car.assignedBay.dwellTime;
          car.mesh.position.copy(car.assignedBay.position);
          car.mesh.rotation.set(0, car.assignedBay.rotationY, 0);

          // Spawn animated 3D pedestrian customer
          this.pedestrianController.spawnCustomer(car.id, car.assignedBay);
        }
      }

      // === E. PARKED & SERVICING ===
      else if (car.state === 'PARKED') {
        car.serviceTime -= dt;

        if (car.serviceTime <= 0 && car.assignedBay) {
          // Check if service road has traffic directly behind the stall before pulling out
          const roadBlocked = this.cars.some(other =>
            (other.state === 'OFF_RAMP' || other.state === 'QUEUED') &&
            Math.abs(other.mesh.position.z - car.assignedBay!.exitPoint.z) < 11.0
          );

          if (!roadBlocked) {
            this.processTransaction(car.assignedBay.category, car.isTruck, car.mesh.position);

            car.state = 'PULLING_OUT';
            car.transitionStart = car.assignedBay.position.clone();
            car.transitionEnd = car.assignedBay.exitPoint.clone();
            car.transitionProgress = 0;
            car.transitionStartRot = car.mesh.rotation.y;
            car.transitionEndRot = 0;

            this.bayManager.releaseBay(car.assignedBay.id);
            car.assignedBay = null;
          }
        }
      }

      // === F. PULLING OUT OF BAY INTO SERVICE ROAD ===
      else if (car.state === 'PULLING_OUT') {
        car.transitionProgress += dt * 0.45;
        const t = Math.min(1.0, car.transitionProgress);
        const easeT = t * t * (3 - 2 * t);

        car.mesh.position.lerpVectors(car.transitionStart, car.transitionEnd, easeT);
        car.mesh.position.y = 0.05;
        car.mesh.rotation.y = THREE.MathUtils.lerp(car.transitionStartRot, car.transitionEndRot, easeT);

        if (car.transitionProgress >= 1.0) {
          car.state = 'RETURN';
          car.curve = this.roadways.plazaReturnCurve;
          car.progress = 0;
          car.speed = 0.042;
          car.laneOffset = 0;
        }
      }

      // === G. RETURN LANE & HIGHWAY MERGE WITH YIELDING ===
      else if (car.state === 'RETURN') {
        // Check merge yielding: if near merge point (progress > 0.82), yield to oncoming highway cars
        let yieldForHighway = false;
        if (car.progress >= 0.82) {
          yieldForHighway = this.cars.some(other =>
            other.state === 'HIGHWAY' &&
            Math.abs(other.mesh.position.x - (-13)) < 4.0 &&
            other.mesh.position.z > 140 &&
            other.mesh.position.z < 205
          );
        }

        if (!yieldForHighway) {
          car.progress += car.speed * speedMult * dt;
        }

        if (car.progress >= 1.0) {
          car.state = 'HIGHWAY';
          car.curve = this.roadways.highwayCurve;
          car.progress = 0.73; // Merged at Z = 205 on 900m highway
          car.speed = 0.028;
          car.laneOffset = 2.5; // Merge into right highway lane
          continue;
        }

        this.updateCurveTransform(car);
      }
    }

    // 4. Update Floating Cash Popups
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const f = this.floatingTexts[i];
      f.timer += dt;
      const progress = f.timer / f.maxTimer;

      // Float upward smoothly
      f.sprite.position.y = f.initialY + progress * 4.5;

      // Fade out
      (f.sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, 1 - progress);

      if (f.timer >= f.maxTimer) {
        this.group.remove(f.sprite);
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private processTransaction(category: BayCategory, isTruck: boolean, pos: THREE.Vector3): void {
    if (!this.engine) return;
    this.engine.totalCustomersServed += 1;

    let revenue = 0;
    let label = '';

    if (category === 'FUEL') {
      const liters = isTruck ? 160 : 50;
      const fuelType = isTruck ? 'DIESEL' : 'REGULAR';
      const pricePerLiter = 1.48;
      revenue = Math.round(liters * pricePerLiter);
      label = `+$${revenue}.00 ⛽`;

      this.engine.fuelStorage.dispenseFuel(fuelType as any, liters);
      this.engine.economy.recordTransaction('FUEL', revenue, `Fuel Dispensed: ${liters}L (${fuelType})`, this.engine.day, this.engine.hour);
      sound.playCashSound();
    } else if (category === 'EV') {
      revenue = 35.0;
      label = `+$${revenue}.00 ⚡`;
      this.engine.economy.recordTransaction('FUEL', revenue, '350kW Fast EV Charge', this.engine.day, this.engine.hour);
      sound.playCashSound();
    } else if (category === 'DINER') {
      revenue = isTruck ? 54.0 : 38.0;
      label = `+$${revenue}.00 🍔`;
      this.engine.economy.recordTransaction('DINER', revenue, 'Diner Meals & Shakes', this.engine.day, this.engine.hour);
      sound.playCashSound();
    } else if (category === 'SHOP') {
      revenue = 24.0;
      label = `+$${revenue}.00 🛒`;
      this.engine.economy.recordTransaction('STORE', revenue, 'QuickMart Snacks & Coffee', this.engine.day, this.engine.hour);
      sound.playCashSound();
    } else if (category === 'MOTEL') {
      revenue = 95.0;
      label = `+$${revenue}.00 🏨`;
      this.engine.economy.recordTransaction('MOTEL', revenue, 'Motel Rest Room Night', this.engine.day, this.engine.hour);
      sound.playCashSound();
    }

    if (revenue > 0) {
      this.spawnFloatingCashText(pos, label);
    }
  }

  /**
   * Spawns a floating cash text sprite that drifts upward and shines
   */
  public spawnFloatingCashText(worldPos: THREE.Vector3, text: string): void {
    if (typeof document === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Glowing green pill
    ctx.fillStyle = 'rgba(6, 78, 59, 0.92)';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 284, 64, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 150, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(4.8, 1.3, 1.0);
    sprite.position.set(worldPos.x, worldPos.y + 2.5, worldPos.z);
    this.group.add(sprite);

    this.floatingTexts.push({
      sprite,
      timer: 0,
      maxTimer: 1.8,
      initialY: worldPos.y + 2.5
    });
  }

  /**
   * Spawns an authentic Wholesale Fuel Delivery Tanker Semi-Truck
   */
  public spawnFuelTankerTruck(): void {
    const mesh = this.createFuelTankerMesh();
    const carId = `tanker_${Date.now()}`;

    const car: Car3D = {
      id: carId,
      mesh,
      curve: this.roadways.highwayCurve,
      progress: 0,
      speed: 0.04,
      isTruck: true,
      isTanker: true,
      color: 0xe2e8f0,
      state: 'HIGHWAY',
      serviceTime: 0,
      laneOffset: 2.5,
      assignedBay: null,
      desiredCategory: 'FUEL',
      transitionStart: new THREE.Vector3(),
      transitionEnd: new THREE.Vector3(),
      transitionProgress: 0,
      transitionStartRot: 0,
      transitionEndRot: 0
    };

    mesh.position.copy(car.curve.getPointAt(0));
    this.group.add(mesh);
    this.cars.push(car);
  }

  private updateCurveTransform(car: Car3D): void {
    const progressClamped = Math.min(1.0, Math.max(0, car.progress));
    const point = car.curve.getPointAt(progressClamped);
    const tangent = car.curve.getTangentAt(progressClamped).normalize();

    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const finalPos = point.clone().addScaledVector(normal, car.laneOffset);
    finalPos.y = 0.05; // Ground level contact
    car.mesh.position.copy(finalPos);

    const yaw = Math.atan2(tangent.x, tangent.z);
    car.mesh.rotation.set(0, yaw, 0, 'YXZ');
  }

  private spawnStarterParkedCar(bayId: string, color: number, isTruck: boolean): void {
    const bay = this.bayManager.getBay(bayId);
    if (!bay) return;

    const mesh = isTruck ? this.create3DTruck(color) : this.create3DCar(color);
    mesh.position.copy(bay.position);
    mesh.rotation.set(0, bay.rotationY, 0);
    this.group.add(mesh);

    const carId = `car_starter_${bayId}`;
    bay.occupiedBy = carId;

    const car: Car3D = {
      id: carId,
      mesh,
      curve: this.roadways.offRampCurve,
      progress: 0,
      speed: 0.04,
      isTruck,
      color,
      state: 'PARKED',
      serviceTime: bay.dwellTime * 0.7,
      laneOffset: 0,
      assignedBay: bay,
      desiredCategory: bay.category,
      transitionStart: bay.position.clone(),
      transitionEnd: bay.position.clone(),
      transitionProgress: 1,
      transitionStartRot: bay.rotationY,
      transitionEndRot: bay.rotationY
    };

    this.cars.push(car);
    this.pedestrianController.spawnCustomer(carId, bay);
  }

  private spawnCar(initialProgress: number, color: number, isTruck: boolean, laneOffset: number): void {
    const mesh = isTruck ? this.create3DTruck(color) : this.create3DCar(color);
    const carId = `car_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const car: Car3D = {
      id: carId,
      mesh,
      curve: this.roadways.highwayCurve,
      progress: initialProgress,
      speed: isTruck ? 0.024 : 0.032,
      isTruck,
      color,
      state: 'HIGHWAY',
      serviceTime: 0,
      laneOffset,
      assignedBay: null,
      desiredCategory: 'FUEL',
      transitionStart: new THREE.Vector3(),
      transitionEnd: new THREE.Vector3(),
      transitionProgress: 0,
      transitionStartRot: 0,
      transitionEndRot: 0
    };

    const pt = car.curve.getPointAt(initialProgress);
    mesh.position.copy(pt);
    this.group.add(mesh);
    this.cars.push(car);
  }

  private removeCar(index: number): void {
    const car = this.cars[index];
    if (car.assignedBay) {
      this.bayManager.releaseBay(car.assignedBay.id);
    }
    this.pedestrianController.removeCustomerByVehicle(car.id);
    if (car.queueSprite) {
      car.mesh.remove(car.queueSprite);
    }
    this.group.remove(car.mesh);
    this.cars.splice(index, 1);
  }

  /**
   * Scaled-Up 3D Passenger Car (Width 3.5m, Height 1.6m, Length 7.0m)
   * Chunky, bold proportions for clear screen visibility!
   */
  public create3DCar(color: number): THREE.Group {
    const car = new THREE.Group();

    // 1. Lower Chassis & Aerodynamic Body
    const bodyGeo = new THREE.BoxGeometry(3.5, 1.1, 7.0);
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.2,
      metalness: 0.45
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.85;
    body.castShadow = true;
    car.add(body);

    // Front Bumper Lip (+Z)
    const bumperGeo = new THREE.BoxGeometry(3.4, 0.5, 0.7);
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const bumper = new THREE.Mesh(bumperGeo, bumperMat);
    bumper.position.set(0, 0.55, 3.5);
    car.add(bumper);

    // 2. Glass Greenhouse / Aerodynamic Cabin
    const cabinGeo = new THREE.BoxGeometry(2.9, 1.0, 3.8);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.85
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.9, -0.3);
    cabin.castShadow = true;
    car.add(cabin);

    // Color Roof Cap
    const roofGeo = new THREE.BoxGeometry(2.86, 0.14, 3.6);
    const roof = new THREE.Mesh(roofGeo, bodyMat);
    roof.position.set(0, 2.45, -0.3);
    car.add(roof);

    // 3. Glowing Front Headlights (+Z)
    const hlGeo = new THREE.BoxGeometry(0.65, 0.3, 0.15);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const hlL = new THREE.Mesh(hlGeo, hlMat);
    hlL.position.set(-1.15, 0.95, 3.52);
    const hlR = hlL.clone();
    hlR.position.x = 1.15;
    car.add(hlL);
    car.add(hlR);

    // 4. Red Rear Taillights (-Z)
    const tlGeo = new THREE.BoxGeometry(0.7, 0.3, 0.15);
    const tlMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tlL = new THREE.Mesh(tlGeo, tlMat);
    tlL.position.set(-1.15, 1.0, -3.52);
    const tlR = tlL.clone();
    tlR.position.x = 1.15;
    car.add(tlL);
    car.add(tlR);

    // 5. Four Chunky Rubber Wheels with Chrome Hubcaps
    const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.45, 16);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
    const rimGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.47, 12);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.15 });

    const wheelPositions = [
      { x: -1.78, z: 2.1 },
      { x: 1.78, z: 2.1 },
      { x: -1.78, z: -2.1 },
      { x: 1.78, z: -2.1 }
    ];

    wheelPositions.forEach(wp => {
      const wheel = new THREE.Group();
      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheel.add(tire);
      wheel.add(rim);
      wheel.position.set(wp.x, 0.65, wp.z);
      wheel.castShadow = true;
      car.add(wheel);
    });

    return car;
  }

  /**
   * Scaled-Up 18-Wheeler Freight Semi-Truck with Kenworth Cab & 53ft Trailer
   */
  public create3DTruck(cabColor: number): THREE.Group {
    const truck = new THREE.Group();

    // 1. Semi-Tractor Cab (+Z)
    const cabGeo = new THREE.BoxGeometry(4.0, 4.4, 5.8);
    const cabMat = new THREE.MeshStandardMaterial({
      color: cabColor,
      roughness: 0.3,
      metalness: 0.35
    });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 2.7, 5.2);
    cab.castShadow = true;
    truck.add(cab);

    // Big Chrome Grille (+Z)
    const grilleGeo = new THREE.BoxGeometry(2.6, 2.2, 0.3);
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const grille = new THREE.Mesh(grilleGeo, chromeMat);
    grille.position.set(0, 1.9, 8.12);
    truck.add(grille);

    // Windshield (+Z)
    const wsGeo = new THREE.BoxGeometry(3.4, 1.4, 0.2);
    const wsMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8 });
    const ws = new THREE.Mesh(wsGeo, wsMat);
    ws.position.set(0, 3.8, 8.11);
    truck.add(ws);

    // Dual Chrome Vertical Exhaust Smoke Stacks
    const pipeGeo = new THREE.CylinderGeometry(0.14, 0.14, 5.2, 12);
    for (const px of [-1.9, 1.9]) {
      const pipe = new THREE.Mesh(pipeGeo, chromeMat);
      pipe.position.set(px, 4.2, 2.6);
      truck.add(pipe);
    }

    // 2. 53ft Refrigerated Freight Box Trailer (-Z)
    const trailerGeo = new THREE.BoxGeometry(4.2, 5.4, 14.5);
    const trailerMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45,
      metalness: 0.1
    });
    const trailer = new THREE.Mesh(trailerGeo, trailerMat);
    trailer.position.set(0, 3.6, -5.2);
    trailer.castShadow = true;
    truck.add(trailer);

    // Trailer Rear Doors (-Z)
    const doorFrameGeo = new THREE.BoxGeometry(3.9, 5.0, 0.2);
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 });
    const doorFrame = new THREE.Mesh(doorFrameGeo, doorFrameMat);
    doorFrame.position.set(0, 3.6, -12.46);
    truck.add(doorFrame);

    // 3. Ten Heavy-Duty Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.55, 16);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    const wheelZPositions = [6.8, 4.0, 2.0, -9.5, -11.5];
    wheelZPositions.forEach(z => {
      for (const x of [-1.95, 1.95]) {
        const w = new THREE.Mesh(wheelGeo, tireMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(x, 0.75, z);
        w.castShadow = true;
        truck.add(w);
      }
    });

    return truck;
  }

  /**
   * Wholesale Fuel Delivery Tanker Semi-Truck (Cylindrical Stainless Steel Tanker)
   */
  public createFuelTankerMesh(): THREE.Group {
    const truck = new THREE.Group();

    // Red Tractor Cab
    const cabGeo = new THREE.BoxGeometry(4.0, 4.4, 5.8);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 2.7, 5.2);
    cab.castShadow = true;
    truck.add(cab);

    // Chrome Tanker Cylinder (Length 14.5, Radius 2.2)
    const tankGeo = new THREE.CylinderGeometry(2.1, 2.1, 14.2, 24);
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15
    });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.rotation.x = Math.PI / 2;
    tank.position.set(0, 3.5, -5.2);
    tank.castShadow = true;
    truck.add(tank);

    // Red Flammable Hazard Diamond
    const hazGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const hazMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const hazL = new THREE.Mesh(hazGeo, hazMat);
    hazL.rotation.y = -Math.PI / 2;
    hazL.rotation.z = Math.PI / 4;
    hazL.position.set(-2.15, 3.5, -5.2);
    truck.add(hazL);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.55, 16);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const wheelZPositions = [6.8, 4.0, 2.0, -9.5, -11.5];
    wheelZPositions.forEach(z => {
      for (const x of [-1.95, 1.95]) {
        const w = new THREE.Mesh(wheelGeo, tireMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(x, 0.75, z);
        w.castShadow = true;
        truck.add(w);
      }
    });

    return truck;
  }
}
