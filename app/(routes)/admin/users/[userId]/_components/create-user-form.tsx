"use client";

import { AddressForm, addressSchema } from "@/components/address-form";
import {
  BillingAddressForm,
  billingAddressSchema,
} from "@/components/billing-address-form";
import ButtonBackward from "@/components/ui/button-backward";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormButton,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import * as z from "zod";
import { createUser } from "../_actions/create-user";

const createUserFormSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom est obligatoire",
  }),
  company: z.string().optional(),
  email: z.string().email({ message: "L'email est invalide" }),
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
  isPro: z.boolean().default(false).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const CreateUserForm = () => {
  const router = useRouter();

  const title = "Créer l'utilisateur";
  const description = "Créer un utilisateur";
  const toastMessage = "Utilisateur créer";
  const action = "Créer l'utilisateur";

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      address: {
        label: "",
        city: "",
        country: "FR",
        line1: "",
        line2: "",
        postalCode: "",
        state: "",
      },
      billingAddress: undefined,
    },
  });

  const isPro = form.watch("isPro");

  const onSubmit = async (data: CreateUserFormValues) => {
    data.name = data.name.trim();
    await createUser(data)
      .then(() => {
        router.push(`/admin/users`);
        router.refresh();
        toast.success(toastMessage);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="mb-8 flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title={title} description={description} />
        </div>
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Nom"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting || !isPro}
                          placeholder="entreprise"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Entrer un numéro de téléphone"
                        defaultCountry="FR"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPro"
                render={({ field }) => (
                  <FormItem className="flex h-20 cursor-pointer flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <label className="flex cursor-pointer flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Professionnel</FormLabel>
                        <FormDescription>
                          {"Faire de cette utilisateur un professionnel"}
                        </FormDescription>
                      </div>
                    </label>
                  </FormItem>
                )}
              />
              <AddressForm />
              <BillingAddressForm />
            </div>
            <FormButton className="ml-auto">{action}</FormButton>
          </form>
        </Form>
        <ButtonBackward />
      </div>
    </div>
  );
};
