const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');
const OVERLAY = document.getElementById('levelCompleteOverlay');
const BTN_NEW = document.getElementById('btn-new-game');
const BTN_NEXT = document.getElementById('btn-next-level');

const DPR = Math.min(window.devicePixelRatio || 1, 2);
let canvasWidth = 0;
let canvasHeight = 0;
let currentLevel = 0;

const LEVELS = [
  {
    gridSize: 5,
    laser: { x: 0, y: 2, dir: 'right' },
    targets: [{ x: 4, y: 2 }],
    mirrors: [{ x: 2, y: 2, type: 'mirror', rotation: 0 }],
    prisms: []
  },
  {
    gridSize: 6,
    laser: { x: 0, y: 3, dir: 'right' },
    targets: [{ x: 5, y: 0 }, { x: 5, y: 5 }],
    mirrors: [
      { x: 2, y: 3, type: 'mirror', rotation: 0 },
      { x: 2, y: 0, type: 'mirror', rotation: 1 }
    ],
    prisms: [{ x: 4, y: 3, type: 'prism' }]
  },
  {
    gridSize: 7,
    laser: { x: 3, y: 6, dir: 'up' },
    targets: [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 3, y: 0 }],
    mirrors: [
      { x: 3, y: 4, type: 'mirror', rotation: 0 },
      { x: 1, y: 4, type: 'mirror', rotation: 1 },
      { x: 5, y: 4, type: 'mirror', rotation: 3 }
    ],
    prisms: [{ x: 3, y: 2, type: 'prism' }]
  }
];

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const MIRROR_REFLECT = {
  0: { up: 'right', right: 'up', down: 'left', left: 'down' },
  1: { up: 'left', left: 'up', down: 'right', right: 'down' },
  2: { up: 'left', left: 'up', down: 'right', right: 'down' },
  3: { up: 'right', right: 'up', down: 'left', left: 'down' }
};

const PRISM_SPLIT = {
  up: ['left', 'right'],
  down: ['left', 'right'],
  left: ['up', 'down'],
  right: ['up', 'down']
};

function resizeCanvas() {
  const wrapper = document.querySelector('.ll-board-wrapper');
  const rect = wrapper.getBoundingClientRect();
  canvasWidth = Math.floor(rect.width);
  canvasHeight = Math.floor(rect.height);
  CANVAS.width = canvasWidth * DPR;
  CANVAS.height = canvasHeight * DPR;
  CANVAS.style.width = canvasWidth + 'px';
  CANVAS.style.height = canvasHeight + 'px';
  CTX.scale(DPR, DPR);
  draw();
}

function getCellSize(level) {
  const padding = 24;
  const availableW = canvasWidth - padding * 2;
  const availableH = canvasHeight - padding * 2;
  return Math.min(availableW / level.gridSize, availableH / level.gridSize);
}

function getGridOrigin(level, cellSize) {
  const gridW = level.gridSize * cellSize;
  const gridH = level.gridSize * cellSize;
  return {
    x: (canvasWidth - gridW) / 2,
    y: (canvasHeight - gridH) / 2
  };
}

function drawGrid(level, cellSize, origin) {
  CTX.strokeStyle = 'rgba(0, 240, 255, 0.06)';
  CTX.lineWidth = 1;

  for (let i = 0; i <= level.gridSize; i++) {
    const x = origin.x + i * cellSize;
    const y = origin.y + i * cellSize;
    CTX.beginPath();
    CTX.moveTo(x, origin.y);
    CTX.lineTo(x, origin.y + level.gridSize * cellSize);
    CTX.stroke();
    CTX.beginPath();
    CTX.moveTo(origin.x, y);
    CTX.lineTo(origin.x + level.gridSize * cellSize, y);
    CTX.stroke();
  }
}

function drawLaserSource(level, cellSize, origin) {
  const { x, y, dir } = level.laser;
  const cx = origin.x + (x + 0.5) * cellSize;
  const cy = origin.y + (y + 0.5) * cellSize;
  const r = cellSize * 0.35;

  CTX.fillStyle = '#ff2d55';
  CTX.shadowColor = '#ff2d55';
  CTX.shadowBlur = 15;
  CTX.beginPath();
  CTX.arc(cx, cy, r, 0, Math.PI * 2);
  CTX.fill();
  CTX.shadowBlur = 0;

  const dirVec = DIRS[dir];
  const indicatorLen = cellSize * 0.5;
  CTX.strokeStyle = '#ff2d55';
  CTX.lineWidth = 3;
  CTX.lineCap = 'round';
  CTX.beginPath();
  CTX.moveTo(cx, cy);
  CTX.lineTo(cx + dirVec.x * indicatorLen, cy + dirVec.y * indicatorLen);
  CTX.stroke();
}

function drawTargets(level, cellSize, origin) {
  level.targets.forEach(t => {
    const cx = origin.x + (t.x + 0.5) * cellSize;
    const cy = origin.y + (t.y + 0.5) * cellSize;
    const r = cellSize * 0.3;

    const hit = checkTargetHit(t);
    CTX.fillStyle = hit ? '#00ff88' : 'rgba(0, 255, 136, 0.2)';
    CTX.shadowColor = hit ? '#00ff88' : 'transparent';
    CTX.shadowBlur = hit ? 20 : 0;

    CTX.beginPath();
    CTX.arc(cx, cy, r, 0, Math.PI * 2);
    CTX.fill();

    CTX.strokeStyle = '#00ff88';
    CTX.lineWidth = 2;
    CTX.stroke();

    CTX.shadowBlur = 0;
  });
}

function drawMirrors(level, cellSize, origin) {
  level.mirrors.forEach((m, idx) => {
    const cx = origin.x + (m.x + 0.5) * cellSize;
    const cy = origin.y + (m.y + 0.5) * cellSize;
    const size = cellSize * 0.4;

    CTX.save();
    CTX.translate(cx, cy);
    CTX.rotate((m.rotation * Math.PI) / 2);

    const hit = checkMirrorHit(m);
    CTX.fillStyle = hit ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)';
    CTX.fillRect(-size, -size, size * 2, size * 2);

    CTX.strokeStyle = hit ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
    CTX.lineWidth = 2;
    CTX.beginPath();
    CTX.moveTo(-size * 0.7, -size * 0.7);
    CTX.lineTo(size * 0.7, size * 0.7);
    CTX.stroke();

    CTX.strokeStyle = hit ? '#00f0ff' : 'rgba(0, 240, 255, 0.3)';
    CTX.lineWidth = 1;
    CTX.beginPath();
    CTX.moveTo(size * 0.7, -size * 0.7);
    CTX.lineTo(-size * 0.7, size * 0.7);
    CTX.stroke();

    CTX.restore();
  });
}

function drawPrisms(level, cellSize, origin) {
  level.prisms.forEach(p => {
    const cx = origin.x + (p.x + 0.5) * cellSize;
    const cy = origin.y + (p.y + 0.5) * cellSize;
    const r = cellSize * 0.35;

    CTX.save();
    CTX.translate(cx, cy);

    const hit = checkPrismHit(p);
    CTX.fillStyle = hit ? 'rgba(217, 70, 239, 0.3)' : 'rgba(217, 70, 239, 0.1)';
    CTX.shadowColor = hit ? '#d946ef' : 'transparent';
    CTX.shadowBlur = hit ? 15 : 0;

    CTX.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      CTX.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    CTX.closePath();
    CTX.fill();

    CTX.strokeStyle = '#d946ef';
    CTX.lineWidth = 2;
    CTX.stroke();

    CTX.shadowBlur = 0;
    CTX.restore();
  });
}

function drawLaserPaths(level, cellSize, origin) {
  const beams = traceLaser(level);
  beams.forEach(beam => {
    if (beam.points.length < 2) return;
    CTX.strokeStyle = '#ff2d55';
    CTX.lineWidth = 3;
    CTX.lineCap = 'round';
    CTX.shadowColor = '#ff2d55';
    CTX.shadowBlur = 10;
    CTX.beginPath();
    beam.points.forEach((pt, i) => {
      const px = origin.x + pt.x * cellSize;
      const py = origin.y + pt.y * cellSize;
      if (i === 0) CTX.moveTo(px, py);
      else CTX.lineTo(px, py);
    });
    CTX.stroke();
    CTX.shadowBlur = 0;
  });
}

function traceLaser(level) {
  const beams = [];
  const startBeam = {
    x: level.laser.x + 0.5,
    y: level.laser.y + 0.5,
    dir: level.laser.dir,
    points: [{ x: level.laser.x + 0.5, y: level.laser.y + 0.5 }]
  };
  beams.push(startBeam);

  const processBeam = (beam) => {
    const { x, y, dir, points } = beam;
    const dirVec = DIRS[dir];
    let curX = x;
    let curY = y;
    let curDir = dir;
    let steps = 0;
    const maxSteps = level.gridSize * 4;

    while (steps < maxSteps) {
      curX += dirVec.x * 0.5;
      curY += dirVec.y * 0.5;
      points.push({ x: curX, y: curY });
      steps++;

      const gridX = Math.floor(curX - 0.5);
      const gridY = Math.floor(curY - 0.5);

      if (gridX < 0 || gridX >= level.gridSize || gridY < 0 || gridY >= level.gridSize) {
        break;
      }

      const mirror = level.mirrors.find(m => m.x === gridX && m.y === gridY);
      if (mirror) {
        const newDir = MIRROR_REFLECT[mirror.rotation][curDir];
        if (newDir) {
          curDir = newDir;
          const newBeam = { x: curX, y: curY, dir: curDir, points: [{ x: curX, y: curY }] };
          processBeam(newBeam);
        }
        break;
      }

      const prism = level.prisms.find(p => p.x === gridX && p.y === gridY);
      if (prism) {
        const splitDirs = PRISM_SPLIT[curDir];
        splitDirs.forEach(d => {
          const newBeam = { x: curX, y: curY, dir: d, points: [{ x: curX, y: curY }] };
          processBeam(newBeam);
        });
        break;
      }
    }
  };

  processBeam(startBeam);
  return beams;
}

function checkTargetHit(target) {
  const beams = traceLaser(LEVELS[currentLevel]);
  return beams.some(beam =>
    beam.points.some(pt =>
      Math.abs(pt.x - (target.x + 0.5)) < 0.3 && Math.abs(pt.y - (target.y + 0.5)) < 0.3
    )
  );
}

function checkMirrorHit(mirror) {
  const beams = traceLaser(LEVELS[currentLevel]);
  return beams.some(beam =>
    beam.points.some(pt =>
      Math.abs(pt.x - (mirror.x + 0.5)) < 0.3 && Math.abs(pt.y - (mirror.y + 0.5)) < 0.3
    )
  );
}

function checkPrismHit(prism) {
  const beams = traceLaser(LEVELS[currentLevel]);
  return beams.some(beam =>
    beam.points.some(pt =>
      Math.abs(pt.x - (prism.x + 0.5)) < 0.3 && Math.abs(pt.y - (prism.y + 0.5)) < 0.3
    )
  );
}

function checkLevelComplete() {
  const level = LEVELS[currentLevel];
  return level.targets.every(t => checkTargetHit(t));
}

function draw() {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);
  const level = LEVELS[currentLevel];
  const cellSize = getCellSize(level);
  const origin = getGridOrigin(level, cellSize);

  drawGrid(level, cellSize, origin);
  drawLaserSource(level, cellSize, origin);
  drawTargets(level, cellSize, origin);
  drawMirrors(level, cellSize, origin);
  drawPrisms(level, cellSize, origin);
  drawLaserPaths(level, cellSize, origin);
}

function handleCanvasClick(e) {
  const level = LEVELS[currentLevel];
  const cellSize = getCellSize(level);
  const origin = getGridOrigin(level, cellSize);
  const rect = CANVAS.getBoundingClientRect();
  const x = (e.clientX - rect.left) * DPR;
  const y = (e.clientY - rect.top) * DPR;
  const gx = Math.floor((x - origin.x) / cellSize);
  const gy = Math.floor((y - origin.y) / cellSize);

  if (gx < 0 || gx >= level.gridSize || gy < 0 || gy >= level.gridSize) return;

  const mirrorIdx = level.mirrors.findIndex(m => m.x === gx && m.y === gy);
  if (mirrorIdx !== -1) {
    level.mirrors[mirrorIdx].rotation = (level.mirrors[mirrorIdx].rotation + 1) % 4;
    draw();
    if (checkLevelComplete()) {
      setTimeout(() => {
        OVERLAY.hidden = false;
      }, 300);
    }
  }
}

function loadLevel(index) {
  currentLevel = Math.max(0, Math.min(index, LEVELS.length - 1));
  OVERLAY.hidden = true;
  resizeCanvas();
}

BTN_NEW.addEventListener('click', () => loadLevel(0));
BTN_NEXT.addEventListener('click', () => loadLevel(currentLevel + 1));
CANVAS.addEventListener('click', handleCanvasClick);
window.addEventListener('resize', resizeCanvas);

resizeCanvas();
loadLevel(0);