"use client";
import AddressAutocomplete, { type Suggestion } from "@/actions/adress-autocompleteFR";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import type * as RPNInput from "react-phone-number-input";
import * as z from "zod";
import type { FullAdress, addressSchema } from "./address-form";
import { AnimateHeight } from "./animations/animate-size";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./ui/command";
import { FloatingInput, FloatingLabel } from "./ui/floating-label-input";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { CountriesList, CountrySelect, isCountry } from "./ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";

interface AdressFormProps {
  className?: string;
}

export const billingAddressSchema = z
  .object({
    label: z.string().optional(),
    city: z.string().min(1, {
      message: "Veuillez entrer la ville",
    }),
    country: z.string().min(1, {
      message: "Veuillez entrer le pays",
    }),
    line1: z.string().min(1, {
      message: "Veuillez entrer l'adresse",
    }),
    line2: z.string().optional(),
    postalCode: z.string().min(1, {
      message: "Veuillez entrer le code postal",
    }),
    state: z.string().min(1, {
      message: "Veuillez entrer la région",
    }),
  })
  .optional();

export const BillingAddressForm = ({ className }: AdressFormProps) => {
  const form = useFormContext<{
    billingAddress: z.infer<typeof billingAddressSchema>;
  }>();
  const billingAddress = form.watch("billingAddress");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(billingAddress?.country?.toUpperCase() === "FR" || !billingAddress);

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value);
    setSuggestions(temp);
  };

  return (
    <div className={cn("-mb-8 space-y-4", className)}>
      <div className="-mb-1 flex items-center gap-2">
        <p className="text-sm font-medium leading-none">Même adresse de facturation</p>
        <Switch
          onCheckedChange={(check) => {
            check ? form.setValue("billingAddress", undefined) : form.setValue("billingAddress", defaultAddress);
          }}
          checked={!billingAddress}
        />
      </div>
      {!!billingAddress && (
        <>
          <FormField
            control={form.control}
            name={"billingAddress"}
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
                            form.setValue("billingAddress.country", "FR");
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
                            form.setValue("billingAddress.country", "FR");
                          }}
                        >
                          France
                        </Button>
                      </div>
                      <AnimateHeight display={filter} className="p-1">
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            onClick={() => setOpen((open) => !open)}
                            disabled={!filter || form.formState.isSubmitting}
                            className={cn(
                              " justify-between active:scale-100 w-full",
                              billingAddress.label && "font-normal text-muted-foreground ",
                            )}
                          >
                            Rechercher votre adresse
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                      </AnimateHeight>
                    </div>
                  </FormControl>
                  <PopoverContent className=" p-0" side="bottom" align="start">
                    <Command loop shouldFilter={false}>
                      <CommandInput
                        placeholder="Entrer l'adresse..."
                        className="h-9 "
                        value={query}
                        onValueChange={(e) => {
                          setSearchTerm(e);
                          if (query.length < 3) {
                            form.setValue("billingAddress.label", "");
                          }
                          setOpen(true);
                        }}
                      />
                      <CommandList>
                        {query.length > 3 && <CommandEmpty>Adresse introuvable</CommandEmpty>}
                        {suggestions.map((suggestion, index) => (
                          <CommandItem
                            className="cursor-pointer
                      bg-popover  text-popover-foreground"
                            value={suggestion.label + index}
                            key={suggestion.label}
                            onSelect={() => {
                              console.log(billingAddress);

                              form.setValue("billingAddress", {
                                label: suggestion.label,
                                city: suggestion.city,
                                country: billingAddress.country,
                                line1: suggestion.line1,
                                line2: billingAddress.line2,
                                postalCode: suggestion.postal_code,
                                state: suggestion.state,
                              });
                              form.clearErrors("billingAddress");
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
                value={billingAddress.country as RPNInput.Country}
                onChange={(value) => {
                  form.setValue("billingAddress.country", isCountry(value) ? value : "FR");
                }}
                disabled={filter || form.formState.isSubmitting}
                options={CountriesList}
                phoneCode={false}
                className="mx-1 w-fit rounded-lg  "
              />
            </AnimateHeight>
          </div>
        </>
      )}
    </div>
  );
};

type AddressInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  addressKey: keyof z.infer<typeof addressSchema>;
};

const AddressInput = ({ label, addressKey, disabled, className, type = "text", ...props }: AddressInputProps) => {
  const form = useFormContext<{
    billingAddress: z.infer<typeof billingAddressSchema>;
  }>();
  const addressValue = form.watch(`billingAddress.${addressKey}`);
  const id = "billingAddress-" + addressKey;

  return (
    <FormField
      control={form.control}
      name={`billingAddress.${addressKey}`}
      render={({ field }) => (
        <FormItem className="relative">
          <FormControl>
            <div className={cn("relative p-2", className)} {...props}>
              <FloatingInput
                value={addressValue}
                onChange={(e) => {
                  form.setValue(`billingAddress.${addressKey}`, e.target.value);
                  form.clearErrors(`billingAddress.${addressKey}`);
                }}
                type={type}
                disabled={form.formState.isSubmitting || disabled}
                id={id}
              />
              <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
            </div>
          </FormControl>
          <FormMessage className="absolute -bottom-3 left-4" />
        </FormItem>
      )}
    />
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
