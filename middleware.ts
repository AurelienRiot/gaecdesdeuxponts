import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
const baseUrl = process.env.NEXT_PUBLIC_URL;

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret });
	if (!token) {
		return redirectToLogin(req);
	}
	try {
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
			console.log("API call error:", apiResponse.statusText);
			return redirectToLogin(req);
		}
		const { role } = (await apiResponse.json()) as { role: string };

		const path = req.nextUrl.pathname;

		if (path.startsWith("/admin")) {
			if (role !== "admin") {
				return redirectToLogin(req);
			}
		}

		if (path.startsWith("/dashboard-user")) {
			if (!["user", "pro", "admin"].includes(role)) {
				return redirectToLogin(req);
			}
			if (role === "admin") {
				return NextResponse.redirect(new URL("/admin", req.url));
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
	matcher: ["/admin/:path*", "/dashboard-user/:path*"],
};

const redirectToLogin = (req: NextRequest) =>
	NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
