import Link from "next/link"
import { DiscIcon as Discord, MessageCircle, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-emerald-900/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link
              href="/"
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"
            >
              Into The Void
            </Link>
            <p className="text-gray-500 mt-2 text-sm">Carbon Credit Verification & Trading Platform</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
            <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              <Discord className="h-6 w-6" />
              <span className="sr-only">Discord</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Telegram</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              <Github className="h-6 w-6" />
              <span className="sr-only">Github</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Into The Void. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
