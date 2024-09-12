"use client";

import AddressAutocomplete, { type Suggestion } from "@/actions/adress-autocompleteFR";
import { Button, IconButton } from "@/components/ui/button";

import { Command, CommandEmpty, CommandInput, CommandItem, CommandListModal } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import { ChevronDown, ChevronsUpDown, House, Tractor } from "lucide-react";
import dynamicImport from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import "../../../(public)/ou-nous-trouver/_components/marker.css";
import type { UserAndShop } from "./direction-form";
import type { DirectionFormValues, Point } from "./direction-schema";
const MapModal = dynamicImport(() => import("./map-modal"), {
  ssr: false,
});

type AddressModalProps = {
  onValueChange?: (address: Point) => void;
  usersAndShops: UserAndShop[];
  value?: Point;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const AddressModal = ({ usersAndShops, onValueChange, value, setIsOpen, isOpen }: AddressModalProps) => {
  const form = useFormContext<DirectionFormValues>();
  const [input, setInput] = useState<Point>(value || { label: "" });

  useEffect(() => {
    if (value) {
      setInput(value);
    }
  }, [value]);
  function onClose(val: Point) {
    setInput(val);
    if (onValueChange) onValueChange(val);
    setIsOpen(false);
    form.clearErrors();
  }

  return (
    <>
      <Modal
        className="left-[50%] top-[25%] md:top-[50%] max-h-[90%] w-[90%] max-w-[700px]  rounded-sm "
        title=""
        description=""
        isOpen={isOpen}
        onClose={() => onClose(input)}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <HouseSelect onSelect={onClose} />
            <FarmSelect onSelect={onClose} />
          </div>
          <AddressSelect usersAndShops={usersAndShops} onValueChange={onClose} />
          <AddressSearch onValueChange={onClose} />
          <MapModal onValueChange={onClose} />
          <Input
            placeholder="Adresse"
            onChange={(e) => {
              setInput({ label: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClose(input);
              }
            }}
            value={input.label}
          />
        </div>
      </Modal>
    </>
  );
};

function FarmSelect({ onSelect }: { onSelect: (val: Point) => void }) {
  return (
    <IconButton
      className="text-green-500"
      Icon={Tractor}
      onClick={() => onSelect({ label: "6 le Pont Robert 44290 Massérac" })}
    />
  );
}

function HouseSelect({ onSelect }: { onSelect: (val: Point) => void }) {
  return (
    <IconButton
      className="text-blue-500"
      Icon={House}
      onClick={() => onSelect({ label: "Pont de l'Eau, 44460 Avessac, France" })}
    />
  );
}

function AddressSelect({
  usersAndShops,
  onValueChange,
}: { usersAndShops: UserAndShop[]; onValueChange: (address: Point) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          id="select-address"
          // disabled={form.formState.isSubmitting}
          className={cn("w-full justify-between pl-2")}
        >
          <span className="flex items-center">
            <FaRegUser className="h-4 w-4 mr-2 inline" />
            Rechercher un client
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" avoidCollisions={false} className=" z-[1200] p-0   ">
        <Command>
          <CommandInput
            // onFocus={() => ScrollToTarget("select-address")}
            placeholder="Nom du client"
          />

          <CommandListModal>
            {usersAndShops.map((item) => (
              <CommandItem
                key={item.address}
                value={item.address}
                keywords={[item.label]}
                onSelect={() => {
                  onValueChange({ label: item.address, longitude: item.longitude, latitude: item.latitude });
                  setOpen(false);
                }}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={16}
                    height={16}
                    className="mr-2 object-contain rounded-sm"
                  />
                )}
                {item.label}
              </CommandItem>
            ))}
          </CommandListModal>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function AddressSearch({ onValueChange }: { onValueChange: (address: Point) => void }) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [query, setQuery] = useState("");

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value).catch((e) => {
      console.log(e);
      return [];
    });
    setSuggestions(temp);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={"search-address"}
          variant="outline"
          role="combobox"
          onClick={() => setOpen((open) => !open)}
          className={cn(" justify-between w-full  pl-2 items-center")}
        >
          <span className="flex items-center">
            <LuMapPin className="h-4 w-4 mr-2 " />
            Rechercher une adresse
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[1200]" side="bottom" align="start">
        <Command loop shouldFilter={false} className="w-full">
          <CommandInput
            // onFocus={() => ScrollToTarget("search-address")}
            placeholder="Entrer l'adresse..."
            className="h-9 w-full"
            value={query}
            onValueChange={(e) => {
              setSearchTerm(e);
              setOpen(true);
            }}
          />
          <CommandListModal className="w-full">
            {query.length > 3 && <CommandEmpty>Adresse introuvable</CommandEmpty>}
            {suggestions.map((suggestion, index) => (
              <CommandItem
                className="cursor-pointer
                          bg-popover  text-popover-foreground w-full"
                value={suggestion.label + index}
                key={suggestion.label}
                onSelect={() => {
                  onValueChange({
                    label: suggestion.label,
                    longitude: suggestion.coordinates[0],
                    latitude: suggestion.coordinates[1],
                  });

                  setOpen(false);
                }}
              >
                {suggestion.label}
              </CommandItem>
            ))}
          </CommandListModal>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default AddressModal;
