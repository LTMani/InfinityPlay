const fs = require('fs');
const { execSync } = require('child_process');
const base = 'T:\\Git Project\\Infinityplay\\games\\bus-simulator\\js\\';
const files = [
  'entities/Bus.js',
  'systems/GameInitSystem.js',
  'systems/GarageSystem.js',
  'systems/SaveLoadSystem.js',
  'systems/GarageConfig.js',
  'ui/GarageUI.js',
  'ui/CustomizationUI.js',
  'ui/MenuSystem.js',
  'main.js'
];
for (const f of files) {
  const full = base + f;
  let c;
  try { c = fs.readFileSync(full, 'utf8'); } catch (e) { console.log(f, 'MISSING'); continue; }
  let ok = false;
  try { execSync('node --check "' + full + '"', { stdio: 'pipe' }); ok = true; } catch (e) {}
  console.log(f + ' lines=' + c.split('\n').length + ' ' + (ok ? 'SYNTAX_OK' : 'SYNTAX_FAIL'));
}