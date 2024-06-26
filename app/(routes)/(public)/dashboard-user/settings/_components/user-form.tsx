"use client";

import { AddressForm, addressSchema, type FullAdress } from "@/components/address-form";
import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import { BillingAddressForm, billingAddressSchema, defaultAddress } from "@/components/billing-address-form";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import { addDelay } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Address, BillingAddress } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import * as z from "zod";
import { deleteUser, updateUser } from "./server-action";

interface UserFormProps {
  initialData: {
    name: string;
    role: string;
    company: string;
    email: string;
    phone: string;
    address: FullAdress;
    billingAddress?: FullAdress;
  };
}

const formSchema = z.object({
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

export const UserForm: React.FC<UserFormProps> = ({ initialData }: UserFormProps) => {
  const [open, setOpen] = useState(false);

  const title = initialData.name ? "Modifier votre profil" : "Completer votre  profil";
  const toastMessage = "Profil mise à jour";
  const action = "Enregistrer les modifications";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      company: initialData.company,
      phone: initialData.phone,
      address: initialData.address ?? defaultAddress,
      billingAddress: initialData.billingAddress,
    },
  });

  const router = useRouter();
  const { setUser } = useUserContext();

  const onSubmit = async (data: UserFormValues) => {
    data.name = data.name.trim();

    const result = await updateUser(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setUser((prev) =>
      prev
        ? {
            ...prev,
            name: data.name,
            phone: data.phone,
            company: data.company || null,
            address: (data.address as Address) ?? null,
            billingAddress: (data.billingAddress as BillingAddress) ?? null,
          }
        : null,
    );
    router.push("/dashboard-user");
    toast.success(toastMessage);
  };

  const onDelete = async () => {
    await deleteUser()
      .then(async () => {
        signOut({ callbackUrl: "/" });
        await addDelay(1000);
        toast.success("Compte supprimé", { position: "top-center" });
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <div className=" flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-center text-3xl font-bold "> {title} </h2>

        <TrashButton
          disabled={form.formState.isSubmitting}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
          className="ml-3"
          iconClassName="ml-2 size-6"
        >
          Supprimer le compte
        </TrashButton>
      </div>
      <Separator className="mt-4" />
      <p className=" py-6  text-base font-bold sm:text-lg">{initialData.email}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 pb-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting} placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {initialData.role === "pro" && (
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <FormControl>
                      <Input disabled={form.formState.isSubmitting} placeholder="entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry="FR"
                      placeholder="Entrer un numéro de téléphone"
                      autoComplete="tel"
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AddressForm className="max-w-lg lg:col-span-2" />
            <BillingAddressForm className="mb-4 max-w-lg lg:col-span-2" />
          </div>
          <FormButton className="ml-auto ">{action}</FormButton>
        </form>
      </Form>
    </>
  );
};
