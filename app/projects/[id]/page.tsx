"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Calendar, Lock, CheckCircle } from "lucide-react"
import { projectBids, architectBids } from "@/lib/data"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const { user, role, isLoading: authLoading } = useAuth()
  
  const [project, setProject] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hybrid Strategy: Try Supabase, fallback to Mock Data
    async function fetchProjectData() {
      try {
        const { data: projData, error: projError } = await supabase
          .from("project_bids")
          .select("*")
          .eq("id", id)
          .single()

        if (projError || !projData) {
          throw new Error("Fallback")
        }
        setProject(projData)

        // Only fetch bids if authenticated and relevant roles
        if (user && role) {
          const { data: bidsData } = await supabase
             .from("architect_bids")
             .select("*")
             .eq("project_bid_id", id)
          
          if (bidsData) setBids(bidsData)
        }

      } catch (err) {
        // Fallback to local mock data
        const localProject = projectBids.find(p => p.id === id)
        setProject(localProject || null)

        if (user && role) {
          // Fake mock bids for testing purposes
          const localBids = architectBids.filter(b => b.projectId === id)
          setBids(localBids)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjectData()
  }, [id, user, role])

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 flex justify-center pb-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-32 pb-8 max-w-2xl mx-auto text-center">
           <h2 className="text-2xl font-serif">Project Not Found</h2>
           <p className="text-muted-foreground mt-2">The project you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  // Define Bid Visibility Logic
  let viewableBids = []
  let canBid = false
  
  if (role === 'admin' || role === 'client') {
    // Clients see all bids on their project (Mocking that they own this project)
    viewableBids = bids;
  } else if (role === 'architect') {
    // Architects see ONLY their own bids.
    viewableBids = bids.filter(b => b.architectId === "mock-architect") // Fallback mock id checking
    if (viewableBids.length === 0) {
      canBid = true;
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Project Header */}
      <section className="pt-24 pb-12 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{project.projectType || 'Architecture'}</Badge>
              <Badge 
                 variant="outline" 
                 className={project.status === 'Open' ? 'text-green-600 border-green-600/30' : ''}
              >
                 {project.status || 'Open'}
              </Badge>
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl">{project.projectTitle || project.project_title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-muted-foreground">
               <div className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {project.location}</div>
               <div className="flex items-center gap-2"><DollarSign className="h-4 w-4"/> {project.budget || 'Not specified'}</div>
               <div className="flex items-center gap-2"><Clock className="h-4 w-4"/> {project.timeline || 'Flexible timeline'}</div>
               <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Posted: {project.postedDate || new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
                <div className="prose prose-sm dark:prose-invert">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
             </div>
             
             {/* Dynamic Bidding Section based on Roles */}
             <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Proposals & Bids</h2>
                
                {!user ? (
                   <div className="bg-secondary/30 rounded-lg p-8 text-center border border-border/50">
                     <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                     <h3 className="font-semibold mb-2">Sign in to view bids</h3>
                     <p className="text-muted-foreground text-sm mb-4">You must be logged in as an Architect to submit a proposal, or as a Client to review bids.</p>
                     <Button asChild><Link href="/">Go Log In</Link></Button>
                   </div>
                ) : (
                   <div>
                     {viewableBids.length > 0 ? (
                       <ul className="space-y-4">
                         {viewableBids.map((bid, i) => (
                           <li key={i} className="flex flex-col sm:flex-row justify-between p-4 border border-border rounded-lg bg-background">
                             <div>
                               <p className="font-medium text-foreground">Architect ID: {bid.architectId}</p>
                               <p className="text-sm text-muted-foreground mt-1">Status: {bid.status}</p>
                             </div>
                             <div className="mt-2 sm:mt-0 text-right">
                               <p className="font-semibold text-foreground">{bid.proposedBudget || bid.proposed_budget}</p>
                             </div>
                           </li>
                         ))}
                       </ul>
                     ) : (
                       <div className="text-center py-6">
                         <p className="text-muted-foreground">No bids to show for your account level.</p>
                       </div>
                     )}

                     {canBid && (
                       <div className="mt-6 pt-6 border-t border-border">
                         <h3 className="font-semibold mb-4">Submit Your Proposal</h3>
                         <Button className="w-full sm:w-auto">Draft Proposal</Button>
                       </div>
                     )}
                   </div>
                )}
             </div>
          </div>

          {/* Right Column: Sticky Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Client Information</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{project.client || project.client_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verified Status</p>
                  <p className="font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Payment Verified
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-muted-foreground mb-1">Total Bids Received</p>
                  <p className="font-serif text-2xl">{project.bidsReceived || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <Footer />
    </div>
  )
}
