import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ArchitectCardProps {
  id: string
  name: string
  title: string
  location: string
  image: string
  coverImage: string
  rating: number
  reviewCount: number
  projectCount: number
  specialties: string[]
  featured?: boolean
}

export function ArchitectCard({
  id,
  name,
  title,
  location,
  image,
  coverImage,
  rating,
  reviewCount,
  projectCount,
  specialties,
  featured = false,
}: ArchitectCardProps) {
  return (
    <Link href={`/architects/${id}`} className="group block">
      <article className="bg-card rounded-xl overflow-hidden border border-border/50 card-hover shadow-sm">
        {/* Cover Image */}
        <div className="relative h-48 image-hover-zoom">
          <Image
            src={coverImage}
            alt={`${name}'s portfolio`}
            fill
            className="object-cover"
          />
          {featured && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground backdrop-blur-md border-transparent shadow-sm">
              Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-6 relative">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-4 border-card shadow-md shrink-0 -mt-12 group-hover:border-primary/20 transition-colors duration-300 bg-card">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="font-serif text-lg text-card-foreground truncate group-hover:text-primary transition-colors">{name}</h3>
              <p className="text-sm text-muted-foreground truncate">{title}</p>
            </div>
          </div>

          {/* Location & Stats */}
          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground/80">
              <MapPin className="h-4 w-4" />
              <span className="truncate tracking-wide">{location}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-muted-foreground/80 font-medium">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-foreground">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground/50">({reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground/80">
            <Briefcase className="h-4 w-4" />
            <span className="tracking-wide">{projectCount} projects completed</span>
          </div>

          {/* Specialties */}
          <div className="mt-5 pt-5 border-t border-border/50 flex flex-wrap gap-2">
            {specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs font-medium bg-secondary/50 hover:bg-secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
