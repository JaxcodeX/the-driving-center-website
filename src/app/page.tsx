import ParticleBackground from "../components/ParticleBackground";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <Features />
      <Stats />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <span className="text-white font-semibold">The Driving Center</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 The Driving Center. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}