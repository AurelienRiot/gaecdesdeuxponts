"use client";
import DeleteButton from "@/components/delete-button";
import { DisplayCreateInvoice } from "@/components/pdf/button/display-create-invoice";
import { DisplayInvoice } from "@/components/pdf/button/display-invoice";
import { DisplayShippingOrder } from "@/components/pdf/button/display-shipping-order";
import { Button } from "@/components/ui/button";
import { Form, FormButton, FormField } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import useServerAction from "@/hooks/use-server-action";
import { createId } from "@/lib/id";
import { scrollToId } from "@/lib/scroll-to-id";
import { cn } from "@/lib/utils";
import type { ProductWithMain } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductStock, Shop } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOrdersQueryClient } from "../../../../../../hooks/use-query/orders-query";
import validateInvoice from "../../../invoices/_actions/validate-invoice";
import { deleteOrder } from "../../_actions/delete-orders";
import confirmOrder from "../_actions/confirm-order";
import { createOrder } from "../_actions/create-order";
import updateOrder from "../_actions/update-order";
import FormDatePicker from "./date-picker";
import NewOrderButton from "./new-order-button";
import { orderSchema, type OrderFormValues } from "./order-schema";
import { ShippingProducts } from "./products";
import SelectShop from "./select-shop";
import SelectUser from "./select-user";
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
  users: UserForOrderType[];
  className?: string;
};

export const OrderForm: React.FC<OrderFormProps> = ({ initialData, products, users, shops, className }) => {
  const router = useRouter();
  const { mutateOrders } = useOrdersQueryClient();
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
        icon: product.icon,
        categoryName: product.categoryName,
        description: product.description,
      })) || [
        {
          id: createId("orderItem"),
          itemId: "",
          unit: "",
          price: undefined,
          icon: null,
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
  const defaultDaysOrders = user?.defaultDaysOrders;

  const onConfirm = async () => {
    if (!initialData?.id) {
      toast.error("Une erreur est survenue");
      return;
    }

    function onSuccess() {
      mutateOrders((prev) =>
        prev.map((order) =>
          order.id === initialData?.id
            ? { ...order, status: !initialData.shippingEmail ? "Commande livrée" : "Commande validée" }
            : order,
        ),
      );
      router.replace(`/admin/orders/${initialData?.id}#button-container`);
    }

    await confirmOrderAction({
      data: { id: initialData.id, confirm: !initialData.shippingEmail },
      onSuccess,
      toastOptions: { position: "top-center" },
    });
  };

  function onPaid() {
    if (!initialData?.invoiceId) {
      toast.error("Une erreur est survenue");
      return;
    }
    validateInvoiceAction({
      data: { id: initialData?.invoiceId, isPaid: !initialData.dateOfPayment },
      onSuccess: () => {
        mutateOrders((prev) =>
          prev.map((order) =>
            order.id === initialData?.id
              ? { ...order, status: initialData.dateOfPayment ? "En attente de paiement" : "Payé" }
              : order,
          ),
        );
        router.replace(`/admin/orders/${initialData?.id}#button-container`);
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

    if (initialData?.id) {
      await updateOrderAction({
        data: { ...data, prevDateOfShipping },
        onSuccess: (result) => {
          if (!result) {
            toast.error("Une erreur est survenue");
            return;
          }
          result.shippingDate = new Date(result.shippingDate);
          result.createdAt = new Date(result.createdAt);
          mutateOrders((prev) => prev.filter((order) => order.id !== result.id).concat(result));
          scrollToId("button-container");
        },
        toastOptions: { position: "top-center" },
      });
    } else {
      createOrderAction({
        data,
        toastOptions: { position: "top-center" },
        onSuccess: (result) => {
          if (!result) {
            toast.error("Une erreur est survenue");
            return;
          }
          result.shippingDate = new Date(result.shippingDate);
          result.createdAt = new Date(result.createdAt);
          mutateOrders((prev) => prev.concat(result));
        },
        onError: () => {
          router.forward();
        },
      });
      router.back();
    }
  };

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
            onBeforeDelete={() => {
              router.back();
            }}
            isSubmitting={form.formState.isSubmitting}
            onSuccess={() => {
              mutateOrders((prev) => prev.filter((order) => order.id !== initialData.id));
            }}
            onError={() => {
              router.forward();
            }}
          />
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="flex flex-wrap items-end gap-8">
            <SelectUser users={users} />
            {/* {!!initialData && (
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
            )} */}

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
                className={cn("w-fit block", user?.role === "pro" && "hidden sm:inline-flex")}
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

      {!!initialData?.id && !!user?.id && (
        <NewOrderButton
          orderId={initialData.id}
          userId={user.id}
          dateOfPickUp={initialData.datePickUp}
          defaultDaysOrders={defaultDaysOrders}
        />
      )}
    </>
  );
};

const newOrder = {
  id: "CM_28-10-24_OX9TN",
  name: "L'Eolienne",
  index: 6,
  user: {
    name: "L'Eolienne",
    email: "union-jadis-0f@icloud.com",
    company: "L'Eolienne",
    completed: false,
    image: "https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/farm/lylttbk2fpktpn0etsuv",
    phone: "",
    address: "Rue du Lotier des Marais, 35600, Sainte-Marie",
    notes:
      "Lundi 08:00 - 14:00\nMardi 08:00 - 14:00\nMercredi 08:00 - 14:00\nJeudi 08:00 - 14:00\nVendredi 08:00 - 14:00\nSamedi Fermé\nDimanche Fermé",
    links: [],
    id: "CS_6CGWVR8",
  },
  shippingDate: new Date("2024-10-28T09:00:00.000Z"),
  productsList: [
    {
      itemId: "PR_JYRIWOS",
      name: "Lait cru bouteille verre 1L",
      price: 1,
      quantity: 15,
      unit: "",
    },
  ],
  address: {
    label: "5 Rue du Lotier des Marais 35600 Sainte-Marie",
    longitude: -2.053687,
    latitude: 47.684641,
  },
  status: "Commande validée",
  totalPrice: "10€",
  createdAt: new Date("2024-10-21T08:30:47.438Z"),
  shopName: "L’éolienne",
  shopId: "SH_OAHK2LM",
};
