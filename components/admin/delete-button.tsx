"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface DeleteButtonProps {
  label?: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
}

export function DeleteButton({ label = "Sil", onDelete }: DeleteButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

    startTransition(async () => {
      const result = await onDelete();
      if (!result.success) {
        alert(result.error ?? "Silme işlemi başarısız.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={handleClick}
      disabled={pending}
    >
      {pending ? "Siliniyor..." : label}
    </Button>
  );
}
