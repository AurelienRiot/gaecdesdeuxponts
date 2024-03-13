import AddressAutocomplete, {
  Suggestion,
} from "@/actions/adress-autocompleteFR";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, haversine } from "@/lib/utils";
import { Shop } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface AddressInputProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  setSortedShops: Dispatch<SetStateAction<Shop[]>>;
  setCoordinates: Dispatch<
    SetStateAction<{ long: number | undefined; lat: number | undefined }>
  >;
  shops: Shop[];
}

export const AddressInput = ({
  setSortedShops,
  setCoordinates,
  shops,
  className,
  ...props
}: AddressInputProps) => {
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const setSearchTerm = async (value: string) => {
    setQuery(() => value);
    const temp = await AddressAutocomplete(value);
    setSuggestions(() => temp);
  };

  const sortShops = (coordinates: {
    long: number | undefined;
    lat: number | undefined;
  }) => {
    if (coordinates.long !== undefined && coordinates.lat !== undefined) {
      const shopsWithDistance = shops.map((shop) => ({
        ...shop,
        distance: haversine(coordinates, {
          long: shop.long,
          lat: shop.lat,
        }),
      }));

      const sorted = shopsWithDistance
        .filter((shop) => shop.distance !== undefined)
        .sort((a, b) => a.distance! - b.distance!);
      setSortedShops(sorted);
    }
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
            className,
          )}
          {...props}
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
            onValueChange={async (e) => {
              await setSearchTerm(e);
              const coordinates =
                suggestions[0] && suggestions[0].coordinates
                  ? {
                      long: suggestions[0].coordinates[0],
                      lat: suggestions[0].coordinates[1],
                    }
                  : { long: undefined, lat: undefined };

              sortShops(coordinates);
              setCoordinates(coordinates);
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
                  const coordinates = {
                    long: address.coordinates[0],
                    lat: address.coordinates[1],
                  };
                  sortShops(coordinates);
                  setCoordinates(coordinates);
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