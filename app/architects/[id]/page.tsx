"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Briefcase, Mail, Phone, Calendar, ArrowLeft, ExternalLink, DollarSign, Zap, Instagram, Linkedin, Globe, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getArchitectById, getPortfolioProjectsByArchitect, getArchitectReviews, supabase } from "@/lib/supabase"

export default function ArchitectPage() {
  const params = useParams()
  const id = params.id as string
  const [architect, setArchitect] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!id) return
      setIsLoading(true)
      try {
        const [arch, projs, revs] = await Promise.all([
          getArchitectById(supabase, id),
          getPortfolioProjectsByArchitect(supabase, id),
          getArchitectReviews(supabase, id)
        ])
        setArchitect(arch)
        setProjects(projs)
        setReviews(revs)
      } catch (error) {
        console.error("Error loading architect data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (!architect) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-serif">Architect not found</h1>
          <Button asChild variant="outline">
            <Link href="/architects">Back to Architects</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-16">
        {/* Cover Image */}
        <div className="relative h-64 sm:h-80 lg:h-96">
          <Image
            src={architect.cover_image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"}
            alt={`${architect.name}'s work`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="bg-card rounded-xl border border-border shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-xl overflow-hidden border-4 border-background shadow-md shrink-0 mx-auto sm:mx-0 bg-secondary">
                {architect.image_url ? (
                  <Image
                    src={architect.image_url}
                    alt={architect.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="font-serif text-4xl text-primary">
                      {architect.name?.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left text-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="font-serif text-3xl">{architect.name}</h1>
                  {architect.featured && (
                    <Badge className="w-fit mx-auto sm:mx-0">Featured</Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground mb-4">{architect.title}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {architect.location}
                  </span>
                  {architect.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      {architect.rating.toFixed(1)} ({architect.review_count} reviews)
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {architect.project_count || projects.length} projects
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {(architect.specialties || []).map((specialty: string) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-4 sm:mt-0">
                <Button size="lg" asChild>
                  <Link href={`/contact?architect=${architect.id}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Connect
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={`/projects/new?architect=${architect.id}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Request Quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Social */}
      <section className="py-8 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Pricing Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Availability
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-serif text-foreground">
                    {architect.hourly_rate ? `$${architect.hourly_rate}/hour` : "Contact for pricing"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Project Budget</p>
                  <p className="text-2xl font-serif text-foreground">
                    {architect.minimum_project_budget ? `$${architect.minimum_project_budget.toLocaleString()}` : "No minimum"}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Connect on Social
              </h3>
              <div className="flex flex-wrap gap-3">
                {architect.instagram_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={architect.instagram_url} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                )}
                {architect.linkedin_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={architect.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {architect.twitter_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={architect.twitter_url} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                )}
                {architect.website_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={architect.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="about" className="space-y-8">
            <TabsList className="bg-secondary w-full sm:w-auto justify-start">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio ({projects.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-8">
              {/* Bio */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {architect.bio || "This architect hasn't shared a bio yet."}
                </p>
              </div>

              {/* Contact Info */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 shrink-0" />
                    <span>{architect.email}</span>
                  </div>
                  {architect.phone && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="h-5 w-5 shrink-0" />
                      <span>{architect.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>{architect.location}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              {projects.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/portfolio/${project.id}`}
                      className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-4 w-4 text-foreground" />
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-card-foreground mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.location} &middot; {project.year}
                        </p>
                        <Badge variant="secondary" className="mt-3">
                          {project.category}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No portfolio projects yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-card rounded-xl border border-border p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-lg font-medium text-secondary-foreground">
                            {review.client_name?.[0] || 'C'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{review.title || 'Client Review'}</h3>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${j < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            {review.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No reviews yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Back Link */}
          <div className="mt-12">
            <Button variant="outline" asChild>
              <Link href="/architects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Architects
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
