import { emailSchema, nameSchema, optionalStringSchema } from "@/components/zod-schema";
import { addressSchema } from "@/components/zod-schema/address-schema";
import { billingAddressSchema } from "@/components/zod-schema/billing-address-schema";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  name: nameSchema,
  company: optionalStringSchema,
  raisonSocial: optionalStringSchema,
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

  notes: optionalStringSchema,
  image: z.string().optional().nullable(),
  role: z.enum(["user", "pro", "trackOnlyUser"]),
  ccInvoice: z.array(emailSchema),
  address: addressSchema,
  billingAddress: billingAddressSchema,
});

export type UserFormValues = z.infer<typeof schema>;
