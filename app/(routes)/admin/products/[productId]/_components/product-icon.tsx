"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { ProductFormValues } from "./product-schema";
import { useFormContext } from "react-hook-form";
import SelectSheet from "@/components/select-sheet";
import { Button } from "@/components/ui/button";
import { productIcons } from "@/components/product";

const values = productIcons.map(({ Icon, label, color }) => ({
  value: { key: label },
  label: <Icon className={`size-5 ${color}`} />,
}));

function ProductIcon() {
  const form = useFormContext<ProductFormValues>();

  return (
    <FormField
      control={form.control}
      name={`icon`}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel>Icone</FormLabel>
          <FormControl>
            <SelectSheet
              triggerClassName="block "
              title="Selectionner l'icone'"
              trigger={(() => {
                const icon = productIcons.find((icon) => icon.label === field.value);
                return icon ? (
                  <Button variant="outline">
                    <icon.Icon className={`size-5 ${icon.color}`} />
                  </Button>
                ) : (
                  "Aucun icone"
                );
              })()}
              selectedValue={field.value}
              defaultValue={"Aucun icone"}
              values={values}
              onSelected={(value) => {
                field.onChange(value?.key);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default ProductIcon;
