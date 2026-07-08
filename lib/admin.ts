import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Bu işlem için giriş yapmalısınız.");
  }
  return session;
}
