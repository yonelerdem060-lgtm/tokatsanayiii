import { AdminSidebar } from "@/components/admin/sidebar";
import { getUnreadMessageCount } from "@/actions/contact";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const unreadResult = await getUnreadMessageCount();
  const unreadMessages = unreadResult.success ? unreadResult.data : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar unreadMessages={unreadMessages} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-8">{children}</div>
      </main>
    </div>
  );
}
