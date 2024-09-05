import { z } from "zod";

const pointSchema = z.object({
  label: z.string({ required_error: "Rentrer une adresse" }).min(1, { message: "Rentrer une adresse" }),
  latitude: z.coerce
    .number()
    .min(-90, { message: "Entrez une latitude valide" })
    .max(90, { message: "Entrez une latitude valide" })
    .optional(),
  longitude: z.coerce
    .number()
    .min(-180, { message: "Entrez une longitude valide" })
    .max(180, { message: "Entrez une longitude valide" })
    .optional(),
});

export const directionSchema = z.object({
  origin: pointSchema,
  destination: pointSchema,
  waypoints: z.array(pointSchema).min(2, { message: "Entrez au moins deux points de passage" }),
});
export type Point = z.infer<typeof pointSchema>;
export const origin: Point = { label: "6 le Pont Robert 44290 Massérac" };
export const destination: Point = { label: "Pont de l'Eau, 44460 Avessac, France" };
export type DirectionFormValues = z.infer<typeof directionSchema>;
