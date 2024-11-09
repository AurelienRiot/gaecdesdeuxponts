import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const emailSchema = z
  .string({
    message: "L'email doit être un email valide",
    invalid_type_error: "L'email doit être un email valide",
    required_error: "L'email est obligatoire",
  })
  .email({ message: "L'email doit être un email valide" })
  .min(1, { message: "Veuillez entrer votre email" })
  .max(100, { message: "L'email ne peut pas dépasser 100 caractères" })
  .trim()
  .toLowerCase();
const nameSchema = z.string().min(1, { message: "Le nom est obligatoire" }).trim();
const optSchema = z.object({
  otp: z
    .string({
      required_error: "Le code unique doit être de 6 chiffres",
      invalid_type_error: "Le code unique doit être de 6 chiffres",
    })
    .regex(/^\d{6}$/, { message: "Le code unique doit être de 6 chiffres" }),
  email: emailSchema,
});

const phoneSchema = z.string({ invalid_type_error: "Entrer un numéro de téléphone" }).refine(
  (value) => {
    return value === "" || isValidPhoneNumber(value);
  },
  {
    message: "Le numéro de téléphone n'est pas valide",
  },
);

const emptySchema = z.object({});
export { emailSchema, nameSchema, optSchema, phoneSchema, emptySchema };
