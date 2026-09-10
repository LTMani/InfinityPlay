/**
 * Bus Simulator - Customization UI
 * Bus exterior, interior, and performance customization interface
 *
 * SKELETON - UI structure implemented, full customization workflow in Phase 2
 */

(function () {
  'use strict';

  const CustomizationData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.CustomizationData) ||
    (typeof require !== 'undefined' ? require('../data/customization') : null);
  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) || null;

  const CustomizationUI = {
    _container: null,
    _activeBus: null,
    _currentCategory: 'exterior',
    _selectedCustomizations: {},

    init(modules) {
      this.modules = modules;
    },

    show(bus) {
      this._activeBus = bus;
      this._currentCategory = 'exterior';
      this._selectedCustomizations = {};

      if (bus && bus.customization) {
        this._selectedCustomizations = JSON.parse(JSON.stringify(bus.customization));
      }

      this._render();
    },

    hide() {
      this._container = null;
      this._activeBus = null;
    },

    _render() {
      const container = document.getElementById('busCustomizationContent');
      if (!container) return;

      container.innerHTML = `
        <div class="bus-customization">
          <div class="bus-cust-header">
            <div class="bus-cust-title">Customize: ${this._activeBus ?
              (this._activeBus.busType ? this._activeBus.busType.displayName : 'Bus') : 'Bus'}</div>
            <div class="bus-cust-price">Total: ₵ ${this._getTotalCost().toLocaleString()}</div>
          </div>
          <div class="bus-cust-categories">
            <button class="bus-cust-cat ${this._currentCategory === 'exterior' ? 'active' : ''}"
                    data-category="exterior">🎨 Exterior</button>
            <button class="bus-cust-cat ${this._currentCategory === 'interior' ? 'active' : ''}"
                    data-category="interior">🪑 Interior</button>
            <button class="bus-cust-cat ${this._currentCategory === 'performance' ? 'active' : ''}"
                    data-category="performance">⚙ Performance</button>
            <button class="bus-cust-cat ${this._currentCategory === 'driver' ? 'active' : ''}"
                    data-category="driver">👔 Driver</button>
          </div>
          <div class="bus-cust-options" id="busCustOptions"></div>
          <div class="bus-cust-actions">
            <button class="bus-btn" data-action="reset">↺ Reset</button>
            <button class="bus-btn bus-btn-primary" data-action="apply">✓ Apply (₵ ${this._getTotalCost().toLocaleString()})</button>
          </div>
        </div>
      `;

      this._renderOptions();
      this._bindEvents();
    },

    _renderOptions() {
      const optionsContainer = document.getElementById('busCustOptions');
      if (!optionsContainer) return;

      if (!CustomizationData) {
        optionsContainer.innerHTML = '<div class="bus-cust-placeholder">Customization data not loaded</div>';
        return;
      }

      const category = this._currentCategory;
      const categoryData = CustomizationData[category];
      if (!categoryData) {
        optionsContainer.innerHTML = '<div class="bus-cust-placeholder">Not available yet</div>';
        return;
      }

      let html = '<div class="bus-cust-grid">';
      for (const [key, items] of Object.entries(categoryData)) {
        if (Array.isArray(items)) {
          html += `<div class="bus-cust-group"><h4>${key.replace(/([A-Z])/g, ' $1')}</h4>`;
          for (const item of items) {
            const current = this._getCurrentValue(category, key);
            const selected = current === item.id;
            html += `
              <div class="bus-cust-option ${selected ? 'selected' : ''}"
                   data-category="${category}" data-key="${key}" data-value="${item.id}">
                <div class="bus-cust-option-name">${item.name}</div>
                <div class="bus-cust-option-price">${item.price > 0 ? '₵ ' + item.price.toLocaleString() : 'Owned'}</div>
              </div>
            `;
          }
          html += '</div>';
        }
      }
      html += '</div>';

      optionsContainer.innerHTML = html;
    },

    _getCurrentValue(category, key) {
      if (!this._selectedCustomizations[category]) return null;
      return this._selectedCustomizations[category][key];
    },

    _getTotalCost() {
      if (!this._selectedCustomizations || !this._activeBus) return 0;
      let total = 0;

      // Cost = difference from current customization
      const current = this._activeBus.customization;
      const selected = this._selectedCustomizations;

      if (selected.exterior && selected.exterior.paintColor &&
          current.exterior && selected.exterior.paintColor !== current.exterior.paintColor) {
        // Find item cost
      }

      return total;
    },

    _bindEvents() {
      const self = this;
      const allOptions = document.querySelectorAll('[data-category][data-key][data-value]');
      for (const opt of allOptions) {
        opt.addEventListener('click', () => {
          const cat = opt.getAttribute('data-category');
          const key = opt.getAttribute('data-key');
          const val = opt.getAttribute('data-value');

          if (!self._selectedCustomizations[cat]) self._selectedCustomizations[cat] = {};
          self._selectedCustomizations[cat][key] = val;

          self._render();
        });
      }

      const applyBtn = document.querySelector('[data-action="apply"]');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => self._apply());
      }

      const resetBtn = document.querySelector('[data-action="reset"]');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => self._reset());
      }

      // Category tabs
      const catBtns = document.querySelectorAll('[data-category]');
      for (const btn of catBtns) {
        if (btn.id === 'busCustOptions') continue;
        if (btn.classList.contains('bus-cust-option')) continue;

        btn.addEventListener('click', () => {
          self._currentCategory = btn.getAttribute('data-category');
          self._render();
        });
      }
    },

    _apply() {
      if (!this._activeBus || !this._activeBus.customization) return;

      this._activeBus.customization = JSON.parse(JSON.stringify(this._selectedCustomizations));

      if (EventManager) {
        EventManager.emit('busCustomized', {
          busId: this._activeBus.id,
          customization: this._activeBus.customization
        });
      }
    },

    _reset() {
      this._selectedCustomizations = JSON.parse(JSON.stringify(this._activeBus.customization));
      this._render();
    },

    update(dt) {},

    destroy() {
      this._container = null;
      this._activeBus = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.CustomizationUI = CustomizationUI;
  }
  if (typeof module !== 'undefined') {
    module.exports = CustomizationUI;
  }
})();
