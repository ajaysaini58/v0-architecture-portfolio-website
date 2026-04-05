"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  MapPin, Mail, Phone, Globe, Instagram, Linkedin, Twitter,
  DollarSign, Briefcase, Star, Edit2, Plus, Trash2, Upload,
  Building2, Award, Clock, ExternalLink, Camera
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import {
  getArchitectByUserId,
  updateArchitectProfile,
  getPortfolioProjectsByArchitect,
  addPortfolioProject,
  deletePortfolioProject,
  uploadPortfolioImage,
  uploadAvatarImage,
  supabase,
} from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ArchitectData {
  id: string
  user_id: string
  name: string
  title: string
  location: string
  image_url: string | null
  cover_image_url: string | null
  rating: number
  review_count: number
  project_count: number
  bio: string
  specialties: string[]
  hourly_rate: number | null
  minimum_project_budget: number | null
  email: string
  phone: string | null
  instagram_url: string | null
  linkedin_url: string | null
  website_url: string | null
  twitter_url: string | null
}

interface PortfolioItem {
  id: string
  title: string
  category: string | null
  location: string | null
  year: number | null
  image_url: string | null
  description: string | null
  likes: number
  views: number
}

export default function ProfilePage() {
  const { user, role, profile, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [architectData, setArchitectData] = useState<ArchitectData | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [editForm, setEditForm] = useState<Partial<ArchitectData>>({})
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    location: "",
    year: new Date().getFullYear(),
    description: "",
    image_url: "",
  })
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user) return
    try {
      const architect = await getArchitectByUserId(user.id)
      if (architect) {
        setArchitectData(architect)
        setEditForm(architect)
        const projects = await getPortfolioProjectsByArchitect(supabase, architect.id)
        if (projects) setPortfolioItems(projects)
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (user) fetchData()
  }, [user, authLoading, router, fetchData])

  const handleSaveProfile = async () => {
    if (!user || !editForm) return
    setIsSaving(true)
    try {
      // Upload avatar if selected
      if (avatarFile) {
        setUploadingAvatar(true)
        const avatarUrl = await uploadAvatarImage(avatarFile, user.id)
        editForm.image_url = avatarUrl
        setUploadingAvatar(false)
      }

      const updates: Record<string, any> = {
        name: editForm.name,
        title: editForm.title,
        location: editForm.location,
        bio: editForm.bio,
        phone: editForm.phone,
        hourly_rate: editForm.hourly_rate ? Number(editForm.hourly_rate) : null,
        minimum_project_budget: editForm.minimum_project_budget ? Number(editForm.minimum_project_budget) : null,
        specialties: editForm.specialties || [],
        instagram_url: editForm.instagram_url,
        linkedin_url: editForm.linkedin_url,
        website_url: editForm.website_url,
        twitter_url: editForm.twitter_url,
        image_url: editForm.image_url,
      }

      const updated = await updateArchitectProfile(user.id, updates)
      setArchitectData(updated)
      setIsEditing(false)
      setAvatarFile(null)
    } catch (err) {
      console.error("Error saving profile:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddProject = async () => {
    if (!architectData) return
    setIsSaving(true)
    try {
      let imageUrl = newProject.image_url

      // Upload image if a file was selected
      if (projectImageFile && user) {
        imageUrl = await uploadPortfolioImage(projectImageFile, user.id)
      }

      const project = await addPortfolioProject({
        title: newProject.title,
        architect_id: architectData.id,
        category: newProject.category || null,
        location: newProject.location || null,
        year: newProject.year || null,
        image_url: imageUrl || null,
        description: newProject.description || null,
      })

      setPortfolioItems([project, ...portfolioItems])
      setShowAddProject(false)
      setNewProject({ title: "", category: "", location: "", year: new Date().getFullYear(), description: "", image_url: "" })
      setProjectImageFile(null)
    } catch (err) {
      console.error("Error adding project:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deletePortfolioProject(projectId)
      setPortfolioItems(portfolioItems.filter(p => p.id !== projectId))
    } catch (err) {
      console.error("Error deleting project:", err)
    }
  }

  const handleSpecialtyChange = (value: string) => {
    const current = editForm.specialties || []
    if (current.includes(value)) {
      setEditForm({ ...editForm, specialties: current.filter(s => s !== value) })
    } else {
      setEditForm({ ...editForm, specialties: [...current, value] })
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  // Non-architect user profile (Client / HR)
  if (role !== "architect" || !architectData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="font-serif text-2xl text-primary">
                  {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </span>
              </div>
              <h1 className="font-serif text-3xl text-foreground mb-2">
                {profile ? `${profile.firstName} ${profile.lastName}` : user?.email}
              </h1>
              <p className="text-muted-foreground capitalize mb-1">{role} Account</p>
              {profile?.company && (
                <p className="text-sm text-muted-foreground">{profile.company}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
              <div className="mt-8 flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/projects">My Projects</Link>
                </Button>
                {(role === "hr") && (
                  <Button variant="outline" asChild>
                    <Link href="/vacancies/post">Post Vacancy</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // Architect Profile
  const specialtyOptions = [
    "Modern Residential", "Commercial", "Interior", "Sustainable Design",
    "Luxury Residential", "Renovation", "Historic Preservation", "Public Buildings",
    "Landscape", "Mixed-Use", "Urban Planning", "Coastal Architecture",
    "Smart Homes", "Minimalist", "Resort Design", "Educational",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Profile Header */}
      <section className="pt-20">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary/80 to-primary/40">
          {architectData.cover_image_url && (
            <Image
              src={architectData.cover_image_url}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 pb-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-xl border-4 border-background bg-secondary overflow-hidden shadow-lg">
                  {architectData.image_url ? (
                    <Image
                      src={architectData.image_url}
                      alt={architectData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <span className="font-serif text-4xl text-primary">
                        {architectData.name?.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setAvatarFile(e.target.files[0])
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Name & Basics */}
              <div className="flex-1 pt-4 sm:pt-8">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Full Name"
                      className="text-2xl font-serif h-auto py-1 px-2"
                    />
                    <Input
                      value={editForm.title || ""}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title (e.g. Principal Architect)"
                      className="h-auto py-1 px-2"
                    />
                    <Input
                      value={editForm.location || ""}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="City, State"
                      className="h-auto py-1 px-2"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="font-serif text-3xl sm:text-4xl text-foreground">{architectData.name}</h1>
                    <p className="text-lg text-muted-foreground mt-1">{architectData.title}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {architectData.location}
                      </span>
                      {architectData.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {architectData.rating} ({architectData.review_count} reviews)
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {architectData.project_count} projects
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Edit Button */}
              <div className="sm:pt-8">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setIsEditing(false); setEditForm(architectData); setAvatarFile(null); }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="about" className="space-y-8">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio ({portfolioItems.length})</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="social">Social & Contact</TabsTrigger>
            </TabsList>

            {/* ABOUT TAB */}
            <TabsContent value="about" className="space-y-8">
              {/* Bio */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-serif text-xl mb-4">About</h2>
                {isEditing ? (
                  <textarea
                    value={editForm.bio || ""}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell clients about yourself, your design philosophy, and your experience..."
                    rows={5}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {architectData.bio || "No bio added yet. Click Edit Profile to add one."}
                  </p>
                )}
              </div>

              {/* Specialties */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-serif text-xl mb-4">Specialties & Experience</h2>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => handleSpecialtyChange(specialty)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                          (editForm.specialties || []).includes(specialty)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(architectData.specialties || []).length > 0 ? (
                      architectData.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="px-3 py-1">
                          {specialty}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No specialties added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* PORTFOLIO TAB */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-xl">My Portfolio</h2>
                <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Portfolio Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Project Title *</Label>
                        <Input
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="e.g. Modern Beach House"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                            placeholder="e.g. Residential"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            type="number"
                            value={newProject.year}
                            onChange={(e) => setNewProject({ ...newProject, year: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newProject.location}
                          onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                          placeholder="e.g. Malibu, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          placeholder="Describe this project..."
                          rows={3}
                          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Project Image</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            id="project-image"
                            className="sr-only"
                            onChange={(e) => {
                              if (e.target.files?.[0]) setProjectImageFile(e.target.files[0])
                            }}
                          />
                          <label htmlFor="project-image" className="cursor-pointer">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {projectImageFile ? projectImageFile.name : "Click to upload an image"}
                            </p>
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground">Or paste an image URL:</p>
                        <Input
                          value={newProject.image_url}
                          onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleAddProject}
                        disabled={!newProject.title || isSaving}
                      >
                        {isSaving ? "Adding..." : "Add Project"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {portfolioItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioItems.map((project) => (
                    <div key={project.id} className="group relative bg-card rounded-lg border border-border overflow-hidden card-hover">
                      <div className="relative aspect-[4/3]">
                        {project.image_url ? (
                          <Image
                            src={project.image_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <Building2 className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-foreground">{project.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {project.category && <Badge variant="secondary" className="text-xs">{project.category}</Badge>}
                          {project.location && <span>{project.location}</span>}
                          {project.year && <span>• {project.year}</span>}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No portfolio projects yet.</p>
                  <Button onClick={() => setShowAddProject(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Project
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* PRICING TAB */}
            <TabsContent value="pricing" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-serif text-xl mb-6">Pricing & Rates</h2>
                {isEditing ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Hourly Rate ($)</Label>
                      <Input
                        type="number"
                        value={editForm.hourly_rate || ""}
                        onChange={(e) => setEditForm({ ...editForm, hourly_rate: parseInt(e.target.value) || null })}
                        placeholder="e.g. 250"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Project Budget ($)</Label>
                      <Input
                        type="number"
                        value={editForm.minimum_project_budget || ""}
                        onChange={(e) => setEditForm({ ...editForm, minimum_project_budget: parseInt(e.target.value) || null })}
                        placeholder="e.g. 75000"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Hourly Rate</p>
                        <p className="font-serif text-2xl text-foreground">
                          {architectData.hourly_rate ? `$${architectData.hourly_rate.toLocaleString()}/hr` : "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Minimum Project Budget</p>
                        <p className="font-serif text-2xl text-foreground">
                          {architectData.minimum_project_budget ? `$${architectData.minimum_project_budget.toLocaleString()}` : "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* SOCIAL & CONTACT TAB */}
            <TabsContent value="social" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-serif text-xl mb-6">Contact Information</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={architectData.email} disabled className="bg-secondary" />
                      <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{architectData.email}</span>
                    </div>
                    {architectData.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">{architectData.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-serif text-xl mb-6">Social Media</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" /> Instagram
                      </Label>
                      <Input
                        value={editForm.instagram_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </Label>
                      <Input
                        value={editForm.linkedin_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" /> Twitter
                      </Label>
                      <Input
                        value={editForm.twitter_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, twitter_url: e.target.value })}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Website
                      </Label>
                      <Input
                        value={editForm.website_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, website_url: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { icon: Instagram, label: "Instagram", url: architectData.instagram_url },
                      { icon: Linkedin, label: "LinkedIn", url: architectData.linkedin_url },
                      { icon: Twitter, label: "Twitter", url: architectData.twitter_url },
                      { icon: Globe, label: "Website", url: architectData.website_url },
                    ].map(({ icon: Icon, label, url }) => (
                      <div key={label} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            {label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not added</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
