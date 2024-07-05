import * as z from "zod";

export const schema = z.object({
  name: z.string().min(1, { message: "Le nom est obligatoire" }),
  imageUrl: z.string().min(1, { message: "L'image est obligatoire" }),
  description: z.string().min(1, { message: "La description est obligatoire" }),
});

export type CategoryFormValues = z.infer<typeof schema>;
