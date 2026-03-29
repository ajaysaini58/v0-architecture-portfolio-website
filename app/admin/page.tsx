'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart3, Users, FileText, MessageSquare, Settings, LogOut, Edit2, Trash2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { blogPosts } from '@/lib/data'

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [editingBlog, setEditingBlog] = useState<string | null>(null)
  const [siteConfig, setSiteConfig] = useState({
    siteName: 'Design By Architect',
    shortName: 'DByARCH',
    tagline: 'Connect with world-class architects',
    contactEmail: 'admin@designbyarchitect.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA, USA',
  })

  const pendingBlogs = blogPosts.filter(p => p.status === 'pending')
  const approvedBlogs = blogPosts.filter(p => p.status === 'approved')
  const totalUsers = 156
  const totalArchitects = 45
  const totalProjects = 89

  const handleSiteConfigUpdate = (field: string, value: string) => {
    setSiteConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleApproveBlog = (id: string) => {
    console.log('[v0] Approving blog:', id)
    // In a real app, this would update the database
  }

  const handleRejectBlog = (id: string) => {
    console.log('[v0] Rejecting blog:', id)
    // In a real app, this would delete from pending
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-serif font-bold text-primary-foreground text-sm">D</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-lg tracking-tight font-bold">DByARCH</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="font-serif text-3xl text-foreground">{totalUsers}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <Badge>Verified</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Architects</p>
              <p className="font-serif text-3xl text-foreground">{totalArchitects}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary">Open</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Projects Posted</p>
              <p className="font-serif text-3xl text-foreground">{totalProjects}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline">{pendingBlogs.length} Pending</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Blog Submissions</p>
              <p className="font-serif text-3xl text-foreground">{approvedBlogs.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-secondary w-full sm:w-auto justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="blogs">Blog Moderation</TabsTrigger>
              <TabsTrigger value="settings">Site Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emma Wilson', 'Alex Rodriguez'].map((name, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                            {name.split(' ')[0][0]}
                          </div>
                          <span className="text-sm">{name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Active now</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Stats */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-4">Platform Health</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">User Engagement</span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '87%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Content Quality</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">System Performance</span>
                        <span className="text-sm font-medium">98%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '98%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Blog Moderation Tab */}
            <TabsContent value="blogs" className="space-y-6">
              <div className="space-y-6">
                {/* Pending Blogs */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold text-lg">Pending Approval ({pendingBlogs.length})</h3>
                  </div>
                  {pendingBlogs.length > 0 ? (
                    <div className="space-y-3">
                      {pendingBlogs.map((blog) => (
                        <div key={blog.id} className="bg-card rounded-xl border border-border p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-foreground">{blog.title}</h4>
                              <p className="text-sm text-muted-foreground">By {blog.author}</p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApproveBlog(blog.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectBlog(blog.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-secondary rounded-lg">
                      <p className="text-muted-foreground">No pending blogs</p>
                    </div>
                  )}
                </div>

                {/* Approved Blogs */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold text-lg">Approved Posts ({approvedBlogs.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {approvedBlogs.slice(0, 5).map((blog) => (
                      <div key={blog.id} className="bg-card rounded-xl border border-border p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{blog.title}</h4>
                            <p className="text-sm text-muted-foreground">By {blog.author} • {blog.likes} likes • {blog.comments.length} comments</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Live</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
                <h3 className="font-semibold text-lg mb-6">Site Configuration</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteConfig.siteName}
                      onChange={(e) => handleSiteConfigUpdate('siteName', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shortName">Short Name / Logo Text</Label>
                    <Input
                      id="shortName"
                      value={siteConfig.shortName}
                      onChange={(e) => handleSiteConfigUpdate('shortName', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={siteConfig.tagline}
                      onChange={(e) => handleSiteConfigUpdate('tagline', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={siteConfig.contactEmail}
                      onChange={(e) => handleSiteConfigUpdate('contactEmail', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={siteConfig.phone}
                      onChange={(e) => handleSiteConfigUpdate('phone', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={siteConfig.address}
                      onChange={(e) => handleSiteConfigUpdate('address', e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
