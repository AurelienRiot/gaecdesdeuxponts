"use client";

import { AddressForm } from "@/components/address-form";
import { BillingAddressForm } from "@/components/billing-address-form";
import DeleteButton from "@/components/delete-button";
import InputImageModal from "@/components/images-upload/image-modal";
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
import useServerAction from "@/hooks/use-server-action";
import type { UserWithOrdersAndAdress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import deleteUser from "../../_actions/delete-user";
import updateUser from "../_actions/update-user";
import MailForm from "./mail-form";
import { schema, type UserFormValues } from "./user-schema";

interface UserFormProps {
  initialData: UserWithOrdersAndAdress;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { serverAction } = useServerAction(updateUser);

  const title = "Modifier l'utilisateur";
  const description = "Modifier un utilisateur";
  const action = "Enregistrer les modifications";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initialData.id,
      completed: initialData.completed,
      email: initialData.email || "",
      name: initialData.name || "",
      image: initialData.image || "",
      company: initialData.company || "",
      phone: initialData.phone || "",
      isPro: initialData.role === "pro" || false,
      address: {
        label: initialData.address?.label || "",
        city: initialData.address?.city || "",
        country: initialData.address?.country || "FR",
        line1: initialData.address?.line1 || "",
        line2: initialData.address?.line2 || "",
        postalCode: initialData.address?.postalCode || "",
        state: initialData.address?.state || "",
      },
      billingAddress: initialData.billingAddress
        ? {
            label: initialData.billingAddress.label || "",
            city: initialData.billingAddress.city,
            country: initialData.billingAddress.country,
            line1: initialData.billingAddress.line1,
            line2: initialData.billingAddress.line2 || "",
            postalCode: initialData.billingAddress.postalCode,
            state: initialData.billingAddress.state,
          }
        : undefined,
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    data.name = data.name.trim();
    function onSuccess() {
      router.push(`/admin/users`);
      router.refresh();
    }
    await serverAction({ data, onSuccess });
  };
  const isPro = form.watch("isPro");

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        <DeleteButton
          action={deleteUser}
          data={{ email: initialData.email }}
          isSubmitting={form.formState.isSubmitting}
          onSuccess={() => {
            router.push(`/admin/users`);
            router.refresh();
          }}
        />
      </div>
      <Separator />

      {<MailForm email={initialData.email} id={initialData.id} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="my-auto">
                <FormControl>
                  <InputImageModal
                    ref={field.ref}
                    selectedFiles={field.value ? [field.value] : []}
                    setSelectedFiles={(files: string[]) => {
                      files.length > 0 ? field.onChange(files[0]) : field.onChange(null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
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

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting || !isPro} placeholder="entreprise" {...field} />
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
                      <FormDescription>{"Faire de cette utilisateur un professionnel"}</FormDescription>
                    </div>
                  </label>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completed"
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
                      <FormLabel>Profile complet</FormLabel>
                      <FormDescription>Indique si le profil de l'utilisateur est complet.</FormDescription>
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
    </>
  );
};
