// Mission Control types — extends Database types with mc_* tables
// These will be added to database.types.ts once migration runs

import type { Database } from './database.types'

export type { Database }

declare module '@/lib/supabase/database.types' {
  interface Database {
    public: Database['public'] & {
      Tables: Database['public']['Tables'] & {
        mc_tasks: {
          Row: {
            id: string
            title: string
            project: 'saas' | 'fso' | 'personal' | 'admin'
            assigned_to: 'me' | 'everest' | 'subagent'
            status: 'todo' | 'in_progress' | 'done'
            last_activity: string | null
            created_at: string
            updated_at: string
          }
          Insert: Omit<Database['public']['Tables']['mc_tasks']['Row'], 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Database['public']['Tables']['mc_tasks']['Row']>
        }
        mc_memory_index: {
          Row: {
            id: string
            filename: string
            path: string
            content_preview: string | null
            modified_at: string
          }
          Insert: Omit<Database['public']['Tables']['mc_memory_index']['Row'], 'id'>
          Update: Partial<Database['public']['Tables']['mc_memory_index']['Row']>
        }
        mc_calendar_events: {
          Row: {
            id: string
            title: string
            start_time: string
            end_time: string | null
            event_type: 'work_window' | 'cron' | 'scheduled'
            source: 'openclaw' | 'manual'
            recurring: boolean
            metadata: Record<string, unknown> | null
          }
          Insert: Omit<Database['public']['Tables']['mc_calendar_events']['Row'], 'id'>
          Update: Partial<Database['public']['Tables']['mc_calendar_events']['Row']>
        }
      }
    }
  }
}
