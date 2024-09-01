import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDayName, getDaysBetweenDates } from "@/lib/date-utils";
import { useFormContext } from "react-hook-form";
import type { AMAPFormValues } from "./amap-schema";

function SelectDay() {
  const form = useFormContext<AMAPFormValues>();
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  function onValueChange(value: number) {
    if (!startDate && !endDate) {
      return;
    }
    form.setValue("daysOfAbsence", []);
    const shippingDays = getDaysBetweenDates({ from: startDate, to: endDate, day: value });

    shippingDays && form.setValue("shippingDays", shippingDays);
  }
  return (
    <FormField
      control={form.control}
      name="day"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel>Jour de livraison</FormLabel>
          <Select
            disabled={form.formState.isSubmitting}
            onValueChange={(value) => {
              field.onChange(Number(value));
              onValueChange(Number(value));
            }}
            value={String(field.value)}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue defaultValue={field.value} placeholder="Selectionner une categorie" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {[...Array(7)].map((_, day) => (
                <SelectItem key={day} value={String(day)}>
                  {getDayName(day)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}

export default SelectDay;
