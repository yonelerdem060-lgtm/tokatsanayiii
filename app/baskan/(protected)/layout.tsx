import { PresidentShell } from "@/components/president/president-shell";
import { auth } from "@/auth";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { redirect } from "next/navigation";

export default async function BaskanProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/baskan/login");
  }

  if (session.user.role !== "PRESIDENT") {
    redirect(session.user.role === "ADMIN" ? ADMIN_BASE_PATH : "/baskan/login");
  }

  return <PresidentShell userName={session.user.name}>{children}</PresidentShell>;
}
