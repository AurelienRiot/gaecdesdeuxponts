import { createId } from "@/lib/id";
import prismadb from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { User } from "@prisma/client";
import { customAlphabet } from "nanoid";
import type { NextAuthOptions } from "next-auth";
import EmailProvider, { type SendVerificationRequestParams } from "next-auth/providers/email";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { revalidateTag } from "next/cache";
import { sendOTP } from "../email";

const expirationTime = 10 * 60 * 1000;
const secret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    EmailProvider({
      sendVerificationRequest,
      maxAge: 12 * 60,
    }),
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger }) => {
      const newToken = { ...token };
      if (!trigger) {
        if (!newToken.tokenExpires || new Date(newToken.tokenExpires) < new Date()) {
          const dbUser = await prismadb.user.findUnique({
            where: { id: newToken.id },
            select: { id: true, name: true, role: true, company: true },
          });
          if (!dbUser) {
            newToken.role = "deleted";
          } else {
            newToken.id = dbUser.id;
            newToken.name = `${dbUser.name}${dbUser.company ? ` - ${dbUser.company}` : ""}`;
            newToken.role = dbUser.role;
            newToken.tokenExpires = new Date(Date.now() + expirationTime);
          }
        }
      }
      if (user) {
        const u = user as User;
        if (!u.id.startsWith("CS_")) {
          await prismadb.user.update({
            where: { email: u.email as string },
            data: {
              id: createId("user"),
            },
          });
          revalidateTag("users");
        }
        const dbUser = await prismadb.user.findUnique({
          where: { email: u.email as string },
          select: { id: true, name: true, role: true, company: true },
        });
        if (!dbUser) {
          newToken.role = "deleted";
        } else {
          newToken.id = dbUser.id;
          newToken.name = `${dbUser.name}${dbUser.company ? ` - ${dbUser.company}` : ""}`;
          newToken.role = dbUser.role;
          newToken.tokenExpires = new Date(Date.now() + expirationTime);
        }
      }
      return newToken;
    },
    session: async ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            name: token.name,
            id: token.id,
            role: token.role,
            tokenExpires: token.tokenExpires,
          },
        };
      }
      return session;
    },
  },
};

async function sendVerificationRequest({ identifier, url, token }: SendVerificationRequestParams) {
  const otp = customAlphabet("0123456789", 6)();
  const hashToken = await createHashToken(token);
  setTimeout(async () => {
    await prismadb.verificationToken.update({
      where: { token: hashToken },
      data: {
        otp,
        url,
      },
    });
  }, 500);

  await sendOTP(otp, identifier);
}

export async function createHashToken(message: string) {
  const data = new TextEncoder().encode(message + secret);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
}
