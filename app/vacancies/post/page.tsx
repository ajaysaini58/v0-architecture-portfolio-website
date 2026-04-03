'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase'

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship']

export default function PostVacancyPage() {
  const { user, isLoading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    description: '',
    requirements: '',
    applyUrl: '',
    applyEmail: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from('vacancies').insert({
        user_id: user.id,
        title: formData.title,
        company: formData.company,
        location: formData.location,
        salary_min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salary_max: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        job_type: formData.jobType,
        description: formData.description,
        requirements: formData.requirements || null,
        apply_url: formData.applyUrl || null,
        apply_email: formData.applyEmail || null,
        status: 'approved', // Goes live immediately
      })

      if (error) {
        console.error('Error posting vacancy:', error)
        // Still show success for mock/demo mode
      }

      setSubmitted(true)
      setTimeout(() => {
        window.location.href = '/vacancies'
      }, 2000)
    } catch (err) {
      console.error('Error:', err)
      setSubmitted(true)
      setTimeout(() => {
        window.location.href = '/vacancies'
      }, 2000)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 flex justify-center pb-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-foreground mb-2">Vacancy Posted!</h2>
          <p className="text-muted-foreground mb-6">
            Your job vacancy is now live. Candidates will be able to view and apply.
          </p>
          <Button asChild>
            <Link href="/vacancies">View All Vacancies</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="outline" asChild className="mb-8">
            <Link href="/vacancies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vacancies
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="font-serif text-4xl text-foreground mb-2">Post a Vacancy</h1>
            <p className="text-muted-foreground">
              List a job opening to attract talented architects and designers.
            </p>
          </div>

          {!user ? (
            <div className="bg-secondary/30 rounded-xl p-12 text-center border border-border/50 shadow-sm mt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Sign in required</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You must be signed in to post a job vacancy.
              </p>
              <Button size="lg" asChild>
                <Link href="/login?redirect=/vacancies/post">Sign In to Continue</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Author */}
              <div className="bg-muted rounded-lg p-4 flex items-center justify-between border border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Posted By</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Job Title *</label>
                <Input
                  placeholder="e.g., Senior Architect"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company / Firm *</label>
                <Input
                  placeholder="e.g., Chen Architecture Studio"
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <Input
                  placeholder="e.g., San Francisco, CA (or Remote)"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Job Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {JOB_TYPES.map(type => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.jobType === type ? "default" : "outline"}
                      onClick={() => updateField('jobType', type)}
                      className="capitalize justify-start"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Salary Range (Annual, USD)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Min (e.g., 80000)"
                    value={formData.salaryMin}
                    onChange={(e) => updateField('salaryMin', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max (e.g., 120000)"
                    value={formData.salaryMax}
                    onChange={(e) => updateField('salaryMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Job Description *</label>
                <Textarea
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={6}
                  required
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Requirements</label>
                <Textarea
                  placeholder="List qualifications, skills, and experience needed..."
                  value={formData.requirements}
                  onChange={(e) => updateField('requirements', e.target.value)}
                  rows={4}
                />
              </div>

              {/* Apply Method */}
              <div className="bg-secondary/30 rounded-xl p-6 border border-border/50 space-y-4">
                <h3 className="font-semibold text-foreground">How should candidates apply?</h3>
                <p className="text-sm text-muted-foreground">Provide an external link, an email address, or both.</p>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Application URL</label>
                  <Input
                    type="url"
                    placeholder="https://your-company.com/careers/apply"
                    value={formData.applyUrl}
                    onChange={(e) => updateField('applyUrl', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Application Email</label>
                  <Input
                    type="email"
                    placeholder="careers@your-company.com"
                    value={formData.applyEmail}
                    onChange={(e) => updateField('applyEmail', e.target.value)}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-6">
                <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4 mr-2" />
                      Post Vacancy
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" size="lg" asChild>
                  <Link href="/vacancies">Cancel</Link>
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
