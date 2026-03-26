"use client"

import { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Star,
  CheckCircle,
  MessageSquare,
  User,
  Building,
  Eye,
  Heart,
  Award,
  X,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { projectBids, architectBids } from "@/lib/data"
import { cn } from "@/lib/utils"

const statusColors = {
  "Open": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Under Review": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Closed": "bg-muted text-muted-foreground",
  "Awarded": "bg-primary/10 text-primary",
}

const bidStatusColors = {
  "Pending": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Shortlisted": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Accepted": "bg-primary/10 text-primary",
  "Declined": "bg-muted text-muted-foreground",
}

export default function ProjectBidsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedBid, setSelectedBid] = useState<string | null>(null)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  
  const project = projectBids.find((p) => p.id === id)
  const bids = architectBids.filter((b) => b.projectId === id)
  
  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="font-serif text-2xl text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you are looking for does not exist.</p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const selectedBidData = bids.find((b) => b.id === selectedBid)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-8 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
                  {project.projectTitle}
                </h1>
                <Badge className={cn(statusColors[project.status as keyof typeof statusColors])}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Posted by {project.client} on {new Date(project.postedDate).toLocaleDateString()}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {project.budget}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {project.timeline}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center px-6 py-3 bg-card rounded-xl border border-border">
                <p className="text-3xl font-semibold text-foreground">{bids.length}</p>
                <p className="text-sm text-muted-foreground">Bids Received</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg text-card-foreground mb-3">Project Description</h2>
            <p className="text-muted-foreground">{project.description}</p>
            <div className="mt-4">
              <Badge variant="secondary">{project.projectType}</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Bids Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-foreground mb-6">
            Architect Bids ({bids.length})
          </h2>

          {bids.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No bids received yet.</p>
              <p className="text-sm text-muted-foreground">
                Check back later or promote your project to attract more architects.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className={cn(
                    "bg-card rounded-xl border border-border p-6 transition-all hover:shadow-md cursor-pointer",
                    selectedBid === bid.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedBid(bid.id)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Architect Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={bid.architectImage}
                          alt={bid.architect}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-card-foreground">
                            {bid.architect}
                          </h3>
                          <Badge className={cn("text-xs", bidStatusColors[bid.status as keyof typeof bidStatusColors])}>
                            {bid.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            {bid.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {bid.projectsCompleted} projects
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bid Details */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Proposed Budget</p>
                        <p className="font-semibold text-foreground">{bid.proposedBudget}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Timeline</p>
                        <p className="font-semibold text-foreground">{bid.proposedTimeline}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="font-semibold text-foreground">
                          {new Date(bid.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/architects/${bid.architectId}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Link>
                      </Button>
                      {bid.status === "Pending" && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedBid(bid.id)
                              setShowAcceptDialog(true)
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedBid(bid.id)
                              setShowDeclineDialog(true)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {bid.status === "Shortlisted" && (
                        <Badge className="bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          Shortlisted
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {bid.message}
                      </p>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {selectedBid === bid.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="font-medium text-card-foreground mb-2">Full Proposal</h4>
                      <p className="text-muted-foreground">{bid.message}</p>
                      
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/architects/${bid.architectId}`}>
                            View Full Portfolio
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Accept Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept this bid?</DialogTitle>
            <DialogDescription>
              You are about to accept the bid from {selectedBidData?.architect}. 
              This will award the project to them and notify all other bidders.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Proposed Budget</p>
                  <p className="font-semibold">{selectedBidData?.proposedBudget}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="font-semibold">{selectedBidData?.proposedTimeline}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowAcceptDialog(false)
              // In a real app, this would make an API call
              alert(`Bid accepted! ${selectedBidData?.architect} has been notified.`)
            }}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm & Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline this bid?</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline the bid from {selectedBidData?.architect}? 
              They will be notified of your decision.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setShowDeclineDialog(false)
                // In a real app, this would make an API call
                alert(`Bid declined. ${selectedBidData?.architect} has been notified.`)
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Decline Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
