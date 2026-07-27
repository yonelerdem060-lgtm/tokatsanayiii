import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { getClientIp } from "@/lib/client-ip";
import { prisma } from "@/lib/db";
import {
  assertLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Kullanıcı adı", type: "text" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        const creds = credentials as Record<string, unknown> | undefined;
        const username = String(creds?.username ?? creds?.email ?? "").trim();
        const password = String(creds?.password ?? "");

        if (!username || !password) {
          return null;
        }

        const ip = await getClientIp();
        const throttle = assertLoginAllowed(ip, username);
        if (!throttle.ok) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: username },
        });

        if (!user?.password) {
          recordLoginFailure(ip, username);
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          recordLoginFailure(ip, username);
          return null;
        }

        clearLoginFailures(ip, username);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
