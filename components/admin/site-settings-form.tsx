"use client";

import { updateSiteSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export interface SiteSettingsFormValues {
  name: string;
  shortName: string;
  phone: string;
  email: string;
  address: string;
  adEmail: string;
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
  about: string;
  aboutParagraphs: string[];
  aboutStats: { label: string; value: string }[];
}

export function SiteSettingsForm({ initialValues }: { initialValues: SiteSettingsFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [paragraphsText, setParagraphsText] = useState(initialValues.aboutParagraphs.join("\n\n"));
  const [statsText, setStatsText] = useState(
    initialValues.aboutStats.map((item) => `${item.label}|${item.value}`).join("\n"),
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const aboutParagraphs = paragraphsText
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    const aboutStats = statsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, value] = line.split("|").map((part) => part.trim());
        return { label: label || "", value: value || "" };
      });

    const result = await updateSiteSettings({
      ...values,
      aboutParagraphs,
      aboutStats,
    });

    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Site Adı</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortName">Kısa Ad</Label>
          <Input
            id="shortName"
            value={values.shortName}
            onChange={(e) => setValues((prev) => ({ ...prev, shortName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            value={values.phone}
            onChange={(e) => setValues((prev) => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="adEmail">Reklam E-postası</Label>
          <Input
            id="adEmail"
            type="email"
            value={values.adEmail}
            onChange={(e) => setValues((prev) => ({ ...prev, adEmail: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adres</Label>
          <Input
            id="address"
            value={values.address}
            onChange={(e) => setValues((prev) => ({ ...prev, address: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="weekdayHours">Hafta içi saatler</Label>
          <Input
            id="weekdayHours"
            value={values.weekdayHours}
            onChange={(e) => setValues((prev) => ({ ...prev, weekdayHours: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="saturdayHours">Cumartesi</Label>
          <Input
            id="saturdayHours"
            value={values.saturdayHours}
            onChange={(e) => setValues((prev) => ({ ...prev, saturdayHours: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sundayHours">Pazar</Label>
          <Input
            id="sundayHours"
            value={values.sundayHours}
            onChange={(e) => setValues((prev) => ({ ...prev, sundayHours: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">Kısa hakkında metni</Label>
        <Textarea
          id="about"
          rows={3}
          value={values.about}
          onChange={(e) => setValues((prev) => ({ ...prev, about: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paragraphs">Hakkımızda paragrafları</Label>
        <Textarea
          id="paragraphs"
          rows={8}
          value={paragraphsText}
          onChange={(e) => setParagraphsText(e.target.value)}
          placeholder="Paragrafları boş satırla ayırın"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stats">İstatistikler (Etiket|Değer)</Label>
        <Textarea
          id="stats"
          rows={4}
          value={statsText}
          onChange={(e) => setStatsText(e.target.value)}
          placeholder={"İş Yeri|200+\nSektör|30+"}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">Ayarlar kaydedildi.</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
      </Button>
    </form>
  );
}
