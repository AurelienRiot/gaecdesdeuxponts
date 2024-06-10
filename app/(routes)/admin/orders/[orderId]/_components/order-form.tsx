"use client";
import {
  DisplayInvoice,
  DisplayShippingOrder,
} from "@/components/pdf/pdf-button";
import { generateOrderId } from "@/components/pdf/pdf-data";
import { deleteOrders } from "@/components/table-custom-fuction/orders-server-actions";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Button, LoadingButton } from "@/components/ui/button";
import ButtonBackward from "@/components/ui/button-backward";
import { Form, FormField } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ProductWithMain,
  ReturnTypeServerAction,
  UserWithAddress,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shop } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import createOrder from "../_actions/create-order";
import updateOrder from "../_actions/update-order";
import FormDatePicker from "./date-picker";
import { OrderFormValues, orderSchema } from "./order-shema";
import { ShippingProducts } from "./products";
import SelectShop from "./select-shop";
import SelectUser from "./select-user";
import TotalPrice from "./total-price";
import { divIcon } from "leaflet";
import TimePicker from "./time-picker";

type ProductFormProps = {
  initialData: OrderFormValues | null;
  products: ProductWithMain[];
  shops: Shop[];
  users: UserWithAddress[];
  referer: string;
};

export const OrderForm: React.FC<ProductFormProps> = ({
  initialData,
  products,
  users,
  shops,
  referer,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const title = initialData
    ? "Modifier le bon de livraison"
    : "Crée un bon de livraison";
  const description = initialData ? "" : "";
  const toastMessage = initialData
    ? "Bon de livraison mise à jour"
    : "Bon de livraison crée";
  const action = initialData
    ? "Sauvegarder les changements"
    : "Crée le bon de livraison";

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      id: initialData?.id || generateOrderId(),
      totalPrice: initialData?.totalPrice,
      dateOfPayment: initialData?.dateOfPayment,
      dateOfShipping: initialData?.dateOfShipping,
      dateOfEdition: initialData?.dateOfEdition ?? new Date(),
      userId: initialData?.userId || "",
      shopId: initialData?.shopId || "",
      datePickUp: initialData?.datePickUp,

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

  const onDelete = async () => {
    const del = await deleteOrders({ id: initialData?.id });
    if (!del.success) {
      toast.error(del.message);
      setOpen(false);
    } else {
      router.push(referer);
      router.refresh();
      toast.success("Commande supprimé");
    }
    setOpen(false);
  };

  const onSubmit = async (data: OrderFormValues) => {
    if (initialData) {
      await updateOrder(data, initialData.id)
        .then(() => {
          toast.success(toastMessage);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    } else {
      await createOrder(data)
        .then(() => {
          toast.success(toastMessage);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={form.formState.isSubmitting}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="flex flex-wrap items-end gap-8">
            <SelectUser users={users} />
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
                  {field.value && (
                    <TimePicker date={field.value} setDate={field.onChange} />
                  )}
                </>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfShipping"
              render={({ field }) => (
                <FormDatePicker
                  {...field}
                  date={field.value}
                  onSelectDate={field.onChange}
                  title="Date de livraison"
                />
              )}
            />
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
            <FormField
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
            />
            <SelectShop shops={shops} />
          </div>
          <ShippingProducts products={products} />

          <TotalPrice />

          <LoadingButton
            disabled={form.formState.isSubmitting}
            className="ml-auto"
            type="submit"
          >
            {action}
          </LoadingButton>
        </form>
      </Form>
      <div className="flex flex-wrap gap-4">
        <div>
          <Label>Bon de livraison</Label>
          <DisplayShippingOrder orderId={form.getValues("id")} />
        </div>
        <div>
          <Label>Facture</Label>
          <DisplayInvoice orderId={form.getValues("id")} />
        </div>
      </div>
      <ButtonBackward
        onClick={() => {
          router.push(referer);
          router.refresh();
        }}
      />
    </>
  );
};
