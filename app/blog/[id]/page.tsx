'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Heart, MessageCircle, Share2, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { blogPosts } from '@/lib/data'

interface BlogDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params
  const post = blogPosts.find(p => p.id === id)

  if (!post) {
    notFound()
  }

  return (
    <BlogDetailContent post={post} />
  )
}

function BlogDetailContent({ post }: { post: typeof blogPosts[0] }) {
  const [likes, setLikes] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [comments, setComments] = useState(post.comments)
  const [newComment, setNewComment] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleAddComment = () => {
    if (commentAuthor.trim() && newComment.trim()) {
      const comment = {
        id: `comment-${Date.now()}`,
        author: commentAuthor,
        content: newComment,
        date: new Date().toLocaleDateString(),
        likes: 0,
      }
      setComments([...comments, comment])
      setNewComment('')
      setCommentAuthor('')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Image */}
      <section className="relative h-96 w-full overflow-hidden">
        <Image
          src={post.image}
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
                {new Date(post.publishedDate).toLocaleDateString()}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <Image
                src={post.authorImage}
                alt={post.author}
                width={56}
                height={56}
                className="rounded-full"
              />
              <div>
                <Link href={`/architects/${post.authorId}`} className="font-semibold hover:text-primary transition-colors">
                  {post.author}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Posted on {new Date(post.publishedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-8">
            {post.content.split('\n\n').map((paragraph, index) => (
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
                  <Button onClick={handleAddComment} className="w-full">
                    Post Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">{comment.date}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{comment.content}</p>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      {comment.likes}
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
