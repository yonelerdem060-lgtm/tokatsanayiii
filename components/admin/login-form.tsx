"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface LoginFormProps {
  /** Giriş sonrası yedek yönlendirme; rol biliniyorsa onu kullanır */
  defaultRedirect?: string;
  usernamePlaceholder?: string;
}

export function LoginForm({
  defaultRedirect = ADMIN_BASE_PATH,
  usernamePlaceholder = "admin",
}: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("Kullanıcı adı veya şifre hatalı.");
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;
    const redirectTo =
      role === "PRESIDENT"
        ? "/baskan"
        : role === "ADMIN"
          ? ADMIN_BASE_PATH
          : defaultRedirect;

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Kullanıcı adı</Label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          placeholder={usernamePlaceholder}
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
    </form>
  );
}
