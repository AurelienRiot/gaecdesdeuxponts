"use client";
import { negativeQuantityStyle } from "@/app/(routes)/admin/orders/[orderId]/_components/products";
import type { GetProductsForOrdersType } from "@/app/(routes)/admin/orders/[orderId]/_functions/get-products-for-orders";
import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import CheckboxForm from "@/components/chekbox-form";
import { GrPowerReset, LuPackageMinus } from "@/components/react-icons";
import SelectSheetWithTabs, { sortProductByTabType } from "@/components/select-sheet-with-tabs";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton, LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NumberInput } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUsersQueryClient } from "@/hooks/use-query/users-query";
import useServerAction from "@/hooks/use-server-action";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Role } from "@prisma/client";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import updateDefaultOrdersAction from "../_actions/update-default-orders";
import type { GetDefaultOrdersType } from "../_functions/get-default-orders";
import { defaultOrderSchema, type DefaultOrderFormValues } from "./schema";

function DisplayDefaultOrderForTheDay({
  defaultOrderForDay,
  products,
  day,
  index,
  userId,
  role,
}: {
  defaultOrderForDay: NonNullable<GetDefaultOrdersType>["defaultOrders"][number] | undefined;
  products: GetProductsForOrdersType;
  day: string;
  userId: string;
  role: Role;
  index: number;
}) {
  const { serverAction } = useServerAction(updateDefaultOrdersAction);
  const { refectUsers } = useUsersQueryClient();
  const form = useForm<DefaultOrderFormValues>({
    resolver: zodResolver(defaultOrderSchema),
    defaultValues: {
      day: index,
      confirmed: defaultOrderForDay?.confirmed ?? true,
      userId,
      defaultOrderProducts: defaultOrderForDay?.defaultOrderProducts.map(({ price, productId, quantity }) => ({
        productId,
        price,
        quantity,
      })) || [
        {
          productId: "",
          price: undefined,
          quantity: 1,
        },
      ],
    },
  });

  const items = form.watch("defaultOrderProducts");

  async function onSubmit(data: DefaultOrderFormValues) {
    if (items.length === 0 || !items.every((item) => item.productId)) {
      toast.error("Completer tous les produits deja existant");
      return;
    }
    await serverAction({ data, onSuccess: () => refectUsers() });
  }

  const deleteProduct = (prodIndex: number) => {
    const newItems = items.filter((_, index) => index !== prodIndex);
    form.setValue("defaultOrderProducts", newItems);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[320px] h-full  space-y-2 relative flex-shrink-0">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold capitalize text-center flex justify-between items-center p-2 mx-auto">
            {day}
          </h2>
          {/* <button type="button" className=" p-2 h-fit border bg-green-500 rounded-full cursor-pointer flex gap-2">
            <Plus className="size-4 text-green-100 stroke-[3]" />
            <Package className="size-4 text-green-100 stroke-[3]" />
          </button> */}
        </div>
        <LoadingButton disabled={form.formState.isSubmitting} variant={"green"} className="w-full" type="submit">
          Mettre a jour
        </LoadingButton>

        <ScrollArea className="  overflow-auto " style={{ maxHeight: `calc(100dvh - 325px)` }}>
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
                className="mb-2"
              />
            )}
          />
          <FormField
            control={form.control}
            name="defaultOrderProducts"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <div className="space-y-4">
                    {items.map((item, productIndex) => (
                      <div
                        key={item.productId + index}
                        className="w-full rounded-md p-4 space-y-4 pb-4  bg-chart1/50 even:bg-chart2/50"
                      >
                        <SelectProductName
                          role={role}
                          products={products}
                          productIndex={productIndex}
                          selectedProduct={item}
                        />
                        <div className="flex gap-4">
                          <PriceInput productIndex={productIndex} products={products} selectedProduct={item} />
                          <QuantityInput productIndex={productIndex} selectedProduct={item} />
                          {productIndex > 0 || items.length > 1 ? (
                            <TrashButton
                              type="button"
                              disabled={form.formState.isSubmitting}
                              variant="destructive"
                              size="sm"
                              className="mt-auto"
                              onClick={() => deleteProduct(productIndex)}
                              iconClassName="size-6"
                            />
                          ) : null}
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
                <AddProductButton />
              </FormItem>
            )}
          />
        </ScrollArea>
      </form>
    </Form>
  );
}

function AddProductButton() {
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
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      <Button type="button" variant="outline" className="whitespace-nowrap border-dashed" onClick={addProduct}>
        <PlusCircledIcon className="mr-2 size-4" />
        {"Ajouter un produit"}
      </Button>
    </div>
  );
}

const SelectProductName = ({
  productIndex,
  products,
  selectedProduct,
  role,
}: {
  role: Role;
  productIndex: number;
  products: GetProductsForOrdersType;
  selectedProduct: DefaultOrderFormValues["defaultOrderProducts"][number];
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
  const groupedProducts = useCallback(
    () =>
      sortProductByTabType(
        products.filter(
          (product) => role === "trackOnlyUser" || (role === "pro" ? product.product.isPro : !product.product.isPro),
        ),
      ),
    [products, role],
  );

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
              tabsValues={groupedProducts()}
              tabs={[
                { value: "favories", label: "Favoris" },
                { value: "biocoop", label: "Biocoop" },
                { value: "others", label: "Autres" },
              ]}
              onSelected={(value) => {
                onSelectedProduct(value.key);
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
  products: GetProductsForOrdersType;
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
