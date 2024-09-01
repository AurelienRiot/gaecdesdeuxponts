"use client";

import { LoadingButton } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { saveAs } from "file-saver";

import { base64ToBlob } from "@/components/pdf/server-actions/pdf-fuction";
import useServerAction from "@/hooks/use-server-action";
import { getDaysBetweenDates } from "@/lib/date-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product, Shop } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import createAMAPFormulaire from "../../_actions/create-formulaire";
import FormDatePicker from "../date-picker";
import DaysOfShipping, { DisplayShippingDays } from "../days-of-shipping";
import { AMAPProducts } from "../products";
import SelectDay from "../select-day";
import SelectShop from "../select-shop";
import { schema, type AMAPFormulaireValues } from "./amap-formulaire-schema";
import { Label } from "@/components/ui/label";

const START = new Date("2024-09-01");
const END = new Date("2024-12-31");

function initialProduct(products: Product[]) {
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
  shops: Shop[];
  products: Product[];
}

export const AMAPFormulaire: React.FC<AMAPFormProps> = ({ shops, products }) => {
  const { serverAction, loading } = useServerAction(createAMAPFormulaire);

  const action = "Créer le formulaire";
  const form = useForm<AMAPFormulaireValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      daysOfAbsence: [],
      shippingDays: getDaysBetweenDates({ from: new Date() < START ? START : new Date(), to: END, day: 2 }),
      day: 2,
      startDate: new Date() < START ? START : new Date(),
      endDate: END,
      amapItems: initialProduct(products),
      shopId: shops[0]?.id || undefined,
    },
  });

  const onSubmit = async (data: AMAPFormulaireValues) => {
    data.shopId = shops.find((item) => item.id === data.shopId)?.name || "AMAP";
    function onSuccess(result?: { base64String: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      saveAs(blob, `Formulaire ${data.shopId}.pdf`);
    }
    await serverAction({ data: data, onSuccess });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="flex flex-wrap items-end gap-8">
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
          {/* <AMAPProducts products={products} /> */}
          <div className="space-y-4">
            <Label>Date de livraisons</Label>
            <DisplayShippingDays />
          </div>

          <LoadingButton disabled={form.formState.isSubmitting || loading} className="ml-auto" type="submit">
            {action}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
