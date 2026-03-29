import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { portfolioProjects } from "@/lib/data"

export default function PortfolioPage() {
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
          <PortfolioGrid projects={portfolioProjects} columns={3} showFilters={true} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
