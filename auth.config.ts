import type { NextAuthConfig } from "next-auth";
import { adminPath } from "@/lib/admin-path";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: adminPath("/login"),
  },
  callbacks: {
    authorized() {
      // Route koruması middleware.ts içinde rol bazlı yönetilir.
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
