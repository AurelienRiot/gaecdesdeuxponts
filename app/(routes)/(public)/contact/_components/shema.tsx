import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Veuillez entrer votre nom" })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" }),
  email: z
    .string()
    .email({ message: "L'email doit être un email valide" })
    .min(1, { message: "Veuillez entrer votre email" })
    .max(100, { message: "L'email ne peut pas dépasser 100 caractères" }),
  phone: z.string().optional(),
  subject: z
    .string()
    .min(1, { message: "Le sujet ne peut pas être vide" })
    .max(100, { message: "Le sujet ne peut pas dépasser 100 caractères" }),
  message: z
    .string()
    .min(1, { message: "Le message ne peut pas être vide" })
    .max(1000, { message: "Le message ne peut pas dépasser 1000 caractères" }),
});
