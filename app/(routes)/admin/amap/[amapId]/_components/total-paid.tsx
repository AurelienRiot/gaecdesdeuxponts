import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, NumberInput } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { AMAPFormValues } from "./amap-schema";

const TotalPaid = () => {
  const form = useFormContext<AMAPFormValues>();

  return (
    <FormField
      control={form.control}
      name={`totalPaid`}
      render={({ field }) => (
        <FormItem className="w-24 relative">
          <FormLabel>Total payé</FormLabel>
          <span className={"absolute right-1 top-8 transform  text-muted-foreground"}>€</span>
          <FormControl>
            <NumberInput disabled={form.formState.isSubmitting} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TotalPaid;
