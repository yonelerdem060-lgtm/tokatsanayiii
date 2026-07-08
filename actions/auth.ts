"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function loginAction(username: string, password: string) {
  try {
    await signIn("credentials", {
      username: username.trim(),
      password,
      redirectTo: "/admin",
      redirect: false,
    });
    return { success: true as const };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false as const, error: "Kullanıcı adı veya şifre hatalı." };
    }
    throw error;
  }
}
