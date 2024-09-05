"use client";

import DeleteButton from "@/components/delete-button";
import { LoadingButton } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useServerAction from "@/hooks/use-server-action";

import { getDaysBetweenDates } from "@/lib/date-utils";
import { createId } from "@/lib/id";
import type { AMAPOrderWithItems } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product, Shop, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { deleteAMAP } from "../../_actions/delete-amap";
import createAMAP from "../_actions/create-amap";
import updateAMAP from "../_actions/update-amap";
import { schema, type AMAPFormValues } from "./amap-schema";
import FormDatePicker from "./date-picker";
import DaysOfShipping, { DisplayShippingDays } from "./days-of-shipping";
import { AMAPProducts } from "./products";
import SelectDay from "./select-day";
import SelectShop from "./select-shop";
import SelectUser from "./select-user";
import TotalPaid from "./total-paid";
import TotalPrice from "./total-price";

const START = new Date(1725314400000);
const END = new Date(1735686000000);

function initialDay(shippingDays?: Date[]) {
  if (!shippingDays) return 2;
  return shippingDays[0].getDay();
}

function initialProduct(products: Product[]) {
  // const item = products.find((product) => product.name === "Lait cru bio bidon 2L");
  if (products) {
    return products.map((item) => ({
      itemId: item.id,
      unit: item.unit,
      description: item.description,
      name: item.name,
      price: item.price,
      quantity: 1,
    }));
  }
  return [];
}

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
      shippingDays: initialData?.shippingDays || getDaysBetweenDates({ from: START, to: END, day: 2 }),
      day: initialDay(initialData?.shippingDays),
      startDate: initialData?.startDate || new Date() < START ? START : new Date(),
      endDate: initialData?.endDate || END,
      totalPrice: initialData?.totalPrice || 0,
      totalPaid: initialData?.totalPaid || 0,
      amapItems: initialData?.amapItems || initialProduct(products),
      userId: initialData?.userId || undefined,
      shopId: initialData?.shopId || shops[0]?.id || undefined,
    },
  });

  // const onError:SubmitErrorHandler<AMAPFormValues> = (e) => {
  //   console.log(e);
  // };

  const onSubmit = async (data: AMAPFormValues) => {
    function onSuccess() {
      router.push(`/admin/amap/${data.id}#button-container`);
      router.refresh();
    }
    initialData ? await updateAMAPAction({ data, onSuccess }) : await createAMAPAction({ data, onSuccess });
  };

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
            <SelectDay />
          </div>
          <AMAPProducts products={products} />
          <div className="space-y-4">
            <Label>Date de livraisons</Label>
            <DaysOfShipping />
            <DisplayShippingDays />
          </div>
          <div className="flex flex-wrap items-end gap-8">
            <TotalPrice />
            <TotalPaid />
          </div>
          {/* {!!initialData && (
            <div id="button-container">
              <Label>Contrat</Label>
              <DisplayAMAPOrder orderId={form.getValues("id")} isSend={false} />
            </div>
          )} */}
          <LoadingButton disabled={form.formState.isSubmitting} className="ml-auto" type="submit">
            {action}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
