import * as z from "zod";

export const schema = z.object({
  id: z.string().min(1),
  dateOfEdition: z.date(),
  startDate: z.date(),
  endDate: z.date(),
  day: z.number(),
  daysOfAbsence: z.array(z.date()),
  shippingDays: z.array(z.date()),
  totalPrice: z.number(),
  totalPaid: z.coerce.number(),
  amapItems: z.array(
    z.object({
      itemId: z.string().min(1),
      name: z.string().min(1, { message: "Le nom est requis" }),
      description: z.string().min(0, { message: "La description est requise" }),
      price: z.coerce.number(),
      icon: z.string().optional().nullable(),
      unit: z.string().optional().nullable(),
      quantity: z.coerce.number(),
    }),
  ),
  userId: z.string({ required_error: "Selectionner l'utilisateur" }).min(1, { message: "Selectionner l'utilisateur" }),
  shopId: z.string({ required_error: "Selectionner l'utilisateur" }).min(1, { message: "Selectionner l'AMAP" }),
});

export type AMAPFormValues = z.infer<typeof schema>;
