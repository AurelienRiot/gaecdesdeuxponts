import { nameSchema } from "@/components/zod-schema";
import { z } from "zod";

const OptionSchema = z.object({
  index: z.number(),
  name: z.string().min(1, { message: "Le nom de l'option est requis" }),
  value: z.string().min(1, { message: "La valeur de l'option est requis" }),
});

const productSchema = z.object({
  id: z.string(),
  index: z.number(),
  name: nameSchema,
  description: z.string(),
  stocks: z.array(z.string()),
  icon: z.string().optional().nullable(),
  price: z.coerce.number({ message: "Le prix doit être un nombre", invalid_type_error: "Le prix doit être un nombre" }),
  tax: z.coerce.number({ message: "La taxe doit être un nombre", invalid_type_error: "La taxe doit être un nombre" }),
  unit: z.enum(["centgramme", "Kilogramme", "Litre"]).optional(),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  imagesUrl: z.array(z.string()),
  options: z.array(OptionSchema),
});

export const mainProductSchema = z.object({
  id: z.string(),
  categoryName: z.string().min(1, { message: "La catégorie est requise" }),
  name: nameSchema,
  productSpecs: z.string().min(1, { message: "Les spécifications sont requises" }),
  isArchived: z.boolean().default(false),
  isPro: z.boolean().default(false),
  imagesUrl: z.array(z.string()).refine((data) => data.length > 0, {
    message: "Au moins une image est requise",
  }),
  products: z.array(productSchema).nonempty("Veuillez ajouter au moins un produit"),
});

export type ProductSchema = z.infer<typeof productSchema>;

export type ProductFormValues = z.infer<typeof mainProductSchema>;
