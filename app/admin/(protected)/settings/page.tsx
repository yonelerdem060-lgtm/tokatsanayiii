import { getSiteSettings } from "@/actions/settings";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function AdminSettingsPage() {
  const result = await getSiteSettings();
  if (!result.success) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Site Ayarları</h1>
        <p className="text-muted-foreground">
          İletişim bilgileri, çalışma saatleri ve hakkımızda içeriğini yönetin.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Genel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
          <SiteSettingsForm initialValues={result.data} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
