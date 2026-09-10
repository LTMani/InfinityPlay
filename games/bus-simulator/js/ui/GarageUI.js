/**
 * Bus Simulator - Garage UI
 * Bus selection, purchase, and fleet management interface
 *
 * SKELETON - UI structure implemented, full visual in Phase 2
 */

(function () {
  'use strict';

  const GarageUI = {
    _container: null,
    _busTypes: [],

    init(modules) {
      this.modules = modules;
    },

    renderGarage() {
      const container = document.getElementById('busGarageContent');
      if (!container) return;

      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      const garageSystem = this.modules.GarageSystem;
      const progression = this.modules.ProgressionSystem;

      if (!player || !garageSystem) return;

      const availableTypes = progression ? progression.getAvailableBusTypes() : [];
      const garageInfo = garageSystem.getGarageInfo();
      const activeBus = garageSystem.getActiveBus();

      let html = '';

      // Phase 8: Garage Overview
      html += this._renderGarageOverview(activeBus, garageInfo);

      // Phase 8: Bus Type Selector
      html += this._renderBusTypeSelector();

      // Phase 8: Operator Selector
      html += this._renderOperatorSelector();

      // Phase 8: Service Type Selector
      html += this._renderServiceTypeSelector();

      // Phase 8: Customization Selector
      html += this._renderCustomizationSelector();

      // Phase 8: Bus Identity Fields
      html += this._renderIdentityFields();

      // Phase 8: Statistics Preview
      html += this._renderStatisticsPreview();

      html += '<div class="bus-garage-grid">';

      // Owned buses
      const garage = garageSystem.getGarage();
      for (const bus of garage) {
        const info = bus.getInfo();
        html += this._renderBusCard(bus, info, true);
      }

      // Available buses for purchase
      for (const bt of availableTypes) {
        if (garage.find(b => b.busTypeId === bt.id)) continue; // Skip owned
        html += this._renderBusPurchaseCard(bt, player.money);
      }

      html += '</div>';
      html += `<div class="bus-garage-summary">
        Buses: ${garageInfo.buses}/${garageInfo.slots} •
        Fleet Value: ₵ ${garageInfo.totalValue.toLocaleString()}
      </div>`;

      container.innerHTML = html;

      this._bindGarageEvents();
    },

    _renderBusCard(bus, info, owned) {
      const isEquipped = this._isActiveBus(bus);
      const conditionColor = info.condition > 80 ? '#10b981' :
                            info.condition > 50 ? '#fbbf24' : '#ef4444';

      return `
        <div class="bus-card ${isEquipped ? 'active' : ''}" data-bus-id="${bus.id}">
          <div class="bus-card-header">
            <span class="bus-name">${bus.busType ? bus.busType.displayName : 'Bus #'+bus.id}</span>
            ${isEquipped ? '<span class="bus-badge">EQUIPPED</span>' : ''}
          </div>
          <div class="bus-card-body">
            <div class="bus-stat">💨 Speed: ${info.speed}/${bus.maxSpeed} km/h</div>
            <div class="bus-stat">⛽ Fuel: ${info.fuelPercent}% (${info.fuel}/${info.fuelCapacity}L)</div>
            <div class="bus-stat">🔧 Condition: <span style="color:${conditionColor}">${info.condition}%</span></div>
            <div class="bus-stat">👥 Passengers: ${info.passengers}/${info.capacity}</div>
            ${(bus.fleetNumber ? `<div class="bus-stat">🔢 ${bus.fleetNumber}</div>` : '')}
          </div>
          <div class="bus-card-actions">
            <button class="bus-btn bus-btn-sm" data-action="equip" data-bus-id="${bus.id}">
              ${isEquipped ? '🔄 Rebuy' : '✓ Equip'}
            </button>
            <button class="bus-btn bus-btn-sm bus-btn-danger" data-action="sell" data-bus-id="${bus.id}">
              💰 Sell
            </button>
          </div>
        </div>
      `;
    },

    _renderBusPurchaseCard(busType, playerMoney) {
      const affordable = playerMoney >= busType.price;
      const priceColor = affordable ? '#10b981' : '#ef4444';

      return `
        <div class="bus-card bus-card-purchase" data-bus-type-id="${busType.id}">
          <div class="bus-card-header">
            <span class="bus-name">${busType.displayName}</span>
            <span class="bus-badge" style="color: ${priceColor}">NEW</span>
          </div>
          <div class="bus-card-body">
            <div class="bus-stat">💨 Speed: ${busType.speed} km/h</div>
            <div class="bus-stat">👥 Capacity: ${busType.capacity}</div>
            <div class="bus-stat">⛽ Efficiency: ${busType.fuelEfficiency} km/L</div>
            <div class="bus-stat">🏷️ Price: <span style="color:${priceColor}">₵ ${busType.price.toLocaleString()}</span></div>
          </div>
          <div class="bus-card-actions">
            <button class="bus-btn bus-btn-sm ${affordable ? 'bus-btn-primary' : ''}"
                    data-action="purchase" data-bus-type="${busType.id}"
                    ${!affordable ? 'disabled' : ''}>
              ${affordable ? '🛒 BUY' : 'Cannot Afford'}
            </button>
          </div>
        </div>
      `;
    },

    _renderGarageOverview(activeBus, garageInfo) {
      if (!activeBus) {
        return '<div class="bus-garage-overview"><p class="bus-garage-empty">No active bus selected</p></div>';
      }

      const info = activeBus.getInfo ? activeBus.getInfo() : {};
      const busTypeName = activeBus.busType ? activeBus.busType.displayName : 'Unknown';
      const serviceType = activeBus.serviceType || 'city';
      const operatorId = activeBus.operatorId || 'none';
      const capacity = info.capacity || (activeBus.busType ? activeBus.busType.capacity : 0);

      return `
        <div class="bus-garage-overview">
          <div class="bus-overview-header">
            <h3 class="bus-overview-title">Active Bus Configuration</h3>
          </div>
          <div class="bus-overview-grid">
            <div class="bus-overview-item">
              <span class="bus-overview-label">Bus</span>
              <span class="bus-overview-value">${busTypeName}</span>
            </div>
            <div class="bus-overview-item">
              <span class="bus-overview-label">Type</span>
              <span class="bus-overview-value">${activeBus.busType ? activeBus.busType.category : 'N/A'}</span>
            </div>
            <div class="bus-overview-item">
              <span class="bus-overview-label">Service</span>
              <span class="bus-overview-value">${serviceType}</span>
            </div>
            <div class="bus-overview-item">
              <span class="bus-overview-label">Operator</span>
              <span class="bus-overview-value">${operatorId}</span>
            </div>
            <div class="bus-overview-item">
              <span class="bus-overview-label">Capacity</span>
              <span class="bus-overview-value">${capacity} passengers</span>
            </div>
            <div class="bus-overview-item">
              <span class="bus-overview-label">Fleet</span>
              <span class="bus-overview-value">${garageInfo.buses}/${garageInfo.slots}</span>
            </div>
          </div>
        </div>
      `;
    },

    _renderBusTypeSelector() {
      const BusTypes = this.modules.BusTypes;
      const GarageConfig = this.modules.GarageConfig;
      if (!BusTypes || !GarageConfig) return '';

      const allTypes = BusTypes.allBusTypes || [];
      const currentConfig = GarageConfig.getConfig();
      const selectedId = currentConfig.busTypeId;

      let html = `
        <div class="bus-config-section">
          <h4 class="bus-config-section-title">Bus Type</h4>
          <div class="bus-type-selector">
      `;

      for (const bt of allTypes) {
        const isSelected = bt.id === selectedId;
        const categoryLabel = bt.category === 'rtc' ? 'RTC' : 'Private';
        html += `
          <div class="bus-type-option ${isSelected ? 'selected' : ''}"
               data-bus-type-id="${bt.id}"
               data-action="select-bus-type">
            <div class="bus-type-info">
              <span class="bus-type-name">${bt.displayName}</span>
              <span class="bus-type-category">${categoryLabel}</span>
            </div>
            <div class="bus-type-stats">
              <span>💨 ${bt.speed} km/h</span>
              <span>👥 ${bt.capacity}</span>
              <span>⛽ ${bt.fuelEfficiency} km/L</span>
            </div>
            ${isSelected ? '<span class="bus-type-check">✓</span>' : ''}
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
      return html;
    },

    _renderOperatorSelector() {
      const OperatorSystem = this.modules.OperatorSystem;
      const GarageConfig = this.modules.GarageConfig;
      if (!OperatorSystem || !GarageConfig) return '';

      const operators = OperatorSystem.getAll ? OperatorSystem.getAll() : [];
      const currentConfig = GarageConfig.getConfig();
      const selectedId = currentConfig.operatorId;

      let html = `
        <div class="bus-config-section">
          <h4 class="bus-config-section-title">Operator / Company</h4>
          <div class="bus-operator-selector">
      `;

      for (const op of operators) {
        const isSelected = op.id === selectedId;
        const typeLabel = op.type === 'public' ? 'Public' : (op.type === 'private' ? 'Private' : op.type);
        html += `
          <div class="bus-operator-option ${isSelected ? 'selected' : ''}"
               data-operator-id="${op.id}"
               data-action="select-operator"
               style="border-left-color: ${op.livery ? op.livery.primaryColor : '#8b5cf6'}">
            <div class="bus-operator-info">
              <span class="bus-operator-name">${op.name}</span>
              <span class="bus-operator-type">${typeLabel}</span>
            </div>
            <div class="bus-operator-details">
              <span>${op.fullName || op.description || ''}</span>
            </div>
            ${isSelected ? '<span class="bus-operator-check">✓</span>' : ''}
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
      return html;
    },

    _renderServiceTypeSelector() {
      const ServiceTypes = this.modules.ServiceTypes;
      const GarageConfig = this.modules.GarageConfig;
      if (!ServiceTypes || !GarageConfig) return '';

      const serviceTypes = ServiceTypes.types || (ServiceTypes.getAll ? ServiceTypes.getAll() : []);
      const currentConfig = GarageConfig.getConfig();
      const selectedId = currentConfig.serviceType;

      let html = `
        <div class="bus-config-section">
          <h4 class="bus-config-section-title">Service Type</h4>
          <div class="bus-service-selector">
      `;

      for (const st of serviceTypes) {
        const isSelected = st.id === selectedId;
        const categoryLabel = st.category === 'public' ? 'Public' : (st.category === 'private' ? 'Private' : st.category);
        html += `
          <div class="bus-service-option ${isSelected ? 'selected' : ''}"
               data-service-type-id="${st.id}"
               data-action="select-service-type"
               style="border-left-color: ${st.color || '#8b5cf6'}">
            <div class="bus-service-info">
              <span class="bus-service-name">${st.displayName || st.name}</span>
              <span class="bus-service-category">${categoryLabel}</span>
            </div>
            <div class="bus-service-details">
              <span>${st.description || ''}</span>
            </div>
            <div class="bus-service-multipliers">
              <span class="bus-multiplier">Fare: ${st.fareMultiplier}x</span>
              <span class="bus-multiplier">Capacity: ${st.capacityMultiplier}x</span>
              <span class="bus-multiplier">Speed: ${st.speedMultiplier}x</span>
            </div>
            ${isSelected ? '<span class="bus-service-check">✓</span>' : ''}
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
      return html;
    },

    _renderCustomizationSelector() {
      const CustomizationData = this.modules.CustomizationData;
      const GarageConfig = this.modules.GarageConfig;
      if (!CustomizationData || !GarageConfig) return '';

      const currentConfig = GarageConfig.getConfig();
      const customization = currentConfig.customization || {};

      let html = `
        <div class="bus-config-section">
          <h4 class="bus-config-section-title">Customization</h4>
          <div class="bus-customization-selector">
      `;

      // Exterior
      html += this._renderCustomizationCategory('exterior', customization.exterior || {}, CustomizationData.exterior || {});

      // Interior
      html += this._renderCustomizationCategory('interior', customization.interior || {}, CustomizationData.interior || {});

      // Performance
      html += this._renderCustomizationCategory('performance', customization.performance || {}, CustomizationData.performance || {});

      html += `
          </div>
        </div>
      `;
      return html;
    },

    _renderIdentityFields() {
      const GarageConfig = this.modules.GarageConfig;
      if (!GarageConfig) return '';

      const currentConfig = GarageConfig.getConfig();
      const busNumber = currentConfig.busNumber || '';
      const destinationBoard = currentConfig.destinationBoard || '';

      return `
        <div class="bus-config-section">
          <h4 class="bus-config-section-title">Bus Identity</h4>
          <div class="bus-identity-fields">
            <div class="bus-identity-field">
              <label for="busNumberInput">Bus Number</label>
              <input type="text" id="busNumberInput" class="bus-input" 
                     value="${this._escapeHtml(busNumber)}" 
                     placeholder="e.g., MH-01-BUS-001"
                     data-action="update-bus-number">
            </div>
            <div class="bus-identity-field">
              <label for="destinationBoardInput">Destination Board</label>
              <input type="text" id="destinationBoardInput" class="bus-input" 
                     value="${this._escapeHtml(destinationBoard)}" 
                     placeholder="e.g., Depot - City Center"
                     data-action="update-destination-board">
            </div>
          </div>
        </div>
      `;
    },

    _renderStatisticsPreview() {
      const GarageSystem = this.modules.GarageSystem;
      const GarageConfig = this.modules.GarageConfig;
      if (!GarageSystem || !GarageConfig) return '';

      const previewBus = GarageSystem.buildPreview ? GarageSystem.buildPreview() : null;
      if (!previewBus) return '';

      const stats = GarageSystem.getBusStatistics(previewBus);
      if (!stats) return '';

      return `
        <div class="bus-config-section">
          <h4 class="bus-config-section-title">Configuration Preview</h4>
          <div class="bus-stats-preview">
            <div class="bus-stats-grid">
              <div class="bus-stat-card">
                <div class="bus-stat-label">Bus Type</div>
                <div class="bus-stat-value">${stats.name}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Category</div>
                <div class="bus-stat-value">${stats.category || 'N/A'}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Body Type</div>
                <div class="bus-stat-value">${stats.bodyType || 'N/A'}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Service Type</div>
                <div class="bus-stat-value">${stats.serviceType}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Operator</div>
                <div class="bus-stat-value">${stats.operatorId || 'None'}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Seated Capacity</div>
                <div class="bus-stat-value">${stats.passengerCapacity}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Standing Capacity</div>
                <div class="bus-stat-value">${stats.standingCapacity}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Available Seats</div>
                <div class="bus-stat-value">${stats.availableSeats}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Max Speed</div>
                <div class="bus-stat-value">${stats.maxSpeed} km/h</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Acceleration</div>
                <div class="bus-stat-value">${stats.acceleration}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Handling</div>
                <div class="bus-stat-value">${stats.handling}</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Fare Multiplier</div>
                <div class="bus-stat-value">${stats.fareMultiplier.toFixed(2)}x</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Boarding Time</div>
                <div class="bus-stat-value">${stats.boardingTime}s</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Alighting Time</div>
                <div class="bus-stat-value">${stats.alightTime}s</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Fuel Capacity</div>
                <div class="bus-stat-value">${stats.fuelCapacity}L</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Fuel Efficiency</div>
                <div class="bus-stat-value">${stats.fuelEfficiency} km/L</div>
              </div>
              <div class="bus-stat-card">
                <div class="bus-stat-label">Comfort</div>
                <div class="bus-stat-value">${stats.comfort}/10</div>
              </div>
              ${stats.busNumber ? `
              <div class="bus-stat-card">
                <div class="bus-stat-label">Bus Number</div>
                <div class="bus-stat-value">${stats.busNumber}</div>
              </div>` : ''}
              ${stats.destinationBoard ? `
              <div class="bus-stat-card">
                <div class="bus-stat-label">Destination</div>
                <div class="bus-stat-value">${stats.destinationBoard}</div>
              </div>` : ''}
            </div>
          </div>
        </div>
      `;
    },

    _renderCustomizationCategory(categoryName, currentValues, categoryData) {
      let html = `<div class="bus-customization-category">
        <h5 class="bus-customization-category-title">${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h5>
        <div class="bus-customization-options">`;

      for (const [key, items] of Object.entries(categoryData)) {
        if (!Array.isArray(items)) continue;
        const currentValue = currentValues[key];
        html += `<div class="bus-customization-group">
          <label class="bus-customization-group-label">${key.replace(/([A-Z])/g, ' $1')}</label>
          <div class="bus-customization-choices">`;
        for (const item of items) {
          const isSelected = item.id === currentValue;
          const priceStr = item.price > 0 ? `₵${item.price.toLocaleString()}` : 'Free';
          const colorPreview = item.color ? ` style="background:${item.color}"` : '';
          html += `
            <div class="bus-customization-choice ${isSelected ? 'selected' : ''}"
                 data-action="select-customization"
                 data-category="${categoryName}"
                 data-key="${key}"
                 data-value="${item.id}">
              <span class="bus-customization-choice-name">${item.name}</span>
              ${colorPreview ? `<span class="bus-customization-color"${colorPreview}></span>` : ''}
              <span class="bus-customization-price">${priceStr}</span>
              ${isSelected ? '<span class="bus-customization-check">✓</span>' : ''}
            </div>`;
        }
        html += `</div></div>`;
      }

      html += `</div></div>`;
      return html;
    },

    _bindGarageEvents() {
      const container = document.getElementById('busGarageContent');
      if (!container) return;

      // Handle click events for buttons
      const buttons = container.querySelectorAll('[data-action]');
      for (const btn of buttons) {
        if (btn.tagName === 'INPUT') continue; // Skip inputs, handle separately
        btn.addEventListener('click', (e) => {
          const action = e.target.getAttribute('data-action');
          const id = e.target.getAttribute('data-bus-id') || e.target.getAttribute('data-bus-type') || e.target.getAttribute('data-bus-type-id') || e.target.getAttribute('data-operator-id') || e.target.getAttribute('data-service-type-id');

          switch (action) {
            case 'equip':
              this._equipBus(id);
              break;
            case 'sell':
              this._sellBus(id);
              break;
            case 'purchase':
              this._purchaseBus(id);
              break;
            case 'select-bus-type':
              this._selectBusType(id);
              break;
            case 'select-operator':
              this._selectOperator(id);
              break;
            case 'select-service-type':
              this._selectServiceType(id);
              break;
            case 'select-customization':
              this._selectCustomization(e.target);
              break;
          }
        });
      }

      // Handle input change events for identity fields
      const busNumberInput = container.querySelector('#busNumberInput');
      if (busNumberInput) {
        busNumberInput.addEventListener('change', (e) => this._updateBusNumber(e.target.value));
        busNumberInput.addEventListener('blur', (e) => this._updateBusNumber(e.target.value));
      }

      const destinationBoardInput = container.querySelector('#destinationBoardInput');
      if (destinationBoardInput) {
        destinationBoardInput.addEventListener('change', (e) => this._updateDestinationBoard(e.target.value));
        destinationBoardInput.addEventListener('blur', (e) => this._updateDestinationBoard(e.target.value));
      }
    },

    _escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    _updateBusNumber(value) {
      const GarageConfig = this.modules.GarageConfig;
      if (!GarageConfig) return;
      GarageConfig.setBusNumber(value);
    },

    _updateDestinationBoard(value) {
      const GarageConfig = this.modules.GarageConfig;
      if (!GarageConfig) return;
      GarageConfig.setDestinationBoard(value);
    },

    _selectCustomization(element) {
      const GarageConfig = this.modules.GarageConfig;
      if (!GarageConfig) return;

      const category = element.getAttribute('data-category');
      const key = element.getAttribute('data-key');
      const value = element.getAttribute('data-value');

      if (!category || !key || !value) return;

      const currentConfig = GarageConfig.getConfig();
      const customization = JSON.parse(JSON.stringify(currentConfig.customization || {}));
      if (!customization[category]) customization[category] = {};
      customization[category][key] = value;

      GarageConfig.setCustomization(customization);
      this.renderGarage();
    },

    _selectServiceType(serviceTypeId) {
      const GarageConfig = this.modules.GarageConfig;
      if (!GarageConfig) return;

      if (GarageConfig.setServiceType(serviceTypeId)) {
        this.renderGarage();
      }
    },

    _selectOperator(operatorId) {
      const GarageConfig = this.modules.GarageConfig;
      if (!GarageConfig) return;

      if (GarageConfig.setOperator(operatorId)) {
        this.renderGarage();
      }
    },

    _selectBusType(busTypeId) {
      const GarageConfig = this.modules.GarageConfig;
      if (!GarageConfig) return;

      if (GarageConfig.setBusType(busTypeId)) {
        this.renderGarage();
      }
    },

    _equipBus(busId) {
      const garageSystem = this.modules.GarageSystem;
      if (garageSystem.setActiveBus(busId)) {
        this.renderGarage();
      }
    },

    _sellBus(busId) {
      const garageSystem = this.modules.GarageSystem;
      const result = garageSystem.sellBus(busId);
      if (result.success) {
        this.renderGarage();
      }
    },

    _purchaseBus(busTypeId) {
      const garageSystem = this.modules.GarageSystem;
      const result = garageSystem.purchaseBus(busTypeId);
      if (result.success) {
        EventManager.emit('busPurchased', {
          busType: busTypeId,
          busName: result.bus.busType ? result.bus.busType.displayName : 'Bus',
          cost: result.cost
        });
        this.renderGarage();
      } else {
        this._showError(result.error || 'Cannot purchase bus');
      }
    },

    _isActiveBus(bus) {
      return bus.id === this._getActiveBusId();
    },

    _getActiveBusId() {
      const garageSystem = this.modules.GarageSystem;
      const bus = garageSystem ? garageSystem.getActiveBus() : null;
      return bus ? bus.id : null;
    },

    _showError(message) {
      const toast = (typeof window !== 'undefined' && window.InfinityPlay &&
                     window.InfinityPlay.Helpers && window.InfinityPlay.Helpers.showToast);
      if (toast) toast(message, 'warning');
    },

    update(dt) {},

    destroy() {
      this._container = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.GarageUI = GarageUI;
  }
  if (typeof module !== 'undefined') {
    module.exports = GarageUI;
  }
})();
