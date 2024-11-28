import { z } from "zod";

export const billingAddressSchema = z
  .object({
    label: z.string().optional().nullable(),
    city: z.string().min(1, {
      message: "Veuillez entrer la ville",
    }),
    country: z.string().min(1, {
      message: "Veuillez entrer le pays",
    }),
    line1: z.string().min(1, {
      message: "Veuillez entrer l'adresse",
    }),
    line2: z.string().optional().nullable(),
    postalCode: z.string().min(1, {
      message: "Veuillez entrer le code postal",
    }),
    state: z.string().min(1, {
      message: "Veuillez entrer la région",
    }),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
  })
  .optional();
