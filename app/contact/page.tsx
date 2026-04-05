"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Send, CheckCircle, Building2, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { architects } from "@/lib/data"
import { submitContactMessage, supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "project", label: "Project Discussion" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "support", label: "Support Request" },
]

function ContactForm() {
  const searchParams = useSearchParams()
  const architectId = searchParams.get("architect")
  const selectedArchitect = architectId ? architects.find((a) => a.id === architectId) : null

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: selectedArchitect ? "project" : "general",
    subject: selectedArchitect ? `Inquiry about working with ${selectedArchitect.name}` : "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      const fullMessage = `Phone: ${formData.phone || 'N/A'}\nType: ${formData.inquiryType}\n\n${formData.message}`
      
      await submitContactMessage(supabase, {
        sender_name: formData.name,
        sender_email: formData.email,
        subject: formData.subject,
        message: fullMessage
      })
      
      setSubmitted(true)
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message || "Failed to send message. Please verify your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl text-foreground mb-4">Message Sent!</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Form */}
      <div>
        <h2 className="font-serif text-2xl text-foreground mb-6">Send Us a Message</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Your name"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Inquiry Type</label>
              <Select
                value={formData.inquiryType}
                onValueChange={(value) => updateFormData("inquiryType", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inquiryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subject <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => updateFormData("subject", e.target.value)}
                placeholder="What is this about?"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message <span className="text-destructive">*</span>
            </label>
            <Textarea
              required
              value={formData.message}
              onChange={(e) => updateFormData("message", e.target.value)}
              placeholder="Tell us more about your inquiry..."
              rows={6}
              className="resize-none"
            />
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </span>
            )}
          </Button>
        </form>

        {/* Selected Architect */}
        {selectedArchitect && (
          <div className="mt-8 p-5 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-3">Contacting about:</p>
            <Link
              href={`/architects/${selectedArchitect.id}`}
              className="flex items-center gap-4 group"
            >
              <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                <Image
                  src={selectedArchitect.image}
                  alt={selectedArchitect.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {selectedArchitect.name}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedArchitect.title}</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div>
        <h2 className="font-serif text-2xl text-foreground mb-6">Get in Touch</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Have questions about our platform, need help finding the right architect, 
          or want to learn more about listing your services? We&apos;re here to help.
        </p>

        <div className="space-y-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Email Us</h3>
              <p className="text-muted-foreground text-sm">hello@dbyarch.com</p>
              <p className="text-muted-foreground text-sm">support@dbyarch.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Call Us</h3>
              <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
              <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9am-6pm PST</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Visit Us</h3>
              <p className="text-muted-foreground text-sm">
                123 Design District<br />
                San Francisco, CA 94102
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">For Architects</h3>
              <p className="text-muted-foreground text-sm">
                Interested in joining our platform?
              </p>
              <Link
                href="/signup"
                className="text-sm text-primary hover:underline"
              >
                Apply to join
              </Link>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="relative h-64 rounded-xl overflow-hidden bg-secondary">
          <Image
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop"
            alt="Office location"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/90 px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium">San Francisco Office</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-secondary/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg">
              We&apos;d love to hear from you. Reach out with questions, feedback, or project inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-96 bg-secondary/20 rounded-xl animate-pulse" />}>
            <ContactForm />
          </Suspense>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I find the right architect for my project?",
                a: "Browse our architect directory, filter by specialty and location, review portfolios, and reach out to architects whose style matches your vision.",
              },
              {
                q: "How much does it cost to use DByARCH?",
                a: "It's free for clients to browse architects and post projects. Architects pay a subscription fee to list their services on the platform.",
              },
              {
                q: "How long does it take to receive bids on my project?",
                a: "Most projects receive their first bids within 24-48 hours. The number of bids depends on project scope and budget.",
              },
              {
                q: "Can I work with architects outside my area?",
                a: "Yes! Many architects work remotely, especially during the design phase. You can filter by architects who offer remote services.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-medium text-card-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
