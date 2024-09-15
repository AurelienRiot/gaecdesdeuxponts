"use client";
import AddressAutocomplete, { type Suggestion } from "@/actions/adress-autocompleteFR";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import * as React from "react";
import { LuMapPin } from "react-icons/lu";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

type SearchAddressProps = {
  className?: string;
  onValueChange: (address: Suggestion) => void;
  triggerClassName?: string;
};

const SearchAddress = React.forwardRef<HTMLButtonElement, SearchAddressProps>(
  ({ className, triggerClassName, onValueChange }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
    const [query, setQuery] = React.useState("");

    const setSearchTerm = async (value: string) => {
      setQuery(value);
      const temp = await AddressAutocomplete(value).catch((e) => {
        console.log(e);
        return [];
      });
      setSuggestions(temp);
    };

    return (
      <Sheet modal open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            ref={ref}
            id={"search-address"}
            variant="outline"
            role="combobox"
            className={cn(" justify-between w-full  pl-2 items-center", triggerClassName)}
          >
            <span className="flex items-center">
              <LuMapPin className="h-4 w-4 mr-2 shrink-0 " />
              Rechercher une adresse
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side={"top"} className="pb-6  ">
          <SheetHeader className="mx-auto w-full max-w-sm">
            <SheetTitle>{"Rechercher une adresse"}</SheetTitle>
          </SheetHeader>
          <Command loop shouldFilter={false} className={cn("mx-auto w-full max-w-sm ", className)}>
            <CommandInput
              placeholder="Entrer l'adresse..."
              className="h-9 w-full"
              value={query}
              onValueChange={(e) => {
                setSearchTerm(e);
              }}
            />
            <div className="relative">
              <CommandList className="w-full overflow-y-auto max-cclh-[35dvh] py-6">
                {query.length > 3 && <CommandEmpty>Adresse introuvable</CommandEmpty>}
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    className="cursor-pointer
                          bg-popover  text-popover-foreground w-full"
                    value={suggestion.label + index}
                    key={suggestion.label}
                    onSelect={() => {
                      onValueChange(suggestion);

                      setIsOpen(false);
                    }}
                  >
                    {suggestion.label}
                  </CommandItem>
                ))}
              </CommandList>
              <div className="inset-0 absolute from-background to-background bg-[linear-gradient(to_bottom,_var(--tw-gradient-from)_0%,_transparent_15%,_transparent_85%,_var(--tw-gradient-to)_100%)] pointer-events-none select-none" />
            </div>
          </Command>
        </SheetContent>
      </Sheet>
    );
  },
);

SearchAddress.displayName = "SearchAddress";

export default SearchAddress;
