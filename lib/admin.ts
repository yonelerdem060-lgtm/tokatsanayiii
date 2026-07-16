import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Bu işlem için giriş yapmalısınız.");
  }
  if (session.user.role !== "ADMIN") {
    throw new Error("Bu işlem için yetkiniz yok.");
  }
  return session;
}

/** Admin veya sanayi başkanı — yalnızca haber işlemleri */
export async function requireNewsEditor() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Bu işlem için giriş yapmalısınız.");
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "PRESIDENT") {
    throw new Error("Bu işlem için yetkiniz yok.");
  }
  return session;
}
