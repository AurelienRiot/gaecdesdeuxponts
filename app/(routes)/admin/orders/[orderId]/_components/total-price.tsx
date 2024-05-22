import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { OrderFormValues } from "./order-form";

const TotalPrice = () => {
  const form = useFormContext<OrderFormValues>();

  const products = form.watch("orderItems");

  useEffect(() => {
    const totalPrice = products.reduce((acc, { price, quantity }) => {
      return acc + (price || 0) * (quantity || 1);
    }, 0);
    form.setValue("totalPrice", totalPrice);
  }, [products, form]);

  return (
    <FormField
      control={form.control}
      name={`totalPrice`}
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel>Prix total</FormLabel>
          <FormControl>
            <Input
              type="number"
              disabled={true}
              placeholder="Quantité du produit"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TotalPrice;
