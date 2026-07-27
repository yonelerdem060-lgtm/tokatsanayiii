import { AdminShell } from "@/components/admin/admin-shell";
import { getUnreadMessageCount } from "@/actions/contact";
import { auth } from "@/auth";
import { adminPath } from "@/lib/admin-path";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(adminPath("/login"));
  }

  const unreadResult = await getUnreadMessageCount();
  const unreadMessages = unreadResult.success ? unreadResult.data : 0;

  return <AdminShell unreadMessages={unreadMessages}>{children}</AdminShell>;
}
