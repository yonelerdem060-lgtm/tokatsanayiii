import { Mail, Megaphone } from "lucide-react";
import Link from "next/link";

export function AdCtaBanner({ adEmail }: { adEmail: string }) {
  return (
    <section className="border-b border-border/70 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[22px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-[0_16px_48px_-20px_rgba(15,23,42,0.55)] sm:p-8">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-amber-500/20 ring-1 ring-amber-400/30">
              <Megaphone className="h-8 w-8 text-amber-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Reklam vererek firmanızı öne çıkarın
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Slider ve öne çıkan firmalar bölümünde görünün. Binlerce ziyaretçiye ulaşın.
              </p>
            </div>
            <Link
              href={`mailto:${adEmail}?subject=Reklam%20Talebi&body=Merhaba,%20reklam%20vermek%20istiyorum.`}
              className="inline-flex shrink-0 items-center gap-2 rounded-[14px] bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              <Mail className="h-4 w-4" />
              E-Posta Gönder
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
