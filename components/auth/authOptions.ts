import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { render } from "@react-email/render";
import { User, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import WelcomeEmail from "../email/welcome";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier: email, url }) => {
        await transporter.sendMail({
          from: "laiteriedupontrobert@gmail.com",
          to: email,
          subject: "Connexion à votre compte ",
          html: render(WelcomeEmail({ url, baseUrl })),
        });
      },
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === "update") {
        for (const key in session) {
          token[key] = session[key];
        }
      }
      if (user) {
        const u = user as User;
        const dbUser = await prismadb.user.findUnique({
          where: { email: u.email as string },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.role = dbUser.role;
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
          },
        };
      }
      return session;
    },
  },
};
