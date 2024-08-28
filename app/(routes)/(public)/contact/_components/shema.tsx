import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string({ required_error: "Veuillez entrer votre nom" })
    .min(1, { message: "Veuillez entrer votre nom" })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" }),
  email: z
    .string({ required_error: "Veuillez entrer votre email" })
    .email({ message: "L'email doit être un email valide" })
    .min(1, { message: "Veuillez entrer votre email" })
    .max(100, { message: "L'email ne peut pas dépasser 100 caractères" }),
  phone: z.string().optional(),
  subject: z
    .string({ required_error: "Veuillez entrer le sujet" })
    .min(1, { message: "Veuillez entrer le sujet" })
    .max(100, { message: "Le sujet ne peut pas dépasser 100 caractères" }),
  message: z
    .string({ required_error: "Veuillez entrer votre message" })
    .min(1, { message: "Veuillez entrer votre message" })
    .max(1000, { message: "Le message ne peut pas dépasser 1000 caractères" }),
});
