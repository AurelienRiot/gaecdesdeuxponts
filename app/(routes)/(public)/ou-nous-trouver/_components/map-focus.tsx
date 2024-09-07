"use client";
import AddressAutocomplete, { type Suggestion } from "@/actions/adress-autocompleteFR";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { X } from "lucide-react";
import { type Dispatch, type SetStateAction, useState, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import { MakePin } from "./marker-pin";
import { cn } from "@/lib/utils";
import LocationMarker from "./location-marker";
import { usePostHog } from "posthog-js/react";
import { IconButton } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Shop } from "@prisma/client";

const MapFocus = ({
  className,
  setCoordinates,
  shops,
  setSortedShops,
}: {
  className?: string;
  setSortedShops: Dispatch<SetStateAction<Shop[]>>;
  shops: Shop[];
  setCoordinates: Dispatch<SetStateAction<{ long: number | undefined; lat: number | undefined }>>;
}) => {
  const { getValue } = useLocalStorage("cookies-banner");
  const [suggestions, setSuggestions] = useState<Suggestion[] | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [pin, setPin] = useState<{ label: string; lat: number; long: number } | undefined>(undefined);
  const map = useMap();
  const inputRef = useRef<HTMLInputElement>(null);
  const posthog = usePostHog();

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value).catch((e) => {
      console.log(e);
      return [];
    });
    setSuggestions(temp);
  };

  function onSelectAddress(address: Suggestion) {
    const longitude = address.coordinates[0];
    const latitude = address.coordinates[1];
    const { accept } = getValue();

    if (accept) {
      posthog?.capture("localisation_trouvée", {
        latitude,
        longitude,
        adresse: address.label,
      });
    }

    map.setView([latitude, longitude], 10);
    setPin({
      label: "Votre position",
      lat: latitude,
      long: longitude,
    });
    setCoordinates({
      long: longitude,
      lat: latitude,
    });
    setSuggestions(undefined);
    setQuery(address.label);
  }

  return (
    <>
      <LocationMarker
        shops={shops}
        setSortedShops={setSortedShops}
        setPin={setPin}
        setCoordinates={setCoordinates}
        className="absolute right-3 top-3 z-[1000]"
      />

      <Command loop shouldFilter={false} className={className}>
        <CommandInput
          ref={inputRef}
          title="Entrer votre adresse"
          placeholder="Entrer votre adresse..."
          className="z-[400]  bg-background mb-1 h-9 w-44 focus:w-56 text-xs transition-all  p-4 pr-0 shadow-md peer"
          value={query}
          showIcon={false}
          onValueChange={(e) => {
            setSearchTerm(e);
          }}
        />
        <div className="absolute z-[401] peer-focus:from-70% peer-focus:to-90% inset-0 h-9 w-full bg-gradient-to-r pointer-events-none from-transparent from-80% to-95% to-background" />
        <IconButton
          Icon={X}
          onMouseDown={(e) => {
            e.preventDefault();
            setSuggestions(undefined);
            setQuery("");
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          noStyle
          iconClassName="size-4"
          className="absolute right-1
          top-[10px] z-[402] cursor-pointer opacity-0 peer-focus:opacity-100 transition-opacity "
          title="Réinitialiser la recherche"
        />

        <CommandList
          className={cn(
            "z-[400] space-y-2 rounded-md bg-popover p-2 max-w-56",
            query.length > 3 && suggestions ? "" : "hidden",
          )}
        >
          {query.length > 3 && suggestions && (
            <CommandEmpty className="flex w-full cursor-default select-none items-center rounded-sm bg-popover px-2 py-1 text-left text-sm text-popover-foreground">
              Adresse introuvable
            </CommandEmpty>
          )}
          {suggestions?.map((address, index) => (
            <CommandItem
              className="cursor-pointer   bg-popover text-popover-foreground"
              value={address.label}
              key={address.label}
              onSelect={() => onSelectAddress(address)}
            >
              {address.label}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
      {!!pin && <Marker position={[pin.lat, pin.long]} icon={MakePin("green", pin.label, null)}></Marker>}
    </>
  );
};

export default MapFocus;
