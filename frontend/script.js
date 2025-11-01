const ROWS = 25;
const COLS = 40;
let grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let start = null;
let end = null;
let currentMode = 'start';
let isMouseDown = false;
let isRunning = false;

createGrid();
setupEventListeners();

function createGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;

      cell.addEventListener('mousedown', () => {
        isMouseDown = true;
        processCell(r, c);
      });
      cell.addEventListener('mouseenter', () => {
        if (isMouseDown) processCell(r, c);
      });

      gridEl.appendChild(cell);
    }
  }
  document.addEventListener('mouseup', () => isMouseDown = false);
}

function processCell(r, c) {
  if (isRunning) return;
  const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
  if (!cell) return;

  const isStart = start && r === start[0] && c === start[1];
  const isEnd = end && r === end[0] && c === end[1];

  if (currentMode === 'erase') {
    if (isStart || isEnd) return;
    cell.className = 'cell';
    grid[r][c] = 0;
    return;
  }

  if (!isStart && !isEnd) {
    cell.className = 'cell';
    grid[r][c] = 0;
  }

  if (currentMode === 'start') {
    if (start) document.querySelector(`.cell[data-r="${start[0]}"][data-c="${start[1]}"]`).className = 'cell';
    start = [r, c];
    cell.className = 'cell start';
  } else if (currentMode === 'end') {
    if (end) document.querySelector(`.cell[data-r="${end[0]}"][data-c="${end[1]}"]`).className = 'cell';
    end = [r, c];
    cell.className = 'cell end';
  } else if (currentMode === 'wall') {
    if (!isStart && !isEnd) {
      cell.className = 'cell wall';
      grid[r][c] = 1;
    }
  }
}

function setupEventListeners() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
    });
  });

  document.getElementById('btn-bfs').addEventListener('click', () => runAlgorithm('bfs'));
  document.getElementById('btn-astar').addEventListener('click', () => runAlgorithm('astar'));
  document.getElementById('btn-dfs').addEventListener('click', () => runAlgorithm('dfs'));
document.getElementById('btn-greedy').addEventListener('click', () => runAlgorithm('greedy'));

  document.getElementById('btn-clear').addEventListener('click', clearAll);
  document.getElementById('btn-clear-path').addEventListener('click', clearPathOnly);
}

function clearPathOnly() {
  if (isRunning) return;
  document.querySelectorAll('.cell.visited, .cell.path').forEach(el => {
    const r = +el.dataset.r;
    const c = +el.dataset.c;
    if (grid[r][c] === 0) el.className = 'cell';
  });
}

function clearAll() {
  if (isRunning) return;
  grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  start = null;
  end = null;
  createGrid();
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-mode="start"]').classList.add('active');
  currentMode = 'start';
}

async function runAlgorithm(algo) {
  if (isRunning) return;
  if (!start || !end) { alert('⚠️ Coloca inicio y fin.'); return; }

  isRunning = true;
  clearPathOnly();

  const response = await fetch('http://localhost:5000/' + algo, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grid, start, end })
  });

  const result = await response.json();
  const speed = 101 - document.getElementById('speed').value;

  for (const [r, c] of result.visited || []) {
    if (!isRunning) break;
    const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    if (cell && !(r===start[0] && c===start[1]) && !(r===end[0] && c===end[1])) {
      cell.classList.add('visited');
      cell.style.transform = 'scale(1.3)';
      setTimeout(() => cell.style.transform = 'scale(1)', speed/2);
    }
    await new Promise(res => setTimeout(res, speed));
  }

  if (result.path && result.path.length > 0 && isRunning) {
    for (const [r, c] of result.path) {
      const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
      if (cell) {
        cell.classList.remove('visited');
        cell.classList.add('path');
        cell.style.opacity = 0;
        setTimeout(() => cell.style.opacity = 1, 50);
      }
      await new Promise(res => setTimeout(res, speed/2));
    }
  } else if (isRunning) { alert('!!No hay ruta.'); }

  isRunning = false;
}
