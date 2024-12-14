import { nameSchema, optionalStringSchema } from "@/components/zod-schema";
import { ShopType } from "@prisma/client";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const TYPE: { value: ShopType; label: string }[] = [
  { value: "sell", label: "Vente" },
  { value: "product", label: "Production" },
  { value: "both", label: "Vente et production" },
  { value: "amap", label: "AMAP" },
];

export const shopHoursSchema = z.object({
  day: z.number(),
  isClosed: z.boolean(),
  isAllDay: z.boolean(),
  openHour1: z.coerce.date(),
  closeHour1: z.coerce.date(),
  openHour2: z.coerce.date().optional().nullable(),
  closeHour2: z.coerce.date().optional().nullable(),
});

export const schema = z.object({
  id: z.string(),
  name: nameSchema,
  imageUrl: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90),
  long: z.coerce.number().min(-180).max(180),
  tags: z.array(z.string()),
  address: z.string().min(1, { message: "L'adresse est requise" }),
  type: z.nativeEnum(ShopType).optional(),
  userId: z.string().optional(),
  phone: z.string().refine(
    (value) => {
      return value === "" || isValidPhoneNumber(value);
    },
    {
      message: "Le numéro de téléphone n'est pas valide",
    },
  ),
  links: z.array(
    z.object({
      label: nameSchema,
      value: z.string().trim().min(1, {
        message: "Le lien est obligatoire",
      }),
    }),
  ),
  email: z.string().email({ message: "L'email est invalide" }).optional(),
  shopHours: z.array(shopHoursSchema),
  description: z.string(),
  isArchived: z.boolean().default(false),
});

export type ShopFormValues = z.infer<typeof schema>;
