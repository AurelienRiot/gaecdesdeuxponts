"use client";
import { deleteOrders } from "@/components/table-custom-fuction/orders-server-actions";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Button, LoadingButton } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  ProductWithMain,
  ReturnTypeServerAction,
  UserWithAddress,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shop } from "@prisma/client";
import { Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import FormDatePicker from "./date-picker";
import SelectShop from "./select-shop";
import SelectUser from "./select-user";
import OrderButton from "./order-button";
import { ShippingProducts } from "./products";
import TotalPrice from "./total-price";
import updateOrder from "../_actions/update-order";
import createOrder from "../_actions/create-order";
import InvoiceButton from "./invoice-button";

const orderItemSchema = z.object({
  itemId: z.string(),
  unit: z.string().optional().nullable(),
  price: z.coerce
    .number()
    .optional()
    .refine((val) => val !== undefined, {
      message: "Veuillez entrer un prix valide",
    }),

  quantity: z.coerce.number().min(0, { message: "La quantité est requise" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  categoryName: z.string().min(0, { message: "La catégorie est requise" }),
  description: z.string().min(0, { message: "La description est requise" }),
});

const OrderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Le nom est requis" }),
  totalPrice: z.number().min(0, { message: "Le prix est requis" }),
  dateOfPayment: z.date().optional().nullable(),
  dateOfShipping: z.date().optional().nullable(),
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
  shopId: z.string().optional().nullable(),
  datePickUp: z.date(),
  orderItems: z.array(orderItemSchema),
  // .nonempty("Veuillez ajouter au moins un produit"),
});

export type OrderFormValues = z.infer<typeof OrderSchema>;

type ProductFormProps = {
  initialData: OrderFormValues | null;
  products: ProductWithMain[];
  shops: Shop[];
  users: UserWithAddress[];
};

export const OrderForm: React.FC<ProductFormProps> = ({
  initialData,
  products,
  users,
  shops,
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
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      id: initialData?.id || `${nanoid()}`,
      name: initialData?.name || "",
      totalPrice: initialData?.totalPrice,
      dateOfPayment: initialData?.dateOfPayment,
      dateOfShipping: initialData?.dateOfShipping,
      userId: initialData?.userId || "",
      shopId: initialData?.shopId || "",
      datePickUp: initialData?.datePickUp || new Date(),

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
      router.push(`/admin/orders`);
      router.refresh();
      toast.success("Commande supprimé");
    }
    setOpen(false);
  };

  const onSubmit = async (data: OrderFormValues) => {
    let result: ReturnTypeServerAction<null>;
    if (initialData) {
      result = await updateOrder(data, initialData.id);
    } else {
      result = await createOrder(data);
    }
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    router.push("/admin/orders");
    router.refresh();
    toast.success(toastMessage);
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
          className="w-full space-y-8 "
        >
          <div className="flex flex-wrap items-end gap-8">
            <SelectUser users={users} />
            <FormField
              control={form.control}
              name="datePickUp"
              render={({ field }) => (
                <FormDatePicker
                  date={field.value}
                  onSelectDate={field.onChange}
                  title="Date de retrait"
                  reset={false}
                />
              )}
            />
            <FormField
              control={form.control}
              name="dateOfShipping"
              render={({ field }) => (
                <FormDatePicker
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
                  date={field.value}
                  onSelectDate={field.onChange}
                  title="Date de paiement"
                />
              )}
            />
            <SelectShop shops={shops} />
          </div>
          <ShippingProducts products={products} />

          <TotalPrice />
          <div className="flex flex-wrap gap-4">
            <OrderButton users={users} />
            <InvoiceButton users={users} />
          </div>
          <LoadingButton
            disabled={form.formState.isSubmitting}
            className="ml-auto"
            type="submit"
          >
            {action}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
