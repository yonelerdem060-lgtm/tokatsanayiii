import { FavoritesPageClient } from "@/components/public/favorites-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorilerim | Tokat Sanayi Sitesi Rehberi",
  description: "Bu cihazda kaydettiğiniz favori firmalar.",
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
