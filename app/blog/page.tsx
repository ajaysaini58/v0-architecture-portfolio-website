'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Plus, Calendar, Heart, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { getBlogPosts, supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'

export default function BlogPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getBlogPosts(supabase, { status: 'approved' })
        setPosts(data || [])
      } catch (err) {
        console.error('Failed to load blog posts:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadPosts()
  }, [])

  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)))

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              Architect Insights
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover perspectives from leading architects on design trends, sustainability, and innovative solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button asChild>
              <Link href={user ? "/blog/write" : "/login?redirect=/blog/write"}>
                <Plus className="h-4 w-4 mr-2" />
                Write Article
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Categories:</span>
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <span className="flex items-center gap-2 text-muted-foreground">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading articles...
              </span>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <article className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Image */}
                      <div className="relative h-64 sm:h-auto overflow-hidden">
                        <Image
                          src={post.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge>{post.category}</Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Author & Meta */}
                        <div>
                          <div className="flex items-center gap-3 mb-4 pb-4 border-t border-border">
                            <Image
                              src={post.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                              alt={post.author || 'Author'}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{post.author || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(post.published_date || post.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments ? post.comments.length : 0}
                            </span>
                            <span className="ml-auto group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Read More <ArrowRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground mb-4">No articles found.</p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory(null) }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
