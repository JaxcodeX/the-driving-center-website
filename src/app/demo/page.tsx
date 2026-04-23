export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,210,255,0.08)_0%,transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Live Demo
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            See The Driving Center in Action
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Here's what your school dashboard looks like after 2 minutes of setup.
            No credit card required.
          </p>
        </div>
      </section>

      {/* School Admin Preview */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">01</span>
            <h2 className="text-2xl font-bold">School Admin Dashboard</h2>
          </div>
          <p className="text-white/50 mb-10 ml-8 max-w-lg">
            A clean, focused view of your entire operation — students, schedules, and revenue at a glance.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {/* Mock Dashboard Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-bold text-sm">DC</div>
                <div>
                  <div className="text-sm font-semibold">Metro Driving School</div>
                  <div className="text-xs text-white/40">Admin Dashboard</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">12</div>
                <div className="text-xs text-white/40">Instructor count</div>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">Active</div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 divide-x divide-white/5">
              {[
                { label: 'Active Students', value: '84', change: '+3 today' },
                { label: 'Scheduled This Week', value: '127', change: '+12 vs last wk' },
                { label: 'Revenue MTD', value: '$4,820', change: '+18%' },
                { label: 'Completion Rate', value: '73%', change: '+5%' },
              ].map((stat) => (
                <div key={stat.label} className="px-6 py-5 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-white/40 mb-1">{stat.label}</div>
                  <div className="text-xs text-green-400/70">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Table Preview */}
            <div className="border-t border-white/5 px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white/70">Recent Student Activity</span>
                <span className="text-xs text-cyan-400 cursor-pointer hover:underline">View all →</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Jessica M.', hrs: '4/6 cls · 2/6 drv', status: 'On Track', statusColor: 'text-green-400' },
                  { name: 'Tyler R.', hrs: '3/6 cls · 0/6 drv', status: 'Needs Driving', statusColor: 'text-yellow-400' },
                  { name: 'Naomi P.', hrs: '6/6 cls · 5/6 drv', status: 'Near Complete', statusColor: 'text-cyan-400' },
                  { name: 'Brandon L.', hrs: '1/6 cls · 0/6 drv', status: 'Just Started', statusColor: 'text-white/40' },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-semibold">
                        {row.name[0]}
                      </div>
                      <span className="text-sm font-medium">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-white/40">{row.hrs}</span>
                      <span className={`text-xs font-medium ${row.statusColor}`}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Flow */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">02</span>
            <h2 className="text-2xl font-bold">Student Booking Flow</h2>
          </div>
          <p className="text-white/50 mb-10 ml-8 max-w-lg">
            Students pick a time slot in under 60 seconds. No phone calls. No back-and-forth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 relative">
              <div className="absolute -top-3 left-5 bg-cyan-500 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">1</div>
              <div className="text-xs text-cyan-400 mb-2 mt-1 font-semibold">Choose Date & Time</div>
              <div className="bg-[#0f0f1a] rounded-lg p-4 text-sm space-y-1.5">
                <div className="flex justify-between text-white/60 text-xs">
                  <span>Mon Apr 28</span><span className="text-cyan-400">Available</span>
                </div>
                <div className="flex justify-between text-white/60 text-xs">
                  <span>Tue Apr 29</span><span className="text-green-400">3 slots open</span>
                </div>
                <div className="flex justify-between text-white/60 text-xs">
                  <span>Wed Apr 30</span><span className="text-yellow-400">1 slot left</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-white/40">Pick from live availability across all instructors</div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 relative">
              <div className="absolute -top-3 left-5 bg-cyan-500 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">2</div>
              <div className="text-xs text-cyan-400 mb-2 mt-1 font-semibold">Confirm Details</div>
              <div className="bg-[#0f0f1a] rounded-lg p-4">
                <div className="space-y-2 text-xs text-white/60">
                  <div className="flex justify-between"><span>Session</span><span className="text-white">Driving Lesson</span></div>
                  <div className="flex justify-between"><span>Date</span><span className="text-white">Tue Apr 29 · 2:00 PM</span></div>
                  <div className="flex justify-between"><span>Instructor</span><span className="text-white">Coach Mike</span></div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between font-semibold"><span>Total</span><span className="text-cyan-400">$75.00</span></div>
                </div>
              </div>
              <div className="mt-3 text-xs text-white/40">Transparent pricing — no hidden fees</div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 relative">
              <div className="absolute -top-3 left-5 bg-cyan-500 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">3</div>
              <div className="text-xs text-cyan-400 mb-2 mt-1 font-semibold">SMS Confirmation</div>
              <div className="bg-[#0f0f1a] rounded-lg p-4 font-mono text-xs text-white/70 space-y-2">
                <div className="text-cyan-400">📱 Your phone — instantly</div>
                <div className="border-l-2 border-cyan-500/40 pl-3 text-white/50 leading-relaxed">
                  "Booking confirmed! 🎉<br/>
                  Driving Lesson<br/>
                  Tue Apr 29 at 2:00 PM<br/>
                  with Coach Mike<br/>
                  <span className="text-cyan-400">See you soon!</span>"
                </div>
              </div>
              <div className="mt-3 text-xs text-white/40">Instant SMS confirmation sent to student</div>
            </div>
          </div>
        </div>
      </section>

      {/* SMS Reminders */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">03</span>
            <h2 className="text-2xl font-bold">Automated SMS Reminders</h2>
          </div>
          <p className="text-white/50 mb-10 ml-8 max-w-lg">
            Two reminders fire automatically — 48 hours and 4 hours before every session. No-shows drop to near zero.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 48h Reminder */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">48h before</div>
                <span className="text-xs text-white/40">First reminder sent automatically</span>
              </div>
              <div className="bg-[#111119] rounded-2xl p-5 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 text-lg">💬</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">The Driving Center</span>
                      <div className="flex gap-1">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        ))}
                      </div>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed font-mono">
                      Hi Jessica! Just a heads up — you have a driving lesson tomorrow (Tue Apr 29) at 2:00 PM with Coach Mike. Reply CANCEL to reschedule.
                    </div>
                    <div className="mt-3 text-xs text-white/30">Delivered · Apr 27 10:00 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4h Reminder */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">4h before</div>
                <span className="text-xs text-white/40">Final reminder — morning of</span>
              </div>
              <div className="bg-[#111119] rounded-2xl p-5 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 text-lg">💬</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">The Driving Center</span>
                      <div className="flex gap-1">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        ))}
                      </div>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed font-mono">
                      Hey Jessica 👋 Your lesson is in 4 hours (2:00 PM today). Make sure you bring your permit &amp; comfortable shoes. See you soon!
                    </div>
                    <div className="mt-3 text-xs text-white/30">Delivered · Apr 29 10:00 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 px-5 py-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 max-w-md ml-0 md:ml-8">
            <span className="text-green-400 text-lg">✓</span>
            <span className="text-sm text-green-400/80">SMS costs are included in your plan — no per-message billing</span>
          </div>
        </div>
      </section>

      {/* TCA Tracking */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">04</span>
            <h2 className="text-2xl font-bold">TCA Compliance Tracking</h2>
          </div>
          <p className="text-white/50 mb-10 ml-8 max-w-lg">
            State-required hour tracking handled automatically. Students see their progress. You stay compliant.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg font-bold">JM</div>
                <div>
                  <div className="font-semibold text-white">Jessica Martinez</div>
                  <div className="text-sm text-white/40">Permit #D-4892011 · Started Mar 3</div>
                </div>
                <div className="ml-auto px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">In Progress</div>
              </div>

              {/* Classroom Hours */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span>Classroom Hours</span>
                  <span className="text-white font-medium">4 / 6 hrs</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              {/* Driving Hours */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span>Behind-the-Wheel Hours</span>
                  <span className="text-white font-medium">2 / 6 hrs</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '33%' }} />
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden flex">
                  <div className="h-full bg-cyan-500" style={{ width: '50%' }} />
                  <div className="h-full bg-yellow-500/50 w-0.5 -ml-0.5" />
                  <div className="h-full bg-white/10 flex-1" />
                </div>
                <span className="text-xs text-cyan-400 font-medium">50% complete</span>
              </div>
            </div>

            {/* Admin View */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white/70 mb-4">TCA Completion Summary · Last 30 days</div>
              <div className="space-y-3">
                {[
                  { name: 'Jessica M.', cls: true, drv: false, label: '2 sessions left' },
                  { name: 'Tyler R.', cls: false, drv: false, label: '3 sessions left' },
                  { name: 'Naomi P.', cls: true, drv: true, label: 'Ready for road test' },
                  { name: 'Brandon L.', cls: false, drv: false, label: 'Just started' },
                  { name: 'Marcus D.', cls: true, drv: false, label: '1 session left' },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs">
                        {s.name[0]}
                      </div>
                      <span className="text-sm text-white/70">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className={`w-5 h-5 rounded text-xs flex items-center justify-center ${s.cls ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white/30'}`}>✓</div>
                        <div className="text-xs text-white/30">cls</div>
                        <div className={`w-5 h-5 rounded text-xs flex items-center justify-center ${s.drv ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white/30'}`}>✓</div>
                        <div className="text-xs text-white/30">drv</div>
                      </div>
                      <span className={`text-xs ${s.label === 'Ready for road test' ? 'text-cyan-400' : 'text-white/40'}`}>{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to see your school?</h2>
          <p className="text-white/50 mb-8 text-base">
            Set up takes 2 minutes. No credit card. No commitment.<br/>
            Your school, your data, live in under an hour.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-base transition-colors"
          >
            Start your free trial →
          </a>
          <div className="mt-5 text-xs text-white/30">Free for 14 days · Then $99/month · Cancel anytime</div>
        </div>
      </section>
    </div>
  )
}