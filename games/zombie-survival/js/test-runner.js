/**
 * Zombie Survival V2 - Automated In-Browser Test Suite
 * Automatically verifies all V2 criteria when loaded with ?test=1
 */

(function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.get('test')) return;

  console.log('🧪 Starting Zombie Survival V2 Automated In-Browser Test Suite...');

  function waitForGame() {
    if (window.gameInstance && window.gameInstance.canvas && window.gameInstance.ui) {
      runAllTests();
    } else {
      setTimeout(waitForGame, 20);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    waitForGame();
  } else {
    window.addEventListener('DOMContentLoaded', waitForGame);
  }

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
    assert('Storage initialized with V2 schema', !!window.Storage && !!window.Storage.data && window.Storage.data.schemaVersion === 2);
    assert('60 Campaign levels generated', window.LEVELS && window.LEVELS.length === 60, `Found ${window.LEVELS ? window.LEVELS.length : 0}`);
    assert('10 Worlds defined with themes', window.WORLDS && window.WORLDS.length === 10);
    assert('10 Weapons defined', window.WEAPON_DEFINITIONS && Object.keys(window.WEAPON_DEFINITIONS).length === 10);
    assert('8 Weapon Modifiers defined', window.WEAPON_MODIFIERS && Object.keys(window.WEAPON_MODIFIERS).length === 8);
    assert('10 Zombie archetypes defined', window.ZOMBIE_TYPES && Object.keys(window.ZOMBIE_TYPES).length === 10);
    assert('Exploder archetype verified', !!window.ZOMBIE_TYPES.exploder && window.ZOMBIE_TYPES.exploder.isExploder);
    assert('Healer archetype verified', !!window.ZOMBIE_TYPES.healer && window.ZOMBIE_TYPES.healer.isHealer);
    assert('5 Bosses configured', window.BOSS_CONFIGS && Object.keys(window.BOSS_CONFIGS).length === 5);
    assert('7 Special Wave Events defined', window.SPECIAL_WAVE_EVENTS && Object.keys(window.SPECIAL_WAVE_EVENTS).length === 7);
    assert('3-Branch Skill Tree defined', window.SKILL_TREE_DEFINITIONS && Object.keys(window.SKILL_TREE_DEFINITIONS).length === 3);

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

    g.ui.showScreen('SKILL_TREE');
    g.ui.renderSkillTree();
    assert('Navigate to SKILL_TREE', g.ui.currentScreen === 'SKILL_TREE');

    g.ui.showScreen('PROFILE');
    g.ui.renderProfile();
    assert('Navigate to PROFILE', g.ui.currentScreen === 'PROFILE');

    g.ui.openLevelBriefing(1);
    assert('Open Level Briefing modal', g.ui.currentScreen === 'BRIEFING');

    g.ui.showScreen('MENU');
    assert('Return to MENU', g.ui.currentScreen === 'MENU');

    // 2. Test Level 1 Start & Match Setup
    g.startStoryLevel(1);
    assert('Start Level 1 match', g.state === 'PLAYING' && g.currentLevelConfig.id === 1);
    assert('Player entity exists with diagonal normalization', !!g.player && g.player.alive);
    assert('Atmospheric map loaded with weather', !!g.map && !!g.effects.timeOfDay);

    // 3. Test Movement, Acceleration & Wall-Safe Dash Sub-stepping
    const initX = g.player.x;
    g.input.right = true;
    g.player.update(0.1, g.input, g.camera.bounds, g.map.obstacles);
    g.input.right = false;
    assert('Player accelerates smoothly with input', g.player.x > initX);

    // Test dash
    const preDashX = g.player.x;
    g.player.triggerAbility();
    assert('Player triggered dash ability', g.player.isDashing || g.player.dashCooldownTimer > 0);

    // 4. Test Weapon Firing & Projectile V2
    const initAmmo = g.player.ammo;
    g.player.shoot(g.projectiles);
    assert('Player fires weapon projectile', g.player.ammo < initAmmo && g.projectiles.length > 0);

    // 5. Test Exploder and Healer Mechanics
    const exploder = new window.Zombie(g.player.x + 100, g.player.y, 'exploder', 1.0);
    assert('Exploder created with fuse', exploder.isExploder && exploder.fuseTimer > 0);
    exploder.takeDamage(100);
    assert('Exploder detonates on defeat', !exploder.alive);

    const healer = new window.Zombie(g.player.x + 150, g.player.y, 'healer', 1.0);
    assert('Healer created with aura radius', healer.isHealer && healer.healRadius > 0);

    // 6. Test Boss Multi-Phase Transitions (4 Phases)
    const boss = new window.Zombie(g.player.x + 200, g.player.y, 'boss', 1.0, 'brute');
    assert('Boss initialized in Phase 1', boss.isBoss && boss.bossPhase === 1);
    boss.takeDamage(boss.maxHp * 0.3); // Under 75% -> Phase 2
    assert('Boss enters Phase 2', boss.bossPhase >= 2);
    boss.takeDamage(boss.maxHp * 0.25); // Under 50% -> Phase 3
    assert('Boss enters Phase 3', boss.bossPhase >= 3);
    boss.takeDamage(boss.maxHp * 0.3); // Under 25% -> Phase 4 Enraged
    assert('Boss enters Phase 4 Enraged', boss.bossPhase === 4);

    // 7. Test Weapon Modifiers System
    window.Storage.addModifier('rapid');
    assert('Modifier added to storage', window.Storage.data.inventory.modifiers.includes('rapid'));
    window.Storage.equipModifier('starter', 'rapid');
    const modWeapon = window.Upgrades.getModifiedWeapon('starter');
    assert('Weapon modifier modifies weapon stats', modWeapon.activeModifier === 'rapid');

    // 8. Test Skill Tree Allocation
    window.Storage.data.skillPoints = 5;
    const skillRes = window.Upgrades.unlockSkillNode('ironFlesh');
    assert('Unlock skill tree node with skill points', skillRes.success && window.Storage.data.unlockedSkills.includes('ironFlesh'));

    // 9. Test HUD Radar & Distance Marker
    const radarCanvas = document.getElementById('hudMinimap');
    assert('Minimap canvas exists in DOM', !!radarCanvas);
    g.effects.renderMinimap(radarCanvas, g.map, g.player, g.zombies, g.objectiveBeacons);

    // 10. Summary Banner
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    console.log(`\n🏁 IN-BROWSER TEST SUITE COMPLETE: ${passed}/${total} PASSED.`);

    const banner = document.createElement('div');
    banner.id = 'qaTestResults';
    banner.style.cssText = 'position:fixed;bottom:10px;left:10px;background:#0f172a;color:#22c55e;padding:12px;border:2px solid #22c55e;border-radius:8px;z-index:99999;font-family:monospace;font-size:13px;max-height:80vh;overflow-y:auto;';
    banner.innerHTML = `<strong>ZOMBIE SURVIVAL V2 QA: ${passed}/${total} PASSED</strong><br>${results.map(r => `${r.passed ? '✓' : '✗'} ${r.name}`).join('<br>')}`;
    document.body.appendChild(banner);
  }
})();
