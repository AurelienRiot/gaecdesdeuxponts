import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token) {
    return redirectToLogin(req);
  }
  try {
    const role = token.role;
    const path = req.nextUrl.pathname;

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
  // matcher: ["/admin/:path*", "/dashboard-user/:path*"],
  matcher: ["/:path*"],
};

const redirectToLogin = (req: NextRequest) =>
  NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
