import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "./product-form";
import type { OptionsArray } from "@/components/product/product-function";

const OptionValueForm = ({
  productIndex,
  optionIndex,
  optionsArray,
  options,
}: {
  optionsArray: OptionsArray;
  productIndex: number;
  optionIndex: number;
  options: { name: string; value: string }[];
}) => {
  const form = useFormContext<ProductFormValues>();
  const [openValue, setOpenValue] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <FormField
      control={form.control}
      name={`products.${productIndex}.options.${optionIndex}.value`}
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel>
            {form.getValues().products[productIndex].options[optionIndex]
              .name || "Nom de l'option"}
          </FormLabel>
          <FormControl>
            <Popover open={openValue} onOpenChange={setOpenValue}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    "min-w-48 justify-between",
                    field.value ? "" : "text-muted-foreground",
                  )}
                >
                  {field.value ? field.value : "Valeur de l'option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Nom de la valeur"
                  />
                  <CommandList>
                    {optionsArray.map(
                      ({ name, values }) =>
                        options[optionIndex].name === name &&
                        values.map((value) => (
                          <CommandItem
                            key={value}
                            value={value}
                            onSelect={(currentValue) => {
                              field.onChange(currentValue);
                              setOpenValue(false);
                              setSearch("");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {value}
                          </CommandItem>
                        )),
                    )}
                    {!!search && (
                      <CommandItem
                        value={search}
                        className="cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          field.onChange(search);
                          setOpenValue(false);
                          setSearch("");
                        }}
                      >
                        {" "}
                        <Check className={"mr-2 h-4 w-4 opacity-0"} />
                        {`Créer "${search}"`}
                      </CommandItem>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OptionValueForm;
