'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, LayoutDashboard, LogOut, ChevronRight, Clock, CheckCircle2, AlertCircle, PlayCircle, Plus } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────
type Task = {
  id: string
  title: string
  project: 'saas' | 'fso' | 'personal' | 'admin'
  assigned_to: 'me' | 'everest' | 'subagent'
  status: 'todo' | 'in_progress' | 'done'
  last_activity: string | null
  created_at: string
  updated_at: string
}

type CalendarEvent = {
  id: string
  title: string
  start_time: string
  end_time: string | null
  event_type: 'work_window' | 'cron' | 'deadline' | 'scheduled'
  source: string
  recurring: boolean
  metadata: Record<string, any> | null
}

type ActivityEntry = {
  id: string
  action: string
  details: string | null
  source: string
  status: string
  created_at: string
}

// ── Supabase Client ─────────────────────────────────────────────────
function createClient() {
  return {
    tasks: { url: '/api/mc/tasks', get: null as any, post: null as any },
    events: { url: '/api/mc/events', get: null as any, post: null as any },
    activity: { url: '/api/mc/activity', get: null as any, post: null as any },
  }
}

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

async function fetchEvents(): Promise<CalendarEvent[]> {
  const res = await fetch('/api/mc/events')
  if (!res.ok) return []
  const json = await res.json()
  return json.events ?? []
}

async function fetchActivity(): Promise<ActivityEntry[]> {
  const res = await fetch('/api/mc/activity')
  if (!res.ok) return []
  const json = await res.json()
  return json.entries ?? []
}

async function logActivity(action: string, details?: string, source = 'Everest'): Promise<void> {
  await fetch('/api/mc/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, details, source, status: 'active' }),
  })
}

// ── Components ───────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-[#10B981]',
    in_progress: 'bg-[#006FFF]',
    todo: 'bg-[#94A3B8]',
    done: 'bg-[#10B981]',
    error: 'bg-[#EF4444]',
    pending: 'bg-[#F59E0B]',
    idle: 'bg-[#94A3B8]',
  }
  return <span className={`w-2 h-2 rounded-full ${colors[status] ?? 'bg-[#94A3B8]'} flex-shrink-0`} />
}

function TaskCard({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, status: string) => void }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    todo: { bg: 'rgba(255,255,255,0.05)', text: '#94A3B8' },
    in_progress: { bg: 'rgba(0,111,255,0.12)', text: '#006FFF' },
    done: { bg: 'rgba(16,185,129,0.12)', text: '#4ADE80' },
  }
  const colors = statusColors[task.status] ?? statusColors.todo

  const projectColors: Record<string, { bg: string; text: string }> = {
    saas: { bg: 'rgba(0,111,255,0.12)', text: '#006FFF' },
    fso: { bg: 'rgba(129,140,248,0.12)', text: '#818CF8' },
    personal: { bg: 'rgba(16,185,129,0.12)', text: '#4ADE80' },
    admin: { bg: 'rgba(255,255,255,0.05)', text: '#94A3B8' },
  }
  const pColors = projectColors[task.project] ?? projectColors.admin

  return (
    <div className="glass-card" style={{ padding: '14px' }}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium flex-1 leading-snug" style={{ color: '#ffffff' }}>{task.title}</p>
        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: colors.bg, color: colors.text }}>
          {task.status === 'in_progress' ? 'in progress' : task.status}
        </span>
      </div>
      {task.last_activity && (
        <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: '#64748B' }}>{task.last_activity}</p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: pColors.bg, color: pColors.text }}>{task.project}</span>
        <span className="text-xs flex-shrink-0" style={{ color: '#64748B' }}>{new Date(task.updated_at).toLocaleDateString()}</span>
      </div>
      {/* Quick status change */}
      <div className="mt-3 pt-3 flex gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {(['todo', 'in_progress', 'done'] as const).map(s => (
          <button key={s} onClick={() => onStatusChange(task.id, s)}
            className="flex-1 text-xs py-1.5 rounded-md transition-colors"
            style={{
              background: task.status === s ? colors.bg : 'rgba(255,255,255,0.03)',
              color: task.status === s ? colors.text : '#64748B',
            }}>
            {s === 'in_progress' ? '▶' : s === 'done' ? '✓' : '○'} {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function EventRow({ event }: { event: CalendarEvent }) {
  const typeColors: Record<string, string> = {
    work_window: 'bg-[#10B981]',
    cron: 'bg-[#006FFF]',
    deadline: 'bg-[#EF4444]',
    scheduled: 'bg-[#818CF8]',
  }
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${typeColors[event.event_type] ?? 'bg-[#94A3B8]'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate" style={{ color: '#E2E8F0' }}>{event.title}</p>
          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
            {event.start_time ? new Date(event.start_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}
            {event.recurring && ' · 🔄'}
          </p>
        </div>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B' }}>
        {event.event_type}
      </span>
    </div>
  )
}

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const statusMap: Record<string, string> = {
    active: 'text-[#10B981]',
    done: 'text-[#10B981]',
    pending: 'text-[#F59E0B]',
    error: 'text-[#EF4444]',
    idle: 'text-[#94A3B8]',
  }
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <StatusDot status={entry.status} />
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed" style={{ color: '#E2E8F0' }}>{entry.action}</p>
        {entry.details && <p className="text-xs mt-1 line-clamp-2" style={{ color: '#64748B' }}>{entry.details}</p>}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs" style={{ color: '#475569' }}>{entry.source}</span>
          <span className="text-xs" style={{ color: '#334155' }}>·</span>
          <span className={`text-xs font-medium ${statusMap[entry.status] ?? 'text-[#94A3B8]'}`}>{entry.status}</span>
          <span className="text-xs" style={{ color: '#334155' }}>·</span>
          <span className="text-xs" style={{ color: '#334155' }}>
            {new Date(entry.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────
export default function MissionControlPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', project: 'saas' as Task['project'], assigned_to: 'everest' as Task['assigned_to'] })
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const loadAll = useCallback(async () => {
    const [tasksData, eventsData, activityData] = await Promise.all([
      fetchTasks(),
      fetchEvents(),
      fetchActivity(),
    ])
    setTasks(tasksData)
    setEvents(eventsData)
    setActivity(activityData)
    setLoading(false)
    setLastRefresh(new Date())
  }, [])

  useEffect(() => {
    loadAll()
    const interval = setInterval(loadAll, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [loadAll])

  const handleStatusChange = async (id: string, status: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: status as Task['status'] } : t))
    await updateTask(id, { status: status as Task['status'] })
    await logActivity(`Task status updated`, `Moved to ${status}`, 'Everest')
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return
    const task = await createTask({ ...newTask, status: 'todo' })
    if (task) {
      setTasks(prev => [task, ...prev])
      setNewTask({ title: '', project: 'saas', assigned_to: 'everest' })
      setShowAddTask(false)
      await logActivity(`Task created`, newTask.title, 'Everest')
    }
  }

  const myTasks = tasks.filter(t => t.assigned_to === 'me')
  const everestTasks = tasks.filter(t => t.assigned_to !== 'me')
  const upcomingEvents = events.filter(e => e.start_time && new Date(e.start_time) > new Date()).slice(0, 6)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0D0D12', backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(0,111,255,0.06) 0%, transparent 55%)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Mission Control</h1>
            <p className="mt-1 text-sm" style={{ color: '#64748B' }}>
              {tasks.length} tasks · {upcomingEvents.length} upcoming · updated {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors" style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}>
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
            <button onClick={loadAll} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors" style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: '#94A3B8' }}>Loading mission control...</p>
        ) : (
          <>
            {/* Tasks Grid — Mine + Everest side by side */}
            <div className="grid grid-cols-2 gap-5 mb-6">
              {/* My Tasks */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    My Tasks
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>{myTasks.length}</span>
                  </h2>
                  <button onClick={() => setShowAddTask(true)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                    <Plus size={12} /> Add Task
                  </button>
                </div>
                <div className="space-y-3">
                  {myTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm" style={{ color: '#64748B' }}>No tasks assigned to you</p>
                      <button onClick={() => setShowAddTask(true)} className="mt-2 text-xs" style={{ color: '#10B981' }}>+ Add your first task</button>
                    </div>
                  ) : (
                    myTasks.map(task => <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />)
                  )}
                </div>
              </div>

              {/* Everest / Subagent Tasks */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
                    <span className="w-2 h-2 rounded-full bg-[#006FFF]" />
                    Everest & Agents
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,111,255,0.12)', color: '#006FFF' }}>{everestTasks.length}</span>
                  </h2>
                </div>
                <div className="space-y-3">
                  {everestTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm" style={{ color: '#64748B' }}>Everest is up to date — no active tasks</p>
                      <p className="text-xs mt-1" style={{ color: '#475569' }}>Tasks will appear here as work is assigned</p>
                    </div>
                  ) : (
                    everestTasks.map(task => <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />)
                  )}
                </div>
              </div>
            </div>

            {/* Add Task Form */}
            {showAddTask && (
              <div className="glass-card mb-6" style={{ padding: '20px', border: '1px solid rgba(0,111,255,0.3)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#E2E8F0' }}>Add New Task</h3>
                <div className="space-y-3">
                  <input
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Task title..."
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                    onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={newTask.project}
                      onChange={e => setNewTask({ ...newTask, project: e.target.value as Task['project'] })}
                      className="px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                      <option value="saas">SaaS</option>
                      <option value="fso">FSO</option>
                      <option value="personal">Personal</option>
                      <option value="admin">Admin</option>
                    </select>
                    <select
                      value={newTask.assigned_to}
                      onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value as Task['assigned_to'] })}
                      className="px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                      <option value="everest">Everest</option>
                      <option value="me">Me</option>
                      <option value="subagent">Subagent</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddTask} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: '#006FFF', color: '#ffffff' }}>
                      Create Task
                    </button>
                    <button onClick={() => setShowAddTask(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#64748B' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar + Agent Status */}
            <div className="grid grid-cols-3 gap-5 mb-6">
              {/* Calendar */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
                  <Clock size={15} />
                  Upcoming
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B' }}>{upcomingEvents.length}</span>
                </h2>
                <div>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm py-4 text-center" style={{ color: '#64748B' }}>No upcoming events scheduled</p>
                  ) : (
                    upcomingEvents.map(event => <EventRow key={event.id} event={event} />)
                  )}
                </div>
              </div>

              {/* Agent Status */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
                  <PlayCircle size={15} />
                  Agent Status
                </h2>
                <div className="space-y-3">
                  {[
                    { name: 'Everest (Main)', status: 'active', color: '#10B981', detail: 'MiniMax-M2.7 · Online now', pulse: true },
                    { name: 'Codex', status: 'standby', color: '#006FFF', detail: 'DeepSeek V4 · Ready on demand', pulse: false },
                    { name: 'Subagents', status: 'ready', color: '#818CF8', detail: 'Spawned on demand · MiniMax + DeepSeek', pulse: false },
                  ].map(agent => (
                    <div key={agent.name} className="flex items-center gap-3" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="relative flex-shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full block" style={{ background: agent.color }} />
                        {agent.pulse && <span className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-60" style={{ background: agent.color }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: '#E2E8F0' }}>{agent.name}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{agent.detail}</p>
                      </div>
                      <span className="text-xs capitalize" style={{ color: agent.color }}>{agent.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
                  <CheckCircle2 size={15} />
                  At a Glance
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Open Tasks', value: tasks.filter(t => t.status !== 'done').length, color: '#006FFF' },
                    { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#F59E0B' },
                    { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, color: '#10B981' },
                    { label: 'Scheduled Events', value: events.length, color: '#818CF8' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#64748B' }}>{stat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
                        <span className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
                <AlertCircle size={15} />
                Live Activity Feed
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B' }}>{activity.length} recent</span>
              </h2>
              <div className="max-h-80 overflow-y-auto pr-2">
                {activity.length === 0 ? (
                  <p className="text-sm py-4 text-center" style={{ color: '#64748B' }}>No activity yet. Everest's actions will appear here.</p>
                ) : (
                  activity.map(entry => <ActivityRow key={entry.id} entry={entry} />)
                )}
              </div>
            </div>
          </>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: '#334155' }}>
            Mission Control · The Driving Center SaaS · Powered by Everest + OpenClaw
          </p>
        </div>
      </div>

      <style jsx global>{`
        .glass-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
        }
      `}</style>
    </div>
  )
}
