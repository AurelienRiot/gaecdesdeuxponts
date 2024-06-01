"use client";
import AddressAutocomplete, {
  Suggestion,
} from "@/actions/adress-autocompleteFR";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as RPNInput from "react-phone-number-input";
import * as z from "zod";
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

export const addressSchema = z.object({
  label: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  postalCode: z.string().optional(),
  state: z.string().optional(),
});

interface AdressFormProps {
  className?: string;
}

export const AddressForm = ({ className }: AdressFormProps) => {
  const form = useFormContext<{ address: z.infer<typeof addressSchema> }>();
  const address = form.watch("address");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(
    address.country?.toUpperCase() === "FR" ? true : false,
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
        name={"address"}
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
                        form.setValue("address.country", "FR");
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
                          field.value.label &&
                            "font-normal text-muted-foreground ",
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
                        form.setValue("address.label", "");
                      }
                      setOpen(true);
                    }}
                  />
                  <CommandList>
                    {query.length > 3 && (
                      <CommandEmpty>Adresse introuvable</CommandEmpty>
                    )}
                    {suggestions.map((suggestion, index) => (
                      <CommandItem
                        className="cursor-pointer
                          bg-popover  text-popover-foreground"
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
        <AddressInput
          label="Adresse"
          addressKey="line1"
          autoComplete="street-address"
        />
        <AddressInput label="Complément d'adresse" addressKey="line2" />
        <AddressInput
          label="Ville"
          addressKey="city"
          autoComplete="address-level2"
        />
        <AddressInput
          label="Code postal"
          addressKey="postalCode"
          autoComplete="postal-code"
        />
        <AddressInput
          label="Région"
          addressKey="state"
          autoComplete="address-level1"
        />

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

type AddressInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "id"
> & {
  label: string;
  addressKey: keyof z.infer<typeof addressSchema>;
};

const AddressInput = ({
  label,
  addressKey,
  disabled,
  className,
  type = "text",
  ...props
}: AddressInputProps) => {
  const form = useFormContext<{ address: z.infer<typeof addressSchema> }>();
  const addressValue = form.watch(`address.${addressKey}`);
  const id = "address-" + addressKey;

  return (
    <div className={cn("relative p-2", className)}>
      <FloatingInput
        disabled={form.formState.isSubmitting || disabled}
        id={id}
        value={addressValue}
        onChange={(e) => {
          form.setValue(`address.${addressKey}`, e.target.value);
        }}
        {...props}
      />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
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
