import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import HowItWorks from "@/components/how-it-works"
import MarketplacePreview from "@/components/marketplace-preview"
import ConnectWallet from "@/components/connect-wallet"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <MarketplacePreview />
        <ConnectWallet />
      </main>
      <Footer />
    </div>
  )
}
