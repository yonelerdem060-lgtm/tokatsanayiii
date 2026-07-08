import { getVehicleTypes } from "@/actions/vehicle-types";
import { VehicleTypesManager } from "@/components/admin/vehicle-types-manager";

export default async function AdminVehicleTypesPage() {
  const result = await getVehicleTypes();
  const items = result.success ? result.data : [];

  return <VehicleTypesManager items={items} />;
}
