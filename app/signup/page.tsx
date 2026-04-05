"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Building2, Check, ArrowLeft, UserSearch, AlertCircle, Mail, Github, Linkedin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { signUpUser, createUserProfile, createArchitectProfile, supabase } from "@/lib/supabase"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    userType: "client",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
    location: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (step === 1) {
      setStep(2)
      return
    }
    
    setIsLoading(true)
    
    try {
      // 1. Sign up with Supabase Auth
      const authData = await signUpUser(formData.email, formData.password)
      
      if (!authData.user) {
        throw new Error("Failed to create account. Please try again.")
      }

      const userId = authData.user.id

      // 2. Create user_profiles row
      await createUserProfile({
        user_id: userId,
        user_type: formData.userType as 'architect' | 'client' | 'hr',
        first_name: formData.firstName,
        last_name: formData.lastName,
        company_name: formData.company || undefined,
      })

      // 3. If architect, create architects row
      if (formData.userType === "architect") {
        await createArchitectProfile({
          user_id: userId,
          name: `${formData.firstName} ${formData.lastName}`,
          title: "Architect",
          location: formData.location || "Not specified",
          email: formData.email,
          bio: "",
          specialties: [],
        })
      }

      // Show email confirmation message
      setEmailSent(true)
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "An error occurred during signup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    setIsLoading(true)
    setError("")
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      console.error(`${provider} signup error:`, err)
      setError(err.message || `An error occurred during ${provider} sign up.`)
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One number", met: /\d/.test(formData.password) },
  ]

  // Email confirmation sent screen
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mx-auto">
            <Mail className="h-10 w-10" />
          </div>
          <h1 className="font-serif text-3xl text-foreground">Check Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a confirmation link to <strong className="text-foreground">{formData.email}</strong>.
            Please click the link to verify your account and start using DByARCH.
          </p>
          <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p>Didn&apos;t receive the email? Check your spam folder or try signing up again.</p>
          </div>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/login">Go to Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-serif font-bold text-primary-foreground text-sm">D</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-tight font-bold">DByARCH</span>
                <span className="text-xs text-muted-foreground">Design By Architect</span>
              </div>
            </Link>
            <h1 className="font-serif text-3xl text-foreground">
              {step === 1 ? "Create your account" : "Complete your profile"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {step === 1
                ? "Join the leading architecture platform"
                : "Tell us a bit more about yourself"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2">
            <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-4">
                  <Label>I am a...</Label>
                  <RadioGroup
                    value={formData.userType}
                    onValueChange={(value) => setFormData({ ...formData, userType: value })}
                    className="grid grid-cols-3 gap-3"
                  >
                    {/* Client */}
                    <Label
                      htmlFor="client"
                      className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all text-center ${
                        formData.userType === "client"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="client" id="client" className="sr-only" />
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="font-medium text-sm">Client</span>
                      <span className="text-xs text-muted-foreground">
                        Hire an architect
                      </span>
                    </Label>

                    {/* Architect */}
                    <Label
                      htmlFor="architect"
                      className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all text-center ${
                        formData.userType === "architect"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="architect" id="architect" className="sr-only" />
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">Architect</span>
                      <span className="text-xs text-muted-foreground">
                        Show portfolio
                      </span>
                    </Label>

                    {/* HR / Recruiter */}
                    <Label
                      htmlFor="hr"
                      className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all text-center ${
                        formData.userType === "hr"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="hr" id="hr" className="sr-only" />
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserSearch className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">HR / Recruiter</span>
                      <span className="text-xs text-muted-foreground">
                        Post vacancies
                      </span>
                    </Label>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="space-y-1 pt-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className={`h-4 w-4 ${req.met ? "text-green-500" : "text-muted-foreground"}`} />
                        <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">
                    {formData.userType === "architect" ? "Studio/Firm Name/Freelancer" : 
                     formData.userType === "hr" ? "Company Name" : "Company (Optional)"}
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder={formData.userType === "architect" ? "Studio Name" : 
                                 formData.userType === "hr" ? "Your company" : "Your company"}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required={formData.userType === "architect" || formData.userType === "hr"}
                    className="h-12"
                  />
                </div>

                {formData.userType === "architect" && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </>
            )}

            <div className="flex gap-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className={`h-12 ${step === 1 ? "w-full" : "flex-1"}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {step === 1 ? "Continue" : "Create account"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          {step === 1 && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button variant="outline" type="button" onClick={() => handleOAuthLogin('google')} disabled={isLoading}>
                  <Globe className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" type="button" onClick={() => handleOAuthLogin('github')} disabled={isLoading}>
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" type="button" onClick={() => handleOAuthLogin('linkedin_oidc')} disabled={isLoading}>
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/80">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center text-primary-foreground">
            <h2 className="font-serif text-4xl mb-6">
              {formData.userType === "architect"
                ? "Showcase your work to thousands"
                : formData.userType === "hr"
                ? "Find top architecture talent"
                : "Find your perfect architect"}
            </h2>
            <p className="text-lg opacity-90">
              {formData.userType === "architect"
                ? "Join a community of talented architects and connect with clients looking for exceptional design."
                : formData.userType === "hr"
                ? "Post job vacancies and browse profiles of vetted architects ready for new opportunities."
                : "Browse portfolios, compare styles, and hire the architect that matches your vision."}
            </p>
            
            <div className="mt-12 space-y-4">
              {[
                formData.userType === "architect"
                  ? "Create a stunning portfolio"
                  : formData.userType === "hr"
                  ? "Post unlimited vacancies"
                  : "Browse 2,500+ architects",
                formData.userType === "architect"
                  ? "Receive project opportunities"
                  : formData.userType === "hr"
                  ? "Search architect profiles"
                  : "Compare bids and proposals",
                formData.userType === "architect"
                  ? "Grow your client base"
                  : formData.userType === "hr"
                  ? "Connect with top talent"
                  : "Hire with confidence",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 justify-center">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
