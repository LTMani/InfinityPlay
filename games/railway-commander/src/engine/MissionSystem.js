/**
 * Railway Commander - Mission & Progression System
 * Defines handcrafted missions, objective tracking, score calculations,
 * and unlock progression.
 */

export const MISSIONS_DATA = [
  {
    id: 'mission-1',
    number: 1,
    title: 'Training Run',
    tagline: 'Master train controls & safe station stopping',
    objective: 'Learn throttle and brake controls, maintain the 60 km/h speed limit, and stop accurately at Riverside Junction.',
    route: 'Central Depot → Riverside Junction',
    distanceMeters: 1800,
    distanceFormatted: '1.8 km',
    speedLimitKmh: 60,
    environment: 'city',
    timeOfDay: 'day', // 'day' | 'sunset' | 'night'
    weather: 'clear', // 'clear' | 'rain' | 'fog'
    rewardXp: 500,
    rewardCoins: 250,
    speedLimitZones: [
      { from: 0, to: 1800, limitKmh: 60 }
    ],
    stations: [
      { id: 'st_riverside', name: 'Riverside Junction', stopPosition: 1620, platformLength: 130, mandatory: true }
    ],
    signals: [
      { id: 'sig_1', name: 'Depot Exit Signal', positionMeters: 550, aspect: 'GREEN' },
      { id: 'sig_2', name: 'Riverside Approach Signal', positionMeters: 1250, aspect: 'GREEN' }
    ]
  },
  {
    id: 'mission-2',
    number: 2,
    title: 'City Express',
    tagline: 'Dynamic speed limit transitions & multi-station timetable',
    objective: 'Operate an express commuter run. Accelerate through the 100 km/h high-speed zone and execute smooth stops at both stations.',
    route: 'Central Depot → Riverside Junction → Metro Harbor',
    distanceMeters: 3800,
    distanceFormatted: '3.8 km',
    speedLimitKmh: 100,
    environment: 'city',
    timeOfDay: 'sunset',
    weather: 'clear',
    rewardXp: 850,
    rewardCoins: 450,
    speedLimitZones: [
      { from: 0, to: 700, limitKmh: 60 },
      { from: 700, to: 2400, limitKmh: 100 },
      { from: 2400, to: 3800, limitKmh: 50 }
    ],
    stations: [
      { id: 'st_riverside', name: 'Riverside Junction', stopPosition: 1550, platformLength: 130, mandatory: true },
      { id: 'st_metro_harbor', name: 'Metro Harbor', stopPosition: 3580, platformLength: 140, mandatory: true }
    ],
    signals: [
      { id: 'sig_1', name: 'Depot Exit Block', positionMeters: 600, aspect: 'GREEN' },
      { id: 'sig_2', name: 'Riverside Approach', positionMeters: 1200, aspect: 'YELLOW' },
      { id: 'sig_3', name: 'Corridor High-Speed Signal', positionMeters: 2200, aspect: 'GREEN' },
      { id: 'sig_4', name: 'Harbor Yard Approach', positionMeters: 3100, aspect: 'YELLOW' }
    ]
  },
  {
    id: 'mission-3',
    number: 3,
    title: 'Signal Master',
    tagline: 'Strict signal compliance & dynamic holding blocks',
    objective: 'Navigate high-traffic industrial junctions. Obey caution yellows and holding red signals with zero SPAD violations.',
    route: 'North Harbor → Iron Valley → Grand Central',
    distanceMeters: 4500,
    distanceFormatted: '4.5 km',
    speedLimitKmh: 80,
    environment: 'industrial',
    timeOfDay: 'night',
    weather: 'rain',
    rewardXp: 1200,
    rewardCoins: 650,
    speedLimitZones: [
      { from: 0, to: 1000, limitKmh: 70 },
      { from: 1000, to: 2900, limitKmh: 90 },
      { from: 2900, to: 4500, limitKmh: 45 }
    ],
    stations: [
      { id: 'st_iron_valley', name: 'Iron Valley Works', stopPosition: 2150, platformLength: 130, mandatory: true },
      { id: 'st_grand_central', name: 'Grand Central Terminal', stopPosition: 4280, platformLength: 160, mandatory: true }
    ],
    signals: [
      { id: 'sig_1', name: 'Harbor Crossover', positionMeters: 750, aspect: 'GREEN' },
      { id: 'sig_2', name: 'Iron Valley Warning', positionMeters: 1750, aspect: 'YELLOW' },
      { 
        id: 'sig_3', 
        name: 'Interlocking Holding Signal', 
        positionMeters: 2950, 
        aspect: 'RED', 
        clearDistance: 320, 
        clearDelay: 1.5 // Clears to Green when train slows to <= 45 km/h within 320m
      },
      { id: 'sig_4', name: 'Grand Central Approach', positionMeters: 3950, aspect: 'YELLOW' }
    ]
  },
  {
    id: 'mission-4',
    number: 4,
    title: 'Precision Driver',
    tagline: 'Mountain passenger express & precision stopping',
    objective: 'Drive an express run through scenic alpine mountain grades. Deliver pinpoint accurate station stops under foggy weather conditions.',
    route: 'Grand Central → Pine Valley → Alpine Summit',
    distanceMeters: 5600,
    distanceFormatted: '5.6 km',
    speedLimitKmh: 110,
    environment: 'alpine',
    timeOfDay: 'day',
    weather: 'fog',
    rewardXp: 1800,
    rewardCoins: 1000,
    speedLimitZones: [
      { from: 0, to: 1200, limitKmh: 70 },
      { from: 1200, to: 3400, limitKmh: 110 },
      { from: 3400, to: 5600, limitKmh: 55 }
    ],
    stations: [
      { id: 'st_pine_valley', name: 'Pine Valley Station', stopPosition: 2350, platformLength: 130, mandatory: true },
      { id: 'st_alpine_summit', name: 'Alpine Summit High Terminal', stopPosition: 5350, platformLength: 150, mandatory: true }
    ],
    signals: [
      { id: 'sig_1', name: 'Valley Outbound', positionMeters: 800, aspect: 'GREEN' },
      { id: 'sig_2', name: 'Pine Valley Distant', positionMeters: 1950, aspect: 'YELLOW' },
      { id: 'sig_3', name: 'Alpine Tunnel Portal Signal', positionMeters: 3300, aspect: 'GREEN' },
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
