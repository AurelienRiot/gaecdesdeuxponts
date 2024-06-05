import prismadb from "@/lib/prismadb";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });

    if (!token || !token.id) {
      console.log("No token provided");
      return new NextResponse("No token provided", { status: 401 });
    }
    const user = await prismadb.user.findUnique({
      where: {
        id: token.id,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      console.log("User not found");
      return new NextResponse("User not found", { status: 401 });
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.log("[AUTH_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
