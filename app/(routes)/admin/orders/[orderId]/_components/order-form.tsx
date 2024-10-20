"use client";
import DateModal from "@/components/date-modal";
import DeleteButton from "@/components/delete-button";
import { DisplayCreateInvoice } from "@/components/pdf/button/display-create-invoice";
import { DisplayInvoice } from "@/components/pdf/button/display-invoice";
import { DisplayShippingOrder } from "@/components/pdf/button/display-shipping-order";
import { Button } from "@/components/ui/button";
import { Form, FormButton, FormField } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useServerAction from "@/hooks/use-server-action";
import { createId } from "@/lib/id";
import type { ProductWithMain, UserWithAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductStock, Shop } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import validateInvoice from "../../../invoices/_actions/validate-invoice";
import { deleteOrder } from "../../_actions/delete-orders";
import confirmOrder from "../_actions/confirm-order";
import createOrder from "../_actions/create-order";
import updateOrder from "../_actions/update-order";
import FormDatePicker from "./date-picker";
import { orderSchema, type OrderFormValues } from "./order-schema";
import { ShippingProducts } from "./products";
import SelectShop from "./select-shop";
import SelectUser from "./select-user";
import TimePicker from "./time-picker";
import TotalPrice from "./total-price";

export type OrderFormProps = {
  initialData:
    | (Omit<OrderFormValues, "id"> & {
        id: string | null;
        invoiceId?: string | null;
        invoiceEmail?: Date | null;
        shippingEmail: Date | null;
        dateOfPayment?: Date | null;
      })
    | null;
  products: (ProductWithMain & { stocks: ProductStock[] })[];
  shops: Shop[];
  users: UserWithAddress[];
  referer: string;
  className?: string;
};

export const OrderForm: React.FC<OrderFormProps> = ({ initialData, products, users, shops, referer, className }) => {
  const router = useRouter();
  // const queryClient = useQueryClient();
  const prevDateOfShipping = initialData?.dateOfShipping ? new Date(initialData.dateOfShipping) : undefined;
  const { serverAction: createOrderAction } = useServerAction(createOrder);
  const { serverAction: updateOrderAction } = useServerAction(updateOrder);
  const { serverAction: confirmOrderAction, loading } = useServerAction(confirmOrder);
  const { serverAction: validateInvoiceAction, loading: validateLoading } = useServerAction(validateInvoice);

  const title = initialData?.id
    ? { label: "Modifier la commande", color: "text-blue-500" }
    : initialData
      ? { label: "Nouvelle commande", color: "text-green-500" }
      : { label: "Crée une commande", color: "text-purple-500" };
  const action = initialData?.id
    ? initialData.dateOfEdition
      ? "Sauvegarder les changements"
      : "Valider la commande"
    : "Crée la commande";

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      id: initialData?.id || createId("order", initialData?.dateOfShipping),
      totalPrice: initialData?.totalPrice,
      dateOfShipping: initialData?.dateOfShipping
        ? new Date(initialData.dateOfShipping)
        : initialData?.datePickUp
          ? new Date(initialData.datePickUp)
          : new Date(new Date().setHours(10, 0, 0, 0)),
      dateOfEdition: new Date(),
      userId: initialData?.userId || "",
      shopId: initialData?.shopId || "",
      datePickUp: initialData?.datePickUp
        ? new Date(initialData.datePickUp)
        : initialData?.dateOfShipping
          ? new Date(initialData.dateOfShipping)
          : new Date(new Date().setHours(10, 0, 0, 0)),
      orderItems: initialData?.orderItems.map((product) => ({
        id: product.id,
        itemId: product.itemId,
        unit: product.unit,
        stocks: product.stocks,
        price: product.price,
        tax: product.tax,
        quantity: product.quantity,
        name: product.name,
        categoryName: product.categoryName,
        description: product.description,
      })) || [
        {
          id: createId("orderItem"),
          itemId: "",
          unit: "",
          price: undefined,
          tax: 1.055,
          quantity: 1,
          name: "",
          categoryName: "",
          description: "",
        },
      ],
    },
  });

  const userId = form.watch("userId");

  const user = userId ? users.find((user) => user.id === userId) : null;

  const onConfirm = async () => {
    if (!initialData?.id) {
      toast.error("Une erreur est survenue");
      return;
    }

    function onSuccess() {
      router.replace(`/admin/orders/${initialData?.id}?referer=${encodeURIComponent(referer)}#button-container`);
      // shippingDate && queryClient.invalidateQueries({ queryKey: [{ date: getLocalIsoString(shippingDate) }] });
      // prevDateOfShipping &&
      //   queryClient.invalidateQueries({ queryKey: [{ date: getLocalIsoString(prevDateOfShipping) }] });
    }

    await confirmOrderAction({
      data: { id: initialData.id, confirm: !initialData.shippingEmail },
      onSuccess,
      toastOptions: { position: "top-center" },
    });
    if (!initialData?.id) {
      toast.error("Une erreur est survenue");
      return;
    }
  };

  function onPaid() {
    if (!initialData?.invoiceId) {
      toast.error("Une erreur est survenue");
      return;
    }
    validateInvoiceAction({
      data: { id: initialData?.invoiceId, isPaid: !initialData.dateOfPayment },
      onSuccess: () => {
        // shippingDate && queryClient.invalidateQueries({ queryKey: [{ date: getLocalIsoString(shippingDate) }] });
        // prevDateOfShipping &&
        //   queryClient.invalidateQueries({ queryKey: [{ date: getLocalIsoString(prevDateOfShipping) }] });
        router.refresh();
      },
    });
  }

  const onSubmit = async (data: OrderFormValues) => {
    const nameCounts: Record<string, number> = {};
    const duplicates = new Set<string>();

    for (const product of data.orderItems) {
      if (product.quantity > 0) {
        const name = product.name;
        if (nameCounts[name]) {
          nameCounts[name]++;
          duplicates.add(name);
        } else {
          nameCounts[name] = 1;
        }
      }
    }
    if (duplicates.size > 0) {
      toast.error(
        `Veuillez supprimer le${duplicates.size > 1 ? "s" : ""} produit${
          duplicates.size > 1 ? "s" : ""
        } en double : ${Array.from(duplicates).join(", ")}`,
        { position: "top-center" },
      );
      return;
    }

    initialData?.id
      ? await updateOrderAction({
          data: { ...data, prevDateOfShipping },
          onSuccess: () =>
            router.replace(`/admin/orders/${data.id}?referer=${encodeURIComponent(referer)}#button-container`),
          toastOptions: { position: "top-center" },
        })
      : await createOrderAction({ data, toastOptions: { position: "top-center" }, onSuccess: () => router.back() });
    // shippingDate &&
    //   queryClient.invalidateQueries({ queryKey: ["fetchDailyOrders", { date: getLocalIsoString(shippingDate) }] });
    // prevDateOfShipping &&
    //   queryClient.invalidateQueries({
    //     queryKey: ["fetchDailyOrders", { date: getLocalIsoString(prevDateOfShipping) }],
    //   });
  };

  function onNewOrder(date?: Date) {
    if (!date) {
      toast.error("Veuillez choisir une date");
      return;
    }
    const dateOfPickUp = form.getValues("datePickUp");
    const hours = dateOfPickUp.getHours();
    const minutes = dateOfPickUp.getMinutes();
    const seconds = dateOfPickUp.getSeconds();
    const milliseconds = dateOfPickUp.getMilliseconds();
    const urlParams = new URLSearchParams();
    urlParams.set("dateOfShipping", new Date(date.setHours(hours, minutes, seconds, milliseconds)).toISOString());
    urlParams.set("referer", referer);
    urlParams.set("id", form.getValues("id"));
    toast.success("Création d'une nouvelle commande", { position: "top-center" });
    router.replace(`/admin/orders/new?${urlParams.toString()}`);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading className={title.color} title={title.label} description={""} />
        {initialData?.id && !initialData?.invoiceId && (
          <DeleteButton
            action={deleteOrder}
            data={{
              id: initialData.id,
              dateOfShipping: initialData.dateOfShipping ? new Date(initialData.dateOfShipping) : undefined,
            }}
            isSubmitting={form.formState.isSubmitting}
            onSuccess={() => {
              router.back();
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
                    {/* <FormDatePicker
                      {...field}
                      date={field.value}
                      onSelectDate={field.onChange}
                      title="Date de retrait"
                      button={"none"}
                    /> */}
                    {field.value && <TimePicker date={field.value} setDate={field.onChange} />}
                  </>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="dateOfShipping"
              render={({ field }) => (
                <FormDatePicker
                  {...field}
                  date={field.value}
                  onSelectDate={field.onChange}
                  button="confirm"
                  title="Date de livraison"
                />
              )}
            />

            <SelectShop shops={shops} />
          </div>
          <ShippingProducts products={products} user={user} />

          <TotalPrice />

          {!initialData?.invoiceId ? (
            <FormButton
              disabled={loading || validateLoading}
              className="ml-auto bg-green-600 hover:bg-green-800"
              type="submit"
            >
              {action}
            </FormButton>
          ) : (
            <p className="text-destructive font-bold">
              Impossible de modifier le commande aprés avoir éditée la facture
            </p>
          )}
        </form>
      </Form>
      {!!initialData?.id && !!initialData.dateOfEdition && (
        <div id="button-container" className="space-y-4">
          {user?.role === "pro" && (
            <div className="space-y-2">
              <Label>Bon de livraison</Label>
              <DisplayShippingOrder
                disabled={form.formState.isSubmitting || loading || validateLoading}
                orderId={initialData.id}
                isSend={!!initialData.shippingEmail}
              />
            </div>
          )}
          <div className="space-y-4">
            {(user?.role === "trackOnlyUser" || !initialData.shippingEmail) && (
              <Button
                onClick={onConfirm}
                disabled={form.formState.isSubmitting || loading || validateLoading}
                variant={initialData.shippingEmail ? "destructive" : "default"}
                className="w-fit block"
              >
                {initialData.shippingEmail ? "Annuler la livraison" : "Confirmer la livraison"}
              </Button>
            )}
            {user?.role === "user" && initialData.shippingEmail && (
              <>
                <Label>Facture</Label>

                {initialData.invoiceId ? (
                  <>
                    <DisplayInvoice
                      disabled={form.formState.isSubmitting || loading || validateLoading}
                      onSendClassName="inline-flex"
                      onViewClassName="hidden"
                      invoiceId={initialData.invoiceId}
                      isSend={!!initialData.invoiceEmail}
                    />
                    <Button
                      onClick={onPaid}
                      disabled={form.formState.isSubmitting || loading || validateLoading}
                      variant={initialData.dateOfPayment ? "destructive" : "default"}
                      className="w-fit"
                    >
                      {initialData.dateOfPayment ? "Annuler le paiement" : "Valider le paiement"}
                    </Button>
                  </>
                ) : (
                  <DisplayCreateInvoice
                    disabled={form.formState.isSubmitting || loading || validateLoading}
                    orderIds={[initialData.id]}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {!!initialData?.id && (
        <DateModal
          onValueChange={onNewOrder}
          triggerClassName=" w-44 border-dashed border-2 text-primary"
          trigger={
            <>
              {" "}
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle commande
            </>
          }
        />
      )}
    </>
  );
};
