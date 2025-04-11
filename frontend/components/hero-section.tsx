import { Button } from "@/components/ui/button"
import { Sparkles, ShieldCheck } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background with particle effect (static placeholder) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-500/20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: "0 0 20px 2px rgba(16, 185, 129, 0.3)",
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Into The Void
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            Carbon Credit Verification powered by AI.
            <br />
            Carbon Trading via Blockchain.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium text-lg py-6 px-8 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Sparkles className="mr-2 h-5 w-5" />
              Claim Your Carbon Credit
            </Button>
           
          </div>
        </div>
      </div>
    </section>
  )
}
