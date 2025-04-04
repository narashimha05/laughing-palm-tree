"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-teal-600">Serenity</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-teal-600 hover:text-teal-800 transition-colors">
              Home
            </Link>
            <Link href="/companion" className="text-teal-600 hover:text-teal-800 transition-colors">
              Companion
            </Link>
            <Link href="/quick-relief" className="text-teal-600 hover:text-teal-800 transition-colors">
              Quick Relief
            </Link>
            <Link href="/dashboard" className="text-teal-600 hover:text-teal-800 transition-colors">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-teal-600 hover:text-teal-800 transition-colors">
              Analytics
            </Link>
            <Link href="/about" className="text-teal-600 hover:text-teal-800 transition-colors">
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-3">
            <Link
              href="/"
              className="block py-2 text-teal-600 hover:text-teal-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/companion"
              className="block py-2 text-teal-600 hover:text-teal-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Companion
            </Link>
            <Link
              href="/quick-relief"
              className="block py-2 text-teal-600 hover:text-teal-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Quick Relief
            </Link>
            <Link
              href="/dashboard"
              className="block py-2 text-teal-600 hover:text-teal-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/analytics"
              className="block py-2 text-teal-600 hover:text-teal-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              href="/about"
              className="block py-2 text-teal-600 hover:text-teal-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

