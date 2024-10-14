"use client";

import { cn } from "@/lib/utils";
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
    <nav className="fixed bottom-0 left-0 right-0 bg-primary text-neutral-200 sm:px-2 flex justify-around items-center h-20 pb-4 lg:hidden z-[1100]">
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
        <AutresButton />
      </div>
    </nav>
  );
}

function AutresButton() {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);

  const secondaryRoutes = SecondaryAdminRoutes(pathName).reverse();

  return (
    <>
      <Suspense fallback={null}>
        {" "}
        <AutoCloseSheet setIsOpen={setOpen} />{" "}
      </Suspense>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          onClick={(e) => e.stopPropagation()}
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
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-fit  pt-2 px-2 bg-green-950  text-neutral-200 border-0 shadow-lg"
        >
          {secondaryRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "flex flex-row items-center gap-4 px-4 py-2 rounded-md",
                route.active && "bg-green-600 font-bold",
              )}
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
