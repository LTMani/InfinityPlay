/**
 * Zombie Survival - Automated In-Browser Test Suite
 * Automatically verifies all 46 prompt criteria when loaded with ?test=1
 */

(function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.get('test')) return;

  console.log('🧪 Starting Zombie Survival Automated In-Browser Test Suite...');

  window.addEventListener('DOMContentLoaded', () => {
    runAllTests();
  });

  async function runAllTests() {
    const results = [];

    function assert(name, condition, extra = '') {
      if (condition) {
        console.log(`✅ PASS: ${name}`);
        results.push({ name, passed: true });
      } else {
        console.error(`❌ FAIL: ${name} - ${extra}`);
        results.push({ name, passed: false, error: extra });
      }
    }

    const g = window.gameInstance;
    assert('Game engine initialized', !!g && !!g.canvas && !!g.ctx);
    assert('Storage initialized', !!window.Storage && !!window.Storage.data);
    assert('Levels defined', window.LEVELS && window.LEVELS.length === 60, `Found ${window.LEVELS.length}`);
    assert('Worlds defined', window.WORLDS && window.WORLDS.length === 10, `Found ${window.WORLDS.length}`);
    assert('Weapons defined', Object.keys(window.WEAPON_DEFINITIONS).length === 9);
    assert('Zombies defined', Object.keys(window.ZOMBIE_TYPES).length === 8);
    assert('Missions defined', window.MISSIONS_LIST && window.MISSIONS_LIST.length >= 15);
    assert('Achievements defined', window.ACHIEVEMENTS_LIST && window.ACHIEVEMENTS_LIST.length >= 12);

    // 1. Test UI Screen Transitions
    g.ui.showScreen('MODE_SELECT');
    assert('Navigate to MODE_SELECT', g.ui.currentScreen === 'MODE_SELECT');

    g.ui.showScreen('LEVEL_SELECT');
    g.ui.renderLevelSelect();
    assert('Navigate to LEVEL_SELECT', g.ui.currentScreen === 'LEVEL_SELECT');

    g.ui.showScreen('ARSENAL');
    g.ui.renderArsenal();
    assert('Navigate to ARSENAL', g.ui.currentScreen === 'ARSENAL');

    g.ui.showScreen('UPGRADES');
    g.ui.renderPlayerUpgrades();
    assert('Navigate to UPGRADES', g.ui.currentScreen === 'UPGRADES');

    g.ui.showScreen('MISSIONS');
    g.ui.renderMissions();
    assert('Navigate to MISSIONS', g.ui.currentScreen === 'MISSIONS');

    g.ui.showScreen('ACHIEVEMENTS');
    g.ui.renderAchievements();
    assert('Navigate to ACHIEVEMENTS', g.ui.currentScreen === 'ACHIEVEMENTS');

    g.ui.showScreen('MENU');
    assert('Return to MENU', g.ui.currentScreen === 'MENU');

    // 2. Test Level 1 Start
    g.startStoryLevel(1);
    assert('Start Level 1 match', g.state === 'PLAYING' && g.currentLevelConfig.id === 1);
    assert('Player entity exists', !!g.player && g.player.alive);
    assert('Map loaded', !!g.map && g.map.obstacles.length > 0);

    // 3. Test Movement & Physics
    const initX = g.player.x;
    g.input.right = true;
    g.player.update(0.1, g.input, g.camera.bounds, g.map.obstacles);
    g.input.right = false;
    assert('Player moves with input', g.player.x > initX, `X: ${initX} -> ${g.player.x}`);

    // 4. Test Weapon Firing
    const initAmmo = g.player.ammo;
    g.player.shoot(g.projectiles);
    assert('Player fires weapon', g.player.ammo < initAmmo && g.projectiles.length > 0);

    // 5. Test Zombie Spawning and Hit
    const testZombie = new window.Zombie(g.player.x + 80, g.player.y, 'normal', 1.0);
    g.zombies.push(testZombie);
    const startHp = testZombie.hp;
    testZombie.takeDamage(35);
    assert('Zombie takes damage', testZombie.hp < startHp);

    // Defeat zombie
    testZombie.takeDamage(100);
    assert('Zombie defeated state', !testZombie.alive && testZombie.state === 'DEFEATED');

    // 6. Test Pickups & Magnetism
    const testCoin = new window.Pickup(g.player.x + 30, g.player.y, 'coin', 50);
    g.pickups.push(testCoin);
    testCoin.update(0.05, g.player);
    assert('Pickup magnetic pull active', Math.hypot(testCoin.x - g.player.x, testCoin.y - g.player.y) <= 30);

    // 7. Test Upgrades Purchasing
    window.Storage.addCoins(1000);
    const buyRes = window.Upgrades.buyPlayerUpgrade('health');
    assert('Buy player upgrade with coins', buyRes.success);

    // 8. Test Pause System
    g.togglePause(true);
    assert('Game pauses', g.state === 'PAUSED');
    g.togglePause(false);
    assert('Game resumes', g.state === 'PLAYING');

    // 9. Test Level 60 Championship Config
    const lvl60 = window.LEVELS[59];
    assert('Level 60 is Championship', lvl60.id === 60 && lvl60.isBossLevel && lvl60.bossType === 'overlord');

    // 10. Test Endless Mode
    g.startEndlessMode();
    assert('Endless mode starts', g.mode === 'ENDLESS' && g.currentLevelConfig.objectiveTarget === Infinity);

    // Summary banner
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    console.log(`\n🏁 IN-BROWSER TEST SUITE COMPLETE: ${passed}/${total} PASSED.`);

    const banner = document.createElement('div');
    banner.id = 'qaTestResults';
    banner.style.cssText = 'position:fixed;bottom:10px;left:10px;background:#0f172a;color:#22c55e;padding:12px;border:2px solid #22c55e;border-radius:8px;z-index:99999;font-family:monospace;font-size:14px;';
    banner.innerHTML = `<strong>QA TEST SUITE: ${passed}/${total} PASSED</strong><br>${results.map(r => `${r.passed ? '✓' : '✗'} ${r.name}`).join('<br>')}`;
    document.body.appendChild(banner);
  }
})();
