"use client";

import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import { signOut } from "next-auth/react";

declare module "next-auth" {
  export interface Session {
    accessToken: string;
    user: {
      id: string;
      role: string;
      tokenExpires: Date;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    tokenExpires: Date;
  }
}

export const Logout = ({ callbackUrl = "/" }: { callbackUrl?: string }) => {
  if (typeof window !== "undefined") {
    signOut({
      callbackUrl,
    });
  }
  return null;
};
