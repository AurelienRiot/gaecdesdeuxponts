"use client";
import type { Suggestion } from "@/actions/adress-autocompleteFR";
import { cn } from "@/lib/utils";
import { useState, type InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import type * as RPNInput from "react-phone-number-input";
import type * as z from "zod";
import { AnimateHeight } from "./animations/animate-size";
import SearchAddress from "./search-address";
import { Button } from "./ui/button";
import { FloatingInput, FloatingLabel } from "./ui/floating-label-input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { CountriesList, CountrySelect, isCountry } from "./ui/phone-input";
import type { addressSchema } from "./zod-schema/address-schema";

interface AdressFormProps {
  className?: string;
}

export const AddressForm = ({ className }: AdressFormProps) => {
  const form = useFormContext<{ address: z.infer<typeof addressSchema> }>();
  const address = form.watch("address");
  const [filter, setFilter] = useState(address.country?.toUpperCase() === "FR");

  function onValueChange(suggestion: Suggestion) {
    form.setValue("address", {
      label: suggestion.label,
      city: suggestion.city,
      country: address.country,
      line1: suggestion.line1,
      line2: address.line2,
      postalCode: suggestion.postal_code,
      state: suggestion.state,
      longitude: suggestion.longitude,
      latitude: suggestion.latitude,
    });
  }

  return (
    <div className={cn("-mb-8 space-y-4 w-full max-w-[350px]", className)}>
      <FormField
        control={form.control}
        name={"address"}
        render={({ field }) => (
          <FormItem className="flex flex-col ">
            <FormLabel className="my-auto h-6 leading-normal">Adresse</FormLabel>
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
                  <SearchAddress ref={field.ref} onValueChange={onValueChange} />
                </AnimateHeight>
              </div>
            </FormControl>

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
