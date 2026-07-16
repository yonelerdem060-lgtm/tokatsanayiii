import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const role = user?.role;

  const isAdminLogin = pathname === "/admin/login";
  const isBaskanLogin = pathname === "/baskan/login";
  const isAdminProtected = pathname.startsWith("/admin") && !isAdminLogin;
  const isBaskanProtected = pathname.startsWith("/baskan") && !isBaskanLogin;

  if (isAdminLogin && user) {
    const dest = role === "PRESIDENT" ? "/baskan" : "/admin";
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  if (isBaskanLogin && user) {
    const dest = role === "ADMIN" ? "/admin" : "/baskan";
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  if (isAdminProtected) {
    if (!user) {
      const url = new URL("/admin/login", req.nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(role === "PRESIDENT" ? "/baskan" : "/admin/login", req.nextUrl),
      );
    }
  }

  if (isBaskanProtected) {
    if (!user) {
      const url = new URL("/baskan/login", req.nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "PRESIDENT") {
      return NextResponse.redirect(
        new URL(role === "ADMIN" ? "/admin" : "/baskan/login", req.nextUrl),
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/baskan/:path*"],
};
