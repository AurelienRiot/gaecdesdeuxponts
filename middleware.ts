import type { Role } from "@prisma/client";
import { getToken, type JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
const baseUrl = process.env.NEXT_PUBLIC_URL;

export async function middleware(req: NextRequest) {
  const token = (await getToken({ req, secret })) as (JWT & { exp: number }) | null;
  const today = new Date().getTime();
  if (!token || token.exp * 1000 < today) {
    return redirectToLogin(req);
  }
  try {
    const role = token.role as Role;
    const path = req.nextUrl.pathname;
    if (new Date(token.tokenExpires).getTime() < today) {
      const apiResponse = await fetch(`${baseUrl}/api/auth`, {
        method: "GET",
        headers: {
          Cookie: cookies()
            .getAll()
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; "),
        },
        cache: "no-store",
      });

      if (!apiResponse.ok) {
        console.log("BaseUrl", baseUrl);
        console.log("API call error:", apiResponse.statusText);
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
      }
      const { role: dbRole } = (await apiResponse.json()) as { role: string };
      console.log("Trigger middleware", dbRole, role, token.tokenExpires, new Date());
      if (dbRole !== role) {
        return redirectToLogin(req);
      }
    }

    if (path === "/" && (role === "admin" || role === "readOnlyAdmin")) {
      return NextResponse.redirect(new URL("/admin/calendar", req.url));
    }

    if (path.startsWith("/admin")) {
      if (role !== "admin" && role !== "readOnlyAdmin") {
        return redirectToLogin(req);
      }
    }

    if (path.startsWith("/dashboard-user")) {
      if (!["user", "pro", "admin", "readOnlyAdmin"].includes(role)) {
        return redirectToLogin(req);
      }
      if (role === "admin" || role === "readOnlyAdmin") {
        return NextResponse.redirect(new URL("/admin/calendar", req.url));
      }
      if (path.startsWith("/dashboard-user/produits-pro")) {
        if (role !== "pro") {
          return redirectToLogin(req);
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log("API call failed:", error);
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard-user/:path*", "/"],
};

const redirectToLogin = (req: NextRequest) =>
  NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
