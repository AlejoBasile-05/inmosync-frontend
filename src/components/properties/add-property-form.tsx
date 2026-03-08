"use client"

import { useToast } from "@/src/hooks/use-toast"
import { useState } from "react"
import {
  Building2,
  MapPin,
  DollarSign,
  BedDouble,
  Bath,
  Maximize,
  ImagePlus,
  Link2,
  Save,
  X,
  Home,
  Building,
  Landmark,
  Mountain,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import { Badge } from "@/src/components/ui/badge"
import { Checkbox } from "@/src/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { FrontendProperty } from "@/src/services/property.service"
import { propertyService } from "@/src/services/property.service"
import { toast } from "@/src/hooks/use-toast"

const propertyTypes = [
  { value: "apartment", label: "Apartment", icon: Building2 },
  { value: "house", label: "House", icon: Home },
  { value: "commercial", label: "Commercial", icon: Building },
  { value: "land", label: "Land", icon: Mountain },
]

const currencies = [
  { value: "USD", label: "USD", symbol: "$" },
  { value: "ARS", label: "ARS", symbol: "$" },
  { value: "EUR", label: "EUR", symbol: "€" },
]

const amenities = [
  { id: "pool", label: "Pool" },
  { id: "garage", label: "Garage" },
  { id: "balcony", label: "Balcony" },
  { id: "pet-friendly", label: "Pet Friendly" },
  { id: "security", label: "24/7 Security" },
  { id: "gym", label: "Gym" },
  { id: "garden", label: "Garden" },
  { id: "air-conditioning", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
  { id: "elevator", label: "Elevator" },
  { id: "storage", label: "Storage" },
  { id: "laundry", label: "Laundry Room" },
]

interface PropertyFormProps {
  action: (propertyData: Omit<FrontendProperty, 'id' | 'status'>) => Promise<void>;
}

export function AddPropertyForm({ action }: PropertyFormProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    location: "",
    price: "",
    currency: "$",
    beds: 0,
    baths: 0,
    sqft: 0,
    characteristics: [] as string[],
    mainImageUrl: "",
    imageFile: null as File | null
  })

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    )
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'imageFile' && files?.[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        mainImageUrl: previewUrl,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        title: formData.title,
        location: formData.location,
        type: formData.type,
        price: parseFloat(formData.price),
        currency: formData.currency,
        beds: Number(formData.beds), 
        baths: Number(formData.baths), 
        sqft: Number(formData.sqft), 
        mainImageUrl: formData.mainImageUrl,
        characteristics: selectedAmenities,
      }
      if (Object.values(formData).some(value => !value)) {
        throw new Error('Por favor, complete todos los campos requeridos');
      }
      await action(data);
    } catch (error) {
        console.error('Error al crear la propiedad:', error)

        const errorMessage = error instanceof Error 
            ? error.message 
            : "Ocurrió un error inesperado al conectarse con el servidor.";
          
          toast({
            title: "Error al guardar",
            description: errorMessage,
            variant: "destructive",
          })
    }
    return
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        <form onSubmit={handleSubmit}>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 sm:p-8 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Información Básica
                  </h2>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Título
                    </Label>
                    <Input
                      name="title"
                      id="title"
                      placeholder="e.g., Modern Downtown Loft with City Views"
                      className="h-11"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property-type" className="text-sm font-medium">
                      Tipo
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger id="property-type" className="h-11">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <type.icon className="h-4 w-4 text-muted-foreground" />
                              {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Dirección
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="location"
                        id="location"
                        placeholder="e.g., 123 Main Street, New York, NY 10001"
                        className="h-11 pl-10"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-2 mb-5">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Precio y Detalles
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Precio
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="price"
                        id="price"
                        type="number"
                        placeholder="0"
                        className="h-11 pl-10"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">
                      Divisa
                    </Label>
                    <Select 
                    defaultValue="USD"
                    name="currency"
                    value={formData.currency}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger id="currency" className="h-11">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label} ({currency.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="text-sm font-medium">
                      Camas
                    </Label>
                    <div className="relative">
                      <BedDouble className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="beds"
                        id="bedrooms"
                        type="number"
                        placeholder="0"
                        min="0"
                        className="h-11 pl-10"
                        value={formData.beds}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms" className="text-sm font-medium">
                      Baños
                    </Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="baths"
                        id="bathrooms"
                        type="number"
                        placeholder="0"
                        min="0"
                        className="h-11 pl-10"
                        value={formData.baths}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label htmlFor="sqft" className="text-sm font-medium">
                      Metros Cuadrados
                    </Label>
                    <div className="relative">
                      <Maximize className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="sqft"
                        id="sqft"
                        type="number"
                        placeholder="0"
                        min="0"
                        className="h-11 pl-10"
                        value={formData.sqft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox className="h-4 w-4" checked disabled />
                  <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Características y Comodidades
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  Selecciona todas las comodidades que apliquen a esta propiedad
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity.id)
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`
                          flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium
                          transition-all duration-150 ease-in-out
                          ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent"
                          }
                        `}
                      >
                        {isSelected && (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {amenity.label}
                      </button>
                    )
                  })}
                </div>

                {selectedAmenities.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground mr-1">Selected:</span>
                    {selectedAmenities.map((id) => {
                      const amenity = amenities.find((a) => a.id === id)
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => toggleAmenity(id)}
                        >
                          {amenity?.label}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </section>

              <Separator />

              <section>
                <div className="flex items-center gap-2 mb-5">
                  <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Media
                  </h2>
                </div>

                <div className="space-y-5">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragActive(false)
                      // Handle file drop here
                    }}
                    className={`
                      relative flex flex-col items-center justify-center p-8 sm:p-12
                      border-2 border-dashed rounded-xl cursor-pointer
                      transition-all duration-200 ease-in-out
                      ${
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }
                    `}
                  >
                    <input
                      name="imageFile"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleChange}
                    />
                    <div
                      className={`
                        flex h-14 w-14 items-center justify-center rounded-full mb-4
                        ${dragActive ? "bg-primary/10" : "bg-muted"}
                      `}
                    >
                      <ImagePlus
                        className={`h-7 w-7 ${
                          dragActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Click para subir tus imagenes o arrástralas aquí
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or WEBP (max. 5MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-url" className="text-sm font-medium">
                      Image URL (fallback)
                    </Label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="mainImageUrl"
                        id="image-url"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="h-11 pl-10"
                        value={formData.mainImageUrl} 
                        onChange={handleChange} 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Si no puedes subir una imagen, proporciona una URL válida como alternativa
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="h-11 px-6">
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit" className="h-11 px-6">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Propiedad
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
