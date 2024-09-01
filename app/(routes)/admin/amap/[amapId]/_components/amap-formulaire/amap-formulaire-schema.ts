import * as z from "zod";

export const schema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  daysOfAbsence: z.array(z.date()),
  shippingDays: z.array(z.date()),
  day: z.number(),
  amapItems: z.array(
    z.object({
      itemId: z.string().min(1),
      name: z.string().min(1, { message: "Le nom est requis" }),
      description: z.string().min(0, { message: "La description est requise" }),
      price: z.coerce.number(),
      unit: z.string().optional().nullable(),
      quantity: z.coerce.number(),
    }),
  ),
  shopId: z.string({ required_error: "Selectionner l'AMAP" }).min(1, { message: "Selectionner l'AMAP" }),
});

export type AMAPFormulaireValues = z.infer<typeof schema>;
