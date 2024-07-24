"use client";
import DeleteButton from "@/components/delete-button";
import { DisplayInvoice, DisplayShippingOrder } from "@/components/pdf/pdf-button";
import { LoadingButton } from "@/components/ui/button";
import ButtonBackward from "@/components/ui/button-backward";
import { Form, FormField } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useServerAction from "@/hooks/use-server-action";
import { createId } from "@/lib/id";
import type { ProductWithMain, UserWithAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Shop } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { deleteOrder } from "../../_actions/delete-orders";
import createOrder from "../_actions/create-order";
import updateOrder from "../_actions/update-order";
import FormDatePicker from "./date-picker";
import { orderSchema, type OrderFormValues } from "./order-shema";
import { ShippingProducts } from "./products";
import SelectShop from "./select-shop";
import SelectUser from "./select-user";
import TimePicker from "./time-picker";
import TotalPrice from "./total-price";

type ProductFormProps = {
  initialData: (OrderFormValues & { invoiceEmail: Date | null; shippingEmail: Date | null }) | null;
  products: ProductWithMain[];
  shops: Shop[];
  users: UserWithAddress[];
  referer: string;
};

export const OrderForm: React.FC<ProductFormProps> = ({ initialData, products, users, shops, referer }) => {
  const router = useRouter();

  const { serverAction: createOrderAction } = useServerAction(createOrder);
  const { serverAction: updateOrderAction } = useServerAction(updateOrder);

  const title = initialData ? "Modifier le bon de livraison" : "Crée un bon de livraison";
  const action = initialData
    ? initialData.dateOfEdition
      ? "Sauvegarder les changements"
      : "Valider la commande"
    : "Crée le bon de livraison";

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      id: initialData?.id || createId("order"),
      totalPrice: initialData?.totalPrice,
      dateOfPayment: initialData?.dateOfPayment,
      dateOfShipping:
        initialData?.dateOfShipping || initialData?.datePickUp || new Date(new Date().setHours(10, 0, 0, 0)),
      dateOfEdition: new Date(),
      userId: initialData?.userId || "",
      shopId: initialData?.shopId || "",
      datePickUp: initialData?.datePickUp || new Date(new Date().setHours(10, 0, 0, 0)),
      orderItems: initialData?.orderItems.map((product) => ({
        itemId: product.itemId,
        unit: product.unit,
        price: product.price,
        quantity: product.quantity,
        name: product.name,
        categoryName: product.categoryName,
        description: product.description,
      })) || [
        {
          itemId: "",
          unit: "",
          price: undefined,
          quantity: 1,
          name: "",
          categoryName: "",
          description: "",
        },
      ],
    },
  });

  const onSubmit = async (data: OrderFormValues) => {
    function onSuccessUpdate() {
      if (!initialData?.dateOfEdition) {
        router.refresh();
      }
    }
    function onSuccessCreate(result?: { id: string }) {
      if (result) {
        router.replace(`/admin/orders/${result.id}#button-container`);
        router.refresh();
      }
    }
    initialData
      ? await updateOrderAction({ data, onSuccess: onSuccessUpdate })
      : await createOrderAction({ data, onSuccess: onSuccessCreate });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={""} />
        {initialData && (
          <DeleteButton
            action={deleteOrder}
            data={{ id: initialData.id }}
            isSubmitting={form.formState.isSubmitting}
            onSuccess={() => {
              router.push(referer);
              router.refresh();
            }}
          />
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="flex flex-wrap items-end gap-8">
            <SelectUser users={users} />
            {!!initialData && (
              <FormField
                control={form.control}
                name="datePickUp"
                render={({ field }) => (
                  <>
                    <FormDatePicker
                      {...field}
                      date={field.value}
                      onSelectDate={field.onChange}
                      title="Date de retrait"
                      button={"none"}
                    />
                    {field.value && <TimePicker date={field.value} setDate={field.onChange} />}
                  </>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="dateOfShipping"
              render={({ field }) => (
                <FormDatePicker {...field} date={field.value} onSelectDate={field.onChange} title="Date de livraison" />
              )}
            />
            <FormField
              control={form.control}
              name="dateOfPayment"
              render={({ field }) => (
                <FormDatePicker {...field} date={field.value} onSelectDate={field.onChange} title="Date de paiement" />
              )}
            />
            {/* <FormField
              control={form.control}
              name="dateOfEdition"
              render={({ field }) => (
                <div className="flex gap-2">
                  <FormDatePicker
                    {...field}
                    date={field.value}
                    onSelectDate={field.onChange}
                    title="Date d'édition"
                    button="uptade"
                    disabled
                  />
                </div>
              )}
            /> */}
            <SelectShop shops={shops} />
          </div>
          <ShippingProducts products={products} />

          <TotalPrice />

          <LoadingButton disabled={form.formState.isSubmitting} className="ml-auto" type="submit">
            {action}
          </LoadingButton>
        </form>
      </Form>
      {!!initialData && !!initialData.dateOfEdition && (
        <div id="button-container" className="flex flex-wrap gap-4">
          <div>
            <Label>Bon de livraison</Label>
            <DisplayShippingOrder orderId={form.getValues("id")} isSend={!!initialData.shippingEmail} />
          </div>
          <div>
            <Label>Facture</Label>
            <DisplayInvoice orderId={form.getValues("id")} isSend={!!initialData.invoiceEmail} />
          </div>
        </div>
      )}
      <ButtonBackward
        onClick={() => {
          router.back();
          router.refresh();
        }}
      />
    </>
  );
};
