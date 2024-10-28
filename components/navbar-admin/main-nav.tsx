"use client";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminRoutes } from "./mobile-nav";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = adminRoutes(pathname);

  return (
    <nav className={cn("flex items-center space-x-4 md:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "text-xs font-medium underline-offset-4 transition-colors hover:underline xl:text-sm",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {<route.Icone className="mr-2 hidden h-4 w-4 lg:inline-block" />}
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
