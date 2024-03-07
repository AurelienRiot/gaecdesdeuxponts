"use client";

import { DefaultSession } from "next-auth";
import { signOut } from "next-auth/react";

declare module "next-auth" {
  export interface Session {
    accessToken: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

export const Logout = ({ callbackUrl }: { callbackUrl: string }) => {
  signOut({
    callbackUrl: `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  });
  return null;
};
