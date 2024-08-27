"use client";

import { LoadingButton } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { createId } from "@/lib/id";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product, Shop, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { AMAPOrderWithItems } from "@/types";
import { useEffect } from "react";
import { schema, type AMAPFormValues } from "./amap-schema";
import FormDatePicker from "./date-picker";
import SelectShop from "./select-shop";
import SelectUser from "./select-user";
import { AMAPProducts } from "./products";
import TotalPrice from "./total-price";
import DaysOfShipping from "./days-of-shipping";
import useServerAction from "@/hooks/use-server-action";
import createAMAP from "../_actions/create-amap";
import updateAMAP from "../_actions/update-amap";
import { deleteAMAP } from "../../_actions/delete-amap";
import DeleteButton from "@/components/delete-button";
import { DisplayAMAPOrder } from "@/components/pdf/pdf-button";
import { Label } from "@/components/ui/label";
import { getTuesdaysBetweenDates } from "@/lib/date-utils";

const START = new Date(1725314400000);
const END = new Date(1735599600000);

interface AMAPFormProps {
  initialData: AMAPOrderWithItems | null;
  users: User[];
  shops: Shop[];
  products: Product[];
}

export const AMAPForm: React.FC<AMAPFormProps> = ({ initialData, users, shops, products }) => {
  const router = useRouter();
  const { serverAction: createAMAPAction } = useServerAction(createAMAP);
  const { serverAction: updateAMAPAction } = useServerAction(updateAMAP);

  const title = initialData ? "Modifier le contrat  AMAP" : "Créer le contrat AMAP";
  const description = initialData ? "" : "";
  const action = initialData ? "Sauvegarder les changements" : "Créer le contrat";
  const form = useForm<AMAPFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initialData?.id || createId("amap"),
      dateOfEdition: new Date(),
      daysOfAbsence: initialData?.daysOfAbsence || [],
      shippingDays: initialData?.shippingDays || getTuesdaysBetweenDates(START, END),
      startDate: initialData?.startDate || new Date() < START ? START : new Date(),
      endDate: initialData?.endDate || END,
      totalPrice: initialData?.totalPrice || 0,
      amapItems: initialData?.amapItems || [],
      userId: initialData?.userId || undefined,
      shopId: initialData?.shopId || shops[0]?.id || undefined,
    },
  });

  const onSubmit = async (data: AMAPFormValues) => {
    function onSuccess() {
      router.push(`/admin/amap/${data.id}#button-container`);
      router.refresh();
    }
    initialData ? await updateAMAPAction({ data, onSuccess }) : await createAMAPAction({ data, onSuccess });
  };

  useEffect(() => {
    if (form.getValues("amapItems").length === 0) {
      const item = products.find((product) => product.name === "Lait cru bio bidon 2L");
      if (item) {
        form.setValue(`amapItems.0.itemId`, item.id);
        form.setValue(`amapItems.0.unit`, item.unit);
        form.setValue(`amapItems.0.description`, item.description);
        form.setValue(`amapItems.0.name`, item.name);
        form.setValue(`amapItems.0.price`, item.price);
        form.setValue(`amapItems.0.quantity`, 1);
      }
    }
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <DeleteButton
            action={deleteAMAP}
            data={{ id: initialData?.id, shippingDays: initialData.shippingDays }}
            isSubmitting={form.formState.isSubmitting}
            onSuccess={() => {
              router.push(`/admin/categories`);
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
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormDatePicker {...field} date={field.value} setDate={field.onChange} title="Date de début" />
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormDatePicker {...field} date={field.value} setDate={field.onChange} title="Date de fin" />
              )}
            />
            <SelectShop shops={shops} />
          </div>
          <AMAPProducts products={products} />
          <DaysOfShipping />
          <TotalPrice />
          {!!initialData && (
            <div id="button-container">
              <Label>Bon de livraison</Label>
              <DisplayAMAPOrder orderId={form.getValues("id")} isSend={false} />
            </div>
          )}
          <LoadingButton disabled={form.formState.isSubmitting} className="ml-auto" type="submit">
            {action}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};

// products.find((product) => product.name === "Lait cru bio bidon 2L")
