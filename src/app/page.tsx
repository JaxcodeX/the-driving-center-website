import ParticleBackground from "../components/ParticleBackground";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Stats />
      <Pricing />
      <FAQ />

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stop scheduling lessons over the phone.
          </h2>
          <p className="text-gray-400 mb-8">
            Your first month is $99. No setup fee. No contract. Cancel anytime.
          </p>
          <a
            href="/signup"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            Get Started Free — No Credit Card
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <span className="text-white font-semibold">The Driving Center</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="/legal/terms" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="/legal/privacy" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="/login" className="hover:text-gray-300 transition-colors">Sign In</a>
          </div>
          <p className="text-gray-500 text-sm">© 2026 The Driving Center SaaS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}