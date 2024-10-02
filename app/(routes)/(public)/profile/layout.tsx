import { UserProvider } from "@/context/user-context";

import type React from "react";
import { ProfilNavBar } from "./nav-components";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const data = await GetUser();
  // console.log({ data });
  // if (!data) {
  //   return redirect
  // }

  return (
    <UserProvider>
      <div className="relative  flex min-h-[80vh] justify-between gap-4 pl-24 pr-4">
        <ProfilNavBar />
        {children}
      </div>
    </UserProvider>
  );
}
