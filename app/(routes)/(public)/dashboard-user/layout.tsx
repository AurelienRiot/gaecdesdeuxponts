import { UserProvider } from "@/context/user-context";

import GetUser from "@/actions/get-user";
import { Metadata } from "next";
import React from "react";
import { ProfilNavBar } from "./nav-components";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Profil utilisateur",
    description: "Profil utilisateur Laiterie du Pont Robert",
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await GetUser();

  return (
    <UserProvider data={data}>
      <div className="      relative flex min-h-[80vh]   justify-between gap-4   pl-24 pr-4 ">
        <ProfilNavBar />
        {children}
      </div>{" "}
    </UserProvider>
  );
}
