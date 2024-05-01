import { JWT, getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = (await getToken({ req, secret })) as JWT;
  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url),
    );
  }

  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (token.role !== "admin") {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url),
      );
    }
  }

  if (path.startsWith("/dashboard-user")) {
    if (!["user", "pro", "admin"].includes(token.role)) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url),
      );
    }
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (path.startsWith("/dashboard-user/produits-pro")) {
      if (token.role !== "pro") {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url),
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard-user/:path*"],
};
