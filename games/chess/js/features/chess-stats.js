/**
 * InfinityPlay - Chess Player Stats, ELO Rating & Leaderboard Service
 * Manages player ELO rating, streaks, win percentages, and match history
 * synchronized with localStorage and the InfinityPlay backend API.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChessStats = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  const STATS_KEY = 'infinityplay_chess_stats';
  const HISTORY_KEY = 'infinityplay_chess_history';

  const DEFAULT_STATS = {
    userId: 'user_tharun',
    name: 'Tharun',
    elo: 2150,
    totalGames: 195,
    wins: 142,
    losses: 38,
    draws: 15,
    winRate: '73%',
    currentStreak: 5,
    bestStreak: 12
  };

  class ChessStats {
    constructor(baseUrl = '') {
      this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    }

    /**
     * Get active player stats (local first, falls back to default)
     */
    getStats() {
      try {
        const raw = localStorage.getItem(STATS_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}

      // Check current user name from platform
      let playerName = 'Tharun';
      try {
        const u = localStorage.getItem('infinityplay_current_user');
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed.name) playerName = parsed.name;
        }
      } catch (e) {}

      const stats = { ...DEFAULT_STATS, name: playerName };
      this.saveStats(stats);
      return stats;
    }

    saveStats(stats) {
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
      } catch (e) {}
    }

    /**
     * Calculate FIDE standard Elo rating change
     * R_new = R + K * (Score - Expected)
     */
    calculateElo(playerElo, opponentElo, score, K = 32) {
      const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
      const delta = Math.round(K * (score - expected));
      return {
        delta,
        newElo: Math.max(100, playerElo + delta)
      };
    }

    /**
     * Record match outcome and update statistics
     */
    recordMatch(outcome, opponentInfo = null, matchDetails = null) {
      // outcome: 'win' | 'loss' | 'draw'
      const stats = this.getStats();
      const oppElo = opponentInfo?.elo || 1500;

      let score = 0.5;
      if (outcome === 'win') score = 1;
      else if (outcome === 'loss') score = 0;

      const { delta, newElo } = this.calculateElo(stats.elo, oppElo, score);
      stats.elo = newElo;
      stats.totalGames += 1;

      if (outcome === 'win') {
        stats.wins += 1;
        stats.currentStreak += 1;
        if (stats.currentStreak > stats.bestStreak) {
          stats.bestStreak = stats.currentStreak;
        }
      } else if (outcome === 'loss') {
        stats.losses += 1;
        stats.currentStreak = 0;
      } else {
        stats.draws += 1;
        stats.currentStreak = 0;
      }

      stats.winRate = Math.round((stats.wins / stats.totalGames) * 100) + '%';
      this.saveStats(stats);

      // Save match to local history
      if (matchDetails) {
        this.saveMatchToHistory({
          id: 'match_' + Date.now(),
          date: new Date().toISOString(),
          outcome,
          eloChange: delta,
          playerElo: newElo,
          opponent: opponentInfo || { name: 'Computer AI', elo: oppElo },
          ...matchDetails
        });
      }

      return { stats, delta, newElo };
    }

    /**
     * Local Match History
     */
    getHistory() {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [];
    }

    saveMatchToHistory(match) {
      const history = this.getHistory();
      history.unshift(match);
      if (history.length > 50) history.splice(50);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      } catch (e) {}
    }

    /**
     * Fetch Global Leaderboard (Server with local fallback)
     */
    async getLeaderboard() {
      try {
        const res = await fetch(`${this.baseUrl}/api/chess/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          return data.leaderboard;
        }
      } catch (e) {}

      // Fallback leaderboard
      const myStats = this.getStats();
      const list = [
        { rank: 1, name: 'Alex Gamer', title: 'Grandmaster', elo: 2420, wins: 184, winRate: '77%', avatar: 'assets/avatars/avatar_alex.png' },
        { rank: 2, name: 'ShadowX', title: 'International Master', elo: 2280, wins: 156, winRate: '72%', avatar: 'assets/avatars/avatar_shadowx.png' },
        { rank: 3, name: myStats.name, title: 'Tactical Master', elo: myStats.elo, wins: myStats.wins, winRate: myStats.winRate, avatar: 'T' },
        { rank: 4, name: 'MaxPlay', title: 'FIDE Master', elo: 1980, wins: 112, winRate: '63%', avatar: 'assets/avatars/avatar_maxplay.png' },
        { rank: 5, name: 'NeoKing', title: 'Candidate Master', elo: 1850, wins: 95, winRate: '60%', avatar: 'assets/avatars/avatar_neoking.png' },
        { rank: 6, name: 'GameBeast', title: 'Arena Master', elo: 1720, wins: 82, winRate: '56%', avatar: 'assets/avatars/avatar_gamebeast.png' }
      ];

      list.sort((a, b) => b.elo - a.elo);
      list.forEach((item, idx) => item.rank = idx + 1);
      return list;
    }
  }

  return ChessStats;
}));

