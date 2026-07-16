import { PresidentShell } from "@/components/president/president-shell";
import { auth } from "@/auth";
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
    redirect(session.user.role === "ADMIN" ? "/admin" : "/baskan/login");
  }

  return <PresidentShell userName={session.user.name}>{children}</PresidentShell>;
}
