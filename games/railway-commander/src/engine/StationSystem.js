/**
 * Railway Commander - Station & Stopping Accuracy System
 * Manages station approaches, platform stop zones, stopping precision metrics,
 * passenger boarding timers, and departure clearance.
 */

export class StationSystem {
  constructor() {
    this.stations = [];
    this.currentStationIndex = 0;
    this.activeStation = null;
    this.stopAccuracyHistory = [];
    this.boardingTimer = 0;
    this.isBoarding = false;
    this.boardingCompleted = false;
    this.missedStations = 0;
  }

  loadStations(stationsList) {
    this.stations = (stationsList || []).map((st, idx) => ({
      id: st.id || `STATION_${idx + 1}`,
      name: st.name || `Station ${idx + 1}`,
      stopPosition: st.stopPosition,
      platformLength: st.platformLength || 140,
      approachDistance: 500,
      enterDistance: 120,
      mandatory: st.mandatory !== false,
      completed: false,
      isMissed: false,
      stopRating: null,
      offsetMeters: null
    }));
    this.currentStationIndex = 0;
    this.activeStation = this.stations[0] || null;
    this.stopAccuracyHistory = [];
    this.boardingTimer = 0;
    this.isBoarding = false;
    this.boardingCompleted = false;
    this.missedStations = 0;
  }

  reset() {
    for (const st of this.stations) {
      st.completed = false;
      st.isMissed = false;
      st.stopRating = null;
      st.offsetMeters = null;
    }
    this.currentStationIndex = 0;
    this.activeStation = this.stations[0] || null;
    this.stopAccuracyHistory = [];
    this.boardingTimer = 0;
    this.isBoarding = false;
    this.boardingCompleted = false;
    this.missedStations = 0;
  }

  update(trainPosition, speedKmh, isStopped, dt) {
    const station = this.activeStation;
    if (!station || station.completed || station.isMissed) {
      return null;
    }

    const distanceToStop = station.stopPosition - trainPosition;
    const platformStart = station.stopPosition - station.platformLength + 20;
    const platformEnd = station.stopPosition + 25;

    // 1. Handle Passenger Boarding Countdown
    if (this.isBoarding) {
      this.boardingTimer -= dt;
      if (this.boardingTimer <= 0) {
        this.isBoarding = false;
        this.boardingCompleted = true;
        station.completed = true;
        
        this.currentStationIndex++;
        this.activeStation = this.stations[this.currentStationIndex] || null;

        return {
          type: 'BOARDING_COMPLETE',
          stationName: station.name,
          message: `Passengers boarded at ${station.name}. Cleared for departure! 🟢`
        };
      }
      return {
        type: 'BOARDING_PROGRESS',
        stationName: station.name,
        timeLeft: Math.ceil(this.boardingTimer),
        message: `Boarding passengers... ${Math.ceil(this.boardingTimer)}s (Keep brakes applied)`
      };
    }

    // 2. Check if train completely stopped near the platform
    if (isStopped && !station.completed && !this.boardingCompleted) {
      if (trainPosition >= platformStart && trainPosition <= platformEnd) {
        const offset = trainPosition - station.stopPosition;
        const absOffset = Math.abs(offset);
        station.offsetMeters = Math.round(offset * 10) / 10;

        let rating = 'GOOD';
        let points = 250;
        let badge = 'GOOD STOP';

        if (absOffset <= 2.5) {
          rating = 'PERFECT';
          points = 500;
          badge = '🌟 PERFECT STOP!';
        } else if (absOffset <= 7.5) {
          rating = 'GOOD';
          points = 300;
          badge = '👍 GOOD STOP';
        } else {
          rating = 'ACCEPTABLE';
          points = 150;
          badge = 'ACCEPTABLE STOP';
        }

        station.stopRating = rating;
        this.stopAccuracyHistory.push({
          stationId: station.id,
          stationName: station.name,
          rating,
          offsetMeters: station.offsetMeters,
          points
        });

        this.isBoarding = true;
        this.boardingTimer = 5.0;

        return {
          type: 'ACCURATE_STOP',
          stationName: station.name,
          rating,
          badge,
          points,
          offsetMeters: station.offsetMeters,
          message: `${badge} (${absOffset.toFixed(1)}m from marker) +${points} pts`
        };
      }
    }

    // 3. Check for Missed / Overshot Station
    if (trainPosition > platformEnd + 15 && !station.completed) {
      station.isMissed = true;
      this.missedStations++;
      this.currentStationIndex++;
      this.activeStation = this.stations[this.currentStationIndex] || null;

      return {
        type: 'MISSED_STATION',
        stationName: station.name,
        message: `MISSED STOP: You failed to stop at ${station.name} platform!`,
        mandatory: station.mandatory
      };
    }

    // 4. Proximity Announcements
    if (distanceToStop > 0 && distanceToStop <= station.approachDistance) {
      if (distanceToStop <= station.enterDistance) {
        return {
          type: 'PREPARE_TO_STOP',
          stationName: station.name,
          distanceMeters: Math.round(distanceToStop),
          message: `Entering ${station.name}: Prepare to Stop (Marker in ${Math.round(distanceToStop)}m)`
        };
      } else {
        return {
          type: 'APPROACHING_STATION',
          stationName: station.name,
          distanceMeters: Math.round(distanceToStop),
          message: `Approaching ${station.name} (${Math.round(distanceToStop)}m)`
        };
      }
    }

    return null;
  }

  getCurrentStation() {
    return this.activeStation;
  }

  getStationsInRange(trainPosition, rangeMeters = 700) {
    return this.stations.filter(
      st => st.stopPosition >= trainPosition - 80 && st.stopPosition <= trainPosition + rangeMeters
    );
  }

  allStationsCompleted() {
    return this.stations.length > 0 && this.stations.every(st => st.completed);
  }

  getCompletionSummary() {
    const completedCount = this.stations.filter(st => st.completed).length;
    const totalCount = this.stations.length;
    return {
      completedCount,
      totalCount,
      missedCount: this.missedStations,
      history: this.stopAccuracyHistory
    };
  }
}
