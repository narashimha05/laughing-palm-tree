import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-teal-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Serenity</h3>
            <p className="text-teal-200">Your personal AI companion for stress relief and mental wellbeing.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-teal-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/companion" className="text-teal-200 hover:text-white transition-colors">
                  Companion
                </Link>
              </li>
              <li>
                <Link href="/quick-relief" className="text-teal-200 hover:text-white transition-colors">
                  Quick Relief
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-teal-200 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Disclaimer</h3>
            <p className="text-teal-200">
              This is not a substitute for professional mental health care. If you&apos;re in crisis, please contact a mental
              health professional or emergency services.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-teal-700 text-center text-teal-200">
          <p>© {new Date().getFullYear()} Serenity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

