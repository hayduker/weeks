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
  { id: 'job0', label: 'Job', color: '#cf8216ff' },
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
    start: '2016-05-17',
    end: '2016-05-22',
    category: 'vacation',
    title: 'Southwest Road Trip',
    description: 'Went to White Sand, Carlsbad, Grand Canyon, and Monument Valley with Josh, Michael, and Olivia.'
  },
  {
    start: '2016-12-26',
    end: '2017-01-02',
    category: 'vacation',
    title: 'Cruise with Candelas and Megan',
    description: 'Forget where we went.'
  },
  {
    start: '2018-01-01',
    end: '2025-10-17',
    category: 'job0',
    title: 'Job at Tech Company',
    description: 'Working as a software engineer.'
  },
  {
    start: '2018-06-08',
    end: '2018-06-12',
    category: 'vacation',
    title: 'Trip to Seattle',
    description: 'Josh and I visited Dylan.'
  },
  {
    start: '2018-08-11',
    end: '2018-08-25',
    category: 'vacation',
    title: 'Trip to Spain and Italy',
    description: 'First time overseas! Visited Joaquin with Josh.'
  },
  {
    start: '2019-04-13',
    end: '2019-04-21',
    category: 'vacation',
    title: 'Trip to Costa Rica',
    description: 'Josh and I visited Joaquin again!'
  },
  {
    start: '2019-12-28',
    end: '2020-01-09',
    category: 'vacation',
    title: 'Trip to Eastern Europe',
    description: 'Visited Budapest, Vienna, Ljubljana, and Zagreb with Hannah and Maddy.'
  },
  {
    start: '2020-03-10',
    end: '2020-03-14',
    category: 'vacation',
    title: 'Josh visits Houston',
    description: 'Went to NASA, Hobbit Bar, and met friends.'
  },
  {
    start: '2020-08-09',
    end: '2020-09-05',
    category: 'vacation',
    title: 'Lived in New York City',
    description: 'Still mostly COVID, was strange but fun.'
  },
  {
    start: '2022-07-16',
    end: '2022-07-23',
    category: 'vacation',
    title: 'Road Trip to the Pacific Northwest',
    description: 'Rose and I visited Craters of the Moon, Mount Rainier, and Orcas Island.'
  },
  {
    start: '2023-04-11',
    end: '2023-04-25',
    category: 'vacation',
    title: 'Trip to the UK',
    description: 'Rose and I visited London, Edinburgh, and the Outer Hebrides.'
  },
  {
    start: '2023-05-06',
    end: '2023-05-12',
    category: 'vacation',
    title: 'Josh and Monika visit Kanab',
    description: 'Canyoneering and Las Vegas.'
  },
  {
    start: '2023-12-27',
    end: '2024-01-01',
    category: 'vacation',
    title: 'Road Trip to Big Bend and Guadalupe Mountains',
    description: 'Rose and I visited Big Bend Ranch State Park and Guadalupe Mountains National Park.'
  },
  {
    start: '2024-03-17',
    end: '2024-03-23',
    category: 'vacation',
    title: 'Trip to Moab',
    description: 'Rose and I hiked in Canyonlands, bouldered at Big Bend, and canyoneered in Arches.'
  },
  {
    start: '2024-04-24',
    end: '2024-04-28',
    category: 'vacation',
    title: 'Trip to GSENM and The Wave',
    description: 'With Patrick and Robin.'
  },
  {
    start: '2024-05-08',
    end: '2024-05-12',
    category: 'vacation',
    title: 'Backpacking in Grand Gulch',
    description: 'And canyoneering in Moab with Rose, Monika, Josh, and Patrick.'
  },
  {
    start: '2024-08-21',
    end: '2024-08-25',
    category: 'vacation',
    title: 'Pothole Fest in Escalante',
    description: 'Awkward as hell but learned a lot.'
  },
  {
    start: '2024-09-26',
    end: '2024-09-29',
    category: 'vacation',
    title: 'Canyoneering in Poison Springs',
    description: 'With Rose, Monika, Josh, and Patrick.'
  },
  {
    start: '2024-10-12',
    end: '2024-10-19',
    category: 'vacation',
    title: 'Trip to New York City',
    description: 'With Rose!'
  },
  {
    start: '2024-12-23',
    end: '2024-12-26',
    category: 'vacation',
    title: 'Trip Houston for Christmas',
    description: 'With Rose!'
  },
  {
    start: '2025-01-02',
    end: '2025-01-05',
    category: 'vacation',
    title: 'Rented Van and Roadtripped to Death Valley',
    description: 'Canyoneered and hiked. Rose and I decided to get a van after this.'
  },
];

// ---------------- Utility Functions ----------------
function addDays(date, days) {
  return new Date(date.getTime() + days * 86400000);
}

function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

function iso(date) { return date.toISOString().slice(0, 10); }

// ISO week helpers
function startOfISOWeek(d) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (date.getUTCDay() + 6) % 7; // Monday=0 ... Sunday=6
  return addDays(date, -day);
}
function addISOWeeks(date, n) { return addDays(date, n * 7); }
function getISOWeekInfo(d) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const thursday = addDays(date, 3 - ((date.getUTCDay() + 6) % 7));
  const isoYear = thursday.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 4));
  const yearStartMonday = startOfISOWeek(yearStart);
  const isoWeek = Math.floor((thursday - yearStartMonday) / 604800000) + 1;
  const isoWeekStartDate = startOfISOWeek(date);
  return { isoYear, isoWeek, isoWeekStartDate };
}

// Anchor = Monday of ISO week containing birth date
const ISO_ANCHOR = startOfISOWeek(BIRTH_DATE);

function dateToWeekIndex(_baseIgnored, date) {
  // Recompute based on ISO anchor so existing calls still work
  const weekStart = startOfISOWeek(date);
  return Math.floor((weekStart - ISO_ANCHOR) / 604800000);
}

function formatRange(start, end) {
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

function getCategoryById(id) { return CATEGORIES.find(c => c.id === id); }

// Build week metadata with ISO awareness + event assignment with 4+ day threshold
function buildWeekMeta() {
  const weeks = new Array(TOTAL_WEEKS);
  for (let i = 0; i < TOTAL_WEEKS; i++) {
    const start = addISOWeeks(ISO_ANCHOR, i);
    const end = addDays(start, 6);
    const { isoYear, isoWeek } = getISOWeekInfo(start);
    weeks[i] = { index: i, start, end, isoYear, isoWeek, event: undefined };
  }
  const lastWeek = weeks[weeks.length - 1];
  EVENTS.forEach(ev => {
    const s = new Date(ev.start + 'T00:00:00Z');
    const e = new Date(ev.end + 'T00:00:00Z');
    if (isNaN(s) || isNaN(e)) return;
    if (e < ISO_ANCHOR || s > lastWeek.end) return;

    // Compute approximate week index bounds
    let startIdx = dateToWeekIndex(null, s);
    let endIdx = dateToWeekIndex(null, e);
    startIdx = clamp(startIdx, 0, weeks.length - 1);
    endIdx = clamp(endIdx, 0, weeks.length - 1);
    for (let i = startIdx; i <= endIdx; i++) {
      const w = weeks[i];
      const overlapStart = (s > w.start) ? s : w.start;
      const overlapEnd = (e < w.end) ? e : w.end;
      if (overlapEnd < overlapStart) continue;
      const overlapDays = Math.floor((overlapEnd - overlapStart) / 86400000) + 1; // inclusive
      if (overlapDays >= 4) {
        w.event = ev; // later events override earlier
      }
    }
  });
  return weeks;
}

// ---------------- Rendering ----------------
let weekMeta = [];
const now = new Date();
const maxDate = addDays(BIRTH_DATE, TOTAL_WEEKS * 7);

function buildAriaLabel(weekIndex, metaObj) {
  const { start, end, isoYear, isoWeek, event } = metaObj;
  let label = `Week ${weekIndex} (ISO ${isoYear}-W${String(isoWeek).padStart(2,'0')}) ${start.toDateString()} to ${end.toDateString()}`;
  if (event) label += `. ${event.title || event.category}`;
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
  grid.innerHTML = '';
  const frag = document.createDocumentFragment();

  // We will render by ISO year, filling each year to 53 columns (weeks) sequentially.
  // Compute min/max isoYear in metadata
  const years = new Set(weekMeta.map(w => w.isoYear));
  const sortedYears = [...years].sort((a,b) => a - b);

  sortedYears.forEach(year => {
    // Collect weeks for this year
    const weeks = weekMeta.filter(w => w.isoYear === year);
    // Map isoWeek -> meta
    const map = new Map();
    weeks.forEach(w => map.set(w.isoWeek, w));
    const maxWeek = map.has(53) ? 53 : 53; // always iterate 1..53
    for (let wk = 1; wk <= maxWeek; wk++) {
      const metaObj = map.get(wk);
      const cell = document.createElement('div');
      cell.className = 'week';
      if (!metaObj) {
        // Unused week 53 for 52-week years
        if (wk === 53 && !map.has(53)) {
          cell.classList.add('unused');
          cell.setAttribute('aria-hidden', 'true');
        } else {
          // This should not happen; skip
          cell.classList.add('unused');
          cell.setAttribute('aria-hidden', 'true');
        }
      } else {
        const { index: i, start, event, isoYear, isoWeek } = metaObj;
        if (event) {
          cell.classList.add('has-event', 'cat-' + event.category);
          const cat = getCategoryById(event.category);
          if (cat) cell.style.backgroundColor = cat.color;
        } else if (start > now) {
          cell.classList.add('future');
        }
        cell.dataset.week = i;
        cell.dataset.isoYear = isoYear;
        cell.dataset.isoWeek = isoWeek;
        cell.dataset.iso = `${isoYear}-W${String(isoWeek).padStart(2,'0')}`;
        cell.tabIndex = 0;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', buildAriaLabel(i, metaObj));
        cell.addEventListener('click', onWeekActivate);
        cell.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onWeekActivate(e); }
        });
      }
      frag.appendChild(cell);
    }
  });

  grid.appendChild(frag);
}

function updateSummary() {
  const weeksElapsed = dateToWeekIndex(BIRTH_DATE, now);
  const clamped = clamp(weeksElapsed, 0, TOTAL_WEEKS - 1);
  const currentMeta = weekMeta[clamped];
  const summary = document.getElementById('summary');
  if (currentMeta) {
    summary.textContent = `Showing weeks 0–${TOTAL_WEEKS - 1}. Current week index: ${clamped}. ISO ${currentMeta.isoYear}-W${String(currentMeta.isoWeek).padStart(2,'0')}. (${Math.floor(clamped / WEEKS_PER_YEAR)} approx years elapsed)`;
  } else {
    summary.textContent = `Showing weeks 0–${TOTAL_WEEKS - 1}.`;
  }
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
  const metaObj = weekMeta[weekIndex];
  if (!metaObj) return;
  const { start, end, event, isoYear, isoWeek } = metaObj;
  const weekVisual = overlay.querySelector('.week-visual');
  const titleEl = overlay.querySelector('.week-title');
  const datesEl = overlay.querySelector('.week-dates');
  const catEl = overlay.querySelector('.week-category');
  const descEl = overlay.querySelector('.week-description');

  let categoryId = event ? event.category : 'unassigned';
  const cat = getCategoryById(categoryId) || { label: 'Unassigned', color: '#666' };

  weekVisual.style.background = cat.color;
  titleEl.textContent = event ? event.title || '(No Title)' : 'No Event Recorded';
  datesEl.textContent = `${formatRange(start, end)} (ISO ${isoYear}-W${String(isoWeek).padStart(2,'0')})`;
  catEl.textContent = `Category: ${cat.label}`;
  descEl.textContent = event ? event.description || '' : 'No additional details for this week.';

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
