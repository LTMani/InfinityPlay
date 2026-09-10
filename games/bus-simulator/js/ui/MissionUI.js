/**
 * Bus Simulator - Mission UI
 * Displays active missions, objectives, and mission log
 *
 * SKELETON - UI structure implemented
 */

(function () {
  'use strict';

  const MissionUI = {
    _container: null,
    _activeMission: null,

    init(modules) {
      this.modules = modules;
    },

    show() {
      this._renderMissionLog();
    },

    hide() {
      const container = document.getElementById('busMissionsContent');
      if (container) container.innerHTML = '';
    },

    _renderMissionLog() {
      const container = document.getElementById('busMissionsContent');
      if (!container) return;

      const missionSystem = this.modules.MissionSystem;
      if (!missionSystem) {
        container.innerHTML = '<div class="bus-cust-placeholder">Mission system not available</div>';
        return;
      }

      const available = missionSystem.getAvailableMissions();
      const completed = missionSystem.getCompletedMissions();
      const active = missionSystem.getActiveMission();

      let html = '<div class="bus-missions-list">';

      if (active) {
        html += this._renderActiveMission(active);
      }

      html += '<div class="bus-mission-section"><h4>Available Missions</h4>';
      for (const mission of available) {
        html += this._renderMissionCard(mission);
      }
      html += '</div>';

      html += '<div class="bus-mission-section"><h4>Completed</h4>';
      for (const mission of completed) {
        html += this._renderCompletedMission(mission);
      }
      html += '</div>';

      html += '</div>';
      container.innerHTML = html;

      this._bindMissionEvents();
    },

    _renderActiveMission(mission) {
      let objectives = '';
      for (const obj of mission.objectives) {
        objectives += `<div class="bus-obj ${obj.completed ? 'done' : ''}">
          ${obj.completed ? '✓' : '○'} ${obj.type}
        </div>`;
      }

      return `
        <div class="bus-mission-active">
          <div class="bus-mission-title">${mission.title}</div>
          <div class="bus-mission-desc">${mission.description}</div>
          <div class="bus-progress-bar">
            <div class="bus-progress-fill" style="width: ${Math.round(mission.progress * 100)}%"></div>
          </div>
          <div class="bus-mission-objectives">${objectives}</div>
          <div class="bus-mission-rewards">
            Reward: ₵ ${mission.rewards.coins} + ${mission.rewards.xp} XP
          </div>
        </div>
      `;
    },

    _renderMissionCard(mission) {
      return `
        <div class="bus-mission-card" data-mission-id="${mission.id}">
          <div class="bus-mission-title">${mission.title}</div>
          <div class="bus-mission-desc">${mission.description}</div>
          <div class="bus-mission-rewards">
            Reward: ₵ ${mission.rewards.coins} + ${mission.rewards.xp} XP
          </div>
          <button class="bus-btn bus-btn-sm bus-btn-primary"
                  data-action="start-mission" data-mission="${mission.id}">
            ▶ Start
          </button>
        </div>
      `;
    },

    _renderCompletedMission(mission) {
      return `
        <div class="bus-mission-card completed">
          <div class="bus-mission-title">${mission.title} ✓</div>
          <div class="bus-mission-rewards">
            Completed: ₵ ${mission.rewards.coins}, ${mission.rewards.xp} XP
          </div>
        </div>
      `;
    },

    _bindMissionEvents() {
      const container = document.getElementById('busMissionsContent');
      if (!container) return;

      const buttons = container.querySelectorAll('[data-action="start-mission"]');
      for (const btn of buttons) {
        btn.addEventListener('click', (e) => {
          const missionId = e.target.getAttribute('data-mission');
          const missionSystem = this.modules.MissionSystem;
          if (missionSystem && missionSystem.startMission(missionId)) {
            EventManager.emit('menuAction', { action: 'start-game' });
            this.modules.GameEngine.setState(this.modules.GameEngine._config.states.PLAYING);
            this.hide();
          }
        });
      }
    },

    renderHUD() {
      const missionSystem = this.modules.MissionSystem;
      if (!missionSystem || !missionSystem.activeMission) return null;

      return {
        title: missionSystem.activeMission.title,
        progress: missionSystem.activeMission.progress,
        objectives: missionSystem.activeMission.objectives
      };
    },

    update(dt) {},

    destroy() {
      this._container = null;
      this._activeMission = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.MissionUI = MissionUI;
  }
  if (typeof module !== 'undefined') {
    module.exports = MissionUI;
  }
})();
