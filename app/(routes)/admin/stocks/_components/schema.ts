import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, { message: "Le nom est obligatoire" }),
  totalQuantity: z.coerce.number().min(1, { message: "La quantité dois être supérieure à 0" }),
});
