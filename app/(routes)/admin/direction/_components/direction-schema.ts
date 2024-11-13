import { z } from "zod";

export const pointSchema = z.object({
  label: z.string({ required_error: "Rentrer une adresse" }),
  latitude: z.coerce
    .number()
    .min(-90, { message: "Entrez une latitude valide" })
    .max(90, { message: "Entrez une latitude valide" })
    .optional()
    .nullable(),
  longitude: z.coerce
    .number()
    .min(-180, { message: "Entrez une longitude valide" })
    .max(180, { message: "Entrez une longitude valide" })
    .optional()
    .nullable(),
});

export const pointSchemaMin = pointSchema.extend({
  label: pointSchema.shape.label.min(1, { message: "Rentrer une adresse" }), // Added minimum length validation
});

export const directionSchema = z.object({
  origin: pointSchemaMin,
  destination: pointSchemaMin,
  waypoints: z.array(pointSchemaMin).min(2, { message: "Entrez au moins deux points de passage" }),
});
export type Point = z.infer<typeof pointSchema>;
export const origin: Point = { label: "6 le Pont Robert 44290 Massérac" };
export const destination: Point = { label: "6 le Pont Robert 44290 Massérac" };
// export const destination: Point = { label: "Pont de l'Eau, 44460 Avessac, France" };
export type DirectionFormValues = z.infer<typeof directionSchema>;
