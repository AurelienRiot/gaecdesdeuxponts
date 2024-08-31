import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import type { AMAPFormValues } from "./amap-schema";

const TotalPrice = () => {
  const form = useFormContext<AMAPFormValues>();

  const amapItems = form.watch("amapItems");
  const shippingDays = form.watch("shippingDays");

  useEffect(() => {
    const totalPrice = amapItems.reduce((acc, { price, quantity }) => {
      return acc + (price || 0) * (quantity || 1);
    }, 0);
    form.setValue("totalPrice", Number((totalPrice * shippingDays.length).toFixed(2)));
  }, [amapItems, form]);

  return (
    <FormField
      control={form.control}
      name={`totalPrice`}
      render={({ field }) => (
        <FormItem className="w-24">
          <FormLabel>Prix total</FormLabel>
          <FormControl>
            <div className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ">{`${field.value || 0}€`}</div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TotalPrice;
