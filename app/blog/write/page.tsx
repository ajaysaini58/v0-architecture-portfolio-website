'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

const CATEGORIES = ["Sustainability", "Interior Design", "Urban Planning", "Renovation", "Design Theory", "Coastal Design", "Commercial"]

export default function WriteBlogPage() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && excerpt && content && category) {
      console.log('[v0] Blog post submitted:', { title, excerpt, content, category })
      setSubmitted(true)
      setTimeout(() => {
        window.location.href = '/blog'
      }, 2000)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-foreground mb-2">Article Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your article has been submitted for admin approval. Once approved, it will appear on the blog.
          </p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Button variant="outline" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="font-serif text-4xl text-foreground mb-2">Write an Article</h1>
            <p className="text-muted-foreground">
              Share your architectural insights with the community. Articles are subject to admin approval before publishing.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Article Title
              </label>
              <Input
                placeholder="Enter article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    onClick={() => setCategory(cat)}
                    className="justify-start"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Excerpt
              </label>
              <Textarea
                placeholder="Brief summary of your article (will appear in previews)"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Article Content
              </label>
              <Textarea
                placeholder="Write your full article here... (Use double line breaks to separate paragraphs)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Use double line breaks to separate paragraphs for better formatting.
              </p>
            </div>

            {/* Note */}
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm text-secondary-foreground">
                <strong>Admin Review:</strong> Your article will be reviewed by our admin team before being published. This typically takes 24-48 hours. We maintain editorial standards to ensure quality content.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-6">
              <Button type="submit" size="lg" className="flex-1">
                Submit for Review
              </Button>
              <Button type="button" variant="outline" size="lg" asChild>
                <Link href="/blog">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
