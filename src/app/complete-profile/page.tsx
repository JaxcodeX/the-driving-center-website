'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, User, Calendar, Hash, Phone, Mail, Shield, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#ffffff',
  outline: 'none',
  borderRadius: '999px',
  padding: '12px 20px',
  fontSize: '14px',
  width: '100%' as const,
  transition: 'border-color 0.2s',
}

const inputFocus = { ...inputStyle, borderColor: 'rgba(126,212,253,0.5)' }
const inputRound = { ...inputStyle, borderRadius: '12px' }

function CompleteProfileForm() {
  const params = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<'form' | 'done'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSchoolOwner, setIsSchoolOwner] = useState(false)

  useEffect(() => {
    async function detectRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.school_id) {
        setIsSchoolOwner(true)
        router.replace('/school-admin')
      }
    }
    detectRole()
  }, [])

  if (isSchoolOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080809' }}>
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">🏫</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>School Admin Dashboard</h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Redirecting you to your school admin panel...</p>
        </div>
      </div>
    )
  }

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
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, keyData, encoder.encode(value))
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)
      return btoa(String.fromCharCode(...combined))
    }

    try {
      const encryptedName = await encryptField(student.legal_name)
      const encryptedPermit = await encryptField(student.permit_number)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Not authenticated. Please sign in first.'); setLoading(false); return }

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

      if (updateError) setError(updateError.message)
      else setStep('done')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: '#080809' }}>
        <div className="bg-circle w-96 h-96 -top-20 -left-20" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)' }} />
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#4ADE80' }} />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#ffffff' }}>You&apos;re all set!</h1>
          <p className="text-base mb-8" style={{ color: '#94A3B8' }}>Profile complete. Book your first lesson at the dashboard.</p>
          <a href="/dashboard"
            className="btn-glow inline-flex items-center gap-2 px-8 py-4 text-base">
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: '#080809' }}>
      {/* decorative circles */}
      <div className="bg-circle w-[500px] h-[500px] -top-40 -left-40" style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.2) 0%, transparent 70%)' }} />
      <div className="bg-circle w-[400px] h-[400px] bottom-20 -right-32" style={{ background: 'radial-gradient(circle, rgba(112,123,255,0.15) 0%, transparent 70%)' }} />

      <div className="max-w-lg w-full relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)' }}>DC</div>
          <span className="text-white font-semibold text-sm">The Driving Center</span>
        </div>

        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#64748B' }}>Step 1 of 1</div>
          <h1 className="text-2xl font-bold mb-1.5" style={{ color: '#ffffff' }}>Complete your profile</h1>
          <p className="text-sm mb-7" style={{ color: '#94A3B8' }}>
            One more step before booking. We need your permit and contact details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Legal name */}
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#64748B' }}>
                <User className="w-3.5 h-3.5 inline mr-1.5" />Legal Name (as on permit)
              </label>
              <input type="text" value={student.legal_name} onChange={e => setStudent({ ...student, legal_name: e.target.value })}
                placeholder="Jane Marie Smith" required
                onFocus={e => (e.target.style.borderColor = 'rgba(126,212,253,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                className="input-pill" style={inputStyle} />
            </div>

            {/* DOB + Permit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#64748B' }}>
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5" />Date of Birth
                </label>
                <input type="date" value={student.dob} onChange={e => setStudent({ ...student, dob: e.target.value })} required
                  onFocus={e => (e.target.style.borderColor = 'rgba(126,212,253,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  className="input-pill" style={{ ...inputRound, height: '52px' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#64748B' }}>
                  <Hash className="w-3.5 h-3.5 inline mr-1.5" />Permit Number
                </label>
                <input type="text" value={student.permit_number} onChange={e => setStudent({ ...student, permit_number: e.target.value })}
                  placeholder="L1234567" required
                  onFocus={e => (e.target.style.borderColor = 'rgba(126,212,253,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  className="input-pill" style={{ ...inputRound, height: '52px' }} />
              </div>
            </div>

            {/* Emergency contact section */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#64748B' }}>Emergency Contact</div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#64748B' }}>Contact Name</label>
                  <input type="text" value={student.emergency_contact_name} onChange={e => setStudent({ ...student, emergency_contact_name: e.target.value })}
                    placeholder="John Smith" required
                    onFocus={e => (e.target.style.borderColor = 'rgba(126,212,253,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    className="input-pill" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#64748B' }}>
                    <Phone className="w-3.5 h-3.5 inline mr-1.5" />Contact Phone
                  </label>
                  <input type="tel" value={student.emergency_contact_phone} onChange={e => setStudent({ ...student, emergency_contact_phone: e.target.value })}
                    placeholder="(555) 867-5309" required
                    onFocus={e => (e.target.style.borderColor = 'rgba(126,212,253,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    className="input-pill" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Parent email */}
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#64748B' }}>
                <Mail className="w-3.5 h-3.5 inline mr-1.5" />Parent / Guardian Email {student.dob && new Date().getFullYear() - new Date(student.dob).getFullYear() < 18 ? '*' : '(optional)'}
              </label>
              <input type="email" value={student.parent_email} onChange={e => setStudent({ ...student, parent_email: e.target.value })}
                placeholder="parent@example.com"
                onFocus={e => (e.target.style.borderColor = 'rgba(126,212,253,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                className="input-pill" style={inputStyle} />
            </div>

            {/* Encryption notice */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl" style={{ background: 'rgba(126,212,253,0.05)', border: '1px solid rgba(126,212,253,0.12)' }}>
              <Shield className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#7ED4FD' }} />
              <span className="text-xs" style={{ color: '#94A3B8' }}>Your sensitive information is encrypted and stored securely. We never share your personal data.</span>
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-glow w-full justify-center mt-2 disabled:opacity-50"
              style={{ padding: '16px 24px' }}>
              {loading ? 'Saving...' : 'Complete Profile'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#080809' }} />}>
      <CompleteProfileForm />
    </Suspense>
  )
}