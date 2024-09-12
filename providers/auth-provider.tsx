"use client";

import { SessionProvider } from "next-auth/react";

type AuthProps = {
  children?: React.ReactNode;
};

export const AuthProviders = ({ children }: AuthProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
