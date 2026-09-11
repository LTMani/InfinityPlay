/**
 * InfinityPlay - Categories Dataset
 */

const categoriesData = [
  {
    id: 'racing',
    name: 'Racing',
    slug: 'Racing',
    icon: 'assets/categories/cat_racing_art.png',
    fullCard: 'assets/categories/cat_racing_full.png',
    gameCount: 2,
    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.05))',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  {
    id: 'adventure',
    name: 'Adventure',
    slug: 'Adventure',
    icon: 'assets/categories/cat_adventure_art.png',
    fullCard: 'assets/categories/cat_adventure_full.png',
    gameCount: 1,
    gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(3, 105, 161, 0.05))',
    borderColor: 'rgba(14, 165, 233, 0.3)'
  },
  {
    id: 'simulation',
    name: 'Simulation',
    slug: 'Simulation',
    icon: 'assets/categories/cat_simulation_art.png',
    fullCard: 'assets/categories/cat_simulation_full.png',
    gameCount: 3,
    gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(161, 98, 7, 0.05))',
    borderColor: 'rgba(234, 179, 8, 0.3)'
  },
  {
    id: 'puzzle',
    name: 'Puzzle',
    slug: 'Puzzle',
    icon: 'assets/categories/cat_puzzle_art.png',
    fullCard: 'assets/categories/cat_puzzle_full.png',
    gameCount: 1,
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(126, 34, 206, 0.05))',
    borderColor: 'rgba(168, 85, 247, 0.3)'
  },
  {
    id: 'sports',
    name: 'Sports',
    slug: 'Sports',
    icon: 'assets/categories/cat_sports_art.png',
    fullCard: 'assets/categories/cat_sports_full.png',
    gameCount: 1,
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(4, 120, 87, 0.05))',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  {
    id: 'strategy',
    name: 'Strategy',
    slug: 'Strategy',
    icon: 'assets/categories/cat_strategy_art.png',
    fullCard: 'assets/categories/cat_strategy_full.png',
    gameCount: 2,
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(180, 83, 9, 0.05))',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  {
    id: 'arcade',
    name: 'Arcade',
    slug: 'Arcade',
    icon: 'assets/categories/cat_arcade_art.png',
    fullCard: 'assets/categories/cat_arcade_full.png',
    gameCount: 0,
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(109, 40, 217, 0.05))',
    borderColor: 'rgba(139, 92, 246, 0.3)'
  },
  {
    id: 'survival',
    name: 'Survival',
    slug: 'Survival',
    icon: 'assets/categories/cat_survival_art.png',
    fullCard: 'assets/categories/cat_survival_full.png',
    gameCount: 1,
    gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(194, 65, 12, 0.05))',
    borderColor: 'rgba(249, 115, 22, 0.3)'
  }
];

if (typeof window !== 'undefined') {
  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.categoriesData = categoriesData;
}
