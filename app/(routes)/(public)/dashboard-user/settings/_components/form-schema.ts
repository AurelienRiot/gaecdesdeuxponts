import { addressSchema } from "@/components/zod-schema/address-schema";
import { billingAddressSchema } from "@/components/zod-schema/billing-address-schema";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom est obligatoire",
  }),
  company: z.string().optional(),
  phone: z.string().refine(
    (value) => {
      return value === "" || isValidPhoneNumber(value);
    },
    {
      message: "Le numéro de téléphone n'est pas valide",
    },
  ),
  address: addressSchema,
  billingAddress: billingAddressSchema,
});

export type UserFormValues = z.infer<typeof formSchema>;
