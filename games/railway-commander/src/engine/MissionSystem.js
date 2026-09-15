/**
 * Railway Commander - Mission & Progression System
 * Defines handcrafted missions, objective tracking, score calculations,
 * and unlock progression.
 */

export const MISSIONS_DATA = [
  {
    id: 'mission-1',
    number: 1,
    title: 'Arakkonam Express',
    tagline: 'WAP-7 Rajdhani run to Arakkonam Junction',
    objective: 'Operate the WAP-7 Rajdhani Express. Follow signals, observe speed limits, negotiate track switches, and stop accurately at Arakkonam Junction Platform 1.',
    route: 'Chennai Central → Arakkonam Junction',
    distanceMeters: 2200,
    distanceFormatted: '2.2 km',
    speedLimitKmh: 70,
    targetTime: '10:45 PM',
    initialClock: '22:15',
    environment: 'city',
    timeOfDay: 'sunset', // sunset dusk matching reference screenshot
    weather: 'clear',
    rewardXp: 500,
    rewardCoins: 250,
    speedLimitZones: [
      { from: 0, to: 950, limitKmh: 70 },
      { from: 950, to: 2200, limitKmh: 50 }
    ],
    trackSwitches: [
      { position: 720, direction: 'right', name: 'Points No. 12B (Track Change)' }
    ],
    stations: [
      { 
        id: 'st_arakkonam', 
        name: 'ARAKKONAM', 
        nativeTamil: 'அரக்கோணம்', 
        nativeHindi: 'अरक्कोणम', 
        stopPosition: 1950, 
        platformLength: 170, 
        mandatory: true 
      }
    ],
    signals: [
      { id: 'sig_1', name: 'Chennai Central Outbound', positionMeters: 550, aspect: 'GREEN' },
      { id: 'sig_2', name: 'Arakkonam Outer Home Signal', positionMeters: 1450, aspect: 'YELLOW' }
    ]
  },
  {
    id: 'mission-2',
    number: 2,
    title: 'Rajdhani Superfast',
    tagline: '130 KMPH high-speed trunk route corridor',
    objective: 'Accelerate the WAP-7 rake to 130 km/h along the trunk main line. Execute smooth braking for Kanpur Central arrival.',
    route: 'New Delhi → Aligarh → Kanpur Central',
    distanceMeters: 3800,
    distanceFormatted: '3.8 km',
    speedLimitKmh: 130,
    targetTime: '11:30 PM',
    initialClock: '23:05',
    environment: 'city',
    timeOfDay: 'night',
    weather: 'clear',
    rewardXp: 850,
    rewardCoins: 450,
    speedLimitZones: [
      { from: 0, to: 700, limitKmh: 80 },
      { from: 700, to: 2600, limitKmh: 130 },
      { from: 2600, to: 3800, limitKmh: 50 }
    ],
    trackSwitches: [
      { position: 1100, direction: 'right', name: 'Aligarh Crossover' }
    ],
    stations: [
      { id: 'st_kanpur', name: 'KANPUR CENTRAL', nativeHindi: 'कानपुर सेंट्रल', stopPosition: 3580, platformLength: 180, mandatory: true }
    ],
    signals: [
      { id: 'sig_1', name: 'Depot Exit Block', positionMeters: 600, aspect: 'GREEN' },
      { id: 'sig_2', name: 'Trunk Corridor Clear', positionMeters: 1600, aspect: 'GREEN' },
      { id: 'sig_3', name: 'Kanpur Yard Approach', positionMeters: 3100, aspect: 'YELLOW' }
    ]
  },
  {
    id: 'mission-3',
    number: 3,
    title: 'Monsoon Express',
    tagline: 'Heavy monsoon downpour, wipers & caution signals',
    objective: 'Navigate heavy tropical rain and slippery tracks. Use wipers, sound the horn at crossings, and obey caution signals.',
    route: 'Howrah Junction → Burdwan Junction',
    distanceMeters: 4500,
    distanceFormatted: '4.5 km',
    speedLimitKmh: 80,
    targetTime: '06:15 PM',
    initialClock: '17:50',
    environment: 'industrial',
    timeOfDay: 'sunset',
    weather: 'rain',
    rewardXp: 1200,
    rewardCoins: 650,
    speedLimitZones: [
      { from: 0, to: 1000, limitKmh: 70 },
      { from: 1000, to: 2900, limitKmh: 90 },
      { from: 2900, to: 4500, limitKmh: 45 }
    ],
    trackSwitches: [
      { position: 1400, direction: 'left', name: 'Bally Bridge Divergence' }
    ],
    stations: [
      { id: 'st_burdwan', name: 'BURDWAN JN', nativeBengali: 'বর্ধমান', stopPosition: 4280, platformLength: 170, mandatory: true }
    ],
    signals: [
      { id: 'sig_1', name: 'Howrah Crossover', positionMeters: 750, aspect: 'GREEN' },
      { id: 'sig_2', name: 'Burdwan Warning', positionMeters: 2200, aspect: 'YELLOW' },
      { id: 'sig_3', name: 'Interlocking Holding Signal', positionMeters: 3300, aspect: 'RED', clearDistance: 320, clearDelay: 1.5 },
      { id: 'sig_4', name: 'Burdwan Platform Approach', positionMeters: 3950, aspect: 'YELLOW' }
    ]
  },
  {
    id: 'mission-4',
    number: 4,
    title: 'Western Ghats Summit',
    tagline: 'Mountain gradients, mist & precision stopping',
    objective: 'Drive an express run through foggy Western Ghat grades. Deliver pinpoint accurate station stops under foggy conditions.',
    route: 'Mumbai CSMT → Karjat → Lonavala Summit',
    distanceMeters: 5600,
    distanceFormatted: '5.6 km',
    speedLimitKmh: 90,
    targetTime: '08:45 AM',
    initialClock: '08:15',
    environment: 'alpine',
    timeOfDay: 'day',
    weather: 'fog',
    rewardXp: 1800,
    rewardCoins: 1000,
    speedLimitZones: [
      { from: 0, to: 1200, limitKmh: 65 },
      { from: 1200, to: 3400, limitKmh: 90 },
      { from: 3400, to: 5600, limitKmh: 50 }
    ],
    trackSwitches: [
      { position: 1900, direction: 'right', name: 'Ghats Mountain Bypass' }
    ],
    stations: [
      { id: 'st_karjat', name: 'KARJAT', nativeMarathi: 'कर्जत', stopPosition: 2350, platformLength: 140, mandatory: true },
      { id: 'st_lonavala', name: 'LONAVALA SUMMIT', nativeMarathi: 'लोonavla', stopPosition: 5350, platformLength: 160, mandatory: true }
    ],
    signals: [
      { id: 'sig_1', name: 'Ghat Outbound', positionMeters: 800, aspect: 'GREEN' },
      { id: 'sig_2', name: 'Karjat Distant', positionMeters: 1950, aspect: 'YELLOW' },
      { id: 'sig_3', name: 'Tunnel Portal Signal', positionMeters: 3500, aspect: 'GREEN' },
      { id: 'sig_4', name: 'Summit Approach Signal', positionMeters: 4900, aspect: 'YELLOW' }
    ]
  }
];

export class MissionSystem {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.currentMission = null;
    this.missionStartTime = 0;
    this.elapsedTime = 0;

    // Mission Score Metrics
    this.overspeedTimeTotal = 0;
    this.emergencyBrakeCount = 0;
    this.safeDrivingBonus = 1000;
  }

  getMissions() {
    const saved = this.saveManager.getProgress();
    return MISSIONS_DATA.map(m => {
      const isUnlocked = m.number === 1 || saved.unlockedMissions.includes(m.id);
      const isCompleted = saved.completedMissions.includes(m.id);
      const bestScore = saved.bestScores[m.id] || 0;
      const stars = saved.missionStars[m.id] || 0;

      return {
        ...m,
        isUnlocked,
        isCompleted,
        bestScore,
        stars
      };
    });
  }

  getMissionById(id) {
    return MISSIONS_DATA.find(m => m.id === id) || MISSIONS_DATA[0];
  }

  startMission(missionId) {
    this.currentMission = this.getMissionById(missionId);
    this.missionStartTime = performance.now();
    this.elapsedTime = 0;
    this.overspeedTimeTotal = 0;
    this.emergencyBrakeCount = 0;
    this.safeDrivingBonus = 1000;
    return this.currentMission;
  }

  recordOverspeed(dt) {
    this.overspeedTimeTotal += dt;
  }

  recordEmergencyBrake() {
    this.emergencyBrakeCount++;
  }

  /**
   * Calculate final score, stars, rank and rewards
   */
  evaluateResults(stationSummary, signalViolations, totalDistanceDriven) {
    const mission = this.currentMission;
    if (!mission) return null;

    let baseScore = 1200; // Base safe driving completion
    let stopScore = 0;

    // Stop accuracy points
    if (stationSummary && stationSummary.history) {
      for (const record of stationSummary.history) {
        stopScore += record.points || 0;
      }
    }

    // Penalties
    const overspeedPenalty = Math.round(this.overspeedTimeTotal * 25);
    const emergencyBrakePenalty = this.emergencyBrakeCount * 120;
    const missedStationPenalty = (stationSummary?.missedCount || 0) * 600;
    const signalPenalty = signalViolations * 800;

    let finalScore = Math.max(0, baseScore + stopScore - overspeedPenalty - emergencyBrakePenalty - missedStationPenalty - signalPenalty);

    // Star & Rating Assignment
    let stars = 1;
    let rank = 'C';

    const maxExpectedScore = baseScore + (mission.stations.length * 500);
    const scoreRatio = finalScore / maxExpectedScore;

    if (scoreRatio >= 0.88 && signalViolations === 0 && (stationSummary?.missedCount || 0) === 0) {
      stars = 3;
      rank = 'S';
    } else if (scoreRatio >= 0.72 && signalViolations === 0) {
      stars = 3;
      rank = 'A';
    } else if (scoreRatio >= 0.52) {
      stars = 2;
      rank = 'B';
    } else {
      stars = 1;
      rank = 'C';
    }

    // Calculate Rewards
    const xpMultiplier = stars === 3 ? 1.0 : (stars === 2 ? 0.75 : 0.5);
    const coinsMultiplier = stars === 3 ? 1.0 : (stars === 2 ? 0.75 : 0.5);

    const earnedXp = Math.round(mission.rewardXp * xpMultiplier);
    const earnedCoins = Math.round(mission.rewardCoins * coinsMultiplier);

    // Save Progress & Unlock Next Mission
    const currentIdx = MISSIONS_DATA.findIndex(m => m.id === mission.id);
    let nextMissionId = null;
    if (currentIdx >= 0 && currentIdx < MISSIONS_DATA.length - 1) {
      nextMissionId = MISSIONS_DATA[currentIdx + 1].id;
    }

    this.saveManager.recordMissionCompletion({
      missionId: mission.id,
      score: finalScore,
      stars,
      earnedXp,
      earnedCoins,
      nextMissionId
    });

    return {
      missionId: mission.id,
      missionTitle: mission.title,
      finalScore,
      stars,
      rank,
      earnedXp,
      earnedCoins,
      nextMissionId,
      breakdown: {
        baseScore,
        stopScore,
        overspeedPenalty,
        emergencyBrakePenalty,
        signalViolations,
        missedStations: stationSummary?.missedCount || 0,
        stopsRecorded: stationSummary?.history?.length || 0
      }
    };
  }
}
