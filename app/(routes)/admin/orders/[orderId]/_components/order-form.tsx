"use client";
import DateModal from "@/components/date-modal";
import DeleteButton from "@/components/delete-button";
import { DisplayInvoice } from "@/components/pdf/button/display-invoice";
import { DisplayShippingOrder } from "@/components/pdf/button/display-shipping-order";
import { getUserName } from "@/components/table-custom-fuction";
import { Button, LoadingButton } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { Form, FormField } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useServerAction from "@/hooks/use-server-action";
import { dateFormatter } from "@/lib/date-utils";
import { createId } from "@/lib/id";
import { currencyFormatter } from "@/lib/utils";
import type { ProductWithMain, UserWithAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Shop } from "@prisma/client";
import { CalendarIcon, Plus, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

export type ProductFormProps = {
  initialData:
    | (Omit<OrderFormValues, "id"> & { id: string | null; invoiceEmail: Date | null; shippingEmail: Date | null })
    | null;
  products: ProductWithMain[];
  shops: Shop[];
  users: UserWithAddress[];
  referer: string;
};

export const OrderForm: React.FC<ProductFormProps> = ({ initialData, products, users, shops, referer }) => {
  const router = useRouter();
  const prevDateOfShipping = initialData?.dateOfShipping ? new Date(initialData.dateOfShipping) : undefined;
  const confirm = useConfirm();
  const { serverAction: createOrderAction } = useServerAction(createOrder);
  const { serverAction: updateOrderAction } = useServerAction(updateOrder);
  const { serverAction: confirmOrderAction, loading } = useServerAction(confirmOrder);

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
      id: initialData?.id || createId("order"),
      totalPrice: initialData?.totalPrice,
      dateOfPayment: initialData?.dateOfPayment ? new Date(initialData.dateOfPayment) : undefined,
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
        : new Date(new Date().setHours(10, 0, 0, 0)),
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

  const userId = form.watch("userId");

  const user = userId ? users.find((user) => user.id === userId) : null;

  const onConfirm = async () => {
    function onSuccess() {
      router.replace(`/admin/orders/${initialData?.id}?referer=${encodeURIComponent(referer)}#button-container`);
    }
    if (!initialData?.id) {
      toast.error("Une erreur est survenue");
      return;
    }
    await confirmOrderAction({
      data: { id: initialData.id, confirm: !initialData.shippingEmail },
      onSuccess,
      toastOptions: { position: "top-center" },
    });
  };

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

    const result = await confirm({
      title: "Confirmation de la commande",
      content: ModalDescription({
        date: data.dateOfShipping,
        items: data.orderItems,
        name: user ? getUserName(user) : "",
        image: user?.image,
      }),
    });
    console.log(initialData?.id, prevDateOfShipping);
    if (result) {
      initialData?.id
        ? await updateOrderAction({
            data: { ...data, prevDateOfShipping },
            toastOptions: { position: "top-center" },
          })
        : await createOrderAction({ data, toastOptions: { position: "top-center" } });

      router.replace(`/admin/orders/${data.id}?referer=${encodeURIComponent(referer)}#button-container`);
    }
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
    toast.success("Création d'une nouvelle commande", { position: "bottom-center" });
    router.replace(`/admin/orders/new?${urlParams.toString()}`);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading className={title.color} title={title.label} description={""} />
        {initialData?.id && (
          <DeleteButton
            action={deleteOrder}
            data={{
              id: initialData.id,
              dateOfShipping: initialData.dateOfShipping ? new Date(initialData.dateOfShipping) : undefined,
            }}
            isSubmitting={form.formState.isSubmitting}
            onSuccess={() => {
              console.log(referer);
              router.replace(referer);
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
                <FormDatePicker {...field} date={field.value} onSelectDate={field.onChange} title="Date de livraison" />
              )}
            />
            {user?.role !== "pro" && (
              <FormField
                control={form.control}
                name="dateOfPayment"
                render={({ field }) => (
                  <FormDatePicker
                    {...field}
                    date={field.value}
                    onSelectDate={field.onChange}
                    title="Date de paiement"
                  />
                )}
              />
            )}

            <SelectShop shops={shops} />
          </div>
          <ShippingProducts products={products} user={user} />

          <TotalPrice />

          <LoadingButton
            disabled={form.formState.isSubmitting}
            className="ml-auto bg-green-600 hover:bg-green-800"
            type="submit"
          >
            {action}
          </LoadingButton>
        </form>
      </Form>
      {!!initialData?.id && !!initialData.dateOfEdition && (
        <div id="button-container" className="space-y-4">
          {user?.role === "pro" && (
            <div className="space-y-2">
              <Label>Bon de livraison</Label>
              <DisplayShippingOrder orderId={form.getValues("id")} isSend={!!initialData.shippingEmail} />
            </div>
          )}
          {user?.role === "user" && (
            <div className="space-y-2">
              <Label>Facture</Label>
              <DisplayInvoice orderId={form.getValues("id")} isSend={!!initialData.invoiceEmail} />
            </div>
          )}
          {user?.role === "trackOnlyUser" && (
            <Button
              onClick={onConfirm}
              disabled={form.formState.isSubmitting || loading}
              variant={initialData.shippingEmail ? "destructive" : "default"}
              className="w-fit"
            >
              {initialData.shippingEmail ? "Annuler la livraison" : "Confirmer la livraison"}
            </Button>
          )}
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

const ModalDescription = ({
  name,
  date,
  items,
  image,
}: { name?: string | null; image?: string | null; date?: Date | null; items: OrderFormValues["orderItems"] }) => {
  if (!name) {
    return "Aucun utilisateur selectioné";
  }
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 gap-y-4  text-muted-foreground">
        <div className="flex gap-2 items-center ">
          {image ? (
            <Image src={image} width={20} height={20} alt={name} className="object-contain rounded-sm " />
          ) : (
            <UserIcon className="w-5 h-5" />
          )}
          <span className="font-semibold">{name}</span>
        </div>
        <div className="flex items-center gap-2 text-md">
          <CalendarIcon className="w-4 h-4" />
          {date ? (
            <span className="font-bold">{dateFormatter(date, { days: true })}</span>
          ) : (
            <span className="font-bold text-destructive">Aucune date de livraison</span>
          )}
        </div>
      </div>
      <div className="space-y-4 py-4">
        <div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Produit</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow
                    key={item.itemId + index}
                    className={item.quantity < 0 ? "text-destructive-foreground bg-destructive rounded-sm" : ""}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right text-lg">{item.quantity}</TableCell>
                    <TableCell className="text-right">{currencyFormatter.format(item.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
