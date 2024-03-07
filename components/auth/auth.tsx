"use client";

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session {
    accessToken: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
