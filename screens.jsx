// ============ Dashboard - Calm variant ============
const DashboardCalm = ({ state, dispatch }) => {
  const { tasks, budgetMins, selectedDay, viewMode } = state;
  const completed = tasks.filter(t => t.done).length;
  const totalUsed = tasks.reduce((s, t) => s + (t.est || 0), 0);
  const sortable = useSortable(tasks, (next) => dispatch({ type: 'REORDER_TASKS', tasks: next }));

  return (
    <>
      <div className="tb-show-mobile">
        <WeekStrip
          date="8 June, 2025"
          activeIdx={selectedDay}
          onPick={(i) => dispatch({ type: 'SET_DAY', i })}
          onPrev={() => dispatch({ type: 'PREV_WEEK' })}
          onNext={() => dispatch({ type: 'NEXT_WEEK' })}
        />
      </div>

      <div className="tb-dashboard">
        <div className="tb-col tb-gap-6">
          <div className="tb-hero">
            <h2>Time budget</h2>
            <Donut tasks={tasks} budgetMins={budgetMins} />
            <div className="tb-row tb-gap-3" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="tb-btn tb-btn-ghost" onClick={() => dispatch({ type: 'OPEN_TIME' })}>
                <Icon name="clock" size={16} /> Adjust budget
              </button>
              <button className="tb-btn tb-btn-primary" onClick={() => dispatch({ type: 'OPEN_TASK', task: null })}>
                <Icon name="plus" size={16} /> Add task
              </button>
            </div>
          </div>

          <div className="tb-card" style={{ padding: 20 }}>
            <div className="tb-tasks-head">
              <h3>Tasks ({tasks.length})</h3>
              <div className="tb-row tb-gap-3">
                <div className="tb-view-toggle">
                  <button className={viewMode === 'list' ? 'active' : ''} onClick={() => dispatch({ type: 'SET_VIEW', mode: 'list' })}>
                    <Icon name="rows" size={14} />
                  </button>
                  <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => dispatch({ type: 'SET_VIEW', mode: 'grid' })}>
                    <Icon name="grid" size={14} />
                  </button>
                </div>
                <button className="tb-btn tb-btn-sm tb-btn-ghost" onClick={() => dispatch({ type: 'OPEN_TASK', task: null })}>
                  <Icon name="plus" size={14} /> Add
                </button>
              </div>
            </div>
            {viewMode === 'list' ? (
              <div className="tb-tasks-list">
                {tasks.map(t => (
                  <TaskRow
                    key={t.id} task={t}
                    dragHandlers={sortable(t.id)}
                    onToggle={(id) => dispatch({ type: 'TOGGLE_TASK', id })}
                    onEdit={(task) => dispatch({ type: 'OPEN_TASK', task })}
                  />
                ))}
              </div>
            ) : (
              <div className="tb-tasks-grid">
                {tasks.map(t => (
                  <TaskCard
                    key={t.id} task={t}
                    dragHandlers={sortable(t.id)}
                    onToggle={(id) => dispatch({ type: 'TOGGLE_TASK', id })}
                    onEdit={(task) => dispatch({ type: 'OPEN_TASK', task })}
                  />
                ))}
              </div>
            )}
          </div>

          <Timeline
            tasks={tasks.map(t => ({ ...t, startOffset: state.starts[t.id] }))}
            startHr={9} endHr={17}
            onDrag={(id, mins) => dispatch({ type: 'SET_START', id, mins })}
          />
        </div>

        <div className="tb-rail">
          <div className="tb-rail-card">
            <h4>Today at a glance</h4>
            <div className="tb-stat-row"><span className="label">Daily budget</span><span className="val">{Math.floor(budgetMins/60)} hrs</span></div>
            <div className="tb-stat-row"><span className="label">Planned</span><span className="val">{formatMins(totalUsed)}</span></div>
            <div className="tb-stat-row"><span className="label">Completed</span><span className="val">{completed} / {tasks.length}</span></div>
            <div className="tb-stat-row"><span className="label">Streak</span><span className="val">12 days</span></div>
          </div>
          <div className="tb-rail-card">
            <h4>This week</h4>
            <div className="tb-mini-bars">
              {WEEK_BAR_DATA.map((d, i) => (
                <div key={i} className={`tb-mini-bar-col ${i === selectedDay ? 'today' : ''}`}>
                  <div className="tb-mini-bar" style={{ height: `${d.act * 18}px` }}></div>
                  <div className="day">{d.day}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--tb-text-mid)', marginTop: 6 }}>Weekly total: <strong style={{ color: 'var(--tb-text)' }}>15 hrs</strong></div>
          </div>
          <div className="tb-rail-card">
            <h4>Top activities</h4>
            <div className="tb-col tb-gap-2">
              {tasks.slice(0, 4).map(t => (
                <div key={t.id} className="tb-row tb-gap-3" style={{ padding: '4px 0' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: t.color }}></div>
                  <span style={{ flex: 1, fontSize: 13 }}>{t.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--tb-text-muted)', fontVariantNumeric: 'tabular-nums' }}>{t.weekHrs}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ============ Dashboard - Hero variant ============
const DashboardHero = ({ state, dispatch }) => {
  const { tasks, budgetMins, selectedDay, viewMode } = state;
  const sortable = useSortable(tasks, (next) => dispatch({ type: 'REORDER_TASKS', tasks: next }));

  return (
    <>
      <div className="tb-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--tb-text-muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Wednesday</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>8 June, 2025</h1>
        </div>
        <WeekStrip
          date=""
          activeIdx={selectedDay}
          onPick={(i) => dispatch({ type: 'SET_DAY', i })}
          onPrev={() => dispatch({ type: 'PREV_WEEK' })}
          onNext={() => dispatch({ type: 'NEXT_WEEK' })}
        />
      </div>

      <div className="tb-hero tb-hero-bold">
        <Donut tasks={tasks} budgetMins={budgetMins} size="lg" />
        <div className="tb-hero-cta">
          <button className="tb-btn tb-btn-ghost" onClick={() => dispatch({ type: 'OPEN_TIME' })}>
            <Icon name="clock" size={16} /> Adjust budget · 9:00–17:00
          </button>
          <button className="tb-btn tb-btn-primary tb-btn-lg" onClick={() => dispatch({ type: 'OPEN_TASK', task: null })}>
            <Icon name="plus" size={18} /> Add task
          </button>
        </div>
      </div>

      <div className="tb-card" style={{ padding: 24 }}>
        <div className="tb-tasks-head">
          <h3>Today's tasks</h3>
          <div className="tb-row tb-gap-3">
            <div className="tb-view-toggle">
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => dispatch({ type: 'SET_VIEW', mode: 'list' })}>
                <Icon name="rows" size={14} />
              </button>
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => dispatch({ type: 'SET_VIEW', mode: 'grid' })}>
                <Icon name="grid" size={14} />
              </button>
            </div>
          </div>
        </div>
        {viewMode === 'grid' ? (
          <div className="tb-tasks-grid">
            {tasks.map(t => (
              <TaskCard
                key={t.id} task={t}
                dragHandlers={sortable(t.id)}
                onToggle={(id) => dispatch({ type: 'TOGGLE_TASK', id })}
                onEdit={(task) => dispatch({ type: 'OPEN_TASK', task })}
              />
            ))}
          </div>
        ) : (
          <div className="tb-tasks-list">
            {tasks.map(t => (
              <TaskRow
                key={t.id} task={t}
                dragHandlers={sortable(t.id)}
                onToggle={(id) => dispatch({ type: 'TOGGLE_TASK', id })}
                onEdit={(task) => dispatch({ type: 'OPEN_TASK', task })}
              />
            ))}
          </div>
        )}
      </div>

      <Timeline
        tasks={tasks.map(t => ({ ...t, startOffset: state.starts[t.id] }))}
        startHr={9} endHr={17}
        onDrag={(id, mins) => dispatch({ type: 'SET_START', id, mins })}
      />
    </>
  );
};

// ============ Empty state ============
const EmptyState = ({ onSetTime }) => (
  <>
    <WeekStrip date="8 June, 2025" activeIdx={3} onPick={() => {}} onPrev={() => {}} onNext={() => {}} />
    <div className="tb-empty">
      <div className="tb-empty-icon">
        <Icon name="target" size={36} />
      </div>
      <h2>Start by setting your available time</h2>
      <p>Plan your day around the hours you actually have. Set a window, and we'll help you fit only what fits.</p>
      <button className="tb-btn tb-btn-primary tb-btn-lg" onClick={onSetTime}>
        <Icon name="clock" size={16} /> Set available time
      </button>
    </div>
  </>
);

// ============ Task overview ============
const TaskOverview = ({ state, dispatch }) => {
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('Newest');
  const filtered = state.tasks.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="tb-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div className="tb-row tb-gap-3" style={{ flex: 1, flexWrap: 'wrap' }}>
          <div className="tb-search">
            <Icon name="search" size={16} className="icon" />
            <input placeholder="Search task" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select className="tb-input" style={{ width: 'auto', minWidth: 140 }} value={sort} onChange={e => setSort(e.target.value)}>
            <option>Newest</option>
            <option>Oldest</option>
            <option>Recently Used</option>
            <option>Most time spent</option>
          </select>
        </div>
        <button className="tb-btn tb-btn-primary" onClick={() => dispatch({ type: 'OPEN_TASK', task: null })}>
          <Icon name="plus" size={16} /> New task
        </button>
      </div>

      <div className="tb-card" style={{ padding: 0 }}>
        <table className="tb-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>Activity</th>
              <th>This week</th>
              <th>Frequency</th>
              <th>Best streak</th>
              <th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td><div style={{ width: 12, height: 12, borderRadius: 3, background: t.color }}></div></td>
                <td><strong>{t.name}</strong></td>
                <td className="num">{t.weekHrs} hrs</td>
                <td>{t.freq} times this week</td>
                <td className="num">12 days</td>
                <td>
                  <div className="tb-row tb-gap-2">
                    <button className="tb-btn-icon" onClick={() => dispatch({ type: 'GO_ANALYTICS', taskId: t.id })}><Icon name="chart" size={16} /></button>
                    <button className="tb-btn-icon" onClick={() => dispatch({ type: 'OPEN_TASK', task: t })}><Icon name="edit" size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--tb-text-muted)' }}>No tasks match "{query}"</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ============ Analytics ============
const Analytics = ({ state, dispatch }) => {
  const task = state.tasks.find(t => t.id === state.analyticsTaskId) || state.tasks[0];
  const maxVal = Math.max(...WEEK_BAR_DATA.map(d => Math.max(d.est, d.act)));

  return (
    <>
      <div className="tb-row tb-gap-3" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div className="tb-row tb-gap-3">
          <button className="tb-btn-icon" onClick={() => dispatch({ type: 'GO', screen: 'overview' })}><Icon name="chevronLeft" size={18} /></button>
          <div>
            <div style={{ fontSize: 12, color: 'var(--tb-text-muted)' }}>Analytics</div>
            <h2 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 600 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: task.color, marginRight: 10, verticalAlign: 'middle' }}></span>
              {task.name}
            </h2>
          </div>
        </div>
        <div className="tb-row tb-gap-2">
          <select className="tb-input" style={{ width: 'auto' }} defaultValue="weekly">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="all">All-time</option>
          </select>
          {state.tasks.length > 1 && (
            <select className="tb-input" style={{ width: 'auto' }} value={task.id} onChange={e => dispatch({ type: 'GO_ANALYTICS', taskId: e.target.value })}>
              {state.tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="tb-stat-cards">
        <div className="tb-stat-card"><div className="label">Total spend</div><div className="val">35<span style={{ fontSize: 18, color: 'var(--tb-text-muted)', marginLeft: 4 }}>hrs</span></div><div className="delta">+4 hrs vs last week</div></div>
        <div className="tb-stat-card"><div className="label">Best streak</div><div className="val">12<span style={{ fontSize: 18, color: 'var(--tb-text-muted)', marginLeft: 4 }}>days</span></div><div className="delta">Personal best</div></div>
        <div className="tb-stat-card"><div className="label">Avg session</div><div className="val">52<span style={{ fontSize: 18, color: 'var(--tb-text-muted)', marginLeft: 4 }}>min</span></div><div className="delta">−8 min vs last week</div></div>
        <div className="tb-stat-card"><div className="label">Accuracy</div><div className="val">93<span style={{ fontSize: 18, color: 'var(--tb-text-muted)', marginLeft: 4 }}>%</span></div><div className="delta">Estimation vs actual</div></div>
      </div>

      <div className="tb-card" style={{ padding: 24 }}>
        <div className="tb-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Time tracking</h4>
          <div className="tb-row tb-gap-2">
            <button className="tb-btn-icon"><Icon name="chevronLeft" size={16} /></button>
            <span style={{ fontSize: 13, color: 'var(--tb-text-mid)' }}>2025 Oct 6 — Oct 12</span>
            <button className="tb-btn-icon"><Icon name="chevronRight" size={16} /></button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--tb-text-muted)', marginBottom: 12 }}>Weekly Total: <strong style={{ color: 'var(--tb-text)' }}>15 hrs</strong></div>
        <div className="tb-chart">
          {WEEK_BAR_DATA.map((d, i) => (
            <div key={i} className="tb-chart-col">
              <div className="tb-chart-bars">
                <div className="tb-chart-bar est" style={{ height: `${(d.est / maxVal) * 100}%` }} title={`Estimated ${d.est}h`}></div>
                <div className="tb-chart-bar act" style={{ height: `${(d.act / maxVal) * 100}%`, background: task.color }} title={`Actual ${d.act}h`}></div>
              </div>
              <div className="day">{d.day}</div>
            </div>
          ))}
        </div>
        <div className="tb-chart-legend">
          <span><span className="dot" style={{ background: 'var(--tb-primary-soft)' }}></span> Estimated</span>
          <span><span className="dot" style={{ background: task.color }}></span> Actual</span>
        </div>
      </div>

      <div className="tb-card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--tb-line)', fontWeight: 600 }}>Daily spend</div>
        <table className="tb-table">
          <tbody>
            {DAILY_SPEND.map((d, i) => (
              <tr key={i}>
                <td>{d.date}</td>
                <td className="num" style={{ textAlign: 'right' }}>{d.hrs} hr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ============ Settings ============
const Settings = ({ state, dispatch }) => {
  return (
    <>
      <div className="tb-row tb-gap-3">
        <div className="tb-avatar" style={{ width: 56, height: 56, fontSize: 20 }}>AC</div>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Alex Chen</h2>
          <div style={{ color: 'var(--tb-text-muted)', fontSize: 13 }}>alex@timebudget.app · Joined June 2025</div>
        </div>
      </div>

      <div className="tb-card" style={{ padding: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>Defaults</h4>
        <div className="tb-col tb-gap-4">
          <SettingRow label="Default work window" sub="Used when you don't set one for the day" right={
            <button className="tb-btn tb-btn-sm tb-btn-ghost" onClick={() => dispatch({ type: 'OPEN_TIME' })}>9:00 — 17:00</button>
          } />
          <SettingRow label="Week starts on" right={
            <select className="tb-input" style={{ width: 'auto', height: 36 }} defaultValue="Sunday">
              <option>Sunday</option><option>Monday</option>
            </select>
          } />
          <SettingRow label="Time unit" right={
            <div className="tb-view-toggle">
              <button className="active">Minutes</button>
              <button>Hours</button>
            </div>
          } />
        </div>
      </div>

      <div className="tb-card" style={{ padding: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>Notifications</h4>
        <div className="tb-col tb-gap-4">
          <SettingRow label="Daily planning reminder" sub="Every morning at 8:30" right={<Toggle on />} />
          <SettingRow label="Exceed time warning" sub="When a task runs over estimation" right={<Toggle on />} />
          <SettingRow label="Weekly review" sub="Sunday evenings" right={<Toggle />} />
        </div>
      </div>

      <div className="tb-card" style={{ padding: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>Data</h4>
        <div className="tb-row tb-gap-3" style={{ flexWrap: 'wrap' }}>
          <button className="tb-btn tb-btn-ghost">Export CSV</button>
          <button className="tb-btn tb-btn-ghost">Sync with calendar</button>
          <button className="tb-btn tb-btn-danger-ghost">Clear all data</button>
        </div>
      </div>
    </>
  );
};

const SettingRow = ({ label, sub, right }) => (
  <div className="tb-row" style={{ justifyContent: 'space-between', gap: 16, padding: '4px 0' }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--tb-text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
    <div>{right}</div>
  </div>
);

const Toggle = ({ on: initial = false, onChange }) => {
  const [on, setOn] = React.useState(initial);
  return (
    <button
      onClick={() => { setOn(!on); onChange?.(!on); }}
      style={{
        width: 40, height: 22, borderRadius: 999,
        background: on ? 'var(--tb-primary)' : 'var(--tb-line-strong)',
        position: 'relative', transition: 'background 150ms ease',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: '50%',
        background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.15)', transition: 'left 150ms ease',
      }} />
    </button>
  );
};

Object.assign(window, { DashboardCalm, DashboardHero, EmptyState, TaskOverview, Analytics, Settings });
