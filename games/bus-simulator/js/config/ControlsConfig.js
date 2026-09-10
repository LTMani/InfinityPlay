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
        uiCancel: ['Escape']
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
