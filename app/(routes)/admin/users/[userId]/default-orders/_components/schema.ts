import * as z from "zod";

const defaultOrderProductsSchema = z.object({
  productId: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
});

export const defaultOrderSchema = z.object({
  day: z.number(),
  confirmed: z.boolean().default(true),
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
  shopId: z.string().optional().nullable(),
  defaultOrderProducts: z.array(defaultOrderProductsSchema),
});

export type DefaultOrderFormValues = z.infer<typeof defaultOrderSchema>;
