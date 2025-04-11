"use client"

import { useState } from "react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ConnectButton } from "thirdweb/react"
import { client } from "@/app/client"

export default function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: "Register", href: "/register" },
    { name: "Evaluate", href: "/evaluate" },
    { name: "My Green NFT Marketplace", href: "/marketplace" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-emerald-900/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"
        >
          Into The Void
        </Link>

        {isDesktop ? (
          <nav className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            <div className="ml-2">
              <ConnectButton
                client={client}
                appMetadata={{
                  name: "Into The Void",
                  url: "https://example.com",
                }}
              />
            </div>
          </nav>
        ) : (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-emerald-400 rounded hover:bg-emerald-900/10 transition">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 border-emerald-900/30">
              <nav className="flex flex-col space-y-6 mt-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <ConnectButton
                  client={client}
                  appMetadata={{
                    name: "Into The Void",
                    url: "https://example.com",
                  }}
                />
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  )
}