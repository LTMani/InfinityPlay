/**
 * Bus Simulator - Asset Loader
 * Preloads and caches images, sprites, and audio
 */

(function () {
  'use strict';

  const AssetLoader = {
    _cache: {},
    _queue: [],
    _loaded: 0,
    _total: 0,
    _onComplete: null,
    _onProgress: null,

    /**
     * Load a single image by URL.
     * Returns a Promise that resolves to the HTMLImageElement.
     */
    loadImage(url) {
      return new Promise((resolve, reject) => {
        if (this._cache[url]) {
          resolve(this._cache[url]);
          return;
        }
        const img = new Image();
        img.onload = () => {
          this._cache[url] = img;
          resolve(img);
        };
        img.onerror = () => {
          console.warn('AssetLoader: Failed to load image:', url);
          resolve(null);
        };
        img.src = url;
      });
    },

    /**
     * Load an audio file by URL.
     * Returns a Promise that resolves to an Audio object.
     */
    loadAudio(url) {
      return new Promise((resolve) => {
        if (this._cache[url]) {
          resolve(this._cache[url]);
          return;
        }
        const audio = new Audio();
        audio.preload = 'auto';
        audio.onload = () => {
          this._cache[url] = audio;
          resolve(audio);
        };
        audio.onerror = () => {
          console.warn('AssetLoader: Failed to load audio:', url);
          resolve(null);
        };
        audio.src = url;
      });
    },

    /**
     * Queue multiple assets for loading.
     * items: [{ type: 'image'|'audio', url: string }]
     */
    loadQueue(items) {
      return new Promise((resolve) => {
        if (!items || items.length === 0) {
          resolve([]);
          return;
        }

        this._total = items.length;
        this._loaded = 0;
        const results = [];

        items.forEach((item, index) => {
          const loader = item.type === 'audio'
            ? this.loadAudio(item.url)
            : this.loadImage(item.url);

          loader.then((result) => {
            results[index] = result;
            this._loaded++;
            if (this._onProgress) {
              this._onProgress(this._loaded / this._total);
            }
            if (this._loaded === this._total) {
              if (this._onComplete) this._onComplete();
              resolve(results);
            }
          });
        });
      });
    },

    get(url) {
      return this._cache[url] || null;
    },

    isLoaded(url) {
      return !!this._cache[url];
    },

    onProgress(callback) {
      this._onProgress = callback;
    },

    onComplete(callback) {
      this._onComplete = callback;
    },

    clear() {
      this._cache = {};
      this._queue = [];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.AssetLoader = AssetLoader;
  }
  if (typeof module !== 'undefined') {
    module.exports = AssetLoader;
  }
})();
