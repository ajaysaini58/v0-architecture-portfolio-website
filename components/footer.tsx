import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl">Architure</h2>
            <p className="text-sm text-background/70 leading-relaxed">
              Connecting visionary clients with world-class architects. Your dream space is just a conversation away.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/architects" className="text-sm text-background/70 hover:text-background transition-colors">
                  Find Architects
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-background/70 hover:text-background transition-colors">
                  Browse Portfolios
                </Link>
              </li>
              <li>
                <Link href="/post-project" className="text-sm text-background/70 hover:text-background transition-colors">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm text-background/70 hover:text-background transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link href="/vacancies" className="text-sm text-background/70 hover:text-background transition-colors">
                  Job Vacancies
                </Link>
              </li>
            </ul>
          </div>

          {/* For Architects */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">For Architects</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/signup" className="text-sm text-background/70 hover:text-background transition-colors">
                  Join as Architect
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-background/70 hover:text-background transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-background/70 hover:text-background transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-sm text-background/70 hover:text-background transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@architure.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>123 Design District<br />San Francisco, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} Architure. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-background/50 hover:text-background/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-background/50 hover:text-background/70 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
