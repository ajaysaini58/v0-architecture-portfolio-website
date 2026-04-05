'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, MessageCircle, Share2, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { getBlogPostById, addBlogComment, supabase, incrementBlogLikes } from '@/lib/supabase'

export default function BlogDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getBlogPostById(supabase, id)
        setPost(data)
      } catch (error) {
        console.error('Failed to load blog post:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (id) {
      loadPost()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading post...
        </span>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-2">Post not found</h1>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <BlogDetailContent post={post} setPost={setPost} />
  )
}

function BlogDetailContent({ post, setPost }: { post: any, setPost: any }) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [comments, setComments] = useState(post.blog_comments || [])
  const [newComment, setNewComment] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLike = async () => {
    if (isLiked) return;
    setIsLiked(true)
    setLikes(likes + 1)
    try {
      await incrementBlogLikes(supabase, post.id)
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddComment = async () => {
    if (commentAuthor.trim() && newComment.trim()) {
      setIsSubmitting(true)
      try {
        const comment = await addBlogComment(supabase, post.id, {
          author: commentAuthor,
          content: newComment
        })
        setComments([...comments, comment])
        setNewComment('')
        setCommentAuthor('')
      } catch (error) {
        console.error('Failed to add comment', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Image */}
      <section className="relative h-96 w-full overflow-hidden">
        <Image
          src={post.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="outline" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge>{post.category}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_date || post.created_at).toLocaleDateString()}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <Image
                src={post.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                alt={post.author || 'Author'}
                width={56}
                height={56}
                className="rounded-full"
              />
              <div>
                <Link href={`/architects/${post.user_id}`} className="font-semibold hover:text-primary transition-colors">
                  {post.author || 'Unknown'}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Posted on {new Date(post.published_date || post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-8">
            {post.content?.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 py-6 border-t border-b border-border mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={isLiked ? 'bg-primary text-primary-foreground' : ''}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              {comments.length}
            </Button>
            <Button variant="outline" size="sm" className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Comments Section */}
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-xl mb-6">Comments ({comments.length})</h3>

              {/* Add Comment Form */}
              <div className="bg-card rounded-xl border border-border p-6 mb-8">
                <h4 className="font-semibold mb-4">Leave a Comment</h4>
                <div className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                  />
                  <Textarea
                    placeholder="Your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none"
                    rows={4}
                  />
                  <Button onClick={handleAddComment} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Posting...
                      </span>
                    ) : (
                      'Post Comment'
                    )}
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{comment.content}</p>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      {comment.likes || 0}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
