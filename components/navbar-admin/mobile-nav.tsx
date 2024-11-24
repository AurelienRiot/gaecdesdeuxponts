"use client";

import { cn } from "@/lib/utils";
import {
  Box,
  Calendar,
  LayoutDashboardIcon,
  ListOrderedIcon,
  LogOut,
  PackageIcon,
  PhoneCallIcon,
  PresentationIcon,
  RowsIcon,
  ShoppingBasket,
  Shuffle,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../ui/sidebar";
import { GiPathDistance, PiInvoice } from "../react-icons";

function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const mainRoutes = MainAdminRoutes(pathname);
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-primary text-neutral-200 sm:px-2 flex justify-around items-center h-20 pb-4 lg:pb-0  z-[1100]",
        className,
      )}
    >
      <div className="grid grid-cols-5 w-full items-center justify-between  sm:px-4">
        {mainRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={(e) => e.stopPropagation()}
            className={cn("flex flex-col items-center px-2 py-1 rounded-md", route.active && "bg-green-600 font-bold")}
          >
            <route.Icone className="w-6 h-6" />
            <span className="text-sm">{route.label}</span>
          </Link>
        ))}
        <SidebarTrigger />
        {/* <SidebarTrigger /> */}
      </div>
    </nav>
  );
}

function SidebarTrigger() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <>
      <button
        data-state={state === "expanded" ? "open" : "closed"}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSidebar();
        }}
        className=" group relative transition-colors duration-300   data-[state=open]:text-destructive text-sm"
      >
        <div className="size-6 relative -translate-y-2  -translate-x-2 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="absolute left-[10px] top-[18px] h-4  w-4 transition-transform duration-300 group-data-[state=open]:translate-x-[5px] group-data-[state=open]:translate-y-[-2px] group-data-[state=open]:-rotate-45 "
            viewBox="0 0 24 24"
            aria-hidden
          >
            <line x1="2" y1="2" x2="22" y2="2"></line>
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="absolute left-[10px] top-[13px] h-4 w-4 transition-transform duration-300 group-data-[state=open]:translate-x-[-4px] group-data-[state=open]:translate-y-[3px] group-data-[state=open]:rotate-45  "
            viewBox="0 0 24 24"
            aria-hidden
          >
            <line x1="2" y1="2" x2="14" y2="2"></line>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="absolute left-[15px] top-[23px] h-4  w-4 transition-transform duration-300 group-data-[state=open]:translate-x-[-5px] group-data-[state=open]:translate-y-[-3px] group-data-[state=open]:rotate-45 "
            viewBox="0 0 24 24"
            aria-hidden
          >
            <line x1="2" y1="2" x2="14" y2="2"></line>
          </svg>
        </div>
        <span className="mx-auto">Autres</span>
      </button>
    </>
  );
}

export default MobileNav;

export const MainAdminRoutes = (pathname: string) => [
  {
    href: `/admin/invoices`,
    label: "Factures",
    active: pathname.startsWith(`/admin/invoices`),
    Icone: PiInvoice,
  },

  {
    href: `/admin/amap`,
    label: "AMAP",
    active: pathname.startsWith(`/admin/amap`),
    Icone: ShoppingBasket,
  },
  {
    href: `/admin/calendar`,
    label: "Calendrier",
    active: pathname.startsWith(`/admin/calendar`),
    Icone: Calendar,
  },
  {
    href: `/admin/users`,
    label: "Clients",
    active: pathname.startsWith(`/admin/users`),
    Icone: Users,
  },
];

export const SecondaryAdminRoutes = (pathname: string) => [
  {
    href: `/admin`,
    label: "Résumé",
    active: pathname === `/admin`,
    Icone: LayoutDashboardIcon,
  },

  {
    href: `/`,
    label: "Accueil",
    active: false,
    Icone: PresentationIcon,
  },

  {
    href: `/admin/contacts`,
    label: "Contacts",
    active: pathname.startsWith(`/admin/contacts`),
    Icone: PhoneCallIcon,
  },
  {
    href: `/admin/shops`,
    label: "Magasins",
    active: pathname.startsWith(`/admin/shops`),
    Icone: Store,
  },
  {
    href: `/admin/categories`,
    label: "Categories",
    active: pathname.startsWith(`/admin/categories`),
    Icone: RowsIcon,
  },
  {
    href: `/admin/products`,
    label: "Produits",
    active: pathname.startsWith(`/admin/products`),
    Icone: PackageIcon,
  },

  {
    href: `/admin/orders`,
    label: "Commandes",
    active: pathname.startsWith(`/admin/orders`),
    Icone: ListOrderedIcon,
  },
  {
    href: `/admin/stocks`,
    label: "Stocks",
    active: pathname.startsWith(`/admin/stocks`),
    Icone: Box,
  },
  {
    href: `/admin/direction`,
    label: "Direction",
    active: pathname.startsWith(`/admin/direction`),
    Icone: GiPathDistance,
  },
  {
    href: `/admin/calendar/day-order`,
    label: "Ordre des commandes par jour",
    active: pathname.startsWith(`/admin/calendar/day-order`),
    Icone: Shuffle,
  },
  {
    href: `/logout`,
    label: "Se deconnecter",
    active: false,
    Icone: LogOut,
  },
];

export const adminRoutes = (pathname: string) => [...MainAdminRoutes(pathname), ...SecondaryAdminRoutes(pathname)];
