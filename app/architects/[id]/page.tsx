import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Star, Briefcase, Mail, Phone, Calendar, ArrowLeft, ExternalLink, DollarSign, Zap, Instagram, Linkedin, Globe, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { architects, portfolioProjects } from "@/lib/data"

interface ArchitectPageProps {
  params: Promise<{ id: string }>
}

export default async function ArchitectPage({ params }: ArchitectPageProps) {
  const { id } = await params
  const architect = architects.find((a) => a.id === id)

  if (!architect) {
    notFound()
  }

  const architectProjects = portfolioProjects.filter(
    (p) => p.architectId === architect.id
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-16">
        {/* Cover Image */}
        <div className="relative h-64 sm:h-80 lg:h-96">
          <Image
            src={architect.coverImage}
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
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-xl overflow-hidden border-4 border-background shadow-md shrink-0 mx-auto sm:mx-0">
                <Image
                  src={architect.image}
                  alt={architect.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="font-serif text-3xl text-card-foreground">{architect.name}</h1>
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
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {architect.rating.toFixed(1)} ({architect.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {architect.projectCount} projects
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {architect.specialties.map((specialty) => (
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
                  <Link href={`/post-project?architect=${architect.id}`}>
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
                  <p className="text-2xl font-serif text-foreground">${architect.hourlyRate}/hour</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Project Budget</p>
                  <p className="text-2xl font-serif text-foreground">${architect.minimumProjectBudget.toLocaleString()}</p>
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
                {architect.social.instagram && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={architect.social.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                )}
                {architect.social.linkedin && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={architect.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {architect.social.twitter && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={architect.social.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                )}
                {architect.social.website && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={architect.social.website} target="_blank" rel="noopener noreferrer">
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
              <TabsTrigger value="portfolio">Portfolio ({architectProjects.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-8">
              {/* Bio */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{architect.bio}</p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <p className="font-serif text-4xl text-foreground mb-2">{architect.projectCount}</p>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <p className="font-serif text-4xl text-foreground mb-2">{architect.rating.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <p className="font-serif text-4xl text-foreground mb-2">{architect.reviewCount}</p>
                  <p className="text-sm text-muted-foreground">Client Reviews</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 shrink-0" />
                    <span>{architect.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 shrink-0" />
                    <span>{architect.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>{architect.location}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              {architectProjects.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {architectProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/portfolio/${project.id}`}
                      className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.image}
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
                        <p className="text-sm text-muted-foreground">{project.location} &middot; {project.year}</p>
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
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-lg font-medium text-secondary-foreground">
                          {["JD", "SM", "AR"][i - 1]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">
                            {["John D.", "Sarah M.", "Alex R."][i - 1]}
                          </h3>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`h-4 w-4 ${j < 5 ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {["Residential Project", "Commercial Interior", "Home Renovation"][i - 1]} &middot;{" "}
                          {["3 months ago", "6 months ago", "1 year ago"][i - 1]}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          {[
                            "Working with this architect was an absolute pleasure. They understood our vision from day one and delivered a home that exceeded our expectations.",
                            "Exceptional attention to detail and creative problem-solving. Our office space transformation was remarkable.",
                            "Professional, responsive, and incredibly talented. Would highly recommend to anyone looking for quality architectural work.",
                          ][i - 1]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="about" className="space-y-8">
            <TabsList className="bg-secondary w-full sm:w-auto justify-start">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio ({architectProjects.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-8">
              {/* Bio */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{architect.bio}</p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <p className="font-serif text-4xl text-foreground mb-2">{architect.projectCount}</p>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <p className="font-serif text-4xl text-foreground mb-2">{architect.rating.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <p className="font-serif text-4xl text-foreground mb-2">{architect.reviewCount}</p>
                  <p className="text-sm text-muted-foreground">Client Reviews</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 shrink-0" />
                    <span>contact@{architect.id.replace("-", "")}.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 shrink-0" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>{architect.location}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              {architectProjects.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {architectProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/portfolio/${project.id}`}
                      className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.image}
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
                        <p className="text-sm text-muted-foreground">{project.location} &middot; {project.year}</p>
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
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-lg font-medium text-secondary-foreground">
                          {["JD", "SM", "AR"][i - 1]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">
                            {["John D.", "Sarah M.", "Alex R."][i - 1]}
                          </h3>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`h-4 w-4 ${j < 5 ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {["Residential Project", "Commercial Interior", "Home Renovation"][i - 1]} &middot;{" "}
                          {["3 months ago", "6 months ago", "1 year ago"][i - 1]}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          {[
                            "Working with this architect was an absolute pleasure. They understood our vision from day one and delivered a home that exceeded our expectations.",
                            "Exceptional attention to detail and creative problem-solving. Our office space transformation was remarkable.",
                            "Professional, responsive, and incredibly talented. Would highly recommend to anyone looking for quality architectural work.",
                          ][i - 1]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
