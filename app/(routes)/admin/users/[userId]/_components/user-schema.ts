import { emailSchema } from "@/components/zod-schema";
import { addressSchema } from "@/components/zod-schema/address-schema";
import { billingAddressSchema } from "@/components/zod-schema/billing-address-schema";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  name: z.string().min(1, {
    message: "Le nom est obligatoire",
  }),
  company: z.string().optional(),
  raisonSocial: z.string().optional(),
  completed: z.boolean().default(false),
  email: emailSchema,
  phone: z.string().refine(
    (value) => {
      return value === "" || isValidPhoneNumber(value);
    },
    {
      message: "Le numéro de téléphone n'est pas valide",
    },
  ),
  links: z.array(
    z.object({
      label: z.string().trim().min(1, {
        message: "Le nom est obligatoire",
      }),
      value: z.string().trim().min(1, {
        message: "Le lien est obligatoire",
      }),
    }),
  ),
  notes: z.string().optional(),
  image: z.string().optional().nullable(),
  role: z.enum(["user", "pro", "trackOnlyUser"]),
  ccInvoice: z.array(emailSchema),
  address: addressSchema,
  billingAddress: billingAddressSchema,
});

export type UserFormValues = z.infer<typeof schema>;
