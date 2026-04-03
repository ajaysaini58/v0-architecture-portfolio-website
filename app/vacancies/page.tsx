'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, MapPin, DollarSign, Clock, Briefcase, ArrowRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase'
import { vacancies as mockVacancies } from '@/lib/data'

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship']

export default function VacanciesPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [vacancies, setVacancies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchVacancies() {
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })

        if (error || !data || data.length === 0) {
          setVacancies(mockVacancies)
        } else {
          setVacancies(data)
        }
      } catch {
        setVacancies(mockVacancies)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVacancies()
  }, [])

  const filteredVacancies = vacancies.filter(v => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.location || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'All' ||
      (v.job_type || v.jobType || '').toLowerCase() === selectedType.toLowerCase()
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              Job Vacancies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore career opportunities in architecture and design. Find your next role or post a vacancy for your firm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {user ? (
              <Button asChild>
                <Link href="/vacancies/post">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Vacancy
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login?redirect=/vacancies/post">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Vacancy
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Job Type:</span>
            {JOB_TYPES.map(type => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Vacancy List */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredVacancies.length > 0 ? (
            <div className="grid gap-6">
              {filteredVacancies.map((vacancy) => (
                <Link key={vacancy.id} href={`/vacancies/${vacancy.id}`}>
                  <article className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                            {vacancy.title}
                          </h3>
                          <Badge variant="secondary" className="capitalize">
                            {vacancy.job_type || vacancy.jobType}
                          </Badge>
                        </div>

                        <p className="text-sm font-medium text-foreground mb-2">
                          {vacancy.company}
                        </p>

                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {vacancy.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {vacancy.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {vacancy.location}
                            </div>
                          )}
                          {(vacancy.salary_min || vacancy.salaryMin) && (
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4" />
                              ${(vacancy.salary_min || vacancy.salaryMin)?.toLocaleString()} - ${(vacancy.salary_max || vacancy.salaryMax)?.toLocaleString()}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {new Date(vacancy.created_at || vacancy.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          View Details <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No vacancies found.</p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedType('All') }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
