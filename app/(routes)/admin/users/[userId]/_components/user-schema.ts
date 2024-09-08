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
  completed: z.boolean().default(false),
  email: z.string().email(),
  phone: z.string().refine(
    (value) => {
      return value === "" || isValidPhoneNumber(value);
    },
    {
      message: "Le numéro de téléphone n'est pas valide",
    },
  ),
  notes: z.string().optional(),
  image: z.string().optional().nullable(),
  role: z.enum(["user", "pro", "trackOnlyUser"]),
  address: addressSchema,
  billingAddress: billingAddressSchema,
});

export type UserFormValues = z.infer<typeof schema>;
