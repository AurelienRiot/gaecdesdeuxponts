"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import AutoCloseSheet from "../auto-close-sheet";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MainAdminRoutes, SecondaryAdminRoutes } from "./main-nav";

function MobileNav() {
  const pathname = usePathname();
  const mainRoutes = MainAdminRoutes(pathname);
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950 text-neutral-200 px-2 flex justify-around items-center h-16 md:hidden">
      <div className="flex flex-row w-full items-center justify-between px-4">
        {mainRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn("flex flex-col items-center ", route.active && "text-green-500")}
          >
            <route.Icone className="w-6 h-6" />
            <span className="text-sm">{route.label}</span>
          </Link>
        ))}
        <AutresButton />
      </div>
    </nav>
  );
}

function AutresButton() {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);

  const secondaryRoutes = SecondaryAdminRoutes(pathName);

  return (
    <>
      <Suspense fallback={null}>
        {" "}
        <AutoCloseSheet setIsOpen={setOpen} />{" "}
      </Suspense>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={cn("flex flex-col items-center ", open && "text-green-500")}>
          <Menu className=" h-6 w-6" />
          <span className="text-sm">Autres</span>
        </PopoverTrigger>
        <PopoverContent className="w-fit space-y-4 bg-neutral-950 text-neutral-200 border-0">
          {secondaryRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn("flex flex-row items-center ", route.active && "text-green-500")}
            >
              <route.Icone className="w-6 h-6" />
              <span className="text-sm">{route.label}</span>
            </Link>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}

export default MobileNav;
