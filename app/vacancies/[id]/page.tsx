'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, DollarSign, Briefcase, Clock, ExternalLink, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { supabase } from '@/lib/supabase'
import { vacancies as mockVacancies } from '@/lib/data'

export default function VacancyDetailPage() {
  const { id } = useParams()
  const [vacancy, setVacancy] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchVacancy() {
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !data) {
          throw new Error('Fallback')
        }
        setVacancy(data)
      } catch {
        const local = mockVacancies.find(v => v.id === id)
        setVacancy(local || null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVacancy()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 flex justify-center pb-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-8 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-serif">Vacancy Not Found</h2>
          <p className="text-muted-foreground mt-2">This vacancy may have been removed or does not exist.</p>
          <Button asChild className="mt-6">
            <Link href="/vacancies">Browse All Vacancies</Link>
          </Button>
        </div>
      </div>
    )
  }

  const applyUrl = vacancy.apply_url || vacancy.applyUrl
  const applyEmail = vacancy.apply_email || vacancy.applyEmail
  const salaryMin = vacancy.salary_min || vacancy.salaryMin
  const salaryMax = vacancy.salary_max || vacancy.salaryMax
  const jobType = vacancy.job_type || vacancy.jobType
  const createdAt = vacancy.created_at || vacancy.createdAt

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="outline" asChild className="mb-6">
            <Link href="/vacancies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Vacancies
            </Link>
          </Button>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="capitalize">{jobType}</Badge>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl text-foreground">{vacancy.title}</h1>

            <p className="text-lg font-medium text-foreground">{vacancy.company}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2 text-muted-foreground">
              {vacancy.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {vacancy.location}
                </div>
              )}
              {salaryMin && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  ${salaryMin.toLocaleString()} - ${salaryMax?.toLocaleString()}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Posted {new Date(createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {vacancy.description}
              </p>
            </div>

            {vacancy.requirements && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {vacancy.requirements}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: Apply */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6 space-y-6">
              <h3 className="font-semibold text-lg">How to Apply</h3>

              {applyUrl && (
                <Button asChild className="w-full" size="lg">
                  <a href={applyUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply on Website
                  </a>
                </Button>
              )}

              {applyEmail && (
                <Button asChild variant={applyUrl ? "outline" : "default"} className="w-full" size="lg">
                  <a href={`mailto:${applyEmail}?subject=Application for ${vacancy.title}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Application
                  </a>
                </Button>
              )}

              {!applyUrl && !applyEmail && (
                <p className="text-sm text-muted-foreground">
                  Contact the poster directly for application details.
                </p>
              )}

              <div className="pt-4 border-t border-border space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{vacancy.company}</p>
                </div>
                {vacancy.location && (
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{vacancy.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Job Type</p>
                  <p className="font-medium capitalize">{jobType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
