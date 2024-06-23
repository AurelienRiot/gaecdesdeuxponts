"use client";
import AddressAutocomplete, {
  type  Suggestion,
} from "@/actions/adress-autocompleteFR";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X } from "lucide-react";
import {  type Dispatch, type  SetStateAction, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import { MakePin } from "./marker-pin";
import "./marker.css";
import { cn } from "@/lib/utils";
import LocationMarker from "./location-marker";
import { usePostHog } from "posthog-js/react";
import { IconButton } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";

const MapFocus = ({
  className,
  setCoordinates,
}: {
  className?: string;
  setCoordinates: Dispatch<
    SetStateAction<{ long: number | undefined; lat: number | undefined }>
  >;
}) => {
  const { getValue } = useLocalStorage("cookies-banner");
  const [suggestions, setSuggestions] = useState<Suggestion[] | undefined>(
    undefined,
  );
  const [query, setQuery] = useState("");
  const [pin, setPin] = useState<
    { label: string; lat: number; long: number } | undefined
  >(undefined);
  const map = useMap();
  const posthog = usePostHog();

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value);
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
        setPin={setPin}
        setCoordinates={setCoordinates}
        className="absolute right-3 top-3 z-[1000]"
      />

      <Command loop shouldFilter={false} className={className}>
        <CommandInput
          title="Entrer votre adresse"
          placeholder="Entrer votre adresse..."
          className="z-[400] mb-1 h-9 min-w-48 bg-neutral-50 p-4 shadow-md"
          value={query}
          showIcon={false}
          onValueChange={(e) => {
            setSearchTerm(e);
          }}
        />
        <IconButton
          Icon={X}
          onClick={() => {
            setSuggestions(undefined);
            setQuery("");
          }}
          noStyle
          iconClassName="size-4"
          className="absolute -right-0
          top-[10px] z-[401] cursor-pointer  opacity-50"
          title="Fermer la recherche"
        />

        <CommandList
          className={cn(
            "z-[400] space-y-2 rounded-md bg-popover",
            suggestions ? "p-2" : "",
          )}
        >
          {query.length > 3 && suggestions && (
            <CommandEmpty className="flex w-full cursor-default select-none items-center rounded-sm bg-popover px-2 py-1 text-left text-sm text-popover-foreground">
              Adresse introuvable
            </CommandEmpty>
          )}
          {
            suggestions?.map((address, index) => (
              <CommandItem
                className="cursor-pointer   bg-popover text-popover-foreground"
                value={index.toString()}
                key={address.label}
                onSelect={() => onSelectAddress(address)}
              >
                {address.label}
              </CommandItem>
            ))}
        </CommandList>
      </Command>
      {!!pin && (
        <Marker
          position={[pin.lat, pin.long]}
          icon={MakePin("green", pin.label, null)}
        ></Marker>
      )}
    </>
  );
};

export default MapFocus;
