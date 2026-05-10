# SPEC_OFFICE_PIXEL — Mission Control Pixel Art Office

## Reference
Alex Finn's "Office" view: pixel-art office floor plan with avatar stations for each team member, animated pixel characters, online status dots, and a live activity feed.

---

## Layout
```
┌──────────────────────────────────────────────────────────────────┐
│ [+ Start Chat]                                                    │
│ [Favorites row — 8 grey placeholder squares]                    │
├─────────────────────────────────────┬────────────────────────────┤
│                                     │                            │
│     OFFICE FLOOR (pixel art)         │   LIVE ACTIVITY PANEL      │
│     ~65% width                      │   ~30% width               │
│                                     │                            │
│     [7 desks with pixel avatars,    │   "Live Activity" header   │
│      server rack, conference table,  │   heartbeat icon           │
│      plants, water cooler]          │   Event feed               │
│                                     │   or "No recent activity"  │
│                                     │                            │
└─────────────────────────────────────┴────────────────────────────┘
```

---

## Office Floor Grid

Pixel-art office. Background: dark checkered pattern (`#141414` / `#0F0F0F` alternating 8px squares).

### Furniture (CSS pixel art):
- **Desks** (4x3 blocks): dark grey `#2A2A2A` rectangles with small `#3A3A3A` monitor on top
- **Conference table** (6x4): `#2A2A2A` rectangle with 4 chairs around it
- **Server rack** (2x5): `#1A1A1A` rectangle with small blinking green indicator dot
- **Water cooler** (2x3): `#3A3A3A` body with `#006FFF` blue jug
- **Plants**: green `#10B981` pixel blocks in `#1A1A1A` pots

### 7 Agent Desks

Left-to-right, top row (3 desks) then bottom row (4 desks):

| # | Agent | Color | Online When |
|---|---|---|---|
| 1 | **Cayden** (You) | Green `#10B981` | Always (green dot) |
| 2 | **Everest** (Me) | Blue `#006FFF` | Always (green dot) |
| 3 | **Minimax** | Cyan `#22D3EE` | minimax sub-agent running |
| 4 | **DeepSeek** | Violet `#A78BFA` | deepseek sub-agent running |
| 5 | **Claude Code** | Orange `#F97316` | Claude Code active |
| 6 | **Codex** | Purple `#818CF8` | Codex/olcoder running |
| 7 | **Subagent** | Amber `#F59E0B` | Any other sub-agent running |

**Each desk:**
```
┌─────────────────┐
│  [PIXEL AVATAR] │  ← 32x32 CSS pixel character
│      E          │  ← initial letter in colored pixel box
├─────────────────┤
│    Everest      │  ← agent name, 11px monospace
│    ●            │  ← status dot (green/amber/grey)
└─────────────────┘
```

**Online state:** Avatar plays 2-frame idle bob animation (translateY -2px to 0, 1.5s loop). Status dot = green. Avatar color = full saturation.

**Offline state (inactive sub-agent):** Avatar = grey `#3A3A3A`, 50% opacity, no animation. Status dot = grey `#475569`. Name label muted.

**Standby state:** Status dot = amber `#F59E0B`. Avatar visible at full color but no bob animation.

### Pixel Avatar CSS

```css
@keyframes pixel-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.pixel-avatar {
  display: grid;
  grid-template-columns: repeat(8, 4px);
  grid-template-rows: repeat(8, 4px);
  gap: 0;
}

.pixel-avatar.active {
  animation: pixel-bob 1.5s ease-in-out infinite;
}

.pixel-avatar.inactive {
  opacity: 0.5;
  filter: grayscale(1);
}
```

Simplified approach: colored square avatar (32x32px) with agent initial, CSS animation. Not actual pixel art grid unless it looks too plain.

### Conference Table
- Positioned center-bottom of office floor
- `#2A2A2A` rectangle, 4 empty chairs around it
- No avatars at chairs (agents are at their desks)
- Label: small "Build Council" pill above (muted grey, dashed border — placeholder, not functional yet)

### Server Rack
- Bottom-right corner
- `#1A1A1A` box with blinking green dot (CSS pulse animation)
- Label: "OpenClaw" in tiny muted text

---

## Favorites Row
- 8 placeholder grey squares: 48x48px, `#1A1A1A`, rounded-lg, `border: 1px solid rgba(255,255,255,0.06)`
- "+ Start Chat" button: blue fill, white text, rounded-full, top-left above favorites

---

## Live Activity Panel

```tsx
<div style={{
  background: '#1A1A1A',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}}>
  {/* Header */}
  <div style={{
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  }}>
    <HeartPulse size={14} style={{ color: '#10B981' }} />
    <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>Live Activity</span>
  </div>

  {/* Event feed */}
  <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
    {activity.length === 0 ? (
      <p style={{ color: '#475569', fontSize: '11px', textAlign: 'center', paddingTop: '32px' }}>
        No recent activity
      </p>
    ) : (
      activity.map(entry => (
        <div key={entry.id} style={{
          display: 'flex', alignItems: 'start', gap: '8px',
          padding: '8px 0',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#10B981', marginTop: '4px', flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#94A3B8', fontSize: '12px', lineHeight: 1.4 }}>{entry.action}</p>
            {entry.details && (
              <p style={{ color: '#475569', fontSize: '11px', marginTop: '2px', truncate: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {entry.details}
              </p>
            )}
          </div>
        </div>
      ))
    )}
  </div>
</div>
```

Width: 280px fixed. Height: fills office area.

---

## Agent Status Detection

Poll `subagents(action=list)` every 30 seconds via an API route.

**New route: `GET /api/mc/agent-status`**
Returns:
```json
{
  "agents": {
    "everest": "online",
    "minimax": "online",
    "deepseek": "offline",
    "claudecode": "standby",
    "codex": "offline",
    "subagent": "offline"
  },
  "activeSubagents": []
}
```

Implementation:
- Everest: always "online"
- minimax model running: "online"
- deepseek model running: "online"
- For actual subagent detection: `subagents(action=list)` from OpenClaw tools
- Default all to "offline" unless confirmed active

---

## Office View Navigation

Sidebar "Office" item → shows Office view.
Sidebar "Tasks" item → shows Kanban view.

State: React state `currentView: 'tasks' | 'office'`.

---

## "+ Start Chat" Button
- Shows modal with agent dropdown: Everest / Minimax / DeepSeek / Codex / Claude Code
- On select: `sessions_send` to the relevant agent session
- For now: show "agent selected" toast confirmation, don't actually send

---

## Responsive
- Min-width: 900px for full office layout
- Below 900px: stack office floor above activity panel, 2-column desk grid
