import * as z from "zod";

const nonEmptyString = z
  .string()
  .max(1000, {
    message: "La description ne peut pas dépasser 1000 caractères",
  })
  .refine((val) => val.trim().length > 0, {
    message: "Entrer une description",
  });

export const bugReportSchema = z.object({
  subject: z.string(),
  page: z.string().min(1, { message: "Entrer le nom de la page" }).max(1000, {
    message: "Le nom de la page ne peut pas dépasser 1000 caractères",
  }),
  message: nonEmptyString,
});

export type BugReportValues = z.infer<typeof bugReportSchema>;
