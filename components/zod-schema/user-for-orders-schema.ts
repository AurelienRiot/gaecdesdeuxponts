import { z } from "zod";
import { roleSchema } from "./index";
import { shopHoursSchema } from "@/app/(routes)/admin/shops/[shopId]/_components/shop-schema";

export const userForOrderSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  formattedName: z.string(),
  role: roleSchema,
  completed: z.boolean().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  image: z.string().nullable(),
  address: z.string().nullable(),
  links: z.array(z.object({ label: z.string(), value: z.string() })),
  shopHours: z.array(shopHoursSchema),
  defaultDaysOrders: z.array(z.number()),
  favoriteProducts: z.array(z.string()),
  notes: z.string().nullable(),
});

export type UserForOrderType = z.infer<typeof userForOrderSchema>;
