"use client";

import { deleteShop } from "@/actions/shops";
import { DeleteButton } from "@/components/admin/delete-button";

export function ShopDeleteButton({ shopId }: { shopId: string }) {
  return (
    <DeleteButton
      onDelete={async () => {
        const result = await deleteShop(shopId);
        return {
          success: result.success,
          error: result.success ? undefined : result.error,
        };
      }}
    />
  );
}
