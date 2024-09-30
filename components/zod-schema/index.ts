import { z } from "zod";

const emailSchema = z
  .string({
    message: "L'email doit être un email valide",
    invalid_type_error: "L'email doit être un email valide",
    required_error: "L'email est obligatoire",
  })
  .email({ message: "L'email doit être un email valide" })
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
  email: z.string().email().trim().toLowerCase(),
});

export { emailSchema, nameSchema, optSchema };
