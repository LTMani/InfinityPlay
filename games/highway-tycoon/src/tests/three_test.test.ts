import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { RoadwaySystem } from '../rendering/3d/RoadwaySystem';
import { PlazaBuildings } from '../rendering/3d/PlazaBuildings';
import { VehicleController } from '../rendering/3d/VehicleController';
import { ParkingBayManager } from '../rendering/3d/ParkingBayManager';
import { PedestrianController } from '../rendering/3d/PedestrianController';

describe('3D Scene Components', () => {
  it('should initialize RoadwaySystem without errors', () => {
    const roadways = new RoadwaySystem();
    expect(roadways.group.children.length).toBeGreaterThan(0);
  });

  it('should initialize PlazaBuildings without errors', () => {
    const buildings = new PlazaBuildings();
    expect(buildings.group.children.length).toBeGreaterThan(0);
  });

  it('should initialize VehicleController without errors', () => {
    const roadways = new RoadwaySystem();
    const bayManager = new ParkingBayManager();
    const pedestrianController = new PedestrianController();
    const camera = new THREE.PerspectiveCamera();
    const vehicles = new VehicleController(roadways, bayManager, pedestrianController);
    expect(vehicles.group.children.length).toBeGreaterThan(0);

    // Test update tick
    vehicles.update(0.016, camera);
    pedestrianController.update(0.016, camera);
  });
});
