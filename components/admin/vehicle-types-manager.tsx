"use client";

import {
  createVehicleTypeFromInput,
  deleteVehicleType,
  updateVehicleTypeFromInput,
} from "@/actions/vehicle-types";
import { EntityManager } from "@/components/admin/entity-manager";

interface VehicleTypesManagerProps {
  items: { id: string; name: string; slug: string }[];
}

export function VehicleTypesManager({ items }: VehicleTypesManagerProps) {
  return (
    <EntityManager
      title="Araç Tipleri"
      description="Otomobil, traktör gibi araç tiplerini yönetin."
      items={items}
      onCreate={async (name) => {
        const result = await createVehicleTypeFromInput({ name });
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
      onUpdate={async (id, name) => {
        const result = await updateVehicleTypeFromInput(id, { name });
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
      onDelete={async (id) => {
        const result = await deleteVehicleType(id);
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
    />
  );
}
