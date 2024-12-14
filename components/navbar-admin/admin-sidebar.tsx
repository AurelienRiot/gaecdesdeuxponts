"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SecondaryAdminRoutes } from "./mobile-nav";

export default function AppSidebar() {
  const pathName = usePathname();
  const secondaryRoutes = SecondaryAdminRoutes(pathName);
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas" side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryRoutes.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    className={
                      item.active ? "bg-green-600 font-bold hover:bg-green-600/90 text-white hover:text-white" : ""
                    }
                  >
                    <Link onClick={toggleSidebar} href={item.href}>
                      <item.Icone />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
