'use client'
export const dynamic = 'force-dynamic'

import { AddPropertyForm } from "@/src/components/properties/add-property-form"
import { Landmark } from "lucide-react"
import { FrontendProperty, propertyService } from "@/src/services/property.service"
import { useToast } from "@/src/hooks/use-toast"

export default function NewPropertyPage() {

  const { toast } = useToast()
  const handleSaveProperty = async (propertyData: Omit<FrontendProperty, 'id' | 'status'>) => {
    try {
      await propertyService.createProperty(propertyData)
      toast({
        title: 'Propiedad creada exitosamente',
        description: 'La propiedad ha sido agregada al catálogo.'
      })
    } catch (error) {
      toast({
        title: 'Ocurrió un error',
        description: error instanceof Error ? error.message : 'Hubo un error al crear la propiedad. Por favor, intenta nuevamente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Landmark className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Añadir nueva Propiedad
            </h1>
          </div>
          <p className="text-muted-foreground ml-13">
            Completa los detalles para listar una nueva propiedad en el catálogo.
          </p>
        </div>

      <AddPropertyForm action={handleSaveProperty} />
    </div>
  )
}