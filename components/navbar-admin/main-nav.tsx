"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboardIcon,
  ListOrderedIcon,
  PackageIcon,
  PhoneCallIcon,
  PresentationIcon,
  RowsIcon,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = adminRoutes(pathname);

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-xs font-medium underline-offset-4 transition-colors hover:underline xl:text-sm",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {<route.Icone className="mr-2 hidden h-4 w-4 xl:inline-block" />}
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

export const adminRoutes = (pathname: string) => [
  {
    href: `/`,
    label: "Accueil",
    active: pathname === `/`,
    Icone: PresentationIcon,
  },
  {
    href: `/admin`,
    label: "Résumé",
    active: pathname === `/admin`,
    Icone: LayoutDashboardIcon,
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
    href: `/admin/users`,
    label: "Clients",
    active: pathname.startsWith(`/admin/users`),
    Icone: Users,
  },
  {
    href: `/admin/contacts`,
    label: "Contacts",
    active: pathname.startsWith(`/admin/contacts`),
    Icone: PhoneCallIcon,
  },
];
