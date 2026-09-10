/**
 * Bus Simulator - Mission System (19)
 * Manages missions, objectives, and route challenges
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const RouteData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.RouteData) ||
    (typeof require !== 'undefined' ? require('../data/routes') : null);

  const MissionSystem = {
    activeMission: null,
    availableMissions: [],
    completedMissions: [],
    missionHistory: [],

    init(modules) {
      this.modules = modules;
      this.activeMission = null;
      this.availableMissions = [];
      this.completedMissions = [];
      this.missionHistory = [];

      this._generateMissions();
    },

    _generateMissions() {
      const routes = RouteData ? RouteData.routes : [];
      const missions = [];

      // Create missions from routes
      for (const route of routes) {
        missions.push({
          id: `mission_${route.id}`,
          title: `${route.name} Route`,
          description: `Complete a full journey from ${route.from} to ${route.to}.`,
          type: 'route',
          routeId: route.id,
          difficulty: route.difficulty,
          rewards: {
            coins: route.baseFare * 1.5,
            xp: Math.round(route.distance * 10)
          },
          objectives: [
            { type: 'complete_route', routeId: route.id, completed: false },
            { type: 'arrive_on_time', completed: false },
            { type: 'no_accidents', completed: false }
          ],
          progress: 0
        });
      }

      // Tutorial mission
      missions.unshift({
        id: 'tutorial',
        title: 'Welcome to Bus Simulator',
        description: 'Learn the basics: drive to the bus stop, pick up passengers, and complete a route.',
        type: 'tutorial',
        difficulty: 'easy',
        rewards: { coins: 500, xp: 200 },
        objectives: [
          { type: 'drive_to_stop', completed: false },
          { type: 'pick_up_passengers', completed: false },
          { type: 'complete_short_route', completed: false }
        ],
        progress: 0
      });

      this.availableMissions = missions;
    },

    startMission(missionId) {
      const mission = this.availableMissions.find(m => m.id === missionId);
      if (!mission) {
        EventManager.emit('missionNotFound', { id: missionId });
        return false;
      }

      this.activeMission = JSON.parse(JSON.stringify(mission));
      this._setupMission();

      EventManager.emit('missionStarted', { mission: this.activeMission });
      return true;
    },

    _setupMission() {
      const mission = this.activeMission;
      if (mission.routeId) {
        const routeSystem = this.modules.RouteSystem;
        if (routeSystem) {
          routeSystem.setRoute(mission.routeId);
        }
      }

      const tripSystem = this.modules.TripSystem;
      if (tripSystem && mission.routeId) {
        const route = RouteData ? RouteData.getById(mission.routeId) : null;
        if (route) {
          tripSystem.startTrip(route);
        }
      }

      EventManager.on('tripCompleted', (data) => {
        this._checkMissionObjectives(mission, data);
      });
    },

    _checkMissionObjectives(mission, tripData) {
      let allComplete = true;

      for (const obj of mission.objectives) {
        if (obj.completed) continue;

        switch (obj.type) {
          case 'complete_route':
            obj.completed = !!tripData;
            break;
          case 'arrive_on_time':
            obj.completed = tripData ? tripData.onTime : false;
            break;
          case 'no_accidents':
            obj.completed = tripData ? tripData.accidentFree : false;
            break;
          case 'drive_to_stop':
            obj.completed = true;
            break;
          case 'pick_up_passengers':
            obj.completed = (tripData && tripData.passengers) > 0;
            break;
          case 'complete_short_route':
            obj.completed = tripData ? tripData.distance > 0 : false;
            break;
        }

        if (!obj.completed) allComplete = false;
      }

      mission.progress = mission.objectives.filter(o => o.completed).length /
        mission.objectives.length;
      mission.allComplete = allComplete;

      EventManager.emit('missionProgress', {
        mission: mission,
        progress: mission.progress
      });

      if (allComplete) {
        this.completeMission(mission);
      }
    },

    completeMission(mission) {
      this.completedMissions.push(mission);

      // Move from available to completed
      this.availableMissions = this.availableMissions.filter(m => m.id !== mission.id);

      // Grant rewards
      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (player && mission.rewards) {
        if (mission.rewards.coins) player.addMoney(mission.rewards.coins);
        if (mission.rewards.xp) player.addXP(mission.rewards.xp);
      }

      this.missionHistory.push({
        id: mission.id,
        title: mission.title,
        completedAt: Date.now(),
        rewards: mission.rewards
      });

      this.activeMission = null;

      EventManager.emit('missionCompleted', { mission: mission });

      // Unlock new missions
      this._generateMissions();
    },

    getAvailableMissions() {
      return this.availableMissions.filter(m => !this.completedMissions.some(c => c.id === m.id));
    },

    getCompletedMissions() {
      return this.completedMissions;
    },

    getActiveMission() {
      return this.activeMission;
    },

    serialize() {
      return {
        completedMissions: this.completedMissions,
        missionHistory: this.missionHistory,
        activeMissionId: this.activeMission ? this.activeMission.id : null
      };
    },

    deserialize(data) {
      this.completedMissions = data.completedMissions || [];
      this.missionHistory = data.missionHistory || [];

      if (data.activeMissionId) {
        const mission = this.availableMissions.find(m => m.id === data.activeMissionId);
        if (mission) {
          this.startMission(mission.id);
        }
      }
    },

    destroy() {
      this.activeMission = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.MissionSystem = MissionSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = MissionSystem;
  }
})();
