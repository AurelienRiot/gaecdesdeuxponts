import { z } from "zod";

export const billingAddressSchema = z
  .object({
    label: z.string().optional(),
    city: z.string().min(1, {
      message: "Veuillez entrer la ville",
    }),
    country: z.string().min(1, {
      message: "Veuillez entrer le pays",
    }),
    line1: z.string().min(1, {
      message: "Veuillez entrer l'adresse",
    }),
    line2: z.string().optional(),
    postalCode: z.string().min(1, {
      message: "Veuillez entrer le code postal",
    }),
    state: z.string().min(1, {
      message: "Veuillez entrer la région",
    }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .optional();
