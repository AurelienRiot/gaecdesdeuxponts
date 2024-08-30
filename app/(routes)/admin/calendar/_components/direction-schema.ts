import { z } from "zod";

export const directionSchema = z.object({
  origin: z.string({ required_error: "Entrez l'adresse de depart" }).min(1, {
    message: "Entrez l'adresse de depart",
  }),
  destination: z.string({ required_error: "Entrez la destination" }).min(1, {
    message: "Entrez la destination",
  }),
  waypoints: z
    .array(z.string({ required_error: "Rentrer une adresse" }).min(1, { message: "Rentrer une adresse" }))
    .min(2, { message: "Entrez au moins deux points de passage" }),
});

export type DirectionFormValues = z.infer<typeof directionSchema>;
