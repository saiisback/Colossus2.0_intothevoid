import { CheckCircle, Coins, BarChart3 } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      title: "Verify",
      description: "AI validates carbon credits",
      icon: <CheckCircle className="h-12 w-12 text-emerald-400" />,
    },
    {
      title: "Tokenize",
      description: "Convert to NFT on blockchain",
      icon: <BarChart3 className="h-12 w-12 text-teal-400" />,
    },
    {
      title: "Trade",
      description: "Marketplace for green NFTs",
      icon: <Coins className="h-12 w-12 text-emerald-400" />,
    },
  ]

  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-900 p-8 rounded-xl border border-emerald-900/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Step {index + 1}: {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
