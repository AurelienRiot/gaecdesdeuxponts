"use client";

import LoadingPage from "@/app/(routes)/(public)/loading";
import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import { signOut } from "next-auth/react";

declare module "next-auth" {
  export interface Session {
    accessToken: string;
    user: {
      id: string;
      role: Role;
      tokenExpires: Date;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    tokenExpires: Date;
    exp: number;
  }
}

export const Logout = ({ callbackUrl = "/" }: { callbackUrl?: string }) => {
  if (typeof window !== "undefined") {
    signOut({
      callbackUrl,
    });
  }
  return <LoadingPage />;
};
