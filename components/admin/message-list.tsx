"use client";

import {
  deleteContactMessage,
  markAllMessagesAsRead,
  markMessageAsRead,
} from "@/actions/contact";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export function MessageList({
  messages,
  initialQuery = "",
}: {
  messages: Message[];
  initialQuery?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return messages;
    return messages.filter((msg) =>
      [msg.name, msg.email, msg.subject, msg.message, msg.phone ?? ""]
        .join(" ")
        .toLocaleLowerCase("tr")
        .includes(q),
    );
  }, [messages, query]);

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markMessageAsRead(id);
      router.refresh();
    });
  }

  function handleMarkAll() {
    startTransition(async () => {
      await markAllMessagesAsRead();
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Mesajlarda ara..."
            className="pl-9"
          />
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" disabled={pending} onClick={handleMarkAll}>
            Tümünü okundu işaretle ({unreadCount})
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
          {query ? "Aramanızla eşleşen mesaj yok." : "Henüz mesaj yok."}
        </p>
      ) : (
        filtered.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl border border-border bg-card p-5 ${!msg.isRead ? "ring-2 ring-primary/20" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{msg.subject}</h3>
                  {!msg.isRead && <Badge className="bg-primary/10 text-primary">Yeni</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{msg.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {msg.createdAt.toLocaleString("tr-TR")}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:text-primary">
                <Mail className="h-3.5 w-3.5" />
                {msg.email}
              </a>
              {msg.phone && (
                <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:text-primary">
                  <Phone className="h-3.5 w-3.5" />
                  {msg.phone}
                </a>
              )}
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>

            <div className="mt-4 flex gap-2">
              {!msg.isRead && (
                <Button size="sm" variant="outline" disabled={pending} onClick={() => handleMarkRead(msg.id)}>
                  Okundu İşaretle
                </Button>
              )}
              <DeleteButton
                label="Sil"
                onDelete={async () => {
                  const result = await deleteContactMessage(msg.id);
                  return {
                    success: result.success,
                    error: result.success ? undefined : result.error,
                  };
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
