import AdminSidebar from "@/components/navbar-admin/admin-sidebar";
import Navbar from "@/components/navbar-admin/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";
import { UserModalProvider } from "./_components/user-modal";
import { OrdersModalProvider } from "./calendar/_components/orders-modal";

export default async function AdminLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <UserModalProvider>
      <OrdersModalProvider>
        <SidebarProvider>
          <AdminSidebar />
          <div className="relative h-full pb-20 w-full">
            {/* <AdminColorSchema /> */}
            <Navbar />
            {children}
            {modal}
          </div>
        </SidebarProvider>
      </OrdersModalProvider>
    </UserModalProvider>
  );
}
