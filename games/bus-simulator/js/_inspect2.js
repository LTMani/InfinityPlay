const fs = require('fs');
const p = 'T:\\Git Project\\Infinityplay\\games\\bus-simulator\\js\\systems\\GameInitSystem.js';
let c = fs.readFileSync(p, 'utf8');
const lines = c.split('\n');
for (let i = 115; i < 121 && i < lines.length; i++) {
  const ln = lines[i];
  console.log(i + 1, JSON.stringify(ln));
  for (let j = 0; j < ln.length; j++) {
    const code = ln.charCodeAt(j);
    if (code < 32 || code > 126) {
      console.log('  non-printable at', j, 'code', code);
    }
  }
}