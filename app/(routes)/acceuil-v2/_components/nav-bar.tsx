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

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="hidden lg:block ">
      <NavigationMenuList>
        <NosProduits />

        <NavigationMenuItem>
          <NavigationMenuTrigger>À propos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-[.75fr_1fr] gap-3 p-6 md:w-[420px]">
              <li className="row-span-3">
                <Image
                  src={"/vache.webp"}
                  alt="Vache"
                  width={1200}
                  height={1600}
                  sizes="160px"
                  className="h-full w-full rounded-md object-cover"
                />
              </li>
              <NavigationMenuListItem
                href="/ou-nous-trouver"
                title="Points de vente"
              >
                Retrouver nos produits dans ces points de vente
              </NavigationMenuListItem>
              <NavigationMenuListItem
                href="/acceuil-v2#partenaires"
                title="Nos partenaires"
              >
                Ils nous font confiance
              </NavigationMenuListItem>
              <NavigationMenuListItem
                href="/docs/primitives/typography"
                title="La Ferme"
              >
                Venez chercher votre lait directment à la ferme
              </NavigationMenuListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href={"/contact"}>Contact</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
