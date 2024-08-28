import { addressSchema } from "@/components/zod-schema/address-schema";
import { billingAddressSchema } from "@/components/zod-schema/billing-address-schema";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ required_error: "Veuillez entrer votre nom" }).min(1, {
    message: "Veuillez entrer votre nom",
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
