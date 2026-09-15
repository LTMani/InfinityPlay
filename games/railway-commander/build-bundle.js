const fs = require('fs');
const path = require('path');

const moduleOrder = [
  'src/engine/TrainPhysics.js',
  'src/engine/TrackManager.js',
  'src/engine/SignalSystem.js',
  'src/engine/StationSystem.js',
  'src/engine/MissionSystem.js',
  'src/engine/SoundManager.js',
  'src/engine/Renderer25D.js',
  'src/engine/UIManager.js',
  'src/engine/InputManager.js',
  'src/engine/SaveManager.js',
  'src/engine/GameEngine.js',
  'src/main.js'
];

let bundleContent = '/** Railway Commander - Standalone Game Bundle (Indian Railways WAP-7 Edition) */\n(function() {\n  "use strict";\n\n';

for (const relPath of moduleOrder) {
  const fullPath = path.join(__dirname, relPath);
  let code = fs.readFileSync(fullPath, 'utf8');
  // Strip BOM if present
  code = code.replace(/^\uFEFF/, '');
  // Strip imports
  code = code.replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
  code = code.replace(/^import\s+['"][^'"]+['"];?\s*$/gm, '');
  // Strip exports
  code = code.replace(/^export\s+default\s+/gm, '');
  code = code.replace(/^export\s+/gm, '');

  bundleContent += `  // --- Module: ${relPath} ---\n`;
  bundleContent += code.split('\n').map(line => '  ' + line).join('\n');
  bundleContent += '\n\n';
}

bundleContent += '})();\n';

const outPath = path.join(__dirname, 'dist', 'game.bundle.js');
fs.writeFileSync(outPath, bundleContent, 'utf8');
console.log('Bundle generated successfully at: ' + outPath);
console.log('Bundle size: ' + fs.statSync(outPath).size + ' bytes');

