"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, MapPin, DollarSign, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { projectBids } from "@/lib/data"
import { supabase } from "@/lib/supabase"

// A hybrid approach: attempt Supabase, fallback to hardcoded mock data for demonstration
export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("project_bids")
          .select("*")
          .order("created_at", { ascending: false })

        if (error || !data || data.length === 0) {
          // Fallback to mock data if table is empty or connection fails
          setProjects(projectBids)
        } else {
          setProjects(data)
        }
      } catch (err) {
        setProjects(projectBids)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    // Handling both Supabase schema and Mock Data schema differences
    const title = project.projectTitle || project.project_title || ""
    const client = project.client || project.client_name || ""
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
            Available Projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse active architectural projects, find the perfect match for your expertise, 
            and submit your proposal to clients looking for visionaries.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name or client..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Project List */}
          {isLoading ? (
             <div className="flex justify-center py-20">
               <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
             </div>
          ) : (
            <div className="grid gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Left side: Project Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-serif text-2xl text-card-foreground group-hover:text-primary transition-colors">
                          {project.projectTitle || project.project_title}
                        </h3>
                        <Badge 
                          variant="secondary"
                          className={project.status === 'Open' ? 'bg-green-100/50 text-green-700 hover:bg-green-100/70' : ''}
                        >
                          {project.status || 'Open'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4" />
                          {project.budget || (project.budget_min ? `$${project.budget_min} - $${project.budget_max}` : 'Not Specified')}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {project.timeline || 'Flexible'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side: Actions */}
                    <div className="flex flex-col items-start lg:items-end justify-between min-w-[200px] gap-4 lg:gap-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Posted by </span>
                        <span className="font-medium text-foreground">{project.client || project.client_name}</span>
                      </div>
                      <Button asChild className="w-full lg:w-auto">
                        <Link href={`/projects/${project.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border/50">
                  <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                  <p className="text-muted-foreground">We couldn't find any projects matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
