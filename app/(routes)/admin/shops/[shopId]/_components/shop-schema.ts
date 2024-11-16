import { optionalStringSchema } from "@/components/zod-schema";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Le nom est requis" }),
  imageUrl: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90),
  long: z.coerce.number().min(-180).max(180),
  tags: z.array(z.string()),
  address: z.string().min(1, { message: "L'adresse est requise" }),
  type: z.enum(["sell", "product", "both", "amap"]).optional(),
  phone: z.string().refine(
    (value) => {
      return value === "" || isValidPhoneNumber(value);
    },
    {
      message: "Le numéro de téléphone n'est pas valide",
    },
  ),
  email: z.string().email({ message: "L'email est invalide" }).optional(),
  website: optionalStringSchema,
  description: z.string(),
  isArchived: z.boolean().default(false),
});

export type ShopFormValues = z.infer<typeof schema>;
