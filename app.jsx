// ============ Layout chrome ============
const NAV_ITEMS = [
{ id: 'dashboard', label: 'Dashboard', icon: 'home' },
{ id: 'overview', label: 'Tasks', icon: 'list' },
{ id: 'analytics', label: 'Analytics', icon: 'chart' },
{ id: 'settings', label: 'Settings', icon: 'settings' }];


const Sidebar = ({ screen, go }) =>
<aside className="tb-sidebar">
    <div className="tb-sidebar-logo">
      <span className="tb-sidebar-logo-mark">T</span>
      <span>Timebudget</span>
    </div>
    <nav className="tb-sidebar-nav">
      <div className="tb-sidebar-section">Plan</div>
      {NAV_ITEMS.map((it) =>
    <button key={it.id} className={`tb-nav-item ${screen === it.id ? 'active' : ''}`} onClick={() => go(it.id)}>
          <span className="icon"><Icon name={it.icon} size={18} /></span>
          <span>{it.label}</span>
        </button>
    )}
    </nav>
    <div className="tb-sidebar-foot">
      <div className="tb-profile">
        <div className="tb-avatar">AC</div>
        <div className="tb-profile-name" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Alex Chen</div>
          <div style={{ fontSize: 11, color: 'var(--tb-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>alex@timebudget.app</div>
        </div>
      </div>
    </div>
  </aside>;


const TopNav = ({ screen, go }) =>
<div className="tb-topnav">
    <div className="tb-topnav-brand">
      <span className="tb-sidebar-logo-mark">T</span>
      <span>Timebudget</span>
    </div>
    <nav className="tb-topnav-nav">
      {NAV_ITEMS.map((it) =>
    <button key={it.id} className={`tb-nav-item ${screen === it.id ? 'active' : ''}`} onClick={() => go(it.id)}>
          <span>{it.label}</span>
        </button>
    )}
    </nav>
    <div className="tb-row tb-gap-3">
      <button className="tb-btn-icon"><Icon name="search" size={18} /></button>
      <div className="tb-avatar">AC</div>
    </div>
  </div>;


const BottomNav = ({ screen, go }) =>
<nav className="tb-bottomnav">
    {NAV_ITEMS.map((it) =>
  <button key={it.id} className={screen === it.id ? 'active' : ''} onClick={() => go(it.id)}>
        <span className="icon"><Icon name={it.icon} size={20} /></span>
        <span>{it.label}</span>
      </button>
  )}
  </nav>;


// ============ Reducer ============
const initialState = {
  screen: 'dashboard',
  tasks: SAMPLE_TASKS,
  budgetMins: 8 * 60,
  startTime: '09:00',
  endTime: '17:00',
  selectedDay: 3,
  viewMode: 'list',
  modal: null, // 'time' | 'task'
  editTask: null,
  starts: {}, // task id -> start offset mins
  analyticsTaskId: 't1',
  hasSetup: true // toggled to false to show empty state
};

function reducer(state, action) {
  switch (action.type) {
    case 'GO':return { ...state, screen: action.screen };
    case 'GO_ANALYTICS':return { ...state, screen: 'analytics', analyticsTaskId: action.taskId };
    case 'SET_DAY':return { ...state, selectedDay: action.i };
    case 'PREV_WEEK':case 'NEXT_WEEK':return state; // no-op visual only
    case 'SET_VIEW':return { ...state, viewMode: action.mode };
    case 'OPEN_TIME':return { ...state, modal: 'time' };
    case 'OPEN_TASK':return { ...state, modal: 'task', editTask: action.task };
    case 'CLOSE_MODAL':return { ...state, modal: null, editTask: null };
    case 'SAVE_TIME':{
        const [sh, sm] = action.start.split(':').map(Number);
        const [eh, em] = action.end.split(':').map(Number);
        const mins = Math.max(0, eh * 60 + em - (sh * 60 + sm));
        return { ...state, startTime: action.start, endTime: action.end, budgetMins: mins, modal: null, hasSetup: true };
      }
    case 'SAVE_TASK':{
        const t = action.task;
        if (t.id) {
          return { ...state, tasks: state.tasks.map((x) => x.id === t.id ? { ...x, ...t } : x), modal: null, editTask: null };
        }
        const newTask = { ...t, id: 't' + Date.now(), done: false, weekHrs: 0, freq: 0 };
        return { ...state, tasks: [...state.tasks, newTask], modal: null, editTask: null };
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id), modal: null, editTask: null };
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map((t) => t.id === action.id ? { ...t, done: !t.done } : t) };
    case 'REORDER_TASKS':
      return { ...state, tasks: action.tasks };
    case 'SET_START':
      return { ...state, starts: { ...state.starts, [action.id]: action.mins } };
    case 'RESET_EMPTY':
      return { ...state, hasSetup: false, tasks: [] };
    case 'SET_BUDGET':
      return { ...state, budgetMins: action.mins };
    default:return state;
  }
}

// ============ App root ============
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "calm",
  "primary": "#4A6FE3",
  "accent": "#3DCBC9",
  "showEmpty": false
} /*EDITMODE-END*/;

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--tb-primary', t.primary);
    root.style.setProperty('--tb-accent', t.accent);
    // soft variant of primary
    root.style.setProperty('--tb-primary-soft', mixWithWhite(t.primary, 0.88));
    root.style.setProperty('--tb-primary-deep', darken(t.primary, 0.15));
  }, [t.primary, t.accent]);

  // Apply empty state
  React.useEffect(() => {
    if (t.showEmpty) {
      dispatch({ type: 'RESET_EMPTY' });
    }
  }, [t.showEmpty]);

  const go = (screen) => dispatch({ type: 'GO', screen });

  const isHero = t.variant === 'hero';

  const renderScreen = () => {
    if (!state.hasSetup) return <EmptyState onSetTime={() => dispatch({ type: 'OPEN_TIME' })} />;
    switch (state.screen) {
      case 'dashboard':return isHero ? <DashboardHero state={state} dispatch={dispatch} /> : <DashboardCalm state={state} dispatch={dispatch} />;
      case 'overview':return <TaskOverview state={state} dispatch={dispatch} />;
      case 'analytics':return <Analytics state={state} dispatch={dispatch} />;
      case 'settings':return <Settings state={state} dispatch={dispatch} />;
      default:return null;
    }
  };

  const titleMap = {
    dashboard: { title: '8 June, 2025', sub: 'Wednesday · Plan your day with a time budget' },
    overview: { title: 'Task overview', sub: 'All activities and their tracked time' },
    analytics: { title: 'Analytics', sub: 'How you spend your time' },
    settings: { title: 'Settings', sub: 'Defaults, notifications, and data' }
  };
  const meta = titleMap[state.screen] || titleMap.dashboard;

  return (
    <div className={`tb-app ${isHero ? 'variant-hero' : 'variant-calm'}`}
    data-screen-label={`Timebudget — ${state.screen}`}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {!isHero && <Sidebar screen={state.screen} go={go} />}
        <main className="tb-main">
          {isHero ?
          <TopNav screen={state.screen} go={go} /> :

          <header className="tb-topbar" data-screen={state.screen} style={{ alignItems: "center" }}>
              <div className="tb-topbar-title">
                <h1>{meta.title}</h1>
                <div className="subtle">{meta.sub}</div>
              </div>
              <div className="tb-row tb-gap-3">
                <button className="tb-btn tb-btn-ghost tb-btn-sm"><Icon name="sun" size={14} /> 9:00 — 17:00</button>
                <button className="tb-btn tb-btn-primary tb-btn-sm" onClick={() => dispatch({ type: 'OPEN_TASK', task: null })}>
                  <Icon name="plus" size={14} /> New task
                </button>
              </div>
            </header>
          }
          <div className="tb-content" data-comment-anchor="0692eb54c0-div-195-11">
            {renderScreen()}
          </div>
        </main>
      </div>
      <BottomNav screen={state.screen} go={go} />

      <SetTimeModal
        open={state.modal === 'time'}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSave={(s, e) => dispatch({ type: 'SAVE_TIME', start: s, end: e })}
        initial={{ start: state.startTime, end: state.endTime }} />
      
      <EditTaskModal
        open={state.modal === 'task'}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSave={(task) => dispatch({ type: 'SAVE_TASK', task })}
        onDelete={(id) => dispatch({ type: 'DELETE_TASK', id })}
        task={state.editTask} />
      

      <TweaksPanel title="Tweaks">
        <TweakSection title="Layout">
          <TweakRadio
            label="Variant"
            value={t.variant}
            onChange={(v) => setTweak('variant', v)}
            options={[
            { value: 'calm', label: 'Calm' },
            { value: 'hero', label: 'Hero' }]
            } />
          
          <TweakToggle
            label="Show empty state"
            value={t.showEmpty}
            onChange={(v) => setTweak('showEmpty', v)} />
          
        </TweakSection>
        <TweakSection title="Color">
          <TweakColor
            label="Primary"
            value={t.primary}
            onChange={(v) => setTweak('primary', v)}
            options={['#4A6FE3', '#1A1F36', '#3DCBC9', '#7C5CFC', '#E26B6B']} />
          
          <TweakColor
            label="Accent"
            value={t.accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#3DCBC9', '#F5D165', '#F3A266', '#A78BFA', '#4A6FE3']} />
          
        </TweakSection>
      </TweaksPanel>
    </div>);

}

// ============ Color helpers ============
function hexToRgb(hex) {
  const m = hex.replace('#', '');
  const i = parseInt(m, 16);
  return { r: i >> 16 & 255, g: i >> 8 & 255, b: i & 255 };
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function mixWithWhite(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}
function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);