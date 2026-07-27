import { FavoritesPageClient } from "@/components/public/favorites-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorilerim",
  description: "Bu cihazda kaydettiğiniz favori firmalar.",
  robots: { index: false, follow: false },
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
