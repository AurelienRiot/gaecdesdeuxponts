import AdminSidebar from "@/components/navbar-admin/admin-sidebar";
import Navbar from "@/components/navbar-admin/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="relative h-full pb-20 w-full">
        {/* <AdminColorSchema /> */}
        <Navbar />

        {children}
      </div>
    </SidebarProvider>
  );
}
