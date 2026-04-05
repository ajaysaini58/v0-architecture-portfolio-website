"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut, Briefcase, ChevronDown, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, role, profile, isLoading, signOut } = useAuth()

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U"

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : user?.email?.split("@")[0] || "User"

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-serif font-bold text-primary-foreground text-sm">D</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-lg tracking-tight text-foreground leading-none">DByARCH</span>
              <span className="text-xs text-muted-foreground">Design By Architect</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/architects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Find Architects
            </Link>
            <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Portfolios
            </Link>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/vacancies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Vacancies
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            {!isLoading && role === 'admin' && (
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                      {initials}
                    </div>
                    <span className="hidden lg:inline text-sm font-medium">{displayName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {role && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">{role}</span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <UserCircle className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/projects" className="flex items-center gap-2 cursor-pointer">
                      <Briefcase className="h-4 w-4" />
                      My Projects
                    </Link>
                  </DropdownMenuItem>
                  {(role === 'hr' || role === 'admin') && (
                    <DropdownMenuItem asChild>
                      <Link href="/vacancies/post" className="flex items-center gap-2 cursor-pointer">
                        <Briefcase className="h-4 w-4" />
                        Post Vacancy
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isLoading ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/login?redirect=${encodeURIComponent(pathname || '/')}`}>Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[500px] pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 pt-4">
            <Link href="/architects" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
              Find Architects
            </Link>
            <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
              Portfolios
            </Link>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
              Projects
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
              Blog
            </Link>
            <Link href="/vacancies" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
              Vacancies
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            {!isLoading && role === 'admin' && (
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium" onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            )}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              {!isLoading && user ? (
                <>
                  <div className="flex items-center gap-3 pb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{role}</p>
                    </div>
                  </div>
                  <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                    My Profile
                  </Link>
                  <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                    My Projects
                  </Link>
                  <button
                    className="text-sm text-destructive hover:text-destructive/80 text-left transition-colors"
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                  >
                    Sign Out
                  </button>
                </>
              ) : !isLoading ? (
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" asChild className="flex-1">
                    <Link href={`/login?redirect=${encodeURIComponent(pathname || '/')}`} onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
