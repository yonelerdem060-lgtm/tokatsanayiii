"use client";

import {
  createBrandFromInput,
  deleteBrand,
  updateBrandFromInput,
} from "@/actions/brands";
import { EntityManager } from "@/components/admin/entity-manager";

interface BrandsManagerProps {
  items: { id: string; name: string; slug: string }[];
}

export function BrandsManager({ items }: BrandsManagerProps) {
  return (
    <EntityManager
      title="Markalar"
      description="Volkswagen, Ford gibi markaları yönetin."
      items={items}
      onCreate={async (name) => {
        const result = await createBrandFromInput({ name });
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
      onUpdate={async (id, name) => {
        const result = await updateBrandFromInput(id, { name });
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
      onDelete={async (id) => {
        const result = await deleteBrand(id);
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
    />
  );
}
