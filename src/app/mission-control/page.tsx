'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type McTask = {
  id: string
  title: string
  project: 'saas' | 'fso' | 'personal' | 'admin'
  assigned_to: 'me' | 'everest' | 'subagent'
  status: 'todo' | 'in_progress' | 'done'
  last_activity: string | null
  created_at: string
  updated_at: string
}

type McCalendarEvent = {
  id: string
  title: string
  event_type: 'work_window' | 'cron' | 'deadline'
  start_time: string
  end_time: string | null
  recurring: boolean
  created_at: string
}

async function getTasks(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('mc_tasks')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) return []
  return (data as McTask[]) ?? []
}

async function getCalendarEvents(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('mc_calendar_events')
    .select('*')
    .order('start_time', { ascending: true })

  if (error) return []
  return (data as McCalendarEvent[]) ?? []
}

export default function MissionControlPage() {
  const [tasks, setTasks] = useState<McTask[]>([])
  const [events, setEvents] = useState<McCalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [tasksData, eventsData] = await Promise.all([
        getTasks(supabase),
        getCalendarEvents(supabase),
      ])
      setTasks(tasksData)
      setEvents(eventsData)
      setLoading(false)
    }
    load()
  }, [])

  const myTasks = tasks.filter(t => t.assigned_to === 'me')
  const everestTasks = tasks.filter(t => t.assigned_to !== 'me')

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: '#0D0D12', backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <p style={{ color: '#94A3B8' }}>Loading mission control...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0D0D12', backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Mission Control</h1>
          <p className="mt-1" style={{ color: '#94A3B8' }}>Everest & Cayden — {tasks.length} active tasks</p>
        </div>

        {/* Tasks Board */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* My Tasks */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              Assigned to Me
            </h2>
            <div className="space-y-3">
              {myTasks.length === 0 ? (
                <p className="text-sm" style={{ color: '#94A3B8' }}>No tasks assigned to you</p>
              ) : (
                myTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>

          {/* Everest/Subagent Tasks */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
              <span className="w-2 h-2 rounded-full bg-[#006FFF]" />
              Everest / Subagents
            </h2>
            <div className="space-y-3">
              {everestTasks.length === 0 ? (
                <p className="text-sm" style={{ color: '#94A3B8' }}>No active tasks</p>
              ) : (
                everestTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="glass-card mb-8" style={{ padding: '20px' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Calendar</h2>
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-sm" style={{ color: '#94A3B8' }}>No events</p>
            ) : (
              events.map(event => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      event.event_type === 'work_window' ? 'bg-[#10B981]' :
                      event.event_type === 'cron' ? 'bg-[#006FFF]' : 'bg-[#818CF8]'
                    }`} />
                    <span className="text-sm" style={{ color: '#94A3B8' }}>{event.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#18181B', color: '#94A3B8' }}>
                      {event.event_type}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: '#94A3B8' }}>
                    {event.recurring ? '🔄 ' : ''}{event.start_time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agent Status */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Agent Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card" style={{ padding: '16px' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-medium" style={{ color: '#ffffff' }}>Everest (Main)</span>
              </div>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Active now</p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Model: MiniMax-M2.7</p>
            </div>
            <div className="glass-card" style={{ padding: '16px' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#006FFF]" />
                <span className="font-medium" style={{ color: '#ffffff' }}>Codex</span>
              </div>
              <p className="text-xs" style={{ color: '#94A3B8' }}>On standby</p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>DeepSeek backend</p>
            </div>
            <div className="glass-card" style={{ padding: '16px' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
                <span className="font-medium" style={{ color: '#ffffff' }}>Subagents</span>
              </div>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Spawned on demand</p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>MiniMax + DeepSeek</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task }: { task: McTask }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    todo: { bg: 'rgba(255,255,255,0.05)', text: '#94A3B8' },
    in_progress: { bg: 'rgba(0,111,255,0.1)', text: '#006FFF' },
    done: { bg: 'rgba(16,185,129,0.1)', text: '#4ADE80' },
  }
  const colors = statusColors[task.status] ?? statusColors.todo

  const projectColors: Record<string, { bg: string; text: string }> = {
    saas: { bg: 'rgba(0,111,255,0.1)', text: '#006FFF' },
    fso: { bg: 'rgba(129,140,248,0.1)', text: '#818CF8' },
    personal: { bg: 'rgba(74,222,128,0.1)', text: '#4ADE80' },
    admin: { bg: 'rgba(255,255,255,0.05)', text: '#94A3B8' },
  }
  const pColors = projectColors[task.project] ?? projectColors.admin

  return (
    <div className="glass-card" style={{ padding: '16px' }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: '#ffffff' }}>{task.title}</p>
          {task.last_activity && (
            <p className="text-xs mt-1 line-clamp-1" style={{ color: '#94A3B8' }}>{task.last_activity}</p>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: colors.bg, color: colors.text }}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: pColors.bg, color: pColors.text }}>
          {task.project}
        </span>
        <span className="text-xs" style={{ color: '#94A3B8' }}>
          {new Date(task.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}