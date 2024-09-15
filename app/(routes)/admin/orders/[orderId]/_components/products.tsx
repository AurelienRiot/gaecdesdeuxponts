"use client";
import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import SelectSheet from "@/components/select-sheet";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NumberInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProductWithMain, UserWithAddress } from "@/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useFormContext } from "react-hook-form";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "sonner";
import type { OrderFormValues } from "./order-schema";

const negativeQuantityStyle =
  "bg-destructive hover:bg-destructive/90 hover:text-destructive-foreground text-destructive-foreground";

export const ShippingProducts = ({
  products,
  user,
}: {
  products: ProductWithMain[];
  user?: UserWithAddress | null;
}) => {
  const form = useFormContext<OrderFormValues>();
  const items = form.watch("orderItems");

  const addProduct = () => {
    if (items.every((item) => item.itemId)) {
      const newItems = {
        itemId: "",
        unit: "",
        price: 0,
        quantity: 1,
        name: "",
        categoryName: "",
        description: "",
      };
      form.setValue("orderItems", [...items, newItems]);
    } else {
      toast.error("Completer tous les produits déjà existant");
    }
  };

  return (
    <FormField
      control={form.control}
      name="orderItems"
      render={({ field }) => (
        <FormItem className="">
          <FormLabel>Produits</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {items.map((item, productIndex) => (
                <div
                  key={`${item.itemId} ${productIndex}`}
                  className="w-fit rounded-md p-4 pb-4 thin-scrollbar bg-chart1/50 even:bg-chart2/50"
                >
                  <ProductName user={user} products={products} productIndex={productIndex} />
                </div>
              ))}
            </div>
          </FormControl>
          {form.formState.errors.orderItems && (
            <p className={"text-sm font-medium text-destructive"}>
              {form.formState.errors.orderItems?.message || "Veuillez completer tous les champs"}
            </p>
          )}
          <div className="flex flex-wrap items-end gap-4">
            <Button type="button" variant="outline" className="whitespace-nowrap border-dashed" onClick={addProduct}>
              <PlusCircledIcon className="mr-2 size-4" />
              {"Ajouter un produit"}
            </Button>
          </div>
        </FormItem>
      )}
    />
  );
};

function ProductName({
  productIndex,
  products,
  user,
}: {
  user?: UserWithAddress | null;
  productIndex: number;
  products: ProductWithMain[];
}) {
  const form = useFormContext<OrderFormValues>();
  const items = form.watch("orderItems");
  const quantity = items[productIndex].quantity;
  const selectedProduct = products.find((product) => product.id === items[productIndex].itemId);

  const deleteProduct = () => {
    const newItems = items.filter((_, index) => index !== productIndex);
    form.setValue("orderItems", newItems);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <SelectProductName
          user={user}
          selectedProduct={selectedProduct}
          products={products}
          productIndex={productIndex}
          quantity={quantity}
        />
        <FormField
          control={form.control}
          name={`orderItems.${productIndex}.price`}
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
                  form.formState.isSubmitting ? "disabled:opacity-50 bg-transparent" : "",
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
          name={`orderItems.${productIndex}.quantity`}
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
  selectedProduct,
  quantity,
  user,
}: {
  user?: UserWithAddress | null;
  productIndex: number;
  quantity: number;
  products: ProductWithMain[];
  selectedProduct?: ProductWithMain;
}) => {
  const form = useFormContext<OrderFormValues>();

  function onValueChange(value: string) {
    const product = products.find((product) => product.id === value);
    if (!product) {
      toast.error("Produit introuvable");
      return;
    }

    form.setValue(`orderItems.${productIndex}.name`, product.name);
    form.setValue(`orderItems.${productIndex}.categoryName`, product.product.categoryName);
    form.setValue(`orderItems.${productIndex}.itemId`, product.id);
    form.setValue(`orderItems.${productIndex}.unit`, product.unit);
    form.setValue(`orderItems.${productIndex}.description`, product.description);
    form.setValue(`orderItems.${productIndex}.price`, product.price);
  }
  return (
    <FormField
      control={form.control}
      name={`orderItems.${productIndex}.name`}
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
                selectedProduct ? (
                  <Button
                    variant="outline"
                    disabled={form.formState.isSubmitting}
                    className={cn(
                      "w-full flex gap-2",
                      field.value ? "" : "text-muted-foreground",
                      quantity < 0 ? negativeQuantityStyle : "",
                    )}
                  >
                    {selectedProduct?.product.isPro && (
                      <Badge variant="orange" className="mr-2">
                        Pro
                      </Badge>
                    )}
                    {field.value ? field.value : "Nom du produit"}
                  </Button>
                ) : (
                  "Sélectionner le produit"
                )
              }
              selectedValue={selectedProduct?.id}
              values={products
                .filter(
                  (product) =>
                    !user ||
                    user.role === "trackOnlyUser" ||
                    product.isArchived ||
                    product.product.isArchived ||
                    (user.role === "pro" ? product.product.isPro : !product.product.isPro),
                )
                .map((product) => ({
                  label: (
                    <>
                      {" "}
                      {product.product.isPro && (
                        <Badge variant="orange" className="mr-2">
                          Pro
                        </Badge>
                      )}
                      {product.name}
                    </>
                  ),
                  value: { key: product.id },
                }))}
              onSelected={(value) => {
                onValueChange(value.key);
              }}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
