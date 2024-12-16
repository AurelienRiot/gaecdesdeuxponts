"use client";
import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import { GrPowerReset } from "@/components/react-icons";
import SelectSheet from "@/components/select-sheet";
import { Button, IconButton } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NumberInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Product } from "@prisma/client";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { AMAPFormValues } from "./amap-schema";
import SelectSheetWithTabs from "@/components/select-sheet-with-tabs";
import { DisplayProductIcon } from "@/components/product";
import { sanitizeString } from "@/lib/id";

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
        icon: null,
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
  const selectedProduct = items[productIndex];
  const quantity = selectedProduct.quantity;
  // const selectedProduct = products.find((product) => product.id === items[productIndex].itemId);

  const deleteProduct = () => {
    const newItems = items.filter((_, index) => index !== productIndex);
    form.setValue("amapItems", newItems);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <SelectProductName
          selectedProduct={selectedProduct}
          products={products}
          productIndex={productIndex}
          quantity={quantity}
        />
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
  selectedProduct,
}: {
  productIndex: number;
  quantity: number;
  products: Product[];
  selectedProduct?: AMAPFormValues["amapItems"][number];
}) => {
  const form = useFormContext<AMAPFormValues>();

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
    form.setValue(`amapItems.${productIndex}.icon`, product.icon);
    form.setValue(`amapItems.${productIndex}.price`, product.price);
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
            <SelectSheet
              triggerClassName="w-full"
              title="Selectionner le produit"
              trigger={
                <Button
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    "w-full flex gap-2",
                    field.value ? "" : "text-muted-foreground",
                    quantity < 0 ? negativeQuantityStyle : "",
                  )}
                >
                  {selectedProduct ? selectedProduct.name : "Nom du produit"}
                </Button>
              }
              selectedValue={selectedProduct?.itemId}
              values={products.map((product) => ({
                label: (
                  <div className="flex items-center justify-center gap-2">
                    <DisplayProductIcon icon={product.icon} />
                    <span className="font-bold ">{product.name}</span>
                  </div>
                ),
                value: { key: product.id },
                search: sanitizeString(product.name),
              }))}
              onSelected={(value) => {
                if (!value) return;
                onValueChange(value.key);
              }}
            />
            {/* <Popover open={open} onOpenChange={setOpen}>
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
            </Popover> */}
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
