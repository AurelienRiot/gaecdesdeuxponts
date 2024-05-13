"use client";
import AddressAutocomplete, {
  Suggestion,
} from "@/actions/adress-autocompleteFR";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X } from "lucide-react";
import { useState } from "react";
import { Marker, useMap } from "react-leaflet";
import { MakePin } from "./marker-pin";
import "./marker.css";
import { cn } from "@/lib/utils";

const MapFocus = ({ className }: { className?: string }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[] | undefined>(
    undefined,
  );
  const [query, setQuery] = useState("");
  const [pin, setPin] = useState<
    { label: string; lat: number; long: number } | undefined
  >(undefined);
  const map = useMap();
  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value);
    setSuggestions(temp);
  };

  return (
    <>
      <Command loop shouldFilter={false} className={className}>
        <CommandInput
          placeholder="Entrer votre adresse..."
          className="z-[400] mb-1 h-9 min-w-48 bg-neutral-50 p-4 shadow-md"
          value={query}
          showIcon={false}
          onValueChange={(e) => {
            setSearchTerm(e);
          }}
        />
        <X
          onClick={() => {
            setSuggestions(undefined);
            setQuery("");
          }}
          className="absolute -right-0.5
           top-[6px] z-[401] cursor-pointer p-1 opacity-50 "
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
          {suggestions &&
            suggestions.map((address, index) => (
              <CommandItem
                className="cursor-pointer    bg-popover text-popover-foreground"
                value={index.toString()}
                key={address.label}
                onSelect={() => {
                  console.log(address.label);
                  map.setView(
                    [address.coordinates[1], address.coordinates[0]],
                    10,
                  );
                  setPin({
                    label: address.label,
                    lat: address.coordinates[1],
                    long: address.coordinates[0],
                  });
                  setSuggestions(undefined);
                  setQuery(address.label);
                }}
              >
                {address.label}
              </CommandItem>
            ))}
        </CommandList>
      </Command>
      {!!pin && (
        <Marker
          position={[pin.lat, pin.long]}
          icon={MakePin("green", pin.label)}
        ></Marker>
      )}
    </>
  );
};

export default MapFocus;
