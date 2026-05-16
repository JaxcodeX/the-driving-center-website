'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function DemoPage() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-surface)',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--accent-secondary), transparent 94%) 0%, transparent 60%)',
      color: 'var(--text-primary)',
    }}>

      {/* Hero */}
      <section style={{
        position: 'relative', padding: '96px 24px', textAlign: 'center',
        borderBottom: '1px solid color-mix(in srgb, var(--text-primary), transparent 95%)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--accent-secondary), transparent 94%) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '768px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '100px',
            border: '1px solid color-mix(in srgb, var(--accent-secondary), transparent 70%)',
            background: 'color-mix(in srgb, var(--accent-secondary), transparent 92%)',
            fontSize: '11px', fontWeight: '600', color: 'var(--success)',
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '24px',
            fontFamily: 'Inter, sans-serif',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--success)',
            }} />
            Live Demo
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '800',
            fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em',
            lineHeight: '1.1', marginBottom: '20px',
          }}>
            See The Driving Center<br />in Action
          </h1>
          <p style={{
            fontSize: '18px', color: 'color-mix(in srgb, var(--text-primary), transparent 55%)', maxWidth: '560px',
            margin: '0 auto', lineHeight: '1.6', fontFamily: 'Inter, sans-serif',
          }}>
            Here&apos;s what your school dashboard looks like after 2 minutes of setup.
            No credit card required.
          </p>
        </div>
      </section>

      {/* School Admin Preview */}
      <section style={{
        padding: '80px 24px',
        borderBottom: '1px solid color-mix(in srgb, var(--text-primary), transparent 95%)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '12px', fontWeight: '600', color: 'var(--success)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>01</span>
            <h2 style={{
              fontSize: '24px', fontWeight: '700',
              fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)',
            }}>School Admin Dashboard</h2>
          </div>
          <p style={{
            fontSize: '15px', color: 'color-mix(in srgb, var(--text-primary), transparent 55%)', maxWidth: '480px',
            marginLeft: '36px', marginBottom: '40px', fontFamily: 'Inter, sans-serif',
          }}>
            A clean, focused view of your entire operation — students, schedules, and revenue at a glance.
          </p>

          <div style={{
            borderRadius: '16px', border: '1px solid var(--border)',
            background: 'color-mix(in srgb, var(--text-primary), transparent 97%)', backdropFilter: 'blur(24px)', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
              background: 'color-mix(in srgb, var(--text-primary), transparent 98%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'var(--success)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)',
                }}>DC</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Metro Driving School</div>
                  <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)' }}>Admin Dashboard</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 50%)',
                }}>12</div>
                <span style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)' }}>Instructors</span>
                <div style={{
                  padding: '4px 12px', borderRadius: '100px',
                  background: 'color-mix(in srgb, var(--success), transparent 85%)',
                  border: '1px solid color-mix(in srgb, var(--success), transparent 70%)',
                  fontSize: '11px', fontWeight: '600', color: 'var(--success)',
                }}>Active</div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              borderBottom: '1px solid color-mix(in srgb, var(--text-primary), transparent 95%)',
            }}>
              {[
                { label: 'Active Students', value: '84', change: '+3 today', accent: 'var(--success)' },
                { label: 'Scheduled This Week', value: '127', change: '+12 vs last wk', accent: 'var(--success)' },
                { label: 'Revenue MTD', value: '$4,820', change: '+18%', accent: 'var(--success)' },
                { label: 'Completion Rate', value: '73%', change: '+5%', accent: 'var(--success)' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: '24px 20px', textAlign: 'center',
                  borderRight: '1px solid color-mix(in srgb, var(--text-primary), transparent 95%)',
                }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>{stat.label}</div>
                  <div style={{ fontSize: '11px', color: stat.accent, fontFamily: 'Inter, sans-serif' }}>{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Table Preview */}
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'color-mix(in srgb, var(--text-primary), transparent 40%)', fontFamily: 'Inter, sans-serif' }}>
                  Recent Student Activity
                </span>
                <span style={{ fontSize: '12px', color: 'var(--success)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>View all →</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Jessica M.', hrs: '4/6 cls · 2/6 drv', status: 'On Track', color: 'var(--success)' },
                  { name: 'Tyler R.', hrs: '3/6 cls · 0/6 drv', status: 'Needs Driving', color: 'var(--warning)' },
                  { name: 'Naomi P.', hrs: '6/6 cls · 5/6 drv', status: 'Near Complete', color: 'var(--status-blue)' },
                  { name: 'Brandon L.', hrs: '1/6 cls · 0/6 drv', status: 'Just Started', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)' },
                ].map((row) => (
                  <div key={row.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 16px', borderRadius: '10px',
                    background: 'color-mix(in srgb, var(--text-primary), transparent 98%)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: 'color-mix(in srgb, var(--accent-secondary), transparent 85%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: '600', color: 'var(--success)',
                      }}>{row.name[0]}</div>
                      <span style={{ fontSize: '13px', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>{row.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <span style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)', fontFamily: 'Inter, sans-serif' }}>{row.hrs}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: row.color, fontFamily: 'Inter, sans-serif' }}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Flow */}
      <section style={{
        padding: '80px 24px',
        borderBottom: '1px solid color-mix(in srgb, var(--text-primary), transparent 95%)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>02</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Student Booking Flow</h2>
          </div>
          <p style={{ fontSize: '15px', color: 'color-mix(in srgb, var(--text-primary), transparent 55%)', maxWidth: '480px', marginLeft: '36px', marginBottom: '40px', fontFamily: 'Inter, sans-serif' }}>
            Students pick a time slot in under 60 seconds. No phone calls. No back-and-forth.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              {
                num: '1', title: 'Choose Date & Time',
                content: [
                  { left: 'Mon Apr 28', right: 'Available', color: 'var(--success)' },
                  { left: 'Tue Apr 29', right: '3 slots open', color: 'var(--success)' },
                  { left: 'Wed Apr 30', right: '1 slot left', color: 'var(--warning)' },
                ],
                footer: 'Pick from live availability across all instructors',
              },
              {
                num: '2', title: 'Confirm Details',
                content: [
                  { left: 'Session', right: 'Driving Lesson', color: 'var(--text-primary)' },
                  { left: 'Date', right: 'Tue Apr 29 · 2:00 PM', color: 'var(--text-primary)' },
                  { left: 'Instructor', right: 'Coach Mike', color: 'var(--text-primary)' },
                  { left: 'Total', right: '$75.00', color: 'var(--success)', bold: true },
                ],
                footer: 'Transparent pricing — no hidden fees',
              },
              {
                num: '3', title: 'SMS Confirmation',
                content: [
                  { left: 'Your phone', right: '📱 Instantly', color: 'var(--success)' },
                ],
                sms: 'Booking confirmed! 🎉\nDriving Lesson\nTue Apr 29 at 2:00 PM\nwith Coach Mike\nSee you soon!',
                footer: 'Instant SMS confirmation sent to student',
              },
            ].map((step) => (
              <div key={step.num} style={{
                position: 'relative', borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'color-mix(in srgb, var(--text-primary), transparent 97%)', backdropFilter: 'blur(24px)', padding: '20px',
              }}>
                <div style={{
                  position: 'absolute', top: '-14px', left: '20px',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'var(--success)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', color: 'var(--text-primary)',
                }}>{step.num}</div>
                <div style={{
                  fontSize: '11px', fontWeight: '600', color: 'var(--success)',
                  marginTop: '4px', marginBottom: '12px', fontFamily: 'Inter, sans-serif',
                }}>{step.title}</div>

                {step.sms ? (
                  <div style={{
                    background: 'color-mix(in srgb, var(--text-primary), transparent 97%)', borderRadius: '10px',
                    padding: '14px', fontFamily: 'monospace',
                    fontSize: '12px', color: 'color-mix(in srgb, var(--text-primary), transparent 40%)',
                    lineHeight: '1.7', marginBottom: '12px',
                    borderLeft: '2px solid color-mix(in srgb, var(--accent-secondary), transparent 70%)',
                    paddingLeft: '16px',
                  }}>
                    {step.sms}
                  </div>
                ) : (
                  <div style={{
                    background: 'color-mix(in srgb, var(--text-primary), transparent 97%)', borderRadius: '10px',
                    padding: '14px', marginBottom: '12px',
                  }}>
                    {step.content.map((row, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: '12px', marginBottom: '6px',
                      }}>
                        <span style={{ color: 'color-mix(in srgb, var(--text-primary), transparent 50%)', fontFamily: 'Inter, sans-serif' }}>{row.left}</span>
                    <span style={{ color: row.color, fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>{row.right}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)', fontFamily: 'Inter, sans-serif' }}>{step.footer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SMS Reminders */}
      <section style={{
        padding: '80px 24px',
        borderBottom: '1px solid color-mix(in srgb, var(--text-primary), transparent 95%)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>03</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Automated SMS Reminders</h2>
          </div>
          <p style={{ fontSize: '15px', color: 'color-mix(in srgb, var(--text-primary), transparent 55%)', maxWidth: '480px', marginLeft: '36px', marginBottom: '40px', fontFamily: 'Inter, sans-serif' }}>
            Two reminders fire automatically — 48 hours and 4 hours before every session. No-shows drop to near zero.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              {
                time: '48h before',
                sub: 'First reminder sent automatically',
                msg: 'Hi Jessica! Just a heads up — you have a driving lesson tomorrow (Tue Apr 29) at 2:00 PM with Coach Mike. Reply CANCEL to reschedule.',
                delivered: 'Delivered · Apr 27 10:00 AM',
              },
              {
                time: '4h before',
                sub: 'Final reminder — morning of',
                msg: 'Hey Jessica 👋 Your lesson is in 4 hours (2:00 PM today). Make sure you bring your permit & comfortable shoes. See you soon!',
                delivered: 'Delivered · Apr 29 10:00 AM',
              },
            ].map((reminder, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    padding: '4px 12px', borderRadius: '100px',
                    background: 'color-mix(in srgb, var(--accent-secondary), transparent 90%)',
                    border: '1px solid color-mix(in srgb, var(--accent-secondary), transparent 80%)',
                    fontSize: '11px', fontWeight: '600', color: 'var(--success)',
                  }}>{reminder.time}</div>
                  <span style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)', fontFamily: 'Inter, sans-serif' }}>{reminder.sub}</span>
                </div>
                <div style={{
                  background: 'color-mix(in srgb, var(--text-primary), transparent 97%)', backdropFilter: 'blur(24px)',
                  borderRadius: '16px', padding: '20px',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'color-mix(in srgb, var(--accent-secondary), transparent 90%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: '16px',
                    }}>💬</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>The Driving Center</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1, 2, 3].map(d => (
                            <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }} />
                          ))}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '13px', color: 'color-mix(in srgb, var(--text-primary), transparent 35%)',
                        lineHeight: '1.6', fontFamily: 'monospace',
                      }}>{reminder.msg}</div>
                      <div style={{ marginTop: '12px', fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 75%)', fontFamily: 'Inter, sans-serif' }}>{reminder.delivered}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '32px', padding: '16px 20px', borderRadius: '12px',
            background: 'color-mix(in srgb, var(--accent-secondary), transparent 92%)',
            border: '1px solid color-mix(in srgb, var(--accent-secondary), transparent 85%)',
            display: 'flex', alignItems: 'center', gap: '12px',
            maxWidth: '480px',
          }}>
            <span style={{ fontSize: '16px' }}>✓</span>
            <span style={{ fontSize: '13px', color: 'color-mix(in srgb, var(--accent-secondary), transparent 20%)', fontFamily: 'Inter, sans-serif' }}>
              SMS costs are included in your plan — no per-message billing
            </span>
          </div>
        </div>
      </section>

      {/* TCA Tracking */}
      <section style={{
        padding: '80px 24px',
        borderBottom: '1px solid color-mix(in srgb, var(--text-primary), transparent 95%)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>04</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>TCA Compliance Tracking</h2>
          </div>
          <p style={{ fontSize: '15px', color: 'color-mix(in srgb, var(--text-primary), transparent 55%)', maxWidth: '480px', marginLeft: '36px', marginBottom: '40px', fontFamily: 'Inter, sans-serif' }}>
            State-required hour tracking handled automatically. Students see their progress. You stay compliant.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {/* Student Card */}
            <div style={{
              borderRadius: '16px', border: '1px solid var(--border)',
              background: 'color-mix(in srgb, var(--text-primary), transparent 97%)', backdropFilter: 'blur(24px)', padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'color-mix(in srgb, var(--accent-secondary), transparent 85%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '700', color: 'var(--success)',
                }}>JM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>Jessica Martinez</div>
                  <div style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)', fontFamily: 'Inter, sans-serif' }}>Permit #D-4892011 · Started Mar 3</div>
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: '100px',
                  background: 'color-mix(in srgb, var(--warning), transparent 90%)',
                  border: '1px solid color-mix(in srgb, var(--warning), transparent 80%)',
                  fontSize: '11px', fontWeight: '600', color: 'var(--warning)',
                }}>In Progress</div>
              </div>

              {/* Classroom Hours */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'color-mix(in srgb, var(--text-primary), transparent 50%)', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
                  <span>Classroom Hours</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>4 / 6 hrs</span>
                </div>
                <div style={{ height: '6px', borderRadius: '100px', background: 'var(--glass-border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '66%', borderRadius: '100px', background: 'var(--success)' }} />
                </div>
              </div>

              {/* Driving Hours */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'color-mix(in srgb, var(--text-primary), transparent 50%)', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
                  <span>Behind-the-Wheel Hours</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>2 / 6 hrs</span>
                </div>
                <div style={{ height: '6px', borderRadius: '100px', background: 'var(--glass-border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '33%', borderRadius: '100px', background: 'var(--success)' }} />
                </div>
              </div>

              {/* Progress */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                paddingTop: '16px', borderTop: '1px solid color-mix(in srgb, var(--text-primary), transparent 95%)',
              }}>
                <div style={{
                  flex: 1, height: '6px', borderRadius: '100px',
                  background: 'var(--glass-border)', overflow: 'hidden',
                  display: 'flex',
                }}>
                  <div style={{ height: '100%', width: '50%', background: 'var(--success)' }} />
                  <div style={{ height: '100%', width: '2px', background: 'color-mix(in srgb, var(--warning), transparent 50%)', marginLeft: '-1px' }} />
                  <div style={{ flex: 1, background: 'var(--glass-border)' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--success)', fontFamily: 'Inter, sans-serif' }}>50% complete</span>
              </div>
            </div>

            {/* Admin View */}
            <div style={{
              borderRadius: '16px', border: '1px solid var(--border)',
              background: 'color-mix(in srgb, var(--text-primary), transparent 97%)', backdropFilter: 'blur(24px)', padding: '24px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'color-mix(in srgb, var(--text-primary), transparent 40%)', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
                TCA Completion Summary · Last 30 days
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { name: 'Jessica M.', cls: true, drv: false, label: '2 sessions left' },
                  { name: 'Tyler R.', cls: false, drv: false, label: '3 sessions left' },
                  { name: 'Naomi P.', cls: true, drv: true, label: 'Ready for road test' },
                  { name: 'Brandon L.', cls: false, drv: false, label: 'Just started' },
                  { name: 'Marcus D.', cls: true, drv: false, label: '1 session left' },
                ].map((s) => (
                  <div key={s.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'color-mix(in srgb, var(--text-primary), transparent 98%)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: 'var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 50%)',
                      }}>{s.name[0]}</div>
                      <span style={{ fontSize: '13px', color: 'color-mix(in srgb, var(--text-primary), transparent 40%)', fontFamily: 'Inter, sans-serif' }}>{s.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '4px',
                          background: s.cls ? 'var(--success)' : 'var(--glass-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', color: s.cls ? 'var(--bg-base)' : 'color-mix(in srgb, var(--text-primary), transparent 70%)',
                        }}>✓</div>
                        <span style={{ fontSize: '10px', color: 'color-mix(in srgb, var(--text-primary), transparent 70%)', fontFamily: 'Inter, sans-serif' }}>cls</span>
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '4px',
                          background: s.drv ? 'var(--success)' : 'var(--glass-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', color: s.drv ? 'var(--bg-base)' : 'color-mix(in srgb, var(--text-primary), transparent 70%)',
                        }}>✓</div>
                        <span style={{ fontSize: '10px', color: 'color-mix(in srgb, var(--text-primary), transparent 70%)', fontFamily: 'Inter, sans-serif' }}>drv</span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        color: s.label === 'Ready for road test' ? 'var(--success)' : 'color-mix(in srgb, var(--text-primary), transparent 60%)',
                        fontFamily: 'Inter, sans-serif',
                      }}>{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '112px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800',
            fontFamily: 'Outfit, sans-serif', marginBottom: '16px',
          }}>Want to see your school?</h2>
          <p style={{ fontSize: '16px', color: 'color-mix(in srgb, var(--text-primary), transparent 55%)', marginBottom: '32px', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>
            Set up takes 2 minutes. No credit card. No commitment.<br />
            Your school, your data, live in under an hour.
          </p>
          <Link href='/signup' style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '14px 28px', borderRadius: '12px',
            background: 'var(--success)', color: 'var(--text-primary)',
            fontSize: '15px', fontWeight: '700', textDecoration: 'none',
            fontFamily: 'Inter, sans-serif',
          }}>
            Start your free trial →
          </Link>
          <div style={{ marginTop: '20px', fontSize: '12px', color: 'color-mix(in srgb, var(--text-primary), transparent 70%)', fontFamily: 'Inter, sans-serif' }}>
            Free for 14 days · Then $99/month · Cancel anytime
          </div>
        </div>
      </section>
    </div>
  )
}
