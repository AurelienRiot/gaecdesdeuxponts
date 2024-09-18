import { z } from "zod";

const emailSchema = z.string().email().trim().toLowerCase();
const nameSchema = z.string().min(1, { message: "Le nom est obligatoire" }).trim();

export { emailSchema, nameSchema };
