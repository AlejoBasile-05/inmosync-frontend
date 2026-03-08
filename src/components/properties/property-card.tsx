import Image from "next/image"
import { MapPin, Bed, Bath, Ruler, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"

export interface Property {
  id: string
  title: string
  location: string
  price: number
  currency: string
  beds: number
  baths: number
  sqft: number
  status: "FREE" | "BUSY"
  mainImageUrl: string
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const statusConfig = {
    FREE: {
      label: "Disponible",
      className: "bg-emerald-500/90 text-white border-emerald-500/90",
    },
    BUSY: {
      label: "Reservado",
      className: "bg-slate-500/90 text-white border-slate-500/90",
    },
  }

  const status = statusConfig[property.status as keyof typeof statusConfig] || {
    label: String(property.status || "UNDEFINED"),
    className: "bg-red-500 border-red-500 text-white",
  }

  return (
    <Card className="overflow-hidden p-0 group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.mainImageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className={`absolute top-3 left-3 ${status.className}`}>
          {status.label}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <p className="text-xl font-bold text-foreground">
          {property.currency === "USD" ? "$" : property.currency}
          {property.price.toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>

        <div className="space-y-1">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Bed className="size-4" />
            <span>{property.beds}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="size-4" />
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="size-4" />
            <span>{property.sqft.toLocaleString()} m²</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border p-3 flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
          <Edit className="size-3.5" />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-3.5" />
          Borrar
        </Button>
      </CardFooter>
    </Card>
  )
}
