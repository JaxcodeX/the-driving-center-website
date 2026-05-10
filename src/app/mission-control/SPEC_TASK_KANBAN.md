# SPEC_TASK_KANBAN — Mission Control Kanban Board

## Kanban Columns
**Recurring | Backlog | In Progress | Review | Done**

Each column header:
```tsx
<div className="flex items-center gap-2 px-3 py-2">
  <span className={`w-2 h-2 rounded-full`} style={{ background: columnColor }} />
  <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>{label}</span>
  <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', color: '#64748B' }}>{count}</span>
  <button className="ml-auto text-sm" style={{ color: '#64748B' }}>+</button>
</div>
```

Column colors:
- Recurring: `#818CF8` (purple)
- Backlog: `#EF4444` (red)
- In Progress: `#006FFF` (blue)
- Review: `#F59E0B` (amber)
- Done: `#10B981` (emerald)

## Task Card Component
```tsx
<div
  className="p-3 rounded-xl cursor-pointer transition-all"
  style={{
    background: '#1A1A1A',
    border: '1px solid rgba(255,255,255,0.06)',
  }}
>
  {/* Status dot + Title */}
  <div className="flex items-start gap-2 mb-1.5">
    <span className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0" style={{ background: statusColor }} />
    <p className="text-sm font-medium leading-snug" style={{ color: '#FFFFFF' }}>
      {truncate(task.title, 80)}
    </p>
  </div>

  {/* Description */}
  {task.description && (
    <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: '#64748B' }}>
      {task.description}
    </p>
  )}

  {/* Footer row */}
  <div className="flex items-center justify-between mt-2">
    <div className="flex items-center gap-1.5">
      <span
        className="text-xs px-2 py-0.5 rounded-full"
        style={{ background: projectBadge.bg, color: projectBadge.text }}
      >
        {task.project}
      </span>
      <span className="text-xs" style={{ color: '#475569' }}>
        {timeAgo(task.updated_at)}
      </span>
    </div>
    {/* Assignee avatar */}
    <span
      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
      style={{ background: assigneeColor, color: '#0F0F0F' }}
    >
      {assigneeInitial}
    </span>
  </div>
</div>
```

## Card Hover State
```css
.task-card:hover {
  border-color: rgba(255,255,255,0.12);
  transform: translateY(-1px);
}
```

## Header KPI Row
```tsx
<div className="flex items-center gap-3 mb-4">
  {[
    { label: 'This week', value: weekCount, color: '#FFFFFF' },
    { label: 'In progress', value: inProgressCount, color: '#006FFF' },
    { label: 'Total', value: totalCount, color: '#94A3B8' },
    { label: 'Completion', value: `${completionPct}%`, color: '#10B981' },
  ].map(kpi => (
    <div key={kpi.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
      style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-xs" style={{ color: '#64748B' }}>{kpi.label}</span>
      <span className="text-sm font-bold" style={{ color: kpi.color }}>{kpi.value}</span>
    </div>
  ))}
</div>
```

## Header Filter Row
- "+ New task" button — blue fill, white text, rounded-full, px-4 py-2
- User filter pills — Cayden (green), Everest (blue), Codex (purple), Subagent (orange)
- "All Projects" dropdown — same styling as user pills with chevron

Active filter pill: `background: color-12, color: white`
Inactive: `background: transparent, border: 1px solid rgba(255,255,255,0.1), color: muted`

## Add Task Modal
- Overlay: `rgba(0,0,0,0.7)` backdrop blur
- Modal card: `#1A1A1A`, rounded-16px, max-w-md, centered
- Fields: title (required), description (textarea), project (select), assignee (select), status (select — defaults to Backlog)
- Cancel + Submit buttons
- On submit: POST /api/mc/tasks → optimistic UI update → log activity

## Column "+" Button
Clicking "+" in column header pre-fills status and opens add modal with that status pre-selected.

## Scroll Behavior
- Each column: max-height with `overflow-y-auto` and custom scrollbar (`#1A1A1A` track, `#333` thumb)
- Cards per column: no artificial limit
- Board: horizontal scroll on overflow with hidden scrollbar

## Responsive
- Desktop: 5 columns side by side
- Tablet: 3 columns visible, horizontal scroll
- Mobile: 2 columns visible, horizontal scroll

## Filter Logic
```
GET /api/mc/tasks returns all → client-side filter by:
- assigned_to (user filter)
- project (project filter)
- status (column)
```

## Avatar Colors
- Cayden: `#10B981` (green)
- Everest: `#006FFF` (blue)
- Codex: `#818CF8` (purple)
- Subagent: `#F59E0B` (orange)

Avatar style: rounded-full, 20px, initial letter in `#0F0F0F` text, colored background
