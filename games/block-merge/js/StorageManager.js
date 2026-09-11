/**
 * StorageManager.js
 * Safe localStorage abstraction for BLOCK MERGE.
 * Manages best scores, auto-save states, sound preferences, and protects against data corruption.
 */

export class StorageManager {
  constructor() {
    this.STORAGE_KEYS = {
      BEST_SCORE: 'infinity_block_merge_best_score',
      GAME_STATE: 'infinity_block_merge_game_state',
      SOUND_ENABLED: 'infinity_block_merge_sound_enabled'
    };
  }

  isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  getBestScore() {
    if (!this.isLocalStorageAvailable()) return 0;
    try {
      const val = localStorage.getItem(this.STORAGE_KEYS.BEST_SCORE);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  }

  setBestScore(score) {
    if (!this.isLocalStorageAvailable()) return;
    try {
      const current = this.getBestScore();
      if (score > current) {
        localStorage.setItem(this.STORAGE_KEYS.BEST_SCORE, score.toString());
      }
    } catch (e) {
      console.warn('Could not save best score:', e);
    }
  }

  getSavedGameState() {
    if (!this.isLocalStorageAvailable()) return null;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEYS.GAME_STATE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Validate schema integrity
      if (!parsed || !Array.isArray(parsed.grid) || parsed.grid.length !== 4) {
        this.clearSavedGameState();
        return null;
      }
      return parsed;
    } catch (e) {
      console.warn('Corrupted game state detected in localStorage. Clearing:', e);
      this.clearSavedGameState();
      return null;
    }
  }

  saveGameState(state) {
    if (!this.isLocalStorageAvailable()) return;
    try {
      if (!state || state.isGameOver) {
        this.clearSavedGameState();
      } else {
        localStorage.setItem(this.STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
      }
    } catch (e) {
      console.warn('Could not auto-save game state:', e);
    }
  }

  clearSavedGameState() {
    if (!this.isLocalStorageAvailable()) return;
    try {
      localStorage.removeItem(this.STORAGE_KEYS.GAME_STATE);
    } catch (e) {
      // Ignore
    }
  }

  getSoundEnabled() {
    if (!this.isLocalStorageAvailable()) return true;
    try {
      const val = localStorage.getItem(this.STORAGE_KEYS.SOUND_ENABLED);
      return val === null ? true : val === 'true';
    } catch (e) {
      return true;
    }
  }

  setSoundEnabled(enabled) {
    if (!this.isLocalStorageAvailable()) return;
    try {
      localStorage.setItem(this.STORAGE_KEYS.SOUND_ENABLED, enabled.toString());
    } catch (e) {
      // Ignore
    }
  }
}
