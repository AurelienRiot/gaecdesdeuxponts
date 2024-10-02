import { UserProvider } from "@/context/user-context";

import GetUser from "@/actions/get-user";
import type React from "react";
import { ProfilNavBar } from "./nav-components";
import { Logout } from "@/components/auth/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await GetUser();
  console.log({ data });
  if (!data) {
    return <Logout />;
  }

  return (
    <UserProvider data={data}>
      <div className="relative  flex min-h-[80vh] justify-between gap-4 pl-24 pr-4">
        <ProfilNavBar />
        {children}
      </div>
    </UserProvider>
  );
}
