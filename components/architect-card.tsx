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
      <article className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={coverImage}
            alt={`${name}'s portfolio`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {featured && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-background shadow-sm shrink-0 -mt-10">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="font-semibold text-card-foreground truncate">{name}</h3>
              <p className="text-sm text-muted-foreground truncate">{title}</p>
            </div>
          </div>

          {/* Location & Stats */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span>{rating.toFixed(1)}</span>
                <span className="text-muted-foreground/60">({reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{projectCount} projects completed</span>
          </div>

          {/* Specialties */}
          <div className="mt-4 flex flex-wrap gap-2">
            {specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
