import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Heart, Eye, Share2, MapPin, Calendar, User, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { portfolioProjects, architects } from "@/lib/data"

interface PortfolioDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { id } = await params
  const project = portfolioProjects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  const architect = architects.find((a) => a.id === project.architectId)
  const relatedProjects = portfolioProjects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.architectId === project.architectId))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Image */}
      <section className="pt-16">
        <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Floating Stats */}
          <div className="absolute bottom-8 left-8 flex items-center gap-6 text-background/90">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {project.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              {project.likes.toLocaleString()} likes
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-4">
                {project.category}
              </Badge>
              <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {project.year}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 lg:w-48">
              <Button size="lg" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Architect Card */}
          {architect && (
            <div className="bg-card rounded-xl border border-border p-6 mb-12">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Designed By
              </h2>
              <Link
                href={`/architects/${architect.id}`}
                className="flex items-center gap-4 group"
              >
                <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={architect.image}
                    alt={architect.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {architect.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{architect.title}</p>
                  <p className="text-sm text-muted-foreground">{architect.location}</p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
              <div className="mt-4 pt-4 border-t border-border">
                <Button asChild className="w-full sm:w-auto">
                  <Link href={`/contact?architect=${architect.id}&project=${project.id}`}>
                    Contact Architect
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Project Gallery */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-foreground mb-6">Project Gallery</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={`${project.image}&seed=${i}`}
                    alt={`${project.title} - Image ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-foreground mb-6">Related Projects</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/portfolio/${relatedProject.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                      <Image
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                      {relatedProject.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{relatedProject.architect}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button variant="outline" asChild>
              <Link href="/portfolio">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
