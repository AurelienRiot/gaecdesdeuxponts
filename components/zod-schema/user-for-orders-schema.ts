import { z } from "zod";
import { roleSchema } from "./index";

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
  defaultDaysOrders: z.array(z.number()),
  notes: z.string().nullable(),
});

export type UserForOrderType = z.infer<typeof userForOrderSchema>;
