"use client";
import type { AllShopsType } from "@/app/(routes)/admin/direction/_functions/get-shops";
import { negativeQuantityStyle } from "@/app/(routes)/admin/orders/[orderId]/_components/products";
import type { ProductsForOrdersType } from "@/app/(routes)/admin/orders/[orderId]/_functions/get-products-for-orders";
import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import CheckboxForm from "@/components/chekbox-form";
import { GrPowerReset, LuPackageMinus } from "@/components/react-icons";
import SelectSheetWithTabs, { getProductTabs } from "@/components/select-sheet-with-tabs";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NumberInput } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import scrollToLastChild from "@/lib/scroll-to-last-child";
import { cn } from "@/lib/utils";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { DefaultOrderFormValues } from "./schema";
import SelectShop from "./select-shop";

function DisplayDefaultOrderForTheDay({
  products,
  shops,
  day,
  favoriteProducts,
}: {
  products: ProductsForOrdersType;
  shops: AllShopsType;
  day: number;
  favoriteProducts: string[];
}) {
  const form = useFormContext<DefaultOrderFormValues>();

  const items = form.watch("defaultOrderProducts");

  const deleteProduct = (prodIndex: number) => {
    const newItems = items.filter((_, index) => index !== prodIndex);
    form.setValue("defaultOrderProducts", newItems);
  };
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold capitalize text-center flex justify-between items-center p-2 mx-auto">
          {DAYS_OF_WEEK[day]}
        </h2>
        {/* <button type="button" className=" p-2 h-fit border bg-green-500 rounded-full cursor-pointer flex gap-2">
            <Plus className="size-4 text-green-100 stroke-[3]" />
            <Package className="size-4 text-green-100 stroke-[3]" />
            </button> */}
      </div>

      <ScrollArea className="overflow-auto " style={{ height: `calc(100dvh - 180px)` }}>
        <div id={`scroll-area-${day}`} className="space-y-4 h-full">
          {items.length > 0 && (
            <>
              <SelectShop shops={shops} />
              <FormField
                control={form.control}
                name="confirmed"
                render={({ field }) => (
                  <CheckboxForm
                    ref={field.ref}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                    title="Commande confirmer"
                    description="Indique si la commande doit être confirmer"
                  />
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="defaultOrderProducts"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <div className="space-y-4">
                    {items.map((item, productIndex) => (
                      <div
                        key={item.productId + day}
                        className="w-full rounded-md p-4 space-y-4   bg-chart1/50 even:bg-chart2/50"
                      >
                        <SelectProductName
                          products={products}
                          productIndex={productIndex}
                          selectedProduct={item}
                          favoriteProducts={favoriteProducts}
                        />
                        <div className="flex gap-4">
                          <PriceInput productIndex={productIndex} products={products} selectedProduct={item} />
                          <QuantityInput productIndex={productIndex} selectedProduct={item} />

                          <TrashButton
                            type="button"
                            disabled={form.formState.isSubmitting}
                            variant="destructive"
                            size="sm"
                            className="mt-auto"
                            onClick={() => deleteProduct(productIndex)}
                            iconClassName="size-6"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </FormControl>
                {form.formState.errors.defaultOrderProducts && (
                  <p className={"text-sm font-medium text-destructive"}>
                    {form.formState.errors.defaultOrderProducts?.message || "Veuillez completer tous les champs"}
                  </p>
                )}
                <AddProductButton index={day} />
              </FormItem>
            )}
          />
        </div>
      </ScrollArea>
    </>
  );
}

function AddProductButton({ index }: { index: number }) {
  const form = useFormContext<DefaultOrderFormValues>();
  const products = form.watch("defaultOrderProducts");
  const addProduct = () => {
    if (!products.every((item) => item.productId)) {
      toast.error("Completer tous les produits deja existant");
      return;
    }
    form.setValue("defaultOrderProducts", [
      ...products,
      {
        productId: "",
        price: 0,
        quantity: 1,
      },
    ]);
    const scrollArea = document.getElementById(`scroll-area-${index}`);
    scrollToLastChild(scrollArea);
  };

  return (
    <Button type="button" variant="outline" className="whitespace-nowrap border-dashed" onClick={addProduct}>
      <PlusCircledIcon className="mr-2 size-4" />
      {"Ajouter un produit"}
    </Button>
  );
}

const SelectProductName = ({
  productIndex,
  products,
  selectedProduct,
  favoriteProducts,
}: {
  productIndex: number;
  products: ProductsForOrdersType;
  selectedProduct: DefaultOrderFormValues["defaultOrderProducts"][number];
  favoriteProducts: string[];
}) => {
  const form = useFormContext<DefaultOrderFormValues>();

  const product = products.find((product) => product.id === selectedProduct.productId);

  function onSelectedProduct(value: string) {
    const selectProduct = products.find((product) => product.id === value);
    if (!selectProduct) {
      toast.error("Produit introuvable");
      return;
    }
    form.setValue(`defaultOrderProducts.${productIndex}.productId`, selectProduct.id);
    form.setValue(`defaultOrderProducts.${productIndex}.price`, selectProduct.price);
  }
  const { tabsValues, tabs } = useMemo(() => getProductTabs(products, favoriteProducts), [products, favoriteProducts]);

  return (
    <FormField
      control={form.control}
      name={`defaultOrderProducts.${productIndex}.productId`}
      render={({ field }) => (
        <FormItem className="relative w-56">
          <FormLabel id={`product-${productIndex}`} className="flex h-8 items-center justify-between gap-2">
            <span className="">{`Nom du produit ${productIndex + 1}`}</span>
          </FormLabel>
          <FormControl>
            <SelectSheetWithTabs
              triggerClassName="w-full"
              title="Selectionner le produit"
              trigger={
                selectedProduct ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={form.formState.isSubmitting}
                    className={cn(
                      "w-full flex gap-2",
                      field.value ? "" : "text-muted-foreground",
                      selectedProduct.quantity < 0 ? negativeQuantityStyle : "",
                    )}
                  >
                    {product?.product.isPro && (
                      <Badge variant="orange" className="mr-2">
                        Pro
                      </Badge>
                    )}
                    {product ? product.name : "Nom du produit"}
                  </Button>
                ) : (
                  "Sélectionner le produit"
                )
              }
              selectedValue={selectedProduct?.productId}
              tabsValues={tabsValues}
              tabs={tabs}
              onSelected={(selected) => {
                if (selected) {
                  onSelectedProduct(selected.key);
                }
              }}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PriceInput = ({
  productIndex,
  products,
  selectedProduct,
}: {
  productIndex: number;
  products: ProductsForOrdersType;
  selectedProduct: DefaultOrderFormValues["defaultOrderProducts"][number];
}) => {
  const form = useFormContext<DefaultOrderFormValues>();
  const defaultProduct = products.find((product) => product.id === selectedProduct.productId);
  return (
    <FormField
      control={form.control}
      name={`defaultOrderProducts.${productIndex}.price`}
      render={({ field }) => (
        <FormItem className="w-20 relative">
          <FormLabel className="flex items-center justify-between gap-2 ">
            <span>Prix</span>

            <IconButton
              Icon={GrPowerReset}
              className="border-dashed p-2 bg-transparent"
              iconClassName="size-3"
              onClick={() => field.onChange(defaultProduct?.price)}
              type="button"
            />
          </FormLabel>
          <span
            className={cn(
              "absolute right-1 top-[50px] transform -translate-y-1/2 text-muted-foreground",
              selectedProduct.quantity < 0 ? negativeQuantityStyle : "",
              form.formState.isSubmitting ? "disabled:opacity-50 bg-transparent" : "",
            )}
          >
            €
          </span>
          <FormControl>
            <NumberInput
              disabled={form.formState.isSubmitting}
              className={selectedProduct.quantity < 0 ? negativeQuantityStyle : ""}
              placeholder="9,99"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const QuantityInput = ({
  productIndex,
  selectedProduct,
}: {
  productIndex: number;
  selectedProduct: DefaultOrderFormValues["defaultOrderProducts"][number];
}) => {
  const form = useFormContext<DefaultOrderFormValues>();
  const items = form.watch("defaultOrderProducts");
  function addNegativeProduct() {
    if (selectedProduct) {
      const newItem = {
        ...selectedProduct,
        quantity: -1,
      };
      console.log(newItem);
      const newItems = [...items.slice(0, productIndex + 1), newItem, ...items.slice(productIndex + 1)];
      form.setValue("defaultOrderProducts", newItems);
    }
  }

  return (
    <FormField
      control={form.control}
      name={`defaultOrderProducts.${productIndex}.quantity`}
      render={({ field }) => (
        <FormItem className="w-24">
          <FormLabel className="flex items-center justify-between gap-2 ">
            <span>Quantité</span>

            <IconButton
              Icon={LuPackageMinus}
              className="border-dashed p-2 text-destructive bg-destructive-foreground"
              iconClassName="size-3"
              onClick={() => addNegativeProduct()}
              type="button"
            />
          </FormLabel>
          {/* <FormLabel className="flex h-8 items-center justify-between gap-2">
        <span className="">Quantité</span>
      </FormLabel> */}

          <FormControl>
            <NumberInput
              disabled={form.formState.isSubmitting}
              className={cn(selectedProduct.quantity < 0 ? negativeQuantityStyle : "", "text-right ")}
              placeholder="9,99"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DisplayDefaultOrderForTheDay;
