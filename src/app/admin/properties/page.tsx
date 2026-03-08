import { propertyService } from "@/src/services/property.service"
import TableProperties from "@/src/components/properties/table-properties"

export default async function PropertiesPage() {
  const properties = await propertyService.getAvailableProperties()
  return (
    <div>
      <TableProperties initialProperties={properties} />
    </div>
  )
}