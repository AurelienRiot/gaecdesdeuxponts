"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import {
  ChevronDown,
  HelpCircle,
  Map,
  PhoneCall,
  StoreIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useState } from "react";
import { BiPhotoAlbum } from "react-icons/bi";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const MainNav = ({
  className,
  categories,
}: {
  className?: string;
  categories: Promise<Category[]>;
}) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const routes = publicRoutes(pathname);
  const CategoriesRoutes = use(categories);

  return (
    <nav
      className={cn("mx-6  items-center space-x-4 lg:space-x-6 ", className)}
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="rounded-lg border border-border ">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-secondary text-secondary-foreground",
                  )}
                >
                  <StoreIcon className="mr-2 hidden h-4 w-4 xl:flex " />
                  Nos Produit
                  <ChevronDown className="ml-2 h-4 w-4" />
                </NavigationMenuLink>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="flex flex-col "
              >
                {CategoriesRoutes.map((category) => {
                  const href = `/category/${category.id}`;
                  const label = category.name;
                  const active = pathname.startsWith(
                    `/category/${category.id}`,
                  );
                  return (
                    <Button
                      asChild
                      key={href}
                      variant={"link"}
                      className={cn(
                        "w-full justify-start",
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
          </NavigationMenuItem>
          {routes.map(({ href, label, active, Icone }) => (
            <NavigationMenuItem
              className="rounded-lg border border-border "
              key={href}
            >
              <NavigationMenuLink
                href={href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-secondary text-secondary-foreground",
                )}
              >
                <Icone className="mr-2 hidden h-4 w-4 xl:flex " />
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default MainNav;

export const publicRoutes = (pathname: string) => [
  {
    href: `/faq`,
    label: "FAQ sur le Lait Cru",
    active: pathname === `/faq`,
    Icone: HelpCircle,
  },
  {
    href: `/gallerie`,
    label: "Gallerie",
    active: pathname === `/gallerie`,
    Icone: BiPhotoAlbum,
  },
  {
    href: `/contact`,
    label: "Contact",
    active: pathname === `/contact`,
    Icone: PhoneCall,
  },

  {
    href: `/find`,
    label: "Où nous trouver",
    active: pathname === `/find`,
    Icone: Map,
  },
];
