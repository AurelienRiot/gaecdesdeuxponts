"use client";

import { useCategoriesContext } from "@/context/categories-context";
import { cn } from "@/lib/utils";
import { ChevronDown, Map, PhoneCall, StoreIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const MainNav = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const routes = publicRoutes(pathname);
  const { categories } = useCategoriesContext();

  return (
    <nav
      className={cn("mx-6   items-center space-x-4 lg:space-x-6 ", className)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="group relative flex items-center justify-center ">
          <StoreIcon className="mr-2 hidden h-4 w-4 xl:flex " />
          Nos Produits
          <ChevronDown className="ml-2 h-4 w-4" />
          <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-blue-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="flex flex-col ">
          {categories.map((category) => {
            const href = `/category/${encodeURIComponent(category.name)}`;
            const label = category.name;
            const active = pathname.startsWith(
              `/category/${encodeURIComponent(category.name)}`,
            );
            return (
              <Button
                asChild
                key={href}
                variant={"link"}
                className={cn(
                  "w-full justify-start ",
                  active && " bg-primary text-primary-foreground",
                )}
              >
                <Link onClick={() => setOpen(false)} href={href}>
                  {label}{" "}
                </Link>
              </Button>
            );
          })}
        </PopoverContent>
      </Popover>
      {routes.map(({ href, label, active, Icone }) => (
        <Link
          key={href}
          href={href}
          className={"group relative flex items-center justify-center"}
        >
          <Icone className="mr-2 hidden h-4 w-4 xl:flex " />
          {label}
          <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;

export const publicRoutes = (pathname: string) => [
  // {
  //   href: `/faq`,
  //   label: "FAQ sur le Lait Cru",
  //   active: pathname === `/faq`,
  //   Icone: HelpCircle,
  // },
  // {
  //   href: `/gallerie`,
  //   label: "Gallerie",
  //   active: pathname === `/gallerie`,
  //   Icone: BiPhotoAlbum,
  // },
  {
    href: `/contact`,
    label: "Contact",
    active: pathname === `/contact`,
    Icone: PhoneCall,
  },

  {
    href: `/ou-nous-trouver`,
    label: "Où nous trouver",
    active: pathname === `/ou-nous-trouver`,
    Icone: Map,
  },
];
