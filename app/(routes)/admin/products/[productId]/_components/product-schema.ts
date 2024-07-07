import { id } from "date-fns/locale";
import { z } from "zod";

const OptionSchema = z.object({
  index: z.number(),
  name: z.string().min(1, { message: "Le nom de l'option est requis" }),
  value: z.string().min(1, { message: "La valeur de l'option est requis" }),
});

const productSchema = z.object({
  id: z.string(),
  index: z.number(),
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string(),
  price: z.coerce
    .number()
    .optional()
    .refine((val) => Number(val) > 0, {
      message: "Veuillez entrer un prix valide",
    }),
  unit: z.enum(["centgramme", "Kilogramme", "Litre"]).optional(),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  imagesUrl: z.array(z.string()),
  options: z.array(OptionSchema),
});

export const mainProductSchema = z.object({
  id: z.string(),
  categoryName: z.string().min(1, { message: "La catégorie est requise" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
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