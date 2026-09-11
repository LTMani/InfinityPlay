const fs = require('fs');
const p = 'T:\\Git Project\\Infinityplay\\games\\bus-simulator\\js\\systems\\GameInitSystem.js';
let c = fs.readFileSync(p, 'utf8');

// Fix missing indentation on the "if (starterBusType) {" line inside _createConfiguredBus.
// The line currently starts at column 0 but should be indented 6 spaces.
const bad = '\nif (starterBusType) {\n        bus.color';
const good = '\n      if (starterBusType) {\n        bus.color';

const beforeCount = c.split(bad).length - 1;
console.log('Occurrences of unindented if before:', beforeCount);

c = c.split(bad).join(good);

const afterCount = c.split(bad).length - 1;
console.log('Occurrences of unindented if after:', afterCount);

fs.writeFileSync(p, c);
console.log('GameInitSystem.js indentation repaired.');