"use client";
import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import { Button, IconButton } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, NumberInput } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollToTarget } from "@/lib/scroll-to-traget";
import { cn } from "@/lib/utils";
import type { Product } from "@prisma/client";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "sonner";
import type { AMAPFormValues } from "./amap-schema";

const negativeQuantityStyle = "bg-destructive text-destructive-foreground";

export const AMAPProducts = ({
  products,
}: {
  products: Product[];
}) => {
  const form = useFormContext<AMAPFormValues>();
  const amapItems = form.watch("amapItems");

  const addProduct = () => {
    if (amapItems.every((item) => item.itemId)) {
      const newItems = {
        itemId: "",
        unit: "",
        price: 0,
        quantity: 1,
        name: "",
        description: "",
      };
      form.setValue("amapItems", [...amapItems, newItems]);
    } else {
      toast.error("Completer tous les produits déjà existant");
    }
  };

  return (
    <FormField
      control={form.control}
      name="amapItems"
      render={({ field }) => (
        <FormItem className="">
          <FormLabel>Produits</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex flex-wrap items-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap border-dashed"
                  onClick={addProduct}
                >
                  <PlusCircledIcon className="mr-2 size-4" />
                  {"Ajouter un produit"}
                </Button>
              </div>
              {amapItems.map((item, productIndex) => (
                <div
                  key={`${item.itemId} ${productIndex}`}
                  className="w-fit rounded-md p-4 pb-4 thin-scrollbar bg-chart1/50 even:bg-chart2/50"
                >
                  <ProductName products={products} productIndex={productIndex} />
                </div>
              ))}
            </div>
          </FormControl>
          {form.formState.errors.amapItems && (
            <p className={"text-sm font-medium text-destructive"}>
              {form.formState.errors.amapItems?.message || "Veuillez completer tous les champs"}
            </p>
          )}
        </FormItem>
      )}
    />
  );
};

function ProductName({
  productIndex,
  products,
}: {
  productIndex: number;
  products: Product[];
}) {
  const form = useFormContext<AMAPFormValues>();
  const items = form.watch("amapItems");
  const quantity = items[productIndex].quantity;
  const selectedProduct = products.find((product) => product.id === items[productIndex].itemId);

  const deleteProduct = () => {
    const newItems = items.filter((_, index) => index !== productIndex);
    form.setValue("amapItems", newItems);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <SelectProductName products={products} productIndex={productIndex} quantity={quantity} />
        <FormField
          control={form.control}
          name={`amapItems.${productIndex}.price`}
          render={({ field }) => (
            <FormItem className="w-20 relative">
              <FormLabel className="flex items-center justify-between gap-2 ">
                <span>Prix</span>

                <IconButton
                  Icon={GrPowerReset}
                  className="border-dashed p-2 bg-transparent"
                  iconClassName="size-3"
                  onClick={() => field.onChange(selectedProduct?.price)}
                  type="button"
                />
              </FormLabel>
              <span
                className={cn(
                  "absolute right-1 top-[50px] transform -translate-y-1/2 text-muted-foreground",
                  quantity < 0 ? negativeQuantityStyle : "",
                )}
              >
                €
              </span>
              <FormControl>
                <NumberInput
                  disabled={form.formState.isSubmitting}
                  className={quantity < 0 ? negativeQuantityStyle : ""}
                  placeholder="9,99"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`amapItems.${productIndex}.quantity`}
          render={({ field }) => (
            <FormItem className="w-16">
              <FormLabel className="flex h-8 items-center justify-between gap-2">
                <span className="">Quantité</span>
              </FormLabel>

              <FormControl>
                <NumberInput
                  disabled={form.formState.isSubmitting}
                  className={quantity < 0 ? negativeQuantityStyle : ""}
                  placeholder="9,99"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {productIndex > 0 || items.length > 1 ? (
          <TrashButton
            type="button"
            disabled={form.formState.isSubmitting}
            variant="destructive"
            size="sm"
            className="mt-auto"
            onClick={deleteProduct}
            iconClassName="size-6"
          />
        ) : null}
      </div>
    </>
  );
}

const SelectProductName = ({
  productIndex,
  products,
  quantity,
}: {
  productIndex: number;
  quantity: number;
  products: Product[];
}) => {
  const form = useFormContext<AMAPFormValues>();

  const [open, setOpen] = useState(false);

  function onValueChange(value: string) {
    const product = products.find((product) => product.id === value);
    if (!product) {
      toast.error("Produit introuvable");
      return;
    }

    form.setValue(`amapItems.${productIndex}.itemId`, product.id);
    form.setValue(`amapItems.${productIndex}.unit`, product.unit);
    form.setValue(`amapItems.${productIndex}.description`, product.description);
    form.setValue(`amapItems.${productIndex}.name`, product.name);
    form.setValue(`amapItems.${productIndex}.price`, product.price);
    form.setValue(`amapItems.${productIndex}.quantity`, 1);

    setOpen(false);
  }

  return (
    <FormField
      control={form.control}
      name={`amapItems.${productIndex}.name`}
      render={({ field }) => (
        <FormItem className="relative w-56">
          <FormLabel id={`product-${productIndex}`} className="flex h-8 items-center justify-between gap-2">
            <span className="">{`Nom du produit ${productIndex + 1}`}</span>
          </FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    "w-full justify-between",
                    field.value ? "" : "text-muted-foreground",
                    quantity < 0 ? negativeQuantityStyle : "",
                  )}
                >
                  {field.value ? field.value : "Nom du produit"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" className="w-[200px] p-0" avoidCollisions={false}>
                <Command>
                  <CommandInput
                    onFocus={() => ScrollToTarget(`product-${productIndex}`)}
                    placeholder="Nom du produit"
                  />
                  <CommandList>
                    {products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        keywords={[product.name]}
                        onSelect={onValueChange}
                      >
                        {product.name}
                      </CommandItem>
                    ))}
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
