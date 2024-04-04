import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = (await getToken({ req, secret })) as any;

  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url),
    );
  }

  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (token.user?.role !== "admin") {
      new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url);
    }
  }

  if (path.startsWith("/dashboard-user")) {
    if (!["user", "pro", "admin"].includes(token.user?.role)) {
      new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard-user/:path*"],
};
