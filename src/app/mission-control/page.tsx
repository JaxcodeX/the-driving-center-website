'use client'

import { useState, useEffect, useCallback } from 'react'
import { LayoutGrid, Calendar, FolderKanban, Brain, FileText, Armchair, Users, Plus, X, ChevronDown } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────
type Task = {
  id: string
  title: string
  description?: string | null
  project: string
  assignee: string
  status: string
  last_activity?: string | null
  created_at: string
  updated_at: string
}

type ActivityEntry = {
  id: string
  action: string
  details: string | null
  source: string
  status: string
  created_at: string
}

type AgentStatus = Record<string, 'online' | 'offline' | 'standby'>

type CurrentView = 'tasks' | 'office'

// ── Design Tokens ────────────────────────────────────────────────────
const TOKENS = {
  bg: '#0F0F0F',
  surface: '#1A1A1A',
  border: 'rgba(255,255,255,0.06)',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  blue: '#006FFF',
  purple: '#818CF8',
  red: '#EF4444',
  amber: '#F59E0B',
  emerald: '#10B981',
  cyan: '#22D3EE',
  violet: '#A78BFA',
  orange: '#F97316',
}

// ── Column Config ────────────────────────────────────────────────────
const COLUMNS = [
  { key: 'recurring', label: 'Recurring', color: TOKENS.purple },
  { key: 'todo', label: 'Backlog', color: TOKENS.red },
  { key: 'in_progress', label: 'In Progress', color: TOKENS.blue },
  { key: 'review', label: 'Review', color: TOKENS.amber },
  { key: 'done', label: 'Done', color: TOKENS.emerald },
]

const PROJECT_COLORS: Record<string, { bg: string; text: string }> = {
  saas: { bg: 'rgba(0,111,255,0.12)', text: TOKENS.blue },
  fso: { bg: 'rgba(129,140,248,0.12)', text: TOKENS.purple },
  personal: { bg: 'rgba(16,185,129,0.12)', text: TOKENS.emerald },
  admin: { bg: 'rgba(255,255,255,0.05)', text: TOKENS.textMuted },
  openclaw: { bg: 'rgba(249,115,22,0.12)', text: TOKENS.orange },
}

const ASSIGNEE_COLORS: Record<string, string> = {
  cayden: TOKENS.emerald,
  everest: TOKENS.blue,
  codex: TOKENS.purple,
  subagent: TOKENS.amber,
  minimax: TOKENS.cyan,
  deepseek: TOKENS.violet,
  claudecode: TOKENS.orange,
}

const USER_FILTERS = [
  { id: 'all', label: 'All', color: TOKENS.textMuted },
  { id: 'cayden', label: 'Cayden', color: TOKENS.emerald },
  { id: 'everest', label: 'Everest', color: TOKENS.blue },
  { id: 'codex', label: 'Codex', color: TOKENS.purple },
  { id: 'subagent', label: 'Subagent', color: TOKENS.amber },
]

const PROJECT_OPTIONS = ['All Projects', 'SaaS', 'FSO', 'Personal', 'Admin', 'OpenClaw']

// ── API Helpers ─────────────────────────────────────────────────────
async function fetchTasks(): Promise<Task[]> {
  const res = await fetch('/api/mc/tasks')
  if (!res.ok) return []
  const json = await res.json()
  return json.tasks ?? []
}

async function createTask(data: Partial<Task>): Promise<Task | null> {
  const res = await fetch('/api/mc/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.task ?? null
}

async function updateTask(id: string, data: Partial<Task>): Promise<void> {
  await fetch(`/api/mc/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

async function fetchActivity(): Promise<ActivityEntry[]> {
  const res = await fetch('/api/mc/activity')
  if (!res.ok) return []
  const json = await res.json()
  return json.entries ?? []
}

async function fetchAgentStatus(): Promise<AgentStatus> {
  const res = await fetch('/api/mc/agent-status')
  if (!res.ok) return {}
  const json = await res.json()
  return json.agents ?? {}
}

async function logActivity(action: string, details?: string, source = 'Everest'): Promise<void> {
  await fetch('/api/mc/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, details, source, status: 'active' }),
  })
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ── Sidebar Component ───────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { id: 'tasks', label: 'Tasks', icon: LayoutGrid },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'docs', label: 'Docs', icon: FileText },
  { id: 'office', label: 'Office', icon: Armchair },
  { id: 'team', label: 'Team', icon: Users },
]

function Sidebar({ currentView, onViewChange }: { currentView: CurrentView; onViewChange: (v: CurrentView) => void }) {
  return (
    <aside
      className="flex flex-col h-screen flex-shrink-0"
      style={{
        width: 200,
        background: TOKENS.surface,
        borderRight: `1px solid ${TOKENS.border}`,
      }}
    >
      {/* Logo */}
      <div className="px-4 py-5" style={{ borderBottom: `1px solid ${TOKENS.border}` }}>
        <p className="text-base font-bold tracking-tight" style={{ color: TOKENS.textPrimary, fontFamily: 'Outfit, sans-serif' }}>
          Mission Control
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {SIDEBAR_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = item.id === currentView
          const isClickable = item.id === 'tasks' || item.id === 'office'
          return (
            <button
              key={item.id}
              onClick={() => isClickable && onViewChange(item.id as CurrentView)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: isActive ? TOKENS.textPrimary : isClickable ? TOKENS.textSecondary : TOKENS.textMuted,
                cursor: isClickable ? 'pointer' : 'default',
                opacity: isClickable ? 1 : 0.5,
              }}
            >
              <Icon size={15} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom badge */}
      <div
        className="px-4 py-4 flex items-center gap-2"
        style={{ borderTop: `1px solid ${TOKENS.border}` }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: TOKENS.blue, color: TOKENS.bg }}
        >
          E
        </div>
        <span className="text-xs" style={{ color: TOKENS.textMuted }}>Everest</span>
      </div>
    </aside>
  )
}

// ── KPI Header ──────────────────────────────────────────────────────
function KpiRow({ tasks }: { tasks: Task[] }) {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const weekCount = tasks.filter(t => new Date(t.created_at) >= weekAgo).length
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length
  const totalCount = tasks.length
  const doneCount = tasks.filter(t => t.status === 'done').length
  const completionPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  const pills = [
    { label: 'This week', value: weekCount, color: TOKENS.textPrimary },
    { label: 'In progress', value: inProgressCount, color: TOKENS.blue },
    { label: 'Total', value: totalCount, color: TOKENS.textSecondary },
    { label: 'Completion', value: `${completionPct}%`, color: TOKENS.emerald },
  ]

  return (
    <div className="flex items-center gap-3 mb-5">
      {pills.map(pill => (
        <div
          key={pill.label}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}` }}
        >
          <span className="text-xs" style={{ color: TOKENS.textMuted }}>{pill.label}</span>
          <span className="text-sm font-bold" style={{ color: pill.color }}>{pill.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Filter Row ──────────────────────────────────────────────────────
function FilterRow({
  userFilter,
  projectFilter,
  onUserChange,
  onProjectChange,
  onNewTask,
}: {
  userFilter: string
  projectFilter: string
  onUserChange: (v: string) => void
  onProjectChange: (v: string) => void
  onNewTask: () => void
}) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      {/* New task */}
      <button
        onClick={onNewTask}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={{ background: TOKENS.blue, color: '#FFFFFF' }}
      >
        <Plus size={14} />
        New task
      </button>

      {/* User filters */}
      <div className="flex items-center gap-1.5">
        {USER_FILTERS.map(user => (
          <button
            key={user.id}
            onClick={() => onUserChange(user.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: userFilter === user.id ? `${user.color}22` : 'transparent',
              border: `1px solid ${userFilter === user.id ? user.color : 'rgba(255,255,255,0.1)'}`,
              color: userFilter === user.id ? user.color : TOKENS.textMuted,
            }}
          >
            {user.label}
          </button>
        ))}
      </div>

      {/* Project dropdown */}
      <div className="relative ml-auto">
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: projectFilter !== 'All Projects' ? `${TOKENS.blue}22` : 'transparent',
            border: `1px solid ${projectFilter !== 'All Projects' ? TOKENS.blue : 'rgba(255,255,255,0.1)'}`,
            color: projectFilter !== 'All Projects' ? TOKENS.blue : TOKENS.textMuted,
          }}
        >
          {projectFilter}
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  )
}

// ── Task Card ────────────────────────────────────────────────────────
function TaskCard({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, status: string) => void }) {
  const col = COLUMNS.find(c => c.key === task.status)
  const statusColor = col?.color ?? TOKENS.textMuted
  const pColors = PROJECT_COLORS[task.project.toLowerCase()] ?? PROJECT_COLORS.admin
  const assigneeColor = ASSIGNEE_COLORS[(task.assignee || '').toLowerCase()] ?? TOKENS.textMuted
  const assigneeInitial = (task.assignee?.charAt(0) || '?').toUpperCase()

  return (
    <div
      className="p-3 rounded-xl cursor-pointer transition-all"
      style={{
        background: TOKENS.surface,
        border: `1px solid ${TOKENS.border}`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = TOKENS.border
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Status dot + Title */}
      <div className="flex items-start gap-2 mb-1.5">
        <span
          className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0"
          style={{ background: statusColor }}
        />
        <p className="text-sm font-medium leading-snug" style={{ color: TOKENS.textPrimary }}>
          {task.title.length > 80 ? task.title.slice(0, 80) + '…' : task.title}
        </p>
      </div>

      {/* Description */}
      {task.description && (
        <p
          className="text-xs leading-relaxed line-clamp-2 mb-2"
          style={{ color: TOKENS.textMuted }}
        >
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: pColors.bg, color: pColors.text }}
          >
            {task.project}
          </span>
          <span className="text-xs" style={{ color: '#475569' }}>
            {timeAgo(task.updated_at)}
          </span>
        </div>
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: assigneeColor, color: TOKENS.bg }}
        >
          {assigneeInitial}
        </span>
      </div>
    </div>
  )
}

// ── Kanban Column ────────────────────────────────────────────────────
function KanbanColumn({
  column,
  tasks,
  onAddToColumn,
  onStatusChange,
}: {
  column: (typeof COLUMNS)[0]
  tasks: Task[]
  onAddToColumn: (status: string) => void
  onStatusChange: (id: string, status: string) => void
}) {
  return (
    <div
      className="flex flex-col flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        width: 280,
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${TOKENS.border}`,
      }}
    >
      {/* Column header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: `1px solid ${TOKENS.border}` }}
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: column.color }} />
        <span className="text-sm font-semibold" style={{ color: TOKENS.textPrimary }}>{column.label}</span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-md"
          style={{ background: 'rgba(255,255,255,0.06)', color: TOKENS.textMuted }}
        >
          {tasks.length}
        </span>
        <button
          className="ml-auto text-sm transition-colors"
          style={{ color: TOKENS.textMuted }}
          onClick={() => onAddToColumn(column.key)}
          onMouseEnter={e => (e.currentTarget.style.color = TOKENS.textPrimary)}
          onMouseLeave={e => (e.currentTarget.style.color = TOKENS.textMuted)}
        >
          +
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {tasks.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: TOKENS.textMuted }}>No tasks</p>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </div>
  )
}

// ── Add Task Modal ───────────────────────────────────────────────────
function AddTaskModal({
  defaultStatus,
  onClose,
  onSubmit,
}: {
  defaultStatus: string
  onClose: () => void
  onSubmit: (data: Partial<Task>) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [project, setProject] = useState('personal')
  const [assignee, setAssignee] = useState('everest')
  const [status, setStatus] = useState(defaultStatus || 'backlog')

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({ title, description: description || null, project, assignee, status })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}` }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold" style={{ color: TOKENS.textPrimary }}>New Task</h2>
          <button onClick={onClose} style={{ color: TOKENS.textMuted }}><X size={16} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: TOKENS.textSecondary }}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: TOKENS.bg,
                border: `1px solid ${TOKENS.border}`,
                color: TOKENS.textPrimary,
              }}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: TOKENS.textSecondary }}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{
                background: TOKENS.bg,
                border: `1px solid ${TOKENS.border}`,
                color: TOKENS.textPrimary,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: TOKENS.textSecondary }}>Project</label>
              <select
                value={project}
                onChange={e => setProject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.border}`, color: TOKENS.textPrimary }}
              >
                {PROJECT_OPTIONS.filter(p => p !== 'All Projects').map(p => (
                  <option key={p} value={p.toLowerCase()}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: TOKENS.textSecondary }}>Assignee</label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.border}`, color: TOKENS.textPrimary }}
              >
                {USER_FILTERS.filter(u => u.id !== 'all').map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: TOKENS.textSecondary }}>Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.border}`, color: TOKENS.textPrimary }}
            >
              {COLUMNS.map(col => (
                <option key={col.key} value={col.key}>{col.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm"
            style={{ color: TOKENS.textSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: TOKENS.blue, color: '#FFFFFF' }}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Office View ─────────────────────────────────────────────────────
const AGENT_DESKS = [
  { id: 'cayden', name: 'Cayden', color: TOKENS.emerald, subtitle: 'Product · You' },
  { id: 'everest', name: 'Everest', color: TOKENS.blue, subtitle: 'Operator · Me' },
  { id: 'minimax', name: 'Minimax', color: TOKENS.cyan, subtitle: 'Model Agent' },
  { id: 'deepseek', name: 'DeepSeek', color: TOKENS.violet, subtitle: 'Model Agent' },
  { id: 'claudecode', name: 'Claude Code', color: TOKENS.orange, subtitle: 'Coding Agent' },
  { id: 'codex', name: 'Codex', color: TOKENS.purple, subtitle: 'Coding Agent' },
  { id: 'subagent', name: 'Subagent', color: TOKENS.amber, subtitle: 'Worker' },
]

function PixelAvatar({ agent, status }: { agent: typeof AGENT_DESKS[0]; status: string }) {
  const isOnline = status === 'online'
  const isStandby = status === 'standby'

  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{ opacity: status === 'offline' ? 0.4 : 1 }}
    >
      <div
        className="relative flex items-center justify-center rounded-lg"
        style={{
          width: 40,
          height: 40,
          background: status === 'offline' ? '#3A3A3A' : agent.color,
          transition: 'background 0.3s',
        }}
      >
        <span
          className="text-sm font-bold"
          style={{ color: status === 'offline' ? '#666' : TOKENS.bg, fontFamily: 'monospace' }}
        >
          {agent.name.charAt(0)}
        </span>
        {isStandby && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
            style={{ background: TOKENS.amber }}
          />
        )}
        {isOnline && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
            style={{ background: TOKENS.emerald }}
          />
        )}
      </div>
      <span
        className="text-xs font-medium"
        style={{
          color: status === 'offline' ? TOKENS.textMuted : TOKENS.textSecondary,
          fontFamily: 'monospace',
          fontSize: 10,
        }}
      >
        {agent.name}
      </span>
    </div>
  )
}

function OfficeView({ agentStatus }: { agentStatus: AgentStatus }) {
  return (
    <div className="flex h-full gap-4" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Office floor */}
      <div
        className="flex-1 rounded-xl p-5 overflow-hidden"
        style={{
          background: TOKENS.surface,
          border: `1px solid ${TOKENS.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: TOKENS.blue, color: '#FFFFFF' }}
          >
            <Plus size={14} />
            Start Chat
          </button>
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${TOKENS.border}` }}
              />
            ))}
          </div>
        </div>

        {/* Office grid */}
        <div
          className="flex-1 rounded-lg p-6 relative overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            backgroundColor: '#141414',
          }}
        >
          {/* Top row desks */}
          <div className="flex gap-6 justify-center mb-8">
            {AGENT_DESKS.slice(0, 3).map(agent => (
              <div key={agent.id} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: '#2A2A2A', border: `1px solid rgba(255,255,255,0.06)` }}
                >
                  <PixelAvatar
                    agent={agent}
                    status={agentStatus[agent.id] ?? 'offline'}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Conference table */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'transparent',
                  border: '1px dashed rgba(255,255,255,0.15)',
                  color: TOKENS.textMuted,
                  fontSize: 10,
                }}
              >
                Build Council
              </span>
              <div
                className="w-32 h-16 rounded-lg"
                style={{ background: '#2A2A2A', border: `1px solid rgba(255,255,255,0.08)` }}
              />
            </div>
          </div>

          {/* Bottom row desks */}
          <div className="flex gap-6 justify-center">
            {AGENT_DESKS.slice(3).map(agent => (
              <div key={agent.id} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: '#2A2A2A', border: `1px solid rgba(255,255,255,0.06)` }}
                >
                  <PixelAvatar
                    agent={agent}
                    status={agentStatus[agent.id] ?? 'offline'}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Server rack bottom-right */}
          <div
            className="absolute bottom-4 right-4 flex flex-col items-center gap-1"
          >
            <div
              className="w-8 h-16 rounded-md"
              style={{ background: '#1A1A1A', border: `1px solid rgba(255,255,255,0.08)` }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full m-1"
                style={{ background: TOKENS.emerald, animation: 'blink 2s ease-in-out infinite' }}
              />
            </div>
            <span className="text-xs" style={{ color: TOKENS.textMuted, fontSize: 9 }}>OpenClaw</span>
          </div>

          {/* Water cooler bottom-left */}
          <div
            className="absolute bottom-4 left-4 flex flex-col items-center gap-1"
          >
            <div
              className="w-6 h-10 rounded-md"
              style={{ background: '#3A3A3A', border: `1px solid rgba(255,255,255,0.06)` }}
            />
            <span className="text-xs" style={{ color: TOKENS.textMuted, fontSize: 9 }}>H₂O</span>
          </div>
        </div>
      </div>

      {/* Live Activity Panel */}
      <LiveActivityPanel />
    </div>
  )
}

// ── Live Activity Panel ─────────────────────────────────────────────
function LiveActivityPanel() {
  const [activity, setActivity] = useState<ActivityEntry[]>([])

  useEffect(() => {
    fetchActivity().then(setActivity)
    const interval = setInterval(() => fetchActivity().then(setActivity), 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden flex-shrink-0"
      style={{
        width: 280,
        background: TOKENS.surface,
        border: `1px solid ${TOKENS.border}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${TOKENS.border}` }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: TOKENS.emerald, animation: 'pulse-dot 2s ease-in-out infinite' }}
        />
        <span className="text-sm font-semibold" style={{ color: TOKENS.textPrimary }}>Live Activity</span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-0">
        {activity.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: TOKENS.textMuted }}>
            No recent activity
          </p>
        ) : (
          activity.map(entry => (
            <div
              key={entry.id}
              className="flex items-start gap-2 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                style={{ background: entry.status === 'active' ? TOKENS.emerald : TOKENS.textMuted }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed" style={{ color: TOKENS.textSecondary }}>
                  {entry.action}
                </p>
                {entry.details && (
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: TOKENS.textMuted }}
                  >
                    {entry.details}
                  </p>
                )}
                <p className="text-xs mt-1" style={{ color: '#334155' }}>
                  {entry.source} · {timeAgo(entry.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────
export default function MissionControlPage() {
  const [currentView, setCurrentView] = useState<CurrentView>('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({})
  const [loading, setLoading] = useState(true)
  const [userFilter, setUserFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('All Projects')
  const [showAddModal, setShowAddModal] = useState(false)
  const [addModalStatus, setAddModalStatus] = useState('todo')

  const loadAll = useCallback(async () => {
    const [tasksData, statusData] = await Promise.all([
      fetchTasks(),
      fetchAgentStatus(),
    ])
    setTasks(tasksData)
    setAgentStatus(statusData)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
    const interval = setInterval(loadAll, 30000)
    return () => clearInterval(interval)
  }, [loadAll])

  const handleStatusChange = async (id: string, status: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    await updateTask(id, { status })
    await logActivity('Task status updated', `Moved to ${status}`, 'Everest')
  }

  const handleAddTask = async (data: Partial<Task>) => {
    const task = await createTask(data)
    if (task) {
      setTasks(prev => [task, ...prev])
      setShowAddModal(false)
      await logActivity('Task created', task.title, 'Everest')
    }
  }

  const handleAddToColumn = (status: string) => {
    setAddModalStatus(status)
    setShowAddModal(true)
  }

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (userFilter !== 'all' && t.assignee !== userFilter) return false
    if (projectFilter !== 'All Projects' && t.project.toLowerCase() !== projectFilter.toLowerCase()) return false
    return true
  })

  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.key] = filteredTasks.filter(t => t.status === col.key)
    return acc
  }, {} as Record<string, Task[]>)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: TOKENS.bg }}>
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top padding */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-sm" style={{ color: TOKENS.textMuted }}>Loading…</p>
          ) : currentView === 'tasks' ? (
            <>
              <KpiRow tasks={tasks} />
              <FilterRow
                userFilter={userFilter}
                projectFilter={projectFilter}
                onUserChange={setUserFilter}
                onProjectChange={setProjectFilter}
                onNewTask={() => { setAddModalStatus('backlog'); setShowAddModal(true) }}
              />

              {/* Kanban board */}
              <div
                className="flex gap-4 overflow-x-auto pb-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: `${TOKENS.surface} transparent` }}
              >
                {COLUMNS.map(col => (
                  <KanbanColumn
                    key={col.key}
                    column={col}
                    tasks={tasksByColumn[col.key] ?? []}
                    onAddToColumn={handleAddToColumn}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </>
          ) : (
            <OfficeView agentStatus={agentStatus} />
          )}
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal
          defaultStatus={addModalStatus}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTask}
        />
      )}

      {/* Global animations */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
    </div>
  )
}