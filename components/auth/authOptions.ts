import { createId } from "@/lib/id";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { User } from "@prisma/client";
import { render } from "@react-email/render";
import { customAlphabet } from "nanoid";
import type { NextAuthOptions } from "next-auth";
import EmailProvider, { type SendVerificationRequestParams } from "next-auth/providers/email";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { revalidateTag } from "next/cache";
import WelcomeEmail from "../email/welcome";

const baseUrl = process.env.NEXT_PUBLIC_URL;
const expirationTime = 5 * 60 * 1000;
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
      if (!trigger) {
        if (!token.tokenExpires || new Date(token.tokenExpires) < new Date()) {
          const dbUser = await prismadb.user.findUnique({
            where: { id: token.id },
            select: { id: true, name: true, role: true },
          });
          if (!dbUser) {
            token.role = "deleted";
          } else {
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.role = dbUser.role;
            token.tokenExpires = new Date(Date.now() + expirationTime);
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
          select: { id: true, name: true, role: true },
        });
        if (!dbUser) {
          token.role = "deleted";
        } else {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.tokenExpires = new Date(Date.now() + expirationTime);
        }
      }
      return token;
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

  await transporter.sendMail({
    from: "laiteriedupontrobert@gmail.com",
    to: identifier,
    text: `Bienvenue sur la Laiterie du Pont Robert. Voici votre code unique : ${otp}`,
    subject: `Connexion à votre compte. Voici votre code unique : ${otp} - Laiterie du Pont Robert`,
    html: await render(WelcomeEmail({ otp, baseUrl })),
  });
}

export async function createHashToken(message: string) {
  const data = new TextEncoder().encode(message + secret);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
}
