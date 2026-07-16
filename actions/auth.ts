"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/db";

export async function loginAction(username: string, password: string) {
  const email = username.trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true, role: true },
    });

    if (!user?.password) {
      return { success: false as const, error: "Kullanıcı adı veya şifre hatalı." };
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return { success: false as const, error: "Kullanıcı adı veya şifre hatalı." };
    }

    const redirectTo = user.role === "PRESIDENT" ? "/baskan" : "/admin";

    await signIn("credentials", {
      username: email,
      password,
      redirectTo,
      redirect: false,
    });

    return { success: true as const, role: user.role, redirectTo };
  } catch (error) {
    // Auth.js başarıda bile bazen yönlendirme hatası fırlatabilir
    if (error instanceof AuthError) {
      return { success: false as const, error: "Kullanıcı adı veya şifre hatalı." };
    }
    throw error;
  }
}
