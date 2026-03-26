import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, Building2, Users, Award, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArchitectCard } from "@/components/architect-card"
import { architects, portfolioProjects } from "@/lib/data"

export default function HomePage() {
  const featuredArchitects = architects.filter((a) => a.featured).slice(0, 3)
  const featuredProjects = portfolioProjects.slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop"
            alt="Modern architecture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <p className="text-primary-foreground/80 text-sm uppercase tracking-widest mb-4">
              Architecture Platform
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary-foreground leading-tight text-balance">
              Where Vision Meets
              <br />
              <span className="text-primary">Extraordinary Design</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
              Connect with world-class architects who transform spaces into living art. 
              Browse portfolios, post your project, and bring your architectural vision to life.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link href="/architects">
                  Find an Architect
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                <Link href="/post-project">
                  Post Your Project
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              <div>
                <p className="font-serif text-3xl text-primary-foreground">500+</p>
                <p className="text-sm text-primary-foreground/60 mt-1">Architects</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-primary-foreground">2,500+</p>
                <p className="text-sm text-primary-foreground/60 mt-1">Projects</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-primary-foreground">98%</p>
                <p className="text-sm text-primary-foreground/60 mt-1">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative z-20 -mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-xl shadow-xl p-6 border border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by specialty, location, or name..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button size="lg" className="sm:w-auto">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-primary mb-3">How It Works</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
            Your Dream Space in Three Steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Browse & Discover</h3>
            <p className="text-muted-foreground leading-relaxed">
              Explore portfolios from hundreds of talented architects. Filter by style, location, and specialty.
            </p>
          </div>
          <div className="text-center p-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
              <Building2 className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Post Your Project</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share your vision and receive proposals from interested architects who match your needs.
            </p>
          </div>
          <div className="text-center p-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Collaborate & Build</h3>
            <p className="text-muted-foreground leading-relaxed">
              Work directly with your chosen architect to bring your architectural vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Architects */}
      <section className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary mb-3">Featured Architects</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                Meet Our Top Talent
              </h2>
            </div>
            <Button variant="outline" asChild className="mt-4 sm:mt-0">
              <Link href="/architects">
                View All Architects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArchitects.map((architect) => (
              <ArchitectCard key={architect.id} {...architect} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary mb-3">Portfolio Showcase</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                Inspiring Projects
              </h2>
            </div>
            <Button variant="outline" asChild className="mt-4 sm:mt-0">
              <Link href="/portfolio">
                Browse All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.id}`}
                className="group block relative aspect-[4/5] rounded-lg overflow-hidden"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-lg text-background">{project.title}</h3>
                  <p className="text-sm text-background/70 mt-1">{project.architect}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary-foreground/70 mb-3">Why Architure</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-primary-foreground mb-8">
                The Trusted Platform for Architecture Excellence
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 shrink-0 text-primary-foreground/80" />
                  <div>
                    <h3 className="font-semibold mb-1">Vetted Professionals</h3>
                    <p className="text-primary-foreground/70 text-sm leading-relaxed">
                      Every architect on our platform is carefully vetted for credentials, experience, and portfolio quality.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Award className="h-6 w-6 shrink-0 text-primary-foreground/80" />
                  <div>
                    <h3 className="font-semibold mb-1">Award-Winning Talent</h3>
                    <p className="text-primary-foreground/70 text-sm leading-relaxed">
                      Access architects who have been recognized with industry awards and featured in top publications.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Users className="h-6 w-6 shrink-0 text-primary-foreground/80" />
                  <div>
                    <h3 className="font-semibold mb-1">Seamless Collaboration</h3>
                    <p className="text-primary-foreground/70 text-sm leading-relaxed">
                      Our platform facilitates smooth communication and project management from start to finish.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1000&fit=crop"
                alt="Modern architecture interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether you&apos;re dreaming of a new home, renovating a space, or planning a commercial project, 
            we&apos;ll help you find the perfect architect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/post-project">
                Post Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/architects">
                Browse Architects
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
