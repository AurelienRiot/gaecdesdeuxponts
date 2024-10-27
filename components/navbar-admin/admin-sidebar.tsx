"use client";
import { Calendar, Inbox, Search, Settings, User } from "lucide-react";

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
import { SecondaryAdminRoutes } from "./mobile-nav";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

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
