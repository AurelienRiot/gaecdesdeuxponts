"use client";
import AddressAutocomplete, { type Suggestion } from "@/actions/adress-autocompleteFR";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import type * as RPNInput from "react-phone-number-input";
import type * as z from "zod";
import { AnimateHeight } from "./animations/animate-size";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./ui/command";
import { FloatingInput, FloatingLabel } from "./ui/floating-label-input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { CountriesList, CountrySelect, isCountry } from "./ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { addressSchema } from "./zod-schema/address-schema";

interface AdressFormProps {
  className?: string;
}

export const AddressForm = ({ className }: AdressFormProps) => {
  const form = useFormContext<{ address: z.infer<typeof addressSchema> }>();
  const address = form.watch("address");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(address.country?.toUpperCase() === "FR");

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value).catch((e) => {
      console.log(e);
      return [];
    });
    setSuggestions(temp);
  };

  return (
    <div className={cn("-mb-8 space-y-4 ", className)}>
      <FormField
        control={form.control}
        name={"address"}
        render={({ field }) => (
          <FormItem className="flex flex-col ">
            <FormLabel className="my-auto h-6 leading-normal">Adresse</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <FormControl>
                <div className="relative items-start space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={"outline"}
                      className={filter ? "hover:bg-green-500/50" : "bg-green-500 hover:bg-green-500"}
                      onClick={() => {
                        setFilter(false);
                        form.setValue("address.country", "FR");
                      }}
                    >
                      Autres
                    </Button>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={!filter ? "hover:bg-green-500/50" : "bg-green-500 hover:bg-green-500"}
                      onClick={() => {
                        setFilter(true);
                        form.setValue("address.country", "FR");
                      }}
                    >
                      France
                    </Button>
                  </div>
                  <AnimateHeight display={filter} className="p-1">
                    <PopoverTrigger asChild>
                      <Button
                        ref={field.ref}
                        variant="outline"
                        role="combobox"
                        onClick={() => setOpen((open) => !open)}
                        disabled={!filter || form.formState.isSubmitting}
                        className={cn(
                          " justify-between active:scale-100 w-full",
                          field.value.label && "font-normal text-muted-foreground ",
                        )}
                      >
                        Rechercher votre adresse
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </AnimateHeight>
                </div>
              </FormControl>
              <PopoverContent className="w-full p-0" side="bottom" align="start">
                <Command loop shouldFilter={false} className="w-full">
                  <CommandInput
                    placeholder="Entrer l'adresse..."
                    className="h-9 w-full"
                    value={query}
                    onValueChange={(e) => {
                      setSearchTerm(e);
                      if (query.length < 3) {
                        form.setValue("address.label", "");
                      }
                      setOpen(true);
                    }}
                  />
                  <CommandList className="w-full">
                    {query.length > 3 && <CommandEmpty>Adresse introuvable</CommandEmpty>}
                    {suggestions.map((suggestion, index) => (
                      <CommandItem
                        className="cursor-pointer
                          bg-popover  text-popover-foreground w-full"
                        value={suggestion.label + index}
                        key={suggestion.label}
                        onSelect={() => {
                          form.setValue("address", {
                            label: suggestion.label,
                            city: suggestion.city,
                            country: address.country,
                            line1: suggestion.line1,
                            line2: address.line2,
                            postalCode: suggestion.postal_code,
                            state: suggestion.state,
                          });

                          setOpen(false);
                        }}
                      >
                        {suggestion.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col gap-4">
        <AddressInput label="Adresse" addressKey="line1" autoComplete="street-address" />
        <AddressInput label="Complément d'adresse" addressKey="line2" />
        <AddressInput label="Ville" addressKey="city" autoComplete="address-level2" />
        <AddressInput label="Code postal" addressKey="postalCode" autoComplete="postal-code" />
        <AddressInput label="Région" addressKey="state" autoComplete="address-level1" />

        <AnimateHeight display={!filter} className="mb-4 p-1">
          <CountrySelect
            value={address.country as RPNInput.Country}
            onChange={(value) => {
              form.setValue("address.country", isCountry(value) ? value : "FR");
            }}
            disabled={filter || form.formState.isSubmitting}
            options={CountriesList}
            phoneCode={false}
            className="mx-1 w-fit rounded-lg  "
          />
        </AnimateHeight>
      </div>
    </div>
  );
};

type AddressInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  addressKey: keyof z.infer<typeof addressSchema>;
};

const AddressInput = ({ label, addressKey, disabled, className, type = "text", ...props }: AddressInputProps) => {
  const form = useFormContext<{ address: z.infer<typeof addressSchema> }>();
  const addressValue = form.watch(`address.${addressKey}`);
  const id = "address-" + addressKey;

  return (
    <div className={cn("relative p-2", className)} {...props}>
      <FloatingInput
        disabled={form.formState.isSubmitting || disabled}
        id={id}
        type="text"
        value={addressValue}
        onChange={(e) => {
          form.setValue(`address.${addressKey}`, e.target.value);
        }}
      />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
};
