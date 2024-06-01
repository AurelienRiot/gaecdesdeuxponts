import * as z from "zod";

export const bugReportSchema = z.object({
  page: z
    .string()
    .min(1, { message: "La page ne peut pas être vide" })
    .max(1000, { message: "La page ne peut pas dépasser 1000 caractères" }),
  message: z
    .string()
    .min(1, { message: "Le message ne peut pas être vide" })
    .max(1000, { message: "Le message ne peut pas dépasser 1000 caractères" }),
});

export type BugReportValues = z.infer<typeof bugReportSchema>;
