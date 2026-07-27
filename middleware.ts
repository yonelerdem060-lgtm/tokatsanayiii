import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import {
  ADMIN_BASE_PATH,
  adminPath,
  isAdminPublicPath,
  toInternalAdminPath,
} from "@/lib/admin-path";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const role = user?.role;

  // Klasik /admin adresini gizle — botlar ve tahmin için 404
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse(null, { status: 404 });
  }

  const isAdminLogin = pathname === adminPath("/login");
  const isBaskanLogin = pathname === "/baskan/login";
  const isAdminProtected = isAdminPublicPath(pathname) && !isAdminLogin;
  const isBaskanProtected = pathname.startsWith("/baskan") && !isBaskanLogin;

  if (isAdminLogin && user) {
    const dest = role === "PRESIDENT" ? "/baskan" : ADMIN_BASE_PATH;
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  if (isBaskanLogin && user) {
    const dest = role === "ADMIN" ? ADMIN_BASE_PATH : "/baskan";
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  if (isAdminProtected) {
    if (!user) {
      const url = new URL(adminPath("/login"), req.nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(role === "PRESIDENT" ? "/baskan" : adminPath("/login"), req.nextUrl),
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
        new URL(role === "ADMIN" ? ADMIN_BASE_PATH : "/baskan/login", req.nextUrl),
      );
    }
  }

  // Gizli URL → iç /admin route (klasör yapısı aynı kalır)
  if (isAdminPublicPath(pathname)) {
    const internal = toInternalAdminPath(pathname);
    if (internal) {
      const url = req.nextUrl.clone();
      url.pathname = internal;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/baskan/:path*",
    // Varsayılan gizli yol — NEXT_PUBLIC_ADMIN_BASE_PATH ile değiştirirseniz burayı da güncelleyin
    "/yp-tokat-7x9k",
    "/yp-tokat-7x9k/:path*",
  ],
};
