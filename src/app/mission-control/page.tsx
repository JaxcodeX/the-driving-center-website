'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// mc_tasks and mc_calendar_events are Everest's personal task/calendar tables
// — not part of the Driving Center SaaS schema.
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
      <div className="min-h-screen bg-[#050505] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#5C6370]">Loading mission control...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-[#5C6370] mt-1">Everest & Cayden — {tasks.length} active tasks</p>
        </div>

        {/* Tasks Board */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* My Tasks */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              Assigned to Me
            </h2>
            <div className="space-y-3">
              {myTasks.length === 0 ? (
                <p className="text-[#5C6370] text-sm">No tasks assigned to you</p>
              ) : (
                myTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>

          {/* Everest/Subagent Tasks */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006FFF]" />
              Everest / Subagents
            </h2>
            <div className="space-y-3">
              {everestTasks.length === 0 ? (
                <p className="text-[#5C6370] text-sm">No active tasks</p>
              ) : (
                everestTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-semibold mb-4">Calendar</h2>
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-[#5C6370] text-sm">No events</p>
            ) : (
              events.map(event => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      event.event_type === 'work_window' ? 'bg-[#10B981]' :
                      event.event_type === 'cron' ? 'bg-[#006FFF]' : 'bg-[#818CF8]'
                    }`} />
                    <span className="text-sm">{event.title}</span>
                    <span className="text-xs text-[#5C6370] px-2 py-0.5 bg-[#18181b] rounded-full">
                      {event.event_type}
                    </span>
                  </div>
                  <div className="text-sm text-[#5C6370]">
                    {event.recurring ? '🔄 ' : ''}{event.start_time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-4">Agent Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#18181b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-medium">Everest (Main)</span>
              </div>
              <p className="text-xs text-[#5C6370]">Active now</p>
              <p className="text-xs text-[#5C6370] mt-1">Model: MiniMax-M2.7</p>
            </div>
            <div className="bg-[#18181b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#006FFF]" />
                <span className="font-medium">Codex</span>
              </div>
              <p className="text-xs text-[#5C6370]">On standby</p>
              <p className="text-xs text-[#5C6370] mt-1">DeepSeek backend</p>
            </div>
            <div className="bg-[#18181b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
                <span className="font-medium">Subagents</span>
              </div>
              <p className="text-xs text-[#5C6370]">Spawned on demand</p>
              <p className="text-xs text-[#5C6370] mt-1">MiniMax + DeepSeek</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task }: { task: McTask }) {
  const statusColors: Record<string, string> = {
    todo: 'bg-[#18181b] text-[#5C6370]',
    in_progress: 'bg-[#006FFF]/10 text-[#006FFF]',
    done: 'bg-[#10B981]/10 text-[#10B981]',
  }

  return (
    <div className="bg-[#18181b] rounded-xl p-4 hover:border-[#27272a] border border-[#1A1A1A] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">{task.title}</p>
          {task.last_activity && (
            <p className="text-xs text-[#5C6370] mt-1 line-clamp-1">{task.last_activity}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status] ?? ''}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          task.project === 'saas' ? 'bg-[#006FFF]/10 text-[#006FFF]' :
          task.project === 'fso' ? 'bg-[#818CF8]/10 text-[#818CF8]' :
          'bg-[#18181b] text-[#5C6370] border border-[#27272a]'
        }`}>
          {task.project}
        </span>
        <span className="text-xs text-[#5C6370]">
          {new Date(task.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}