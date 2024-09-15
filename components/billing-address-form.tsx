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
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { CountriesList, CountrySelect, isCountry } from "./ui/phone-input";
import { Switch } from "./ui/switch";
import { defaultAddress, type addressSchema } from "./zod-schema/address-schema";
import type { billingAddressSchema } from "./zod-schema/billing-address-schema";

interface AdressFormProps {
  className?: string;
}

export const BillingAddressForm = ({ className }: AdressFormProps) => {
  const form = useFormContext<{
    billingAddress: z.infer<typeof billingAddressSchema>;
  }>();
  const billingAddress = form.watch("billingAddress");
  const [filter, setFilter] = useState(billingAddress?.country?.toUpperCase() === "FR" || !billingAddress);

  function onValueChange(suggestion: Suggestion) {
    form.setValue("billingAddress", {
      label: suggestion.label,
      city: suggestion.city,
      country: billingAddress?.country || "FR",
      line1: suggestion.line1,
      line2: billingAddress?.line2,
      postalCode: suggestion.postal_code,
      state: suggestion.state,
    });
    form.clearErrors("billingAddress");
  }

  return (
    <div className={cn("-mb-8 space-y-4 ", className)}>
      <div className="-mb-2 flex items-center gap-2">
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
                      <SearchAddress ref={field.ref} onValueChange={onValueChange} />
                    </AnimateHeight>
                  </div>
                </FormControl>
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
                ref={field.ref}
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
