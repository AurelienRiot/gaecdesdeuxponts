import { UserProvider } from "@/context/user-context";

import React from "react";
import { ProfilNavBar } from "./nav-components";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Profil utilisateur",
    openGraph: {
      title: "Profil utilisateur",
      description: "Profil utilisateur Laiterie du Pont Robert",
    },
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="      relative flex min-h-[80vh]   justify-between gap-4   pl-24 pr-4 ">
        <ProfilNavBar />
        {children}
      </div>{" "}
    </UserProvider>
  );
}
