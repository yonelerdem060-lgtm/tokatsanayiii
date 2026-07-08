"use client";

import {
  createCategoryFromInput,
  deleteCategory,
  updateCategoryFromInput,
} from "@/actions/categories";
import { EntityManager } from "@/components/admin/entity-manager";

interface CategoriesManagerProps {
  items: { id: string; name: string; slug: string }[];
}

export function CategoriesManager({ items }: CategoriesManagerProps) {
  return (
    <EntityManager
      title="Kategoriler"
      description="Motor ustası, yedek parça gibi dükkan kategorilerini yönetin."
      items={items}
      onCreate={async (name) => {
        const result = await createCategoryFromInput({ name });
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
      onUpdate={async (id, name) => {
        const result = await updateCategoryFromInput(id, { name });
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
      onDelete={async (id) => {
        const result = await deleteCategory(id);
        return { success: result.success, error: result.success ? undefined : result.error };
      }}
    />
  );
}
