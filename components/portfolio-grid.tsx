"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Eye, Heart, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PortfolioProject {
  id: string
  title: string
  architect: string
  architectId: string
  category: string
  location: string
  year: string
  image: string
  likes: number
  views: number
}

interface PortfolioGridProps {
  projects: PortfolioProject[]
  columns?: 2 | 3 | 4
  showFilters?: boolean
}

const categories = [
  "All",
  "Residential",
  "Commercial",
  "Interior",
  "Landscape",
  "Public",
  "Renovation",
]

export function PortfolioGrid({ projects, columns = 3, showFilters = true }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((project) => project.category === activeCategory)

  return (
    <div className="space-y-8">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 text-sm rounded-full transition-colors",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div
        className={cn(
          "grid gap-6",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            href={`/portfolio/${project.id}`}
            className="group block"
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <article className="relative overflow-hidden rounded-lg bg-card">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-foreground/60 flex flex-col justify-end p-5 transition-opacity duration-300",
                    hoveredId === project.id ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div className="flex items-center gap-4 text-background/80 text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {project.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {project.likes.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-background">{project.title}</h3>
                  <p className="text-sm text-background/80 mt-1">
                    by {project.architect}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary" className="bg-background/20 text-background border-0">
                      {project.category}
                    </Badge>
                    <span className="text-xs text-background/60">{project.location} &middot; {project.year}</span>
                  </div>
                </div>

                {/* View Icon */}
                <div
                  className={cn(
                    "absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 flex items-center justify-center transition-all duration-300",
                    hoveredId === project.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  )}
                >
                  <ExternalLink className="h-4 w-4 text-foreground" />
                </div>
              </div>

              {/* Info (visible when not hovering) */}
              <div
                className={cn(
                  "p-4 transition-opacity duration-300",
                  hoveredId === project.id ? "opacity-0 h-0 p-0 overflow-hidden" : "opacity-100"
                )}
              >
                <h3 className="font-medium text-card-foreground truncate">{project.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.architect}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No projects found in this category.</p>
        </div>
      )}
    </div>
  )
}
