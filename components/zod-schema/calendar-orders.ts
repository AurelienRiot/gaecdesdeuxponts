import { z } from "zod";
import { statusSchema } from "./status";
import { pointSchema } from "@/app/(routes)/admin/direction/_components/direction-schema";

export const productQuantitiesSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  price: z.number(),
  unit: z.string(),
  icon: z.string().nullable().optional(),
  quantity: z.number(),
});
export type ProductQuantities = z.infer<typeof productQuantitiesSchema>;
export const calendarOrderSchema = z.object({
  id: z.string(),
  index: z.number().nullable().optional(),
  userName: z.string(),
  userId: z.string(),
  userImage: z.string().nullable().optional(),
  shippingDate: z.coerce.date(),
  totalPrice: z.string(),
  status: statusSchema,
  productsList: z.array(productQuantitiesSchema),
  shopName: z.string(),
  address: pointSchema,
  shopId: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
});

export type CalendarOrderType = z.infer<typeof calendarOrderSchema>;
