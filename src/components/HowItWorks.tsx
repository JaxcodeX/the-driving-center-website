export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Sign up and set up your school',
      description:
        'Create your account, enter your school name, and claim your public booking URL — something like /school/your-school-name. Takes 2 minutes.',
    },
    {
      number: '02',
      title: 'Import your students',
      description:
        "Drop your existing Excel or CSV file into the import wizard. Names, dates of birth, permit numbers — we encrypt everything and have it loaded in under a minute.",
    },
    {
      number: '03',
      title: 'Set your availability once',
      description:
        'Tell us which instructors work which hours on which days. Students will only see slots when someone is actually available. Never double-book again.',
    },
    {
      number: '04',
      title: 'Students book online — no more phone tag',
      description:
        'Share your booking link. Students pick their lesson type, choose a time, and pay a deposit. You get a notification. Done.',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            Up and running in under an hour
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            No training required. No 30-day implementation. Just sign up, import, and start taking bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-5xl font-bold text-cyan-500/30 mb-4">{step.number}</div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
