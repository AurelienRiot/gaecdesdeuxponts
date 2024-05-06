import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuListItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import NosProduits from "./nos-produits";
import { MapIcon } from "lucide-react";
import { TiBusinessCard } from "react-icons/ti";
import { GiCow } from "react-icons/gi";
import AuthLink from "./auth-link";

export function MainNav({
  className,
  orientation,
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <NavigationMenu
      delayDuration={10000}
      skipDelayDuration={500}
      orientation={orientation}
      className={className}
    >
      <NavigationMenuList>
        <NosProduits />

        <NavigationMenuItem>
          <NavigationMenuTrigger>À propos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[calc(100vw-165px)] max-w-[420px] grid-cols-1 gap-3 p-1 xs:p-4 sm:w-[420px] sm:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 hidden sm:block">
                <Image
                  src={"/vache.webp"}
                  alt="Vache"
                  width={1200}
                  height={1600}
                  sizes="160px"
                  className="h-full w-full rounded-md object-cover"
                />
              </li>
              {aProposRoutes.map(({ href, title, descripton, Icone }) => (
                <NavigationMenuListItem
                  key={href}
                  href={href}
                  title={title}
                  Icone={<Icone className="mr-2 size-4" />}
                >
                  {descripton}
                </NavigationMenuListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href={"/contact"}>Contact</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="sm:hidden">
            <AuthLink />
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export const aProposRoutes = [
  {
    href: `/ou-nous-trouver`,
    title: "Points de vente",
    descripton: "Retrouver nos produits dans ces points de vente",
    Icone: MapIcon,
  },
  {
    href: "/#partenaires",
    title: "Nos partenaires",
    descripton: "Ils nous font confiance",
    Icone: TiBusinessCard,
  },
  {
    href: "/#la-ferme",
    title: "La Ferme",
    descripton: "Venez chercher votre lait directment à la ferme",
    Icone: GiCow,
  },
];
