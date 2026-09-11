/**
 * Railway Commander - Save Manager
 * Manages resilient persistence to LocalStorage with fallback handling,
 * corrupted JSON recovery, and driver profile progression.
 */

const STORAGE_KEY = 'railway_commander_save_v1';
const SETTINGS_KEY = 'railway_commander_settings_v1';

export class SaveManager {
  constructor() {
    this.progress = this.loadProgress();
    this.settings = this.loadSettings();
  }

  getStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
      if (typeof localStorage !== 'undefined') return localStorage;
    } catch (e) {}
    return null;
  }

  loadProgress() {
    const defaultData = {
      driverName: 'Train Commander',
      driverLevel: 1,
      totalXp: 0,
      coins: 150,
      unlockedMissions: ['mission-1'],
      completedMissions: [],
      bestScores: {},
      missionStars: {}
    };

    try {
      const storage = this.getStorage();
      if (!storage) return defaultData;

      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return defaultData;

      const parsed = JSON.parse(raw);
      return {
        ...defaultData,
        ...parsed,
        unlockedMissions: Array.isArray(parsed.unlockedMissions) && parsed.unlockedMissions.length > 0
          ? parsed.unlockedMissions
          : ['mission-1'],
        completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
        bestScores: parsed.bestScores || {},
        missionStars: parsed.missionStars || {}
      };
    } catch (e) {
      return defaultData;
    }
  }

  saveProgress() {
    try {
      const storage = this.getStorage();
      if (storage) {
        storage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
      }
    } catch (e) {
      console.warn('RailwayCommander: Failed to write save to localStorage', e);
    }
  }

  loadSettings() {
    const defaultSettings = {
      sound: true,
      music: true,
      quality: 'HIGH',
      cameraMode: 'chase'
    };

    try {
      const storage = this.getStorage();
      if (!storage) return defaultSettings;

      const raw = storage.getItem(SETTINGS_KEY);
      if (!raw) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch (e) {
      return defaultSettings;
    }
  }

  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    try {
      const storage = this.getStorage();
      if (storage) {
        storage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      }
    } catch (e) {
      console.warn('RailwayCommander: Failed to write settings to localStorage', e);
    }
  }

  getProgress() {
    return this.progress;
  }

  recordMissionCompletion({ missionId, score, stars, earnedXp, earnedCoins, nextMissionId }) {
    if (!this.progress.completedMissions.includes(missionId)) {
      this.progress.completedMissions.push(missionId);
    }

    if (nextMissionId && !this.progress.unlockedMissions.includes(nextMissionId)) {
      this.progress.unlockedMissions.push(nextMissionId);
    }

    const currentBest = this.progress.bestScores[missionId] || 0;
    if (score > currentBest) {
      this.progress.bestScores[missionId] = score;
    }

    const currentStars = this.progress.missionStars[missionId] || 0;
    if (stars > currentStars) {
      this.progress.missionStars[missionId] = stars;
    }

    this.progress.totalXp += (earnedXp || 0);
    this.progress.coins += (earnedCoins || 0);
    this.progress.driverLevel = Math.max(1, Math.floor(this.progress.totalXp / 1000) + 1);

    this.saveProgress();
  }

  resetProgress() {
    this.progress = {
      driverName: 'Train Commander',
      driverLevel: 1,
      totalXp: 0,
      coins: 150,
      unlockedMissions: ['mission-1'],
      completedMissions: [],
      bestScores: {},
      missionStars: {}
    };
    this.saveProgress();
  }
}
