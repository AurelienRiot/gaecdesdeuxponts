import * as z from "zod";

const orderItemSchema = z.object({
  itemId: z.string(),
  unit: z.string().optional().nullable(),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  name: z.string().min(1, { message: "Le nom est requis" }),
  categoryName: z.string().min(0, { message: "La catégorie est requise" }),
  description: z.string().min(0, { message: "La description est requise" }),
});

export const orderSchema = z.object({
  id: z.string().min(1),
  totalPrice: z.number(),
  dateOfPayment: z.date().optional().nullable(),
  dateOfShipping: z.date().optional().nullable(),
  dateOfEdition: z.date().optional().nullable(),
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
  shopId: z.string().optional().nullable(),
  datePickUp: z.date({ message: "La date de retrait est requise" }),
  orderItems: z.array(orderItemSchema),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
