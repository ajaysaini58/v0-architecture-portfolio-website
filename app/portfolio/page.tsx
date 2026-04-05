"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { portfolioProjects as mockProjects } from "@/lib/data"
import { supabase } from "@/lib/supabase"

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>(mockProjects)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*, architects(name)')
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          // Map Supabase data to match the component's expected format
          const mapped = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            architect: p.architects?.name || "Unknown",
            architectId: p.architect_id,
            category: p.category || "Other",
            location: p.location || "",
            year: p.year?.toString() || "",
            image: p.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
            likes: p.likes || 0,
            views: p.views || 0,
            description: p.description || "",
          }))
          // Merge with mock if Supabase has data, or show Supabase-only
          setProjects([...mapped, ...mockProjects])
        } else {
          setProjects(mockProjects)
        }
      } catch {
        setProjects(mockProjects)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              Portfolio Gallery
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore stunning architectural projects from our community of talented architects. 
              Get inspired by residential, commercial, and public space designs.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <PortfolioGrid projects={projects} columns={3} showFilters={true} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
