"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { HelpCircle, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";
import { BiPhotoAlbum } from "react-icons/bi";

const MainNav = () => {
  const pathname = usePathname();

  const routes = publicRoutes(pathname);

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 ">
      <NavigationMenu>
        <NavigationMenuList>
          {routes.map(({ href, label, active, Icone }) => (
            <NavigationMenuItem
              className="rounded-lg border-2 border-border"
              key={href}
            >
              <NavigationMenuLink
                href={href}
                className={navigationMenuTriggerStyle()}
              >
                <Icone className="mr-2 hidden h-4 w-4 xl:flex" />
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {/* <SearchNav /> */}
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
];
