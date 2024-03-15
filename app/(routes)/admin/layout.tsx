import { Logout } from "@/components/auth/auth";
import { checkAdmin } from "@/components/auth/checkAuth";
import Navbar from "@/components/navbar-admin/navbar";
import { AdminColorSchema } from "@/providers/color-schema-provider";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const callbackUrl = "/admin";

  const isAuth = await checkAdmin();

  if (!isAuth) {
    return (
      <Logout
        callbackUrl={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      />
    );
  }

  return (
    <div className="relative h-full ">
      {/* <AdminColorSchema /> */}
      <Navbar />
      {children}
    </div>
  );
}
