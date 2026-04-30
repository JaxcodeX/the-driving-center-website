// Shared TypeScript interfaces for all Supabase tables used across the codebase.
// Use these with `as` casts on admin client operations when the generated types are missing
// or incomplete for a given table.

// ─── Individual table interfaces ─────────────────────────────────────────────

export interface StudentsDriverEd {
  id: string
  school_id: string
  legal_name: string
  dob: string
  permit_number: string | null
  parent_email: string
  emergency_contact_name: string
  emergency_contact_phone: string | null
  classroom_hours: number
  driving_hours: number
  certificate_issued_at: string | null
  created_at: string
}

export interface Instructor {
  id: string
  school_id: string
  name: string
  email: string
  phone: string
  license_number: string
  license_expiry: string
  active: boolean
  created_at: string
}

export interface Session {
  id: string
  school_id: string
  session_type_id: string
  instructor_id: string
  start_date: string
  location: string
  max_seats: number
  seats_booked: number
  status: string
  created_at: string
}

export interface Booking {
  id: string
  session_id: string | null
  student_name: string
  student_email: string
  student_phone: string | null
  status: string
  deposit_amount_cents: number
  confirmation_token: string | null
  cancellation_reason: string | null
  cancelled_at: string | null
  created_at: string
}

export interface AuditLog {
  action: string
  actor_id: string
  timestamp: string
  details: Record<string, unknown>
}

export interface School {
  id: string
  name: string
  owner_email: string
  owner_name: string
  phone: string
  state: string
  license_number: string
  plan_tier: string
  stripe_customer_id: string | null
  service_zips: string
  created_at: string
}

export interface SessionType {
  id: string
  school_id: string
  name: string
  duration_minutes: number
  price_cents: number
  deposit_cents: number
}

// ─── Supabase generic Database type (must be defined after individual interfaces) ───

// Supabase generic database type — pass to createClient<Database> for full type inference
export interface Database {
  public: {
    Tables: {
      students_driver_ed: {
        Row: StudentsDriverEd
        Insert: Omit<StudentsDriverEd, 'id' | 'created_at'>
        Update: Partial<Omit<StudentsDriverEd, 'id' | 'created_at'>>
      }
      instructors: {
        Row: Instructor
        Insert: Omit<Instructor, 'id' | 'created_at'>
        Update: Partial<Omit<Instructor, 'id' | 'created_at'>>
      }
      sessions: {
        Row: Session
        Insert: Omit<Session, 'id'>
        Update: Partial<Omit<Session, 'id'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at'>>
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'timestamp'>
        Update: Partial<Omit<AuditLog, 'timestamp'>>
      }
      schools: {
        Row: School
        Insert: Omit<School, 'id' | 'created_at'>
        Update: Partial<Omit<School, 'id' | 'created_at'>>
      }
      session_types: {
        Row: SessionType
        Insert: Omit<SessionType, 'id'>
        Update: Partial<Omit<SessionType, 'id'>>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// ─── Joined/extended types used in route handlers ─────────────────────────────

export interface BookingWithSession extends Booking {
  session: Pick<Session, 'id' | 'school_id' | 'start_date' | 'seats_booked'> | null
}

export interface BookingFull extends Booking {
  session: {
    id: string
    start_date: string
    location: string
    session_type: Pick<SessionType, 'name' | 'duration_minutes' | 'price_cents' | 'deposit_cents'>
    instructor: Pick<Instructor, 'name'>
  }
}

export interface CheckoutBookingData extends Booking {
  session: {
    id: string
    school_id: string
    start_date: string
    location: string
    session_type: Pick<SessionType, 'name'>
  }
}