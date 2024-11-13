import { z } from "zod";

export const status = ["À confirmer", "Commande validée", "Commande livrée", "En attente de paiement", "Payé"] as const;

export type Status = (typeof status)[number];
export const statusSchema = z.enum(status);
