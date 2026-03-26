"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, MapPin, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArchitectCard } from "@/components/architect-card"
import { architects } from "@/lib/data"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const specialties = [
  "All Specialties",
  "Modern Residential",
  "Commercial",
  "Interior",
  "Sustainable Design",
  "Luxury Residential",
  "Renovation",
  "Historic Preservation",
  "Public Buildings",
  "Landscape",
  "Mixed-Use",
  "Urban Planning",
]

const locations = [
  "All Locations",
  "San Francisco, CA",
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Miami, FL",
  "Seattle, WA",
]

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
  { value: "projects", label: "Most Projects" },
  { value: "reviews", label: "Most Reviews" },
]

export default function ArchitectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [sortBy, setSortBy] = useState("featured")
  const [minRating, setMinRating] = useState<number | null>(null)

  const filteredArchitects = useMemo(() => {
    let result = [...architects]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.title.toLowerCase().includes(query) ||
          a.specialties.some((s) => s.toLowerCase().includes(query))
      )
    }

    // Specialty filter
    if (selectedSpecialty !== "All Specialties") {
      result = result.filter((a) =>
        a.specialties.some((s) =>
          s.toLowerCase().includes(selectedSpecialty.toLowerCase())
        )
      )
    }

    // Location filter
    if (selectedLocation !== "All Locations") {
      result = result.filter((a) => a.location === selectedLocation)
    }

    // Rating filter
    if (minRating) {
      result = result.filter((a) => a.rating >= minRating)
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "projects":
        result.sort((a, b) => b.projectCount - a.projectCount)
        break
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [searchQuery, selectedSpecialty, selectedLocation, sortBy, minRating])

  const activeFiltersCount = [
    selectedSpecialty !== "All Specialties",
    selectedLocation !== "All Locations",
    minRating !== null,
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedSpecialty("All Specialties")
    setSelectedLocation("All Locations")
    setMinRating(null)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Specialty */}
      <div>
        <label className="text-sm font-medium mb-3 block">Specialty</label>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full transition-colors",
                selectedSpecialty === specialty
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium mb-3 block">Location</label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating */}
      <div>
        <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
        <div className="flex gap-2">
          {[4.5, 4.7, 4.8, 4.9].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? null : rating)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors",
                minRating === rating
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              {rating}+
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-8 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              Find Your Architect
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover talented architects who can bring your vision to life. 
              Browse portfolios, compare styles, and connect with professionals.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, specialty, or style..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-6">Filters</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{filteredArchitects.length}</span>{" "}
                    architects found
                  </p>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden flex-1 sm:flex-initial">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grid */}
              {filteredArchitects.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredArchitects.map((architect) => (
                    <ArchitectCard key={architect.id} {...architect} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground mb-4">No architects found matching your criteria.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
