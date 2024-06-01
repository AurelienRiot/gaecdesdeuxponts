"use client";
import AddressAutocomplete, {
  Suggestion,
} from "@/actions/adress-autocompleteFR";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react";
import { Path, PathValue, useFormContext } from "react-hook-form";
import * as RPNInput from "react-phone-number-input";
import { AnimateHeight } from "./animations/animate-size";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { FloatingInput, FloatingLabel } from "./ui/floating-label-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { CountriesList, CountrySelect, isCountry } from "./ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";

export type FullAdress = {
  label: string;
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
};

interface AdressFormProps {
  selectedAddress: FullAdress;
  setSelectedAddress: Dispatch<SetStateAction<FullAdress>>;
  className?: string;
}

export const AddressForm = <T extends { address: FullAdress }>({
  selectedAddress,
  setSelectedAddress,
  className,
}: AdressFormProps) => {
  const form = useFormContext<T>();
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(
    selectedAddress.country.toUpperCase() === "FR" ? true : false,
  );
  const [country, setCountry] = useState<RPNInput.Country>(
    isCountry(selectedAddress.country) ? selectedAddress.country : "FR",
  );

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value);
    setSuggestions(temp);
  };

  return (
    <div className={cn("-mb-8 space-y-4", className)}>
      <FormField
        control={form.control}
        name={"address" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Adresse</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <FormControl>
                <div className="relative items-start space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <p>Autres</p>
                    <Switch
                      onCheckedChange={() => {
                        setFilter(!filter);
                        setSelectedAddress({
                          ...selectedAddress,
                          country: "FR",
                        });
                        setCountry("FR");
                      }}
                      checked={filter}
                    />
                    <p>France</p>
                  </div>
                  <AnimateHeight display={filter} className="p-1">
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        onClick={() => setOpen((open) => !open)}
                        disabled={!filter || form.formState.isSubmitting}
                        className={cn(
                          " justify-between active:scale-100 ",
                          field.value && "font-normal text-muted-foreground ",
                        )}
                      >
                        Rechercher votre adresse
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </AnimateHeight>
                </div>
              </FormControl>
              <PopoverContent className="w-fit p-0" side="bottom" align="start">
                <Command loop shouldFilter={false}>
                  <CommandInput
                    placeholder="Entrer l'adresse..."
                    className="h-9 "
                    value={query}
                    onValueChange={(e) => {
                      setSearchTerm(e);
                      if (query.length < 3) {
                        const prev = form.getValues();
                        form.setValue(
                          "address" as Path<T>,
                          { ...prev.address, label: "" } as PathValue<
                            T,
                            Path<T>
                          >,
                        );
                      }
                      setOpen(true);
                    }}
                  />
                  <CommandList>
                    {query.length > 3 && (
                      <CommandEmpty>Adresse introuvable</CommandEmpty>
                    )}
                    {suggestions.map((address, index) => (
                      <CommandItem
                        className="cursor-pointer
                          bg-popover  text-popover-foreground"
                        value={index.toString()}
                        key={address.label}
                        onSelect={() => {
                          const prev = form.getValues();
                          form.setValue(
                            "address" as Path<T>,
                            {
                              ...prev.address,
                              label: address.label,
                            } as PathValue<T, Path<T>>,
                          );
                          setSelectedAddress((prev) => ({
                            ...prev,
                            label: address.label,
                            city: address.city,
                            country: address.country,
                            line1: address.line1,
                            postalCode: address.postal_code,
                            state: address.state,
                          }));
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
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col gap-4">
        <AddressInput
          label="Adresse"
          addressKey="line1"
          disabled={form.formState.isSubmitting}
          autoComplete="street-address"
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressInput
          label="Complément d'adresse"
          addressKey="line2"
          disabled={form.formState.isSubmitting}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressInput
          label="Ville"
          addressKey="city"
          disabled={form.formState.isSubmitting}
          autoComplete="address-level2"
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressInput
          label="Code postal"
          addressKey="postalCode"
          disabled={form.formState.isSubmitting}
          autoComplete="postal-code"
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressInput
          label="Région"
          addressKey="state"
          disabled={form.formState.isSubmitting}
          autoComplete="address-level1"
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />

        <AnimateHeight display={!filter} className="mb-4 p-1">
          <CountrySelect
            value={country}
            onChange={(value) => {
              setCountry(value);
              setSelectedAddress((prev) => ({ ...prev, country: value }));
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
  addressKey: keyof FullAdress;
  selectedAddress: FullAdress;
  setSelectedAddress: Dispatch<SetStateAction<FullAdress>>;
};

const AddressInput = ({
  label,
  addressKey,
  selectedAddress,
  setSelectedAddress,
  ...props
}: AddressInputProps) => {
  return (
    <div className="relative p-2">
      <FloatingInput
        {...props}
        id={addressKey}
        type="text"
        value={selectedAddress[addressKey]}
        onChange={(e) => {
          setSelectedAddress((prev) => ({
            ...prev,
            [addressKey]: e.target.value,
          }));
        }}
      />
      <FloatingLabel htmlFor={addressKey}>{label}</FloatingLabel>
    </div>
  );
};

export const defaultAddress: FullAdress = {
  label: "",
  city: "",
  country: "FR",
  line1: "",
  line2: "",
  postalCode: "",
  state: "",
};
