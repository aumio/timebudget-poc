// ============ Donut ============
const Donut = ({ tasks, budgetMins, size = 'md', showRemaining = true }) => {
  const W = 320;
  const cx = W / 2, cy = W / 2;
  const R = 130;
  const SW = 26;
  const C = 2 * Math.PI * R;

  const usedMins = tasks.filter(t => !t.done).reduce((s, t) => s + (t.est || 0), 0);
  const completedMins = tasks.filter(t => t.done).reduce((s, t) => s + (t.actual || t.est || 0), 0);
  const totalPlanned = tasks.reduce((s, t) => s + (t.est || 0), 0);

  const remaining = Math.max(0, budgetMins - completedMins - usedMins);
  const remainingHrs = Math.floor(remaining / 60);
  const remainingMins = remaining % 60;

  // Segments
  let offset = 0;
  const segs = [];
  tasks.forEach(t => {
    const portion = (t.est || 0) / budgetMins;
    const dash = portion * C;
    segs.push({ ...t, dash, offset, completed: t.done });
    offset += dash;
  });

  const isEmpty = tasks.length === 0;

  return (
    <div className={`tb-donut-wrap ${size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : ''}`}>
      <svg viewBox={`0 0 ${W} ${W}`}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={R}
          className="tb-donut-track"
          strokeWidth={SW}
          fill="none"
        />
        {/* Subtle inner ring */}
        <circle cx={cx} cy={cy} r={R - SW - 2}
          stroke="rgba(74,111,227,0.06)"
          strokeWidth="1"
          fill="none"
        />
        {/* Segments */}
        {!isEmpty && segs.map((s, i) => (
          <circle
            key={s.id}
            cx={cx} cy={cy} r={R}
            className="tb-donut-seg"
            stroke={s.color}
            strokeWidth={SW}
            fill="none"
            strokeLinecap="butt"
            strokeDasharray={`${s.dash} ${C}`}
            strokeDashoffset={-s.offset}
            opacity={s.completed ? 0.45 : 1}
          />
        ))}
      </svg>
      <div className="tb-donut-center">
        {showRemaining ? (
          <>
            <div className="tb-donut-label">Remaining</div>
            <div className="tb-donut-value">
              {String(remainingHrs).padStart(2, '0')}:{String(remainingMins).padStart(2, '0')}
            </div>
            <div className="tb-donut-sub">Daily total: <strong>{Math.floor(budgetMins/60)} hrs</strong></div>
          </>
        ) : (
          <>
            <div className="tb-donut-label">Time budget</div>
            <div className="tb-donut-value">{Math.floor(budgetMins/60)} hrs</div>
            <div className="tb-donut-sub">9:00 — 17:00</div>
          </>
        )}
      </div>
    </div>
  );
};

// ============ Week strip ============
const WeekStrip = ({ activeIdx, onPick, date, onPrev, onNext }) => (
  <div className="tb-week">
    {date && (
      <div className="tb-week-header">
        <button className="tb-week-arrow" onClick={onPrev} aria-label="Previous"><Icon name="chevronLeft" size={16} /></button>
        <div className="tb-week-date">{date}</div>
        <button className="tb-week-arrow" onClick={onNext} aria-label="Next"><Icon name="chevronRight" size={16} /></button>
      </div>
    )}
    <div className="tb-week-strip">
      {WEEK_DAYS.map((d) => (
        <button key={d.idx} className={`tb-week-day ${d.idx === activeIdx ? 'active' : ''}`} onClick={() => onPick(d.idx)}>
          <span className="dow">{d.dow}</span>
          <span className="dn">{d.dn}</span>
        </button>
      ))}
    </div>
  </div>
);

// ============ Task row / card ============
const TaskRow = ({ task, onToggle, onEdit, onDelete, dragHandlers }) => (
  <div
    className={`tb-task ${task.done ? 'done' : ''} ${dragHandlers?.dragging ? 'dragging' : ''} ${dragHandlers?.over ? 'over' : ''}`}
    draggable={!!dragHandlers}
    onDragStart={dragHandlers?.onDragStart}
    onDragOver={dragHandlers?.onDragOver}
    onDragLeave={dragHandlers?.onDragLeave}
    onDrop={dragHandlers?.onDrop}
    onDragEnd={dragHandlers?.onDragEnd}
  >
    {dragHandlers && (
      <span className="tb-drag-handle" aria-hidden="true">
        <Icon name="grip" size={14} />
      </span>
    )}
    <button
      className={`tb-check ${task.done ? 'checked' : ''}`}
      onClick={() => onToggle(task.id)}
      aria-label="toggle"
    >
      {task.done && <Icon name="check" size={14} />}
    </button>
    <div className="tb-task-swatch" style={{ background: task.color }}></div>
    <div className="tb-task-body">
      <div className="tb-task-name">{task.name}</div>
      <div className="tb-task-meta">
        <Icon name="clock" size={12} />
        <span>Estimation {formatMins(task.est)}</span>
      </div>
      {task.exceed > 0 && !task.done && (
        <div className="tb-task-exceed">
          <Icon name="flame" size={11} /> Exceed {task.exceed} mins
        </div>
      )}
    </div>
    <button className="tb-btn-icon" onClick={() => onEdit(task)} aria-label="edit"><Icon name="edit" size={16} /></button>
  </div>
);

const TaskCard = ({ task, onToggle, onEdit, dragHandlers }) => (
  <div
    className={`tb-task-card ${task.done ? 'done' : ''} ${dragHandlers?.dragging ? 'dragging' : ''} ${dragHandlers?.over ? 'over' : ''}`}
    draggable={!!dragHandlers}
    onDragStart={dragHandlers?.onDragStart}
    onDragOver={dragHandlers?.onDragOver}
    onDragLeave={dragHandlers?.onDragLeave}
    onDrop={dragHandlers?.onDrop}
    onDragEnd={dragHandlers?.onDragEnd}
  >
    <div className="tb-task-swatch" style={{ background: task.color }}></div>
    <div className="tb-row" style={{ justifyContent: 'space-between' }}>
      <div className="tb-row tb-gap-2" style={{ minWidth: 0 }}>
        {dragHandlers && (
          <span className="tb-drag-handle" aria-hidden="true">
            <Icon name="grip" size={14} />
          </span>
        )}
        <div className="tb-task-name">{task.name}</div>
      </div>
      <button
        className={`tb-check ${task.done ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
      >{task.done && <Icon name="check" size={14} />}</button>
    </div>
    <div className="tb-task-meta">
      <Icon name="clock" size={12} />
      <span>{formatMins(task.est)}</span>
    </div>
    {task.exceed > 0 && !task.done && (
      <div className="tb-task-exceed" style={{ alignSelf: 'flex-start' }}>
        <Icon name="flame" size={11} /> Exceed {task.exceed} mins
      </div>
    )}
    <div className="tb-row" style={{ justifyContent: 'flex-end', marginTop: 'auto', paddingTop: 6 }}>
      <button className="tb-btn-icon" onClick={() => onEdit(task)}><Icon name="edit" size={16} /></button>
    </div>
  </div>
);

// ============ Timeline (draggable blocks) ============
const Timeline = ({ tasks, startHr = 9, endHr = 17, onDrag }) => {
  const totalHrs = endHr - startHr;
  const totalMins = totalHrs * 60;
  const [drag, setDrag] = React.useState(null);
  const ref = React.useRef(null);

  // place each task starting from 9:00 sequentially
  const blocks = React.useMemo(() => {
    let cur = 0;
    return tasks.filter(t => !t.done).map(t => {
      const start = t.startOffset !== undefined ? t.startOffset : cur;
      const block = { ...t, start, dur: t.est };
      cur = start + t.est;
      return block;
    });
  }, [tasks]);

  const onMouseDown = (e, b) => {
    e.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    const startX = e.clientX;
    const initialOffset = b.start;

    setDrag({ id: b.id, x: 0 });

    const move = (ev) => {
      const dx = ev.clientX - startX;
      const minsPerPx = totalMins / rect.width;
      let newStart = Math.round((initialOffset + dx * minsPerPx) / 15) * 15;
      newStart = Math.max(0, Math.min(totalMins - b.dur, newStart));
      onDrag(b.id, newStart);
    };
    const up = () => {
      setDrag(null);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div className="tb-timeline">
      <div className="tb-timeline-head">
        <h4>Today's plan</h4>
        <span className="tb-pill">{startHr}:00 — {endHr}:00 · Drag to reschedule</span>
      </div>
      <div className="tb-timeline-bar" ref={ref}>
        <div className="tb-timeline-hours">
          {Array.from({ length: totalHrs }, (_, i) => (
            <div className="tb-timeline-hour" key={i}>
              <span>{String(startHr + i).padStart(2, '0')}:00</span>
            </div>
          ))}
        </div>
        {blocks.map((b) => {
          const leftPct = (b.start / totalMins) * 100;
          const widthPct = (b.dur / totalMins) * 100;
          return (
            <div
              key={b.id}
              className={`tb-timeline-block ${drag?.id === b.id ? 'dragging' : ''}`}
              style={{ left: `${leftPct}%`, width: `${widthPct}%`, background: b.color }}
              onMouseDown={(e) => onMouseDown(e, b)}
            >
              <div className="tb-tb-title">{b.name}</div>
              <div className="tb-tb-time">{formatHM(startHr * 60 + b.start)} — {formatHM(startHr * 60 + b.start + b.dur)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ Modals ============
const SetTimeModal = ({ open, onClose, onSave, initial }) => {
  const [start, setStart] = React.useState(initial?.start || '09:00');
  const [end, setEnd] = React.useState(initial?.end || '17:00');
  if (!open) return null;
  return (
    <div className="tb-modal-backdrop" onClick={onClose}>
      <div className="tb-modal" onClick={e => e.stopPropagation()}>
        <div className="tb-modal-head">
          <h3>Set available time</h3>
          <button className="tb-btn-icon" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="tb-modal-body">
          <div className="tb-field">
            <label className="tb-field-label">Start time</label>
            <div className="tb-row tb-gap-2" style={{ background: 'var(--tb-bg-tint)', borderRadius: 12, padding: '0 14px', height: 44 }}>
              <Icon name="clock" size={16} />
              <input type="time" value={start} onChange={e => setStart(e.target.value)} style={{ background: 'transparent', border: 'none', flex: 1, fontSize: 14 }} />
            </div>
          </div>
          <div className="tb-field">
            <label className="tb-field-label">End time</label>
            <div className="tb-row tb-gap-2" style={{ background: 'var(--tb-bg-tint)', borderRadius: 12, padding: '0 14px', height: 44 }}>
              <Icon name="clock" size={16} />
              <input type="time" value={end} onChange={e => setEnd(e.target.value)} style={{ background: 'transparent', border: 'none', flex: 1, fontSize: 14 }} />
            </div>
          </div>
        </div>
        <div className="tb-modal-foot">
          <button className="tb-btn tb-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="tb-btn tb-btn-primary" onClick={() => onSave(start, end)}>Save</button>
        </div>
      </div>
    </div>
  );
};

const EditTaskModal = ({ open, onClose, onSave, onDelete, task }) => {
  const [name, setName] = React.useState(task?.name || '');
  const [color, setColor] = React.useState(task?.color || TASK_COLORS[0]);
  const [est, setEst] = React.useState(task?.est || 60);
  const [actual, setActual] = React.useState(task?.actual || 0);

  React.useEffect(() => {
    if (task) {
      setName(task.name || '');
      setColor(task.color || TASK_COLORS[0]);
      setEst(task.est || 60);
      setActual(task.actual || 0);
    } else {
      setName(''); setColor(TASK_COLORS[0]); setEst(60); setActual(0);
    }
  }, [task, open]);

  if (!open) return null;
  const isEdit = !!task?.id;
  return (
    <div className="tb-modal-backdrop" onClick={onClose}>
      <div className="tb-modal" onClick={e => e.stopPropagation()}>
        <div className="tb-modal-head">
          <h3>{isEdit ? 'Edit Task' : 'Add Task'}</h3>
          <button className="tb-btn-icon" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="tb-modal-body">
          <div className="tb-field">
            <label className="tb-field-label">Activity name</label>
            <div className="tb-row tb-gap-2">
              <input className="tb-input" placeholder="e.g. Reading" value={name} onChange={e => setName(e.target.value)} />
              <ColorPicker value={color} onChange={setColor} />
            </div>
          </div>
          <div className="tb-field">
            <label className="tb-field-label">Estimation (minutes)</label>
            <div className="tb-row tb-gap-2" style={{ background: 'var(--tb-bg-tint)', borderRadius: 12, padding: '0 14px', height: 44 }}>
              <Icon name="clock" size={16} />
              <input type="number" min="0" step="15" value={est} onChange={e => setEst(Number(e.target.value))} style={{ background: 'transparent', border: 'none', flex: 1, fontSize: 14 }} />
              <span style={{ color: 'var(--tb-text-muted)', fontSize: 12 }}>{formatMins(est)}</span>
            </div>
          </div>
          <div className="tb-field">
            <label className="tb-field-label">Actual (minutes)</label>
            <div className="tb-row tb-gap-2" style={{ background: 'var(--tb-bg-tint)', borderRadius: 12, padding: '0 14px', height: 44 }}>
              <Icon name="clock" size={16} />
              <input type="number" min="0" step="5" value={actual} onChange={e => setActual(Number(e.target.value))} style={{ background: 'transparent', border: 'none', flex: 1, fontSize: 14 }} />
              <span style={{ color: 'var(--tb-text-muted)', fontSize: 12 }}>{actual ? formatMins(actual) : '—'}</span>
            </div>
          </div>
        </div>
        <div className="tb-modal-foot" style={{ justifyContent: isEdit ? 'space-between' : 'flex-end' }}>
          {isEdit && <button className="tb-btn tb-btn-danger-ghost" onClick={() => onDelete(task.id)}>Delete</button>}
          <div className="tb-row tb-gap-2">
            <button className="tb-btn tb-btn-ghost" onClick={onClose}>Cancel</button>
            <button className="tb-btn tb-btn-primary" onClick={() => onSave({ id: task?.id, name, color, est, actual })}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorPicker = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 44, height: 44, borderRadius: 12, background: value,
          border: '2px solid white', boxShadow: '0 0 0 1px var(--tb-line-strong)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
        }}
      >
        <Icon name="check" size={14} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 10,
          background: 'white', borderRadius: 12, padding: 8, boxShadow: 'var(--tb-shadow-lg)',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, border: '1px solid var(--tb-line)'
        }}>
          {TASK_COLORS.map(c => (
            <button
              key={c}
              onClick={() => { onChange(c); setOpen(false); }}
              style={{
                width: 28, height: 28, borderRadius: 8, background: c,
                border: c === value ? '2px solid var(--tb-text)' : '2px solid transparent',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { Donut, WeekStrip, TaskRow, TaskCard, Timeline, SetTimeModal, EditTaskModal });

// ============ Sortable hook (drag to reorder) ============
function useSortable(items, onReorder) {
  const [draggingId, setDraggingId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);

  return (id) => ({
    dragging: draggingId === id,
    over: overId === id && draggingId !== id,
    onDragStart: (e) => {
      setDraggingId(id);
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', id); } catch (err) {}
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (overId !== id) setOverId(id);
    },
    onDragLeave: () => {
      if (overId === id) setOverId(null);
    },
    onDrop: (e) => {
      e.preventDefault();
      if (draggingId && draggingId !== id) {
        const from = items.findIndex(t => t.id === draggingId);
        const to = items.findIndex(t => t.id === id);
        if (from > -1 && to > -1) {
          const next = [...items];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          onReorder(next);
        }
      }
      setDraggingId(null);
      setOverId(null);
    },
    onDragEnd: () => {
      setDraggingId(null);
      setOverId(null);
    },
  });
}

window.useSortable = useSortable;
