"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Building2, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate sending reset email
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-serif text-2xl tracking-tight">Architure</span>
          </Link>
          
          {!isSubmitted ? (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl text-foreground">Reset your password</h1>
              <p className="mt-2 text-muted-foreground">
                Enter your email and we&apos;ll send you instructions to reset your password.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="font-serif text-3xl text-foreground">Check your email</h1>
              <p className="mt-2 text-muted-foreground">
                We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>
              </p>
            </>
          )}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send reset link
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder, or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:underline font-medium"
                >
                  try another email address
                </button>
              </p>
            </div>
            
            <Button variant="outline" className="w-full h-12" asChild>
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Link>
            </Button>
          </div>
        )}

        {!isSubmitted && (
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
