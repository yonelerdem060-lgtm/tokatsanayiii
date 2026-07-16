import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BaskanLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#e8f0fa_0%,#f4f7fb_50%,#ffffff_100%)] p-4 sm:p-6">
      <Card className="w-full max-w-md border-border/80 shadow-soft">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Tokat Sanayi Sitesi
          </p>
          <CardTitle className="mt-1">Başkan Girişi</CardTitle>
          <CardDescription>
            Bu panel yalnızca haber yayınlamak içindir. Dükkan ve site yönetimi burada yoktur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm defaultRedirect="/baskan" usernamePlaceholder="baskan" />
        </CardContent>
      </Card>
    </div>
  );
}
