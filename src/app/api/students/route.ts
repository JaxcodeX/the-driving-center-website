import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// AES-GCM decryption helper
async function decryptField(encrypted: string): Promise<string> {
  if (!encrypted || encrypted === 'PENDING') return encrypted
  try {
    const data = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
    const iv = data.slice(0, 12)
    const ciphertext = data.slice(12)
    const encoder = new TextEncoder()
    const rawKey = (process.env.ENCRYPTION_KEY ?? 'default-key-32-chars-here-xxxxx').slice(0, 32)
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(rawKey.padEnd(32, '0')),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
    return new TextDecoder().decode(decrypted)
  } catch {
    return encrypted
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')

  if (!schoolId) {
    return new NextResponse('Missing school_id', { status: 400 })
  }

  const supabase = await createClient()
  const { data: students, error } = await supabase
    .from('students_driver_ed')
    .select('id, created_at, driving_hours, certificate_issued_at, permit_number, dob')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Decrypt names for display — only on server side
  const decrypted = await Promise.all(
    (students ?? []).map(async (s) => ({
      ...s,
      legal_name: '[encrypted]',
    }))
  )

  return NextResponse.json(decrypted)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  const body = await request.json()
  const { legal_name, dob, permit_number, parent_email, emergency_contact_name, emergency_contact_phone } = body

  if (!legal_name || !dob) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  // Encrypt sensitive fields
  const encoder = new TextEncoder()
  const rawKey = (process.env.ENCRYPTION_KEY ?? 'default-key-32-chars-here-xxxxx').slice(0, 32)
  const keyData = await crypto.subtle.importKey(
    'raw',
    encoder.encode(rawKey.padEnd(32, '0')),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )

  async function encryptField(value: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, keyData, encoder.encode(value))
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)
    return btoa(String.fromCharCode(...combined))
  }

  const encryptedName = await encryptField(legal_name)
  const encryptedPermit = await encryptField(permit_number ?? '')

  const supabaseAdmin = await createClient()
  const { data: student, error } = await supabaseAdmin
    .from('students_driver_ed')
    .insert({
      school_id: schoolId,
      legal_name: encryptedName,
      dob,
      permit_number: encryptedPermit,
      parent_email: parent_email ?? '',
      emergency_contact_name: emergency_contact_name ?? '',
      emergency_contact_phone: emergency_contact_phone ?? '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ id: student.id, legal_name: '[encrypted]' }, { status: 201 })
}
