// ---------- Sample task data ----------
const SAMPLE_TASKS = [
  { id: 't1', name: 'Reading',   color: '#3DCBC9', est: 180, actual: 185, done: false, exceed: 5, weekHrs: 16, freq: 4 },
  { id: 't2', name: 'Searching', color: '#4A6FE3', est: 120, actual: 0,   done: true,  weekHrs: 8,  freq: 2 },
  { id: 't3', name: 'Writing',   color: '#F5D165', est: 75,  actual: 0,   done: true,  weekHrs: 5,  freq: 3 },
  { id: 't4', name: 'Design review', color: '#F3A266', est: 60, actual: 0, done: false, weekHrs: 3, freq: 2 },
];

const WEEK_DAYS = [
  { dow: 'Sun', dn: 4, idx: 0 },
  { dow: 'Mon', dn: 5, idx: 1 },
  { dow: 'Tue', dn: 6, idx: 2 },
  { dow: 'Wed', dn: 7, idx: 3 },
  { dow: 'Thu', dn: 8, idx: 4 },
  { dow: 'Fri', dn: 9, idx: 5 },
  { dow: 'Sat', dn: 10, idx: 6 },
];

const WEEK_BAR_DATA = [
  { day: 'S', est: 2, act: 1.5 },
  { day: 'M', est: 3, act: 2.8 },
  { day: 'T', est: 2.5, act: 3 },
  { day: 'W', est: 2, act: 2.2 },
  { day: 'T', est: 1.5, act: 0.8 },
  { day: 'F', est: 2.5, act: 2.5 },
  { day: 'S', est: 1, act: 2 },
];

const DAILY_SPEND = [
  { date: '2025.10.6 (Sun)', hrs: 1 },
  { date: '2025.10.9 (Wed)', hrs: 2.5 },
  { date: '2025.10.10 (Thu)', hrs: 0.5 },
  { date: '2025.10.12 (Sat)', hrs: 3 },
  { date: '2025.10.12 (Sat)', hrs: 3.5 },
];

const TASK_COLORS = ['#4A6FE3', '#3DCBC9', '#F5D165', '#F3A266', '#A78BFA', '#E26B6B'];

// ---------- Helpers ----------
const formatMins = (mins) => {
  if (!mins) return '0 mins';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} hr ${m} mins`;
  if (h) return `${h} hr${h > 1 ? 's' : ''}`;
  return `${m} mins`;
};

const formatHM = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

Object.assign(window, { SAMPLE_TASKS, WEEK_DAYS, WEEK_BAR_DATA, DAILY_SPEND, TASK_COLORS, formatMins, formatHM });
