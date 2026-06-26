import Link from 'next/link';
import { ArrowRight, Building2, Users, Briefcase, MessageSquare, Search, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/30">
                <span className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-sm font-medium text-accent">Welcome to ArchConnect</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Your Professional Architecture{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                  Network
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Connect architects with clients, showcase portfolios, post projects, and build meaningful professional relationships in the architecture industry.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <p className="text-sm text-muted-foreground mt-1">Architects</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">2,500+</div>
                <p className="text-sm text-muted-foreground mt-1">Projects Posted</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">For Every Role</h2>
            <p className="text-lg text-muted-foreground">
              Whether you&apos;re an architect showcasing your work or a client seeking talent, we have the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Architect Card */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>For Architects</CardTitle>
                <CardDescription>Showcase your talent and grow your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Showcase your portfolio with stunning galleries</span>
                  </li>
                  <li className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Bid on projects and expand your client base</span>
                  </li>
                  <li className="flex gap-3">
                    <Users className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Direct messaging with potential clients</span>
                  </li>
                  <li className="flex gap-3">
                    <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Build verified reputation through reviews</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-6">
                  <Link href="/signup?role=architect">Register as Architect</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Client Card */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>For Clients</CardTitle>
                <CardDescription>Find and hire the perfect architect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Search className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Browse verified architect portfolios</span>
                  </li>
                  <li className="flex gap-3">
                    <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Post projects and receive competitive bids</span>
                  </li>
                  <li className="flex gap-3">
                    <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Connect directly with architects</span>
                  </li>
                  <li className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Track project progress and manage budgets</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full mt-6">
                  <Link href="/signup?role=client">Register as Client</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Other Roles */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">Students</h3>
                <p className="text-sm text-muted-foreground mb-4">Find internships and mentorship opportunities</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signup?role=student">Sign Up</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">HR & Recruiters</h3>
                <p className="text-sm text-muted-foreground mb-4">Post job opportunities in architecture</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signup?role=company_hr">Sign Up</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center md:col-span-3 md:w-1/3 md:mx-auto">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">Companies</h3>
                <p className="text-sm text-muted-foreground mb-4">Hire architects and build your team</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signup?role=company_hr">Sign Up</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground">
              Connect with thousands of architects and clients building amazing projects together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">1K+</div>
                <p className="text-muted-foreground">Active architects sharing portfolios</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-accent mb-2">500+</div>
                <p className="text-muted-foreground">Projects successfully completed</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-secondary mb-2">$5M+</div>
                <p className="text-muted-foreground">In projects facilitated</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 lg:py-32 bg-card border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Latest from Our Blog</h2>
            <p className="text-lg text-muted-foreground">
              Insights on architecture, design trends, and industry best practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4" />
                  <CardTitle className="line-clamp-2">Exploring Sustainable Design in 2024</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    Discover how modern architects are incorporating sustainability into their projects while maintaining aesthetic excellence.
                  </p>
                  <Link href="#" className="text-primary hover:underline text-sm font-medium">
                    Read More →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/blog">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of architects and clients transforming the built environment together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
