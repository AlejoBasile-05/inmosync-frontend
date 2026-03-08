"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Search, Bed, Bath, Ruler, Send, MapPin, Home, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Skeleton } from "@/src/components/ui/skeleton"
import { cn } from "@/src/lib/utils"
import { propertyService, type FrontendProperty } from "@/src/services/property.service"
import { useToast } from "../../hooks/use-toast"
import { chatService } from "../../services/chat.service"

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

interface Property {
  id: string
  title: string
  type: string
  location: string
  price: number
  currency: string
  mainImageUrl: string
  beds: number
  baths: number
  sqft: number
  characteristics: string[]
  status: "Available" | "Reserved"
}

interface PropertyCatalogProps {
  clientId: string;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Luxury Downtown Apartment",
    location: "245 W Grand Ave, Chicago, IL",
    price: 485000,
    type: "Apartment",
    currency: "ARS",
    mainImageUrl: "/images/property-1.jpg",
    beds: 2,
    baths: 2,
    sqft: 1_250,
    characteristics: ["Modern", "Luxury"],
    status: "Available",
  },
  {
    id: "prop-2",
    title: "Charming Suburban Home",
    location: "18 Maple Dr, Evanston, IL",
    price: 625000,
    type: "House",
    currency: "ARS",
    mainImageUrl: "/images/property-2.jpg",
    beds: 4,
    baths: 3,
    sqft: 2_800,
    characteristics: ["Charming", "Suburban"],
    status: "Available",
  },
  {
    id: "prop-3",
    title: "Modern Beachfront Condo",
    type: "Condo",
    location: "900 Ocean Blvd, Miami, FL",
    price: 1150000,
    currency: "ARS",
    mainImageUrl: "/images/property-3.jpg",
    beds: 3,
    baths: 2,
    sqft: 1_900,
    characteristics: ["Modern", "Beachfront"],
    status: "Reserved",
  },
  {
    id: "prop-4",
    title: "Elegant City Penthouse",
    type: "Penthouse",
    location: "1 Central Park W, New York, NY",
    price: 3200000,
    currency: "ARS",
    mainImageUrl: "/images/property-4.jpg",
    beds: 3,
    baths: 3,
    sqft: 3_100,
    characteristics: ["Elegant", "City"],
    status: "Available",
  },
  {
    id: "prop-5",
    title: "Cozy Industrial Loft",
    type: "Loft",
    location: "742 N Wells St, Chicago, IL",
    price: 350000,
    currency: "ARS",
    mainImageUrl: "/images/property-5.jpg",
    beds: 1,
    baths: 1,
    sqft: 850,
    characteristics: ["Cozy", "Industrial"],
    status: "Available",
  },
  {
    id: "prop-6",
    title: "Contemporary Townhouse",
    type: "Townhouse",
    location: "32 Elm St, Austin, TX",
    price: 540000,
    currency: "ARS",
    mainImageUrl: "/images/property-6.jpg",
    beds: 3,
    baths: 2,
    sqft: 2_100,
    characteristics: ["Contemporary", "Townhouse"],
    status: "Reserved",
  },
]

// ---------------------------------------------------------------------------
// Filter chips
// ---------------------------------------------------------------------------

type FilterKey = "all" | "1bed" | "2bed" | "3bed+" | "under500k" | "500k-1m" | "1m+"

interface FilterOption {
  key: FilterKey
  label: string
}

const FILTERS: FilterOption[] = [
  { key: "all", label: "All" },
  { key: "under500k", label: "< $500k" },
  { key: "500k-1m", label: "$500k–1M" },
  { key: "1m+", label: "$1M+" },
  { key: "1bed", label: "1 Bed" },
  { key: "2bed", label: "2 Beds" },
  { key: "3bed+", label: "3+ Beds" },
]

function parsePriceToNumber(price: string): number {
  return Number(price.replace(/[^0-9.]/g, ""))
}

function matchesFilter(property: Property, filter: FilterKey): boolean {
  if (filter === "all") return true
  const price = property.price
  switch (filter) {
    case "under500k":
      return price < 500_000
    case "500k-1m":
      return price >= 500_000 && price < 1_000_000
    case "1m+":
      return price >= 1_000_000
    case "1bed":
      return property.beds === 1
    case "2bed":
      return property.beds === 2
    case "3bed+":
      return property.beds >= 3
    default:
      return true
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PropertyCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-3">
      <Skeleton className="h-24 w-24 shrink-0 rounded-md" />
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  )
}

function PropertyCard({
  property,
  onSend,
}: {
  property: Property
  onSend: (property: Property) => void
}) {
  const isAvailable = property.status === "Available"

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/50"
      )}
    >

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
        <Image
          src={property.mainImageUrl}
          alt={property.title}
          fill
          className="object-cover"
          sizes="96px"
        />
        <Badge
          className={cn(
            "absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0 leading-5 border-none shadow-sm",
            isAvailable
              ? "bg-emerald-500/90 text-card"
              : "bg-muted-foreground/80 text-card"
          )}
        >
          {property.status}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between overflow-hidden">
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold leading-tight text-foreground">
            {property.price}
          </span>
          <span className="truncate text-sm font-semibold text-foreground">
            {property.title}
          </span>
          <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            {property.location}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="size-3.5" />
              {property.beds}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3.5" />
              {property.baths}
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="size-3.5" />
              {property.sqft.toLocaleString()}
              <span className="sr-only">square feet</span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
            onClick={() => onSend(property)}
            aria-label={`Send ${property.title} to chat`}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Home className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          No se encontraron propiedades.
        </p>
        <p className="text-xs text-muted-foreground">
          Intenta ajustar tu búsqueda o filtros para encontrar listados que coincidan.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PropertyCatalog({ clientId }: PropertyCatalogProps) {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [dbProperties, setDbProperties] = useState<FrontendProperty[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const properties = await propertyService.getAvailableProperties();
        setDbProperties(properties);
      } catch (error) {
        console.error("Error conectando con la base de datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return dbProperties.filter((p) => { 
      const matchesSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
      return matchesSearch && matchesFilter(p, activeFilter)
    })
  }, [search, activeFilter, dbProperties])

  const handleSend = async (property: FrontendProperty) => {
    const messageText = `🏠 *¡Mirá esta propiedad que encontré para vos!*\n\n*📍 ${property.title}*\n${property.location}\n\n*💰 Precio:* ${property.price}\n*🛏️ Habitaciones:* ${property.beds}\n*🛁 Baños:* ${property.baths}\n*📐 Superficie:* ${property.sqft} m²\n\n¿Te gustaría que agendemos una visita o te paso más info?`;

    try {
      await chatService.sendMessage(clientId, messageText);

      toast({
        title: "¡Propiedad enviada! 🚀",
        description: `Se envió "${property.title}" al chat del cliente.`,
      })
      
    } catch (error) {
      console.error("Error al enviar la propiedad:", error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar la propiedad. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-border bg-background px-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            className="h-9 gap-1.5 text-xs"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="size-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  activeFilter === f.key
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {isLoading ? (
            <>
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </>
          ) : filteredProperties.length === 0 ? (
            <EmptyState />
          ) : (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSend={handleSend}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {!isLoading && filteredProperties.length > 0 && (
        <div className="border-t border-border bg-background px-4 py-2.5">
          <p className="text-xs text-muted-foreground">
            {filteredProperties.length}{" "}
            {filteredProperties.length === 1 ? "property" : "properties"} found
          </p>
        </div>
      )}
    </div>
  )
}
