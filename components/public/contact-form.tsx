"use client";

import { submitContactForm } from "@/actions/contact";
import { TurnstileWidget } from "@/components/public/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { FormEvent, useCallback, useState } from "react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formStartedAt] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setLoading(false);
      setError("Lütfen güvenlik doğrulamasını tamamlayın.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || undefined,
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
      formStartedAt,
      turnstileToken: turnstileToken || undefined,
    };

    const result = await submitContactForm(payload);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTurnstileToken(null);
    event.currentTarget.reset();
  }

  if (success) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-green-200 bg-green-50 py-12 text-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
        <h3 className="mt-4 text-lg font-semibold text-green-800">Mesajınız Alındı</h3>
        <p className="mt-2 max-w-sm text-sm text-green-700">
          En kısa sürede size dönüş yapacağız. Teşekkür ederiz.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSuccess(false)}>
          Yeni Mesaj Gönder
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad *</Label>
          <Input id="name" name="name" required placeholder="Adınız Soyadınız" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-posta *</Label>
          <Input id="email" name="email" type="email" required placeholder="ornek@email.com" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" placeholder="0356 XXX XX XX" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Konu *</Label>
          <Input id="subject" name="subject" required placeholder="Mesaj konusu" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mesaj *</Label>
        <Textarea id="message" name="message" required rows={5} placeholder="Mesajınızı yazın..." />
      </div>
      {/* Honeypot — botlar doldurursa sessizce yok sayılır */}
      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {TURNSTILE_SITE_KEY ? (
        <TurnstileWidget siteKey={TURNSTILE_SITE_KEY} onToken={handleTurnstileToken} />
      ) : null}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Gönderiliyor..." : "Mesaj Gönder"}
      </Button>
    </form>
  );
}
