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


export default function TableProperties({ initialProperties }: { initialProperties: Property[] }) {

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProperties = initialProperties.filter((property) => {
    const location = property.location || ""
    
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
              placeholder="Buscar propiedades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="FREE">Disponible</SelectItem>
              <SelectItem value="BUSY">Reservado</SelectItem>
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