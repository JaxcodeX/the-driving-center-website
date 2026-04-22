'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CompleteProfileForm() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const supabase = createClient()

  const [step, setStep] = useState<'form' | 'done'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [student, setStudent] = useState({
    legal_name: '',
    dob: '',
    permit_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    parent_email: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Encrypt sensitive fields before INSERT (AES-256 via Web Crypto API)
    const encoder = new TextEncoder()
    const rawKey = (process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? 'default-key-32-chars-here-xxxxx').slice(0, 32)
    const keyData = await crypto.subtle.importKey(
      'raw',
      encoder.encode(rawKey.padEnd(32, '0')),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )

    const iv = crypto.getRandomValues(new Uint8Array(12))

    async function encryptField(value: string): Promise<string> {
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyData,
        encoder.encode(value)
      )
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)
      return btoa(String.fromCharCode(...combined))
    }

    try {
      const encryptedName = await encryptField(student.legal_name)
      const encryptedPermit = await encryptField(student.permit_number)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Not authenticated. Please sign in first.')
        setLoading(false)
        return
      }

      const { error: updateError } = await supabase
        .from('students_driver_ed')
        .update({
          legal_name: encryptedName,
          dob: student.dob,
          permit_number: encryptedPermit,
          emergency_contact_name: student.emergency_contact_name,
          emergency_contact_phone: student.emergency_contact_phone,
          parent_email: student.parent_email,
        })
        .eq('parent_email', user.email!)
        .eq('permit_number', 'PENDING')
        .order('created_at', { ascending: false })
        .limit(1)

      if (updateError) {
        setError(updateError.message)
      } else {
        setStep('done')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">You&apos;re all set!</h1>
          <p className="text-gray-400 mb-6">
            Profile complete. Book your first lesson at the dashboard.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Dashboard →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DC</span>
          </div>
          <span className="text-white font-semibold">The Driving Center</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Complete your profile</h1>
          <p className="text-gray-400 mb-6">
            One more step before booking. We need your permit and contact details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Legal Name (as it appears on your permit)
              </label>
              <input
                type="text"
                value={student.legal_name}
                onChange={(e) => setStudent({ ...student, legal_name: e.target.value })}
                placeholder="Jane Marie Smith"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={student.dob}
                  onChange={(e) => setStudent({ ...student, dob: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Permit Number</label>
                <input
                  type="text"
                  value={student.permit_number}
                  onChange={(e) => setStudent({ ...student, permit_number: e.target.value })}
                  placeholder="L1234567"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h2 className="text-sm font-semibold text-white mb-3">Emergency Contact</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={student.emergency_contact_name}
                    onChange={(e) => setStudent({ ...student, emergency_contact_name: e.target.value })}
                    placeholder="John Smith"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={student.emergency_contact_phone}
                    onChange={(e) => setStudent({ ...student, emergency_contact_phone: e.target.value })}
                    placeholder="(555) 867-5309"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Parent or Guardian Email (if under 18)
              </label>
              <input
                type="email"
                value={student.parent_email}
                onChange={(e) => setStudent({ ...student, parent_email: e.target.value })}
                placeholder="parent@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Profile →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <CompleteProfileForm />
    </Suspense>
  )
}
