/**
 * Bus Simulator - Controls Configuration
 * Keyboard mappings for player input
 */

(function () {
  'use strict';

  const ControlsConfig = {
    // Movement
    accelerate: 'KeyW',
    brake: 'KeyS',
    steerLeft: 'KeyA',
    steerRight: 'KeyD',
    handbrake: 'Space',

    // Alternative WASD / Arrow keys
    accelerateAlt: 'ArrowUp',
    brakeAlt: 'ArrowDown',
    steerLeftAlt: 'ArrowLeft',
    steerRightAlt: 'ArrowRight',

// Gameplay
    pause: 'KeyP',
    exitVehicle: 'KeyE',
    horn: 'KeyH',
    toggleLights: 'KeyL',
    toggleView: 'KeyV',
    // Phase 10B Task 15: wiper and interior-light toggles.
    // Deliberately non-conflicting keys: KeyW is accelerate, so wipers
    // use KeyU and interior lights use KeyI.
    wipers: 'KeyU',
    interiorLights: 'KeyI',

    // UI Navigation
    menuBack: 'Escape',
    uiUp: 'ArrowUp',
    uiDown: 'ArrowDown',
    uiLeft: 'ArrowLeft',
    uiRight: 'ArrowRight',
    uiSelect: 'Enter',
    uiCancel: 'Escape',

    // Garage / Customization
    garagePrev: 'ArrowLeft',
    garageNext: 'ArrowRight',
    customizePrev: 'ArrowLeft',
    customizeNext: 'ArrowRight',

    // Game specific toggles
    toggleSpeedo: 'KeyO',
    toggleNav: 'KeyN',
    toggleMap: 'KeyM',
    // Phase 10B Task 16: door controls.
    // Deliberately non-conflicting keys: KeyT/R/G are unused.
    toggleDoors: 'KeyT',
    toggleRearDoor: 'KeyR',
    toggleDriverDoor: 'KeyG',

    getActionKeys(actionName) {
      const mapping = {
        accelerate: ['KeyW', 'ArrowUp'],
        brake: ['KeyS', 'ArrowDown'],
        steerLeft: ['KeyA', 'ArrowLeft'],
        steerRight: ['KeyD', 'ArrowRight'],
        handbrake: ['Space'],
        pause: ['KeyP', 'Escape'],
        horn: ['KeyH'],
        toggleLights: ['KeyL'],
        toggleView: ['KeyV'],
        exitVehicle: ['KeyE'],
        menuBack: ['Escape'],
        uiSelect: ['Enter'],
        uiCancel: ['Escape'],
        // Phase 10B Task 15
        wipers: ['KeyU'],
        interiorLights: ['KeyI'],
        // Phase 10B Task 16
        toggleDoors: ['KeyT'],
        toggleRearDoor: ['KeyR'],
        toggleDriverDoor: ['KeyG']
      };
      return mapping[actionName] || [this[actionName] || actionName];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.ControlsConfig = ControlsConfig;
  }
  if (typeof module !== 'undefined') {
    module.exports = ControlsConfig;
  }
})();
