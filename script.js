/* Life in Weeks Visualization - Vanilla JS Implementation */

// ---------------- Configuration ----------------
const BIRTH_DATE = new Date('1995-01-01'); // Change to your actual birth date
const MAX_YEARS = 75;
const WEEKS_PER_YEAR = 52; // Simplification for grid shape (not ISO week-year aware)
const TOTAL_WEEKS = MAX_YEARS * WEEKS_PER_YEAR;

// Categories legend (edit / extend as needed)
const CATEGORIES = [
  { id: 'elementary_school', label: 'Elementary School', color: '#1b7340ff' },
  { id: 'middle_school', label: 'Middle School', color: '#4fcc59ff' },
  { id: 'high_school', label: 'High School', color: '#4f83cc' },
  { id: 'college', label: 'College', color: '#295189ff' },
  { id: 'nvoq', label: 'nVoq', color: '#cf8216ff' },
  { id: 'vacation', label: 'Vacation', color: '#d3499eff' },
  { id: 'unassigned', label: 'Unassigned', color: '#666666' }
];

// Sparse event ranges; add or modify events here
// NOTE: Overlapping events -> later events in array override earlier
const EVENTS = [
  {
    start: '1998-08-01',
    end: '2004-05-01',
    category: 'elementary_school',
    title: 'Elementary School Years',
    description: 'Attended elementary school.'
  },
  {
    start: '2004-08-01',
    end: '2008-05-01',
    category: 'middle_school',
    title: 'Middle School Years',
    description: 'Attended middle school.'
  },
  {
    start: '2008-08-01',
    end: '2013-05-01',
    category: 'high_school',
    title: 'High School Years',
    description: 'Attended high school. Peaked.'
  },
  {
    start: '2013-08-01',
    end: '2017-12-15',
    category: 'college',
    title: 'College Years',
    description: 'Studied computers and stuff.'
  },
  {
    start: '2017-12-16',
    end: '2025-10-13',
    category: 'company_1',
    title: 'Company 1',
    description: 'Working as a software engineer.'
  },
];

// ---------------- Utility Functions ----------------
function addDays(date, days) {
  return new Date(date.getTime() + days * 86400000);
}

function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

function iso(date) { return date.toISOString().slice(0, 10); }

function dateToWeekIndex(base, date) {
  return Math.floor((date - base) / 604800000); // 7 * 864e5
}

function weekRange(base, weekIndex) {
  const start = addDays(base, weekIndex * 7);
  const end = addDays(start, 6);
  return { start, end };
}

function formatRange(start, end) {
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

function getCategoryById(id) { return CATEGORIES.find(c => c.id === id); }

// Build a direct lookup array mapping weekIndex -> event meta
function buildWeekMeta() {
  const arr = new Array(TOTAL_WEEKS);
  EVENTS.forEach(ev => {
    const s = new Date(ev.start + 'T00:00:00Z');
    const e = new Date(ev.end + 'T00:00:00Z');
    if (isNaN(s) || isNaN(e)) return;

    let startIdx = dateToWeekIndex(BIRTH_DATE, s);
    let endIdx = dateToWeekIndex(BIRTH_DATE, e);
    if (endIdx < 0 || startIdx > TOTAL_WEEKS - 1) return;

    startIdx = clamp(startIdx, 0, TOTAL_WEEKS - 1);
    endIdx = clamp(endIdx, 0, TOTAL_WEEKS - 1);
    for (let i = startIdx; i <= endIdx; i++) {
      arr[i] = ev; // later events override earlier ones
    }
  });
  return arr;
}

// ---------------- Rendering ----------------
let weekMeta = [];
const now = new Date();
const maxDate = addDays(BIRTH_DATE, TOTAL_WEEKS * 7);

function buildAriaLabel(weekIndex, meta, start, end) {
  const year = Math.floor(weekIndex / WEEKS_PER_YEAR);
  let label = `Week ${weekIndex} (Year ${year}) ${start.toDateString()} to ${end.toDateString()}`;
  if (meta) label += `. ${meta.title || meta.category}`;
  else if (start > now) label += '. Future week';
  return label;
}

function renderLegend() {
  const legend = document.getElementById('legend');
  legend.innerHTML = '<h2>Legend</h2>';
  const ul = document.createElement('ul');
  ul.className = 'legend-list';
  CATEGORIES.forEach(cat => {
    const li = document.createElement('li');
    li.className = 'legend-item';
    const sw = document.createElement('span');
    sw.className = 'legend-swatch';
    sw.style.background = cat.color;
    sw.title = cat.label;
    li.appendChild(sw);
    const lbl = document.createElement('span');
    lbl.textContent = cat.label;
    li.appendChild(lbl);
    ul.appendChild(li);
  });
  legend.appendChild(ul);
}

function renderGrid() {
  const grid = document.getElementById('grid');
  const frag = document.createDocumentFragment();

  for (let i = 0; i < TOTAL_WEEKS; i++) {
    const cell = document.createElement('div');
    cell.className = 'week';

    const { start, end } = weekRange(BIRTH_DATE, i);
    if (start > maxDate) break;

    const meta = weekMeta[i];
    if (meta) {
      cell.classList.add('has-event', 'cat-' + meta.category);
      const cat = getCategoryById(meta.category);
      if (cat) cell.style.backgroundColor = cat.color;
    } else if (start > now) {
      cell.classList.add('future');
    }
    
    cell.dataset.week = i;
    cell.tabIndex = 0;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', buildAriaLabel(i, meta, start, end));
    cell.addEventListener('click', onWeekActivate);
    cell.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onWeekActivate(e); }
    });
    frag.appendChild(cell);
  }
  grid.appendChild(frag);
}

function updateSummary() {
  const weeksElapsed = dateToWeekIndex(BIRTH_DATE, now);
  const clamped = clamp(weeksElapsed, 0, TOTAL_WEEKS - 1);
  const summary = document.getElementById('summary');
  summary.textContent = `Showing weeks 0–${TOTAL_WEEKS - 1}. Current week index: ${clamped}. (${Math.floor(clamped / WEEKS_PER_YEAR)} full years elapsed)`;
}

// ---------------- Modal / Overlay ----------------
let lastFocused = null;

function onWeekActivate(e) {
  const cell = e.currentTarget;
  const idx = parseInt(cell.dataset.week, 10);
  openOverlay(idx, cell);
}

function openOverlay(weekIndex, originEl) {
  lastFocused = originEl;
  const overlay = document.getElementById('overlay');
  const { start, end } = weekRange(BIRTH_DATE, weekIndex);
  const meta = weekMeta[weekIndex];
  const weekVisual = overlay.querySelector('.week-visual');
  const titleEl = overlay.querySelector('.week-title');
  const datesEl = overlay.querySelector('.week-dates');
  const catEl = overlay.querySelector('.week-category');
  const descEl = overlay.querySelector('.week-description');

  let categoryId = meta ? meta.category : 'unassigned';
  const cat = getCategoryById(categoryId) || { label: 'Unassigned', color: '#666' };

  weekVisual.style.background = cat.color;
  titleEl.textContent = meta ? meta.title || '(No Title)' : 'No Event Recorded';
  datesEl.textContent = formatRange(start, end);
  catEl.textContent = `Category: ${cat.label}`;
  descEl.textContent = meta ? meta.description || '' : 'No additional details for this week.';

  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');

  // Focus management
  const closeBtn = overlay.querySelector('.close');
  closeBtn.focus();
}

function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  if (lastFocused) lastFocused.focus();
  lastFocused = null;
}

function handleOverlayClick(e) {
  if (e.target.dataset.close === 'true') {
    closeOverlay();
  }
}

function handleKey(e) {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('overlay');
    if (overlay.getAttribute('aria-hidden') === 'false') closeOverlay();
  }
}

// ---------------- Initialization ----------------
function init() {
  weekMeta = buildWeekMeta();
  renderLegend();
  renderGrid();
  updateSummary();
  document.getElementById('overlay').addEventListener('click', handleOverlayClick);
  document.addEventListener('keydown', handleKey);
}

document.addEventListener('DOMContentLoaded', init);
