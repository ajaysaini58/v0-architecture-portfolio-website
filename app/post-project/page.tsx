"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar,
  FileText,
  Upload,
  CheckCircle,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const projectTypes = [
  { value: "residential", label: "Residential", icon: "🏠" },
  { value: "commercial", label: "Commercial", icon: "🏢" },
  { value: "interior", label: "Interior Design", icon: "🎨" },
  { value: "renovation", label: "Renovation", icon: "🔨" },
  { value: "landscape", label: "Landscape", icon: "🌳" },
  { value: "public", label: "Public Space", icon: "🏛️" },
]

const budgetRanges = [
  "Under $100,000",
  "$100,000 - $250,000",
  "$250,000 - $500,000",
  "$500,000 - $1,000,000",
  "$1,000,000 - $2,500,000",
  "$2,500,000+",
]

const timelines = [
  "3-6 months",
  "6-12 months",
  "12-18 months",
  "18-24 months",
  "24+ months",
]

const steps = [
  { id: 1, label: "Project Type", icon: Building2 },
  { id: 2, label: "Details", icon: FileText },
  { id: 3, label: "Location & Budget", icon: MapPin },
  { id: 4, label: "Timeline", icon: Calendar },
  { id: 5, label: "Review", icon: CheckCircle },
]

export default function PostProjectPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    projectType: "",
    title: "",
    description: "",
    requirements: "",
    location: "",
    budget: "",
    timeline: "",
    deadline: "",
    files: [] as string[],
  })

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.projectType !== ""
      case 2:
        return formData.title !== "" && formData.description !== ""
      case 3:
        return formData.location !== "" && formData.budget !== ""
      case 4:
        return formData.timeline !== ""
      default:
        return true
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    alert("Project posted successfully! (Demo)")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-8 bg-secondary/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-2">
            Post a New Project
          </h1>
          <p className="text-muted-foreground">
            Tell us about your project and receive bids from talented architects.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : step.id < currentStep
                        ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                        : "bg-secondary text-muted-foreground"
                  )}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2",
                      step.id < currentStep ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Project Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                  What type of project is this?
                </h2>
                <p className="text-muted-foreground">
                  Select the category that best describes your project.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateFormData("projectType", type.value)}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left",
                      formData.projectType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-3xl">{type.icon}</span>
                    <span className="font-medium text-foreground">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                  Tell us about your project
                </h2>
                <p className="text-muted-foreground">
                  Provide details to help architects understand your vision.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="e.g., Modern Family Home in Malibu"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Description <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Describe your project, including the type of space, style preferences, and any specific requirements..."
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specific Requirements
                  </label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => updateFormData("requirements", e.target.value)}
                    placeholder="Any specific features, materials, or design elements you want included..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reference Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop images here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Budget */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                  Location & Budget
                </h2>
                <p className="text-muted-foreground">
                  Help architects understand the scope of your project.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Location <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      placeholder="City, State or Full Address"
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget Range <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => updateFormData("budget", value)}
                  >
                    <SelectTrigger className="h-12">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
                    <Info className="h-3 w-3 mt-0.5 shrink-0" />
                    This is an estimate. Final costs will be discussed with your chosen architect.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Timeline */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                  Project Timeline
                </h2>
                <p className="text-muted-foreground">
                  When do you want to start and how long do you expect the project to take?
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Duration <span className="text-destructive">*</span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {timelines.map((timeline) => (
                      <button
                        key={timeline}
                        onClick={() => updateFormData("timeline", timeline)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                          formData.timeline === timeline
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">{timeline}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bid Deadline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => updateFormData("deadline", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Architects will submit their proposals before this date.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                  Review Your Project
                </h2>
                <p className="text-muted-foreground">
                  Please review your project details before posting.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border divide-y divide-border">
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Project Type</p>
                  <p className="font-medium text-card-foreground capitalize">{formData.projectType}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Project Title</p>
                  <p className="font-medium text-card-foreground">{formData.title}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-card-foreground">{formData.description}</p>
                </div>
                {formData.requirements && (
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground mb-1">Requirements</p>
                    <p className="text-card-foreground">{formData.requirements}</p>
                  </div>
                )}
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium text-card-foreground">{formData.location}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Budget Range</p>
                  <p className="font-medium text-card-foreground">{formData.budget}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Timeline</p>
                  <p className="font-medium text-card-foreground">{formData.timeline}</p>
                </div>
                {formData.deadline && (
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground mb-1">Bid Deadline</p>
                    <p className="font-medium text-card-foreground">
                      {new Date(formData.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 rounded-xl p-5 flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Once posted, your project will be visible to all architects on the platform. 
                  You&apos;ll receive notifications when architects submit their bids.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Post Project
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
