"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface EntityItem {
  id: string;
  name: string;
  slug: string;
}

interface EntityManagerProps {
  title: string;
  description: string;
  items: EntityItem[];
  onCreate: (name: string) => Promise<{ success: boolean; error?: string }>;
  onUpdate: (id: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function EntityManager({
  title,
  description,
  items,
  onCreate,
  onUpdate,
  onDelete,
}: EntityManagerProps) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onCreate(newName.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Kayıt eklenemedi.");
      return;
    }

    setNewName("");
    router.refresh();
  }

  async function handleUpdate(id: string) {
    setLoading(true);
    setError(null);

    const result = await onUpdate(id, editingName.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Kayıt güncellenemedi.");
      return;
    }

    setEditingId(null);
    setEditingName("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

    setLoading(true);
    setError(null);

    const result = await onDelete(id);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Kayıt silinemedi.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleCreate} className="flex gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="new-name">Yeni Ekle</Label>
          <Input
            id="new-name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Ad girin..."
            required
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={loading}>
            Ekle
          </Button>
        </div>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Ad</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-right font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  Henüz kayıt yok.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    {editingId === item.id ? (
                      <Input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        autoFocus
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {editingId === item.id ? (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleUpdate(item.id)}
                            disabled={loading}
                          >
                            Kaydet
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setEditingName("");
                            }}
                          >
                            Vazgeç
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditingName(item.name);
                            }}
                          >
                            Düzenle
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={loading}
                          >
                            Sil
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
