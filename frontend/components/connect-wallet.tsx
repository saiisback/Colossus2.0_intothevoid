import { ConnectButton } from "thirdweb/react"
import { client } from "@/app/client"
import { Button } from "@/components/ui/button"

export default function ConnectWallet() {
  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Ready to Join the Green Revolution?
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Connect your wallet to start trading carbon credits and make a positive impact on our planet.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            
            <ConnectButton
                              client={client}
                              appMetadata={{
                                name: "Into The Void",
                                url: "https://example.com",
                              }}
                            />
          </div>
        </div>
      </div>
    </section>
  )
}
