import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
const baseUrl = process.env.NEXT_PUBLIC_URL;

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });
    const today = new Date().getTime();
    const path = req.nextUrl.pathname;

    if (!token || token.exp * 1000 < today) {
      console.log(token ? `exp: ${token.exp * 1000 < today}` : "No token provided");
      return redirectToLogin(req);
    }
    const role = token.role;
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
      if (dbRole !== role) {
        console.log("DB role:", dbRole, "Token role:", role);
        return redirectToLogin(req);
      }
    }

    if (path.startsWith("/admin")) {
      if (!["shipping", "admin", "readOnlyAdmin"].includes(role)) {
        return redirectToLogin(req);
      }
      if (role === "shipping" && (path.startsWith("/admin/invoices") || path === "/admin")) {
      }
    }

    if (path.startsWith("/profile")) {
      if (!["user", "pro", "admin", "readOnlyAdmin"].includes(role)) {
        return redirectToLogin(req);
      }
      if (!["shipping", "admin", "readOnlyAdmin"].includes(role)) {
        return NextResponse.redirect(new URL("/admin/calendar", req.url));
      }
      if (path.startsWith("/profile/produits-pro")) {
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
  matcher: ["/admin/:path*", "/profile/:path*"],
};

const redirectToLogin = (req: NextRequest) => {
  const emaillogin = req.nextUrl.searchParams.get("emaillogin");
  return NextResponse.redirect(
    new URL(
      `/login?callbackUrl=${encodeURIComponent(req.url)}${emaillogin ? `&emaillogin=${emaillogin}` : ""}`,
      req.url,
    ),
  );
};
