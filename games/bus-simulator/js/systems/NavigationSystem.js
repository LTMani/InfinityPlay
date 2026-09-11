/**
 * Bus Simulator - Navigation System (20)
 * Turn-by-turn navigation and route guidance
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);

  const NavigationSystem = {
    _directions: [],
    _currentDirectionIndex: 0,
    _nextTurnDistance: 0,
    _nextTurnInstruction: '',
    _destination: null,
    _routePath: [],

    init(modules) {
      this.modules = modules;
      this._directions = [];
      this._currentDirectionIndex = 0;
      this._nextTurnDistance = 0;
      this._nextTurnInstruction = '';
      this._destination = null;
      this._routePath = [];

      EventManager.on('routeStarted', (data) => {
        this.setDestination(data.route.to);
      });
    },

    setDestination(destinationId) {
      const map = this.modules.Map;
      const routeSystem = this.modules.RouteSystem;

      if (!map || !routeSystem || !routeSystem.waypoints) return;

      this._destination = destinationId;

      // Generate directions from waypoints
      this._directions = [];
      this._routePath = [];

      const waypoints = routeSystem.waypoints;
      for (let i = 0; i < waypoints.length - 1; i++) {
        const from = waypoints[i];
        const to = waypoints[i + 1];
        const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
        const angle = Math.atan2(to.y - from.y, to.x - from.x);

        const instruction = this._generateInstruction(from, to, waypoints[i - 1], angle, distance, to);
        this._directions.push({
          index: i,
          instruction: instruction.text,
          icon: instruction.icon,
          distance: distance,
          angle: angle,
          target: to,
          type: instruction.type
        });
        this._routePath.push(to);
      }

      this._currentDirectionIndex = 0;
      this._updateNextTurn();

      EventManager.emit('navigationSet', {
        destination: destinationId,
        directions: this._directions.length
      });
    },

    _generateInstruction(from, to, prev, angle, distance, wayPoint) {
      let instruction = 'Continue';
      let icon = '⬆️';
      let type = 'continue';

      const cityId = wayPoint.cityId;
      const locName = cityId || `Location ${wayPoint.t || ''}`;

      if (wayPoint.type === 'stop') {
        instruction = `Arrive at ${locName}`;
        icon = '🚌';
        type = 'stop';
      } else if (wayPoint.type === 'end') {
        instruction = `Destination: ${locName}`;
        icon = '🏁';
        type = 'destination';
      } else if (prev) {
        const prevAngle = Math.atan2(from.y - prev.y, from.x - prev.x);
        const angleDiff = angle - prevAngle;
        const normalized = ((angleDiff + Math.PI) % (Math.PI * 2)) - Math.PI;

        if (Math.abs(normalized) < 0.3) {
          instruction = 'Continue straight';
          icon = '⬆️';
          type = 'continue';
        } else if (normalized > 0) {
          instruction = 'Turn right';
          icon = '➡️';
          type = 'right';
        } else {
          instruction = 'Turn left';
          icon = '⬅️';
          type = 'left';
        }

        instruction += ` toward ${locName}`;
      }

      return { text: instruction, icon: icon, type: type };
    },

    _updateNextTurn() {
      if (this._directions.length === 0 || this._currentDirectionIndex >= this._directions.length) {
        this._nextTurnInstruction = 'Destination reached!';
        this._nextTurnDistance = 0;
        return;
      }

      const nextDir = this._directions[this._currentDirectionIndex];
      this._nextTurnInstruction = nextDir.instruction;
      this._nextTurnDistance = nextDir.distance;
    },

    update(bus, dt) {
      if (!bus || this._directions.length === 0) return;

      const currentDir = this._directions[this._currentDirectionIndex];
      if (!currentDir) return;

      const distToTarget = Math.sqrt(
        Math.pow(currentDir.target.x - bus.x, 2) + Math.pow(currentDir.target.y - bus.y, 2)
      );

      this._nextTurnDistance = distToTarget;
      this._nextTurnInstruction = currentDir.instruction;

      // Check if we've reached the current waypoint
      if (distToTarget < 50) {
        this._currentDirectionIndex++;
        this._updateNextTurn();

        EventManager.emit('navigationUpdated', {
          direction: currentDir,
          nextDirection: this._directions[this._currentDirectionIndex] || null,
          allComplete: this._currentDirectionIndex >= this._directions.length
        });
      }
    },

    getNextInstruction() {
      return {
        instruction: this._nextTurnInstruction,
        distance: Math.round(this._nextTurnDistance),
        icon: this._directions[this._currentDirectionIndex] ?
          this._directions[this._currentDirectionIndex].icon : '🏁'
      };
    },

    getRoutePath() {
      return this._routePath;
    },

    isDestinationReached() {
      return this._currentDirectionIndex >= this._directions.length;
    },

    serialize() {
      return {
        currentDirectionIndex: this._currentDirectionIndex,
        destination: this._destination
      };
    },

    deserialize(data) {
      this._currentDirectionIndex = data.currentDirectionIndex || 0;
      this._destination = data.destination || null;
    },

    destroy() {
      this._directions = [];
      this._routePath = [];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.NavigationSystem = NavigationSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = NavigationSystem;
  }
})();
