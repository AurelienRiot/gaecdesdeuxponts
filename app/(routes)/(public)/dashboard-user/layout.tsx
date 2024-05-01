import { UserProvider } from "@/context/user-context";

import React from "react";
import { ProfilNavBar } from "./nav-components";

export const metadata = {
  title: " Laiterie du Pont Robert - Profil utilisateur",
  description: "Profil utilisateur Laiterie du Pont Robert",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="      relative flex min-h-screen   justify-between gap-4   pl-20 pr-4 ">
        <ProfilNavBar />
        {children}
      </div>{" "}
    </UserProvider>
  );
}
