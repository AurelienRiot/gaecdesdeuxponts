"use client";

import AddressAutocomplete, {
  Suggestion,
} from "@/actions/adress-autocompleteFR";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type Shop = {
  name: string;
  address: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  description: string;
  coordinates: [number, number];
};

const shops: Shop[] = [
  {
    name: "CHEVRERIE DES PERRIERES",
    address: "25 Entrelandes, 35390 Sainte-Anne-sur-Vilaine ",
    phone: "02 99 08 77 77",
    email: "chevres.perrieres@orange.fr",
    description: "Shop 1 description",
    coordinates: [-1.814653, 47.747504],
  },
  {
    name: "AMAP Du Champ au Panier",
    address: "12 rue des arcades, 35390 La Dominelais",
    phone: undefined,
    email: undefined,
    description: "Shop 2 description",
    coordinates: [-1.6834668, 47.7623234],
  },
  {
    name: "GAEC DE LA PINAIS",
    address: "23 bis La Pinais, 35480 Guipry-Messac",
    phone: "02 99 34 21 20",
    email: "fermedelapinais@orange.fr",
    description: "Shop 3 description",
    coordinates: [-1.761831, 47.823978],
  },
];

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}
function haversine(
  coord1: [number | undefined, number | undefined],
  coord2: [number, number],
) {
  const R = 6371.0; // Radius of the Earth in kilometers

  if (!coord1[0] || !coord1[1]) {
    return undefined;
  }

  const lon1 = coord1[0];
  const lat1 = coord1[1];
  const lon2 = coord2[0];
  const lat2 = coord2[1];

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}

const Find = () => {
  const [coordinates, setCoordinates] = useState<
    [number | undefined, number | undefined]
  >([undefined, undefined]);
  const [sortedShops, setSortedShops] = useState<Shop[]>([]);

  useEffect(() => {
    if (coordinates[0] !== undefined && coordinates[1] !== undefined) {
      const shopsWithDistance = shops.map((shop) => ({
        ...shop,
        distance: haversine(coordinates, shop.coordinates),
      }));

      const sorted = shopsWithDistance
        .filter((shop) => shop.distance !== undefined)
        .sort((a, b) => a.distance! - b.distance!);
      setSortedShops(sorted);
    } else {
      setSortedShops(shops); // Default to original order if no coordinates
    }
  }, [coordinates]);

  return (
    <Container className="my-8 space-y-8">
      <div className="">
        <h1 className="text-4xl font-bold">Trouver un magasin</h1>
        <p className="text-lg">
          Trouvez le magasin le plus proche de chez vous
        </p>
      </div>

      <AddressInput setCoordinates={setCoordinates} />

      <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sortedShops.map((shop) => (
          <ShopCard shop={shop} key={shop.name} coordinates={coordinates} />
        ))}
      </div>
    </Container>
  );
};

export default Find;

const ShopCard = ({
  shop,
  coordinates,
}: {
  shop: Shop;
  coordinates: [number | undefined, number | undefined];
}) => {
  const distance = haversine(coordinates, shop.coordinates);

  return (
    <Card className="flex h-full w-full min-w-[300px] flex-col ">
      <CardHeader>
        <CardTitle>{shop.name}</CardTitle>
        <CardDescription>{shop.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {!!shop.address && (
          <CardDescription>
            <span className="font-bold">Adresse :</span>{" "}
            {/* <Link
              href={`https://maps.google.com/?q=${shop.address}`}
              className="inline p-1 underline-offset-2 hover:underline"
              target="_blank"
            > */}
            {shop.address}
            {/* </Link> */}
          </CardDescription>
        )}
        {!!shop.phone && (
          <CardDescription>
            <span className="font-bold">Téléphone :</span> {shop.phone}
          </CardDescription>
        )}
        {!!shop.email && (
          <CardDescription>
            {" "}
            <span className="font-bold">Mail :</span> {shop.email}
          </CardDescription>
        )}
        {distance !== undefined && (
          <CardDescription>
            {" "}
            <span className="font-bold">Distance :</span>{" "}
            <span className="underline underline-offset-2">
              {Math.round(distance)} kilometers
            </span>
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

const AddressInput = ({
  setCoordinates,
}: {
  setCoordinates: Dispatch<
    SetStateAction<[number | undefined, number | undefined]>
  >;
}) => {
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value);
    setSuggestions(temp);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          onClick={() => setOpen((open) => !open)}
          className={cn(
            " justify-between active:scale-100 ",
            query && "font-normal text-muted-foreground ",
          )}
        >
          Rechercher votre adresse
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" side="bottom" align="start">
        <Command
          filter={(value, search) => {
            return 1;
          }}
          loop
        >
          <CommandInput
            placeholder="Entrer l'adresse..."
            className="h-9 "
            value={query}
            onValueChange={(e) => {
              setSearchTerm(e);

              setOpen(true);
            }}
          />
          <CommandList>
            {query.length > 2 && (
              <CommandEmpty>Adresse introuvable</CommandEmpty>
            )}
            {suggestions.map((address, index) => (
              <CommandItem
                className="cursor-pointer
                          bg-popover  text-popover-foreground"
                value={String(index)}
                key={address.label}
                onSelect={() => {
                  setCoordinates(address.coordinates);
                  console.log(address.coordinates);
                  setOpen(false);
                }}
              >
                {address.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
