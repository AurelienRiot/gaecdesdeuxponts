import Navbar from "@/components/navbar-admin/navbar";
import type React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full pb-20 md:pb-0 ">
      {/* <AdminColorSchema /> */}
      <Navbar />
      {children}
    </div>
  );
}
