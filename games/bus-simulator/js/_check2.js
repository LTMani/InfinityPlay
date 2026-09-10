const fs = require('fs');
const base = 'T:\\Git Project\\Infinityplay\\games\\bus-simulator\\js\\';
const files = [
  'entities/Bus.js',
  'systems/GameInitSystem.js',
  'systems/GarageSystem.js',
  'systems/SaveLoadSystem.js',
  'systems/GarageConfig.js'
];

console.log('--- Duplicate prototype method check ---');
for (const f of files) {
  const full = base + f;
  let c;
  try { c = fs.readFileSync(full, 'utf8'); } catch (e) { continue; }
  const protoRe = /(\w+)\.prototype\.(\w+)\s*=\s*function/g;
  const seen = new Map();
  let m;
  while ((m = protoRe.exec(c)) !== null) {
    const name = m[2];
    if (!seen.has(name)) seen.set(name, 0);
    seen.set(name, seen.get(name) + 1);
  }
  for (const [name, count] of seen.entries()) {
    if (count > 1) console.log('DUP PROTO ' + name + ' x' + count + ' in ' + f);
  }
}

console.log('--- Duplicate object method check ---');
for (const f of files) {
  const full = base + f;
  let c;
  try { c = fs.readFileSync(full, 'utf8'); } catch (e) { continue; }
  const objRe = /^\s{4,}(\w+)\s*\([^)]*\)\s*\{/gm;
  const seen = new Map();
  let m;
  while ((m = objRe.exec(c)) !== null) {
    const name = m[1];
    if (name === 'if' || name === 'for' || name === 'function' || name === 'switch' || name === 'while' || name === 'catch') continue;
    if (!seen.has(name)) seen.set(name, 0);
    seen.set(name, seen.get(name) + 1);
  }
  for (const [name, count] of seen.entries()) {
    if (count > 1) console.log('DUP METHOD ' + name + ' x' + count + ' in ' + f);
  }
}

console.log('--- Corrupted identifier check (space where dot expected) ---');
for (const f of files) {
  const full = base + f;
  let c;
  try { c = fs.readFileSync(full, 'utf8'); } catch (e) { continue; }
  const re = /\b(\w+)\s+(\w+)\s*=\s*/g;
  let m;
  while ((m = re.exec(c)) !== null) {
    const seg = m[0].trim();
    console.log('POSSIBLE CORRUPTION in ' + f + ': ' + JSON.stringify(seg));
  }
}

console.log('--- Bus.js tintColor check ---');
const bus = fs.readFileSync(base + 'entities/Bus.js', 'utf8');
console.log('has this$tintColor:', bus.includes('this$tintColor'));
console.log('has this$tintColor:', bus.includes('this$tintColor'));