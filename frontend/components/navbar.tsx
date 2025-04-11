"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";

export default function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: "Register", href: "/register" },
    { name: "Claim", href: "/claim" },
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
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-black font-medium">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </nav>
        ) : (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-emerald-400" />
              </Button>
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
              name: "Example App",
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
