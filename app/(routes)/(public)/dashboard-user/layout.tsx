import { redirect } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/auth/authOptions";

export const metadata = {
  title: "RIOT TECH - Profil utilisateur",
  description: "Profil utilisateur RIOT TECH",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const callbackUrl = "/dashboard-user";

  if (!session || !session.user) {
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return <div className="relative h-full ">{children}</div>;
}
