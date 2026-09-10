/**
 * Bus Simulator - Economy UI
 * Displays financial information: revenue, expenses, net income, balance
 *
 * SKELETON - UI structure implemented
 */

(function () {
  'use strict';

  const EconomyConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EconomyConfig) ||
    (typeof require !== 'undefined' ? require('../data/economy') : null);

  const EconomyUI = {
    _container: null,
    _tripSummary: null,

    init(modules) {
      this.modules = modules;
    },

    show() {
      this._renderEconomy();
    },

    hide() {
      const container = document.getElementById('busEconomyContent');
      if (container) container.innerHTML = '';
    },

    _renderEconomy() {
      const container = document.getElementById('busEconomyContent');
      if (!container) return;

      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (!player) return;

      const economyConfig = EconomyConfig;
      const stats = {
        balance: player.money,
        totalRevenue: player.totalRevenue,
        totalExpenses: player.totalExpenses,
        totalDistance: player.totalDistance,
        tripsCompleted: player.tripsCompleted,
        passengersServed: player.totalPassengersServed,
        vehicles: player.garage ? player.garage.length : 0
      };

      // Find nearest fuel station price
      let fuelPrice = 85;
      let tollFee = 45;
      if (economyConfig) {
        fuelPrice = economyConfig.expenses.fuelPricePerLiter;
        tollFee = economyConfig.expenses.tollCharges.min;
      }

      container.innerHTML = `
        <div class="bus-economy-view">
          <div class="bus-economy-summary">
            <div class="bus-stat-card">
              <div class="bus-stat-label">Balance</div>
              <div class="bus-stat-value" style="color:#10b981">₵ ${stats.balance.toLocaleString()}</div>
            </div>
            <div class="bus-stat-card">
              <div class="bus-stat-label">Total Revenue</div>
              <div class="bus-stat-value">₵ ${stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div class="bus-stat-card">
              <div class="bus-stat-label">Total Expenses</div>
              <div class="bus-stat-value" style="color:#ef4444">₵ ${stats.totalExpenses.toLocaleString()}</div>
            </div>
            <div class="bus-stat-card">
              <div class="bus-stat-label">Trips Completed</div>
              <div class="bus-stat-value">${stats.tripsCompleted}</div>
            </div>
          </div>

          <div class="bus-economy-details">
            <h4>Current Trip</h4>
            <div id="busCurrentTripStats">No active trip</div>
          </div>

          <div class="bus-economy-prices">
            <h4>Prices</h4>
            <div>Fuel: ₵ ${fuelPrice}/liter</div>
            <div>Toll: ₵ ${tollFee}-${tollFee * 2}</div>
            <div>Maintenance: ₵ ${(economyConfig ? economyConfig.maintenancePerKm : 3.5)}/km</div>
          </div>
        </div>
      `;

      this._updateTripStats();
    },

    _updateTripStats() {
      const container = document.getElementById('busCurrentTripStats');
      if (!container) return;

      const tripSystem = this.modules.TripSystem;
      if (!tripSystem) {
        container.innerHTML = '<div>No trip data available</div>';
        return;
      }

      const stats = tripSystem.getTripStats();

      container.innerHTML = `
        <div class="bus-trip-stats">
          <div>Distance: ${stats.distance} km</div>
          <div>Passengers: ${stats.passengers}</div>
          <div>Fuel Used: ${stats.fuelUsed} L</div>
          <div>Revenue: ₵ ${stats.revenue.toLocaleString()}</div>
          <div>Expenses: ₵ ${stats.expenses.toLocaleString()}</div>
          <div>On Time: ${stats.onTime ? '✓ Yes' : '✗ No'}</div>
          <div>Perfect: ${stats.perfect ? '✓ Yes' : '✗ No'}</div>
        </div>
      `;
    },

    showTripSummary(tripData) {
      this._tripSummary = tripData;

      if (typeof document === 'undefined') return;

      let summary = document.getElementById('busTripSummary');
      if (!summary) {
        summary = document.createElement('div');
        summary.id = 'busTripSummary';
        summary.className = 'bus-overlay';
        summary.innerHTML = '<div class="bus-summary-content"></div>';
        document.body.appendChild(summary);
      }

      const content = summary.querySelector('.bus-summary-content');
      if (content) {
        content.innerHTML = `
          <h3>Trip Complete!</h3>
          <div class="bus-summary-stats">
            <div>💰 Revenue: ₵ ${tripData.revenue.toLocaleString()}</div>
            <div>📍 Distance: ${tripData.distance} km</div>
            <div>👥 Passengers: ${tripData.passengers}</div>
            <div>⛽ Fuel: ${tripData.fuelUsed}L</div>
            <div>💸 Expenses: ₵ ${tripData.expenses.toLocaleString()}</div>
            <div class="bus-summary-net" style="color:${tripData.netIncome >= 0 ? '#10b981' : '#ef4444'}">
              ${tripData.netIncome >= 0 ? '↑' : '↓'} Net: ₵ ${tripData.netIncome.toLocaleString()}
            </div>
          </div>
          <button class="bus-btn bus-btn-primary" data-action="continue">Continue</button>
        `;

        summary.style.display = 'block';

        const continueBtn = content.querySelector('[data-action="continue"]');
        if (continueBtn) {
          continueBtn.onclick = () => {
            summary.style.display = 'none';
          };
        }
      }
    },

    renderHUD() {
      return null; // Economy info shown via trip stats and HUD status bar
    },

    update(dt) {},

    destroy() {
      this._container = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.EconomyUI = EconomyUI;
  }
  if (typeof module !== 'undefined') {
    module.exports = EconomyUI;
  }
})();
