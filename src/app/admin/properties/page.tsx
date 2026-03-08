"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { PropertyCard, type Property } from "@/src/components/properties/property-card"

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Loft",
    location: "123 Main Street, New York, NY",
    price: 4500,
    currency: "USD",
    beds: 2,
    baths: 2,
    sqft: 1200,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
  {
    id: "2",
    title: "Luxury Penthouse Suite",
    location: "456 Park Avenue, New York, NY",
    price: 12000,
    currency: "USD",
    beds: 4,
    baths: 3,
    sqft: 3200,
    status: "reserved",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
  {
    id: "3",
    title: "Cozy Studio Apartment",
    location: "789 Broadway, New York, NY",
    price: 2200,
    currency: "USD",
    beds: 1,
    baths: 1,
    sqft: 550,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  },
  {
    id: "4",
    title: "Spacious Family Home",
    location: "321 Oak Lane, Brooklyn, NY",
    price: 6800,
    currency: "USD",
    beds: 5,
    baths: 4,
    sqft: 4500,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: "5",
    title: "Contemporary Waterfront Condo",
    location: "555 Harbor View, Manhattan, NY",
    price: 8500,
    currency: "USD",
    beds: 3,
    baths: 2,
    sqft: 2100,
    status: "reserved",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  },
  {
    id: "6",
    title: "Charming Brownstone Flat",
    location: "42 Clinton Street, Brooklyn, NY",
    price: 3800,
    currency: "USD",
    beds: 2,
    baths: 1,
    sqft: 950,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
]

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Propiedades</h1>
            <p className="text-muted-foreground mt-1">
              Gestione sus listados de propiedades y disponibilidad
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/properties/new-property">
              <Plus className="size-4" />
              Añadir Propiedad
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="reserved">Reservado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No se encontraron propiedades que coincidan con tus criterios.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
