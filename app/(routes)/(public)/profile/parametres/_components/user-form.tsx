"use client";

import { AddressForm } from "@/components/address-form";
import { BillingAddressForm } from "@/components/billing-address-form";
import DeleteButton from "@/components/delete-button";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import { defaultAddress, type FullAdress } from "@/components/zod-schema/address-schema";
import useServerAction from "@/hooks/use-server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserQueryClient } from "../../_components/user-query";
import deleteUser from "../_actions/delete-user";
import updateUser from "../_actions/update-user";
import { formSchema, type UserFormValues } from "./form-schema";

interface UserFormProps {
  initialData: {
    name: string;
    role: string;
    company: string;
    raisonSocial: string;
    email: string;
    phone: string;
    address: FullAdress;
    billingAddress?: FullAdress;
  };
}

export const UserForm: React.FC<UserFormProps> = ({ initialData }: UserFormProps) => {
  const { serverAction } = useServerAction(updateUser);
  const { refectUser } = useUserQueryClient();
  const title = initialData.name ? "Modifier votre profile" : "Completer votre  profile";
  const action = "Enregistrer les modifications";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      company: initialData.company,
      raisonSocial: initialData.raisonSocial,
      phone: initialData.phone,
      address: initialData.address ?? defaultAddress,
      billingAddress: initialData.billingAddress,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: UserFormValues) => {
    data.name = data.name.trim();
    data.company = data.company?.trim();
    function onSuccess() {
      refectUser();
      router.push("/profile");
    }
    await serverAction({ data, onSuccess });
  };

  return (
    <>
      <div className=" flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-center text-3xl font-bold "> {title} </h2>

        <DeleteButton
          action={deleteUser}
          data={{}}
          isSubmitting={form.formState.isSubmitting}
          onSuccess={() => {
            signOut({ redirect: false });
            router.push("/");
            toast.success("Compte supprimé", { position: "top-center" });
          }}
        />
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
                  <FormLabel className={field.value ? "text-primary" : "text-destructive"}>Nom</FormLabel>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting} placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {initialData.role === "pro" && (
              <>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl>
                        <Input disabled={form.formState.isSubmitting} placeholder="Entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="raisonSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raison sociale</FormLabel>
                      <FormControl>
                        <Input disabled={form.formState.isSubmitting} placeholder="Raison sociale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
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
