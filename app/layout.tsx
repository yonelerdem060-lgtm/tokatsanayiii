import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tokat Sanayi Sitesi Rehberi",
    template: "%s | Tokat Sanayi Sitesi",
  },
  description:
    "Tokat Sanayi Sitesi dükkân rehberi — kategori, araç tipi ve marka bazlı arama",
  openGraph: {
    title: "Tokat Sanayi Sitesi Rehberi",
    description:
      "Tokat Sanayi Sitesi dükkân rehberi — kategori, araç tipi ve marka bazlı arama",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
