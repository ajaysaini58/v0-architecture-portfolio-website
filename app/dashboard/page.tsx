"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { projectBids, architectBids } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

const statusColors = {
  "Open": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Under Review": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Closed": "bg-muted text-muted-foreground",
  "Awarded": "bg-primary/10 text-primary",
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { user, role, isLoading } = useAuth()

  const safeFilteredBids = projectBids.filter((bid) => {
    if (role === 'admin') return true;
    if (role === 'client') return true; // Mock: client sees their projects
    if (role === 'architect') {
       // Mock: Architect sees projects they have bid on
       const hasBid = architectBids.some(ab => ab.projectId === bid.id && ab.architectId === "mock-architect");
       // For demo purposes, we let them see first 2
       return bid.id === 'bid-1' || bid.id === 'bid-2'; 
    }
    return false;
  })

  const filteredBids = safeFilteredBids.filter((bid) => {
    const matchesSearch = bid.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.client.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "open") return matchesSearch && bid.status === "Open"
    if (activeTab === "review") return matchesSearch && bid.status === "Under Review"
    return matchesSearch
  })

  const stats = [
    {
      label: "Active Projects",
      value: safeFilteredBids.filter((b) => b.status === "Open").length,
      icon: AlertCircle,
      color: "text-green-600",
    },
    {
      label: "Under Review",
      value: safeFilteredBids.filter((b) => b.status === "Under Review").length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Total Bids Received",
      value: safeFilteredBids.reduce((acc, b) => acc + b.bidsReceived, 0),
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Projects Completed",
      value: 12,
      icon: CheckCircle,
      color: "text-blue-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {isLoading ? (
        <div className="pt-32 flex justify-center pb-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : !user ? (
        <div className="pt-32 pb-8 max-w-2xl mx-auto text-center">
           <h2 className="text-2xl font-serif">Sign in required</h2>
           <p className="text-muted-foreground mt-2">Please log in to view your dashboard.</p>
        </div>
      ) : (
      <>
      {/* Header */}
      <section className="pt-24 pb-8 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-2">
                Bidding Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your projects and review bids from architects
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/post-project">
                <Plus className="h-4 w-4 mr-2" />
                Post New Project
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-secondary", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-card-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="review">Under Review</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Projects Table/Cards */}
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-card-foreground truncate">
                        {bid.projectTitle}
                      </h3>
                      <Badge className={cn("shrink-0", statusColors[bid.status as keyof typeof statusColors])}>
                        {bid.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Client: {bid.client}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {bid.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {bid.budget}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {bid.timeline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {new Date(bid.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Bids & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-center px-4 py-2 bg-secondary rounded-lg">
                      <p className="text-2xl font-semibold text-foreground">{bid.bidsReceived}</p>
                      <p className="text-xs text-muted-foreground">Bids</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/project/${bid.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Bids
                        </Link>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                  {bid.description}
                </p>

                {/* Project Type Badge */}
                <div className="mt-4">
                  <Badge variant="secondary">{bid.projectType}</Badge>
                </div>
              </div>
            ))}

            {filteredBids.length === 0 && (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground mb-4">No projects found.</p>
                <Button asChild>
                  <Link href="/post-project">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Project
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      </>
      )}

      <Footer />
    </div>
  )
}
