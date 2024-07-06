import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const customNumberSchema = z
  .string({
    required_error: "Veuillez entrer un nombre",
  })
  .refine((value) => value !== "", {
    message: "Veuillez entrer un nombre",
  })
  .transform((value) => {
    const num = Number(value);
    if (Number.isNaN(num)) {
      throw new Error("Veuillez entrer un nombre");
    }
    return num;
  })
  .refine((value) => typeof value === "number", {
    message: "Veuillez entrer un nombre",
  });

export const schema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Le nom est requis" }),
  imageUrl: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90),
  long: z.coerce.number().min(-180).max(180),

  address: z.string().min(1, { message: "L'adresse est requise" }),
  phone: z.string().refine(
    (value) => {
      return value === "" || isValidPhoneNumber(value);
    },
    {
      message: "Le numéro de téléphone n'est pas valide",
    },
  ),
  email: z.string().email({ message: "L'email est invalide" }).optional(),
  website: z.string().optional(),
  description: z.string(),
  isArchived: z.boolean().default(false).optional(),
});

export type ShopFormValues = z.infer<typeof schema>;
