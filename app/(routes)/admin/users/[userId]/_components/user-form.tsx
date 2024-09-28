"use client";

import { AddressForm } from "@/components/address-form";
import { AnimateHeight } from "@/components/animations/animate-size";
import { BillingAddressForm } from "@/components/billing-address-form";
import CheckboxForm from "@/components/chekbox-form";
import DeleteButton from "@/components/delete-button";
import InputImageModal from "@/components/images-upload/image-modal";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import useServerAction from "@/hooks/use-server-action";
import type { UserWithOrdersAndAdress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import deleteUser from "../../_actions/delete-user";
import updateUser from "../_actions/update-user";
import MailForm from "./mail-form";
import SelectRole from "./select-role";
import { schema, type UserFormValues } from "./user-schema";

interface UserFormProps {
  initialData: UserWithOrdersAndAdress;
  incomplete?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, incomplete }) => {
  const router = useRouter();
  const { serverAction } = useServerAction(updateUser);
  const [open, setOpen] = useState(incomplete);

  const title = "Fiche utilisateur";
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
      role: ["user", "pro", "trackOnlyUser"].includes(initialData.role) ? (initialData.role as "user") : "user",
      notes: initialData.notes || "",
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
      router.back();
      router.refresh();
    }
    await serverAction({ data, onSuccess });
  };
  const role = form.watch("role");

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
      <Button onClick={() => setOpen(!open)} variant={open ? "destructive" : "secondary"}>
        {open ? "Fermer" : "Modifier l'utilisateur"}
      </Button>
      <AnimateHeight className="px-4" display={open}>
        <>
          {<MailForm email={initialData.email} id={initialData.id} />}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 ">
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
              <div className="flex flex-wrap gap-8 ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={field.value?.includes("acompleter") ? "font-bold text-destructive" : ""}>
                        Nom
                      </FormLabel>
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
                      <FormLabel className={field.value?.includes("acompleter") ? "font-bold text-destructive" : ""}>
                        Entreprise
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting || role !== "pro"}
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
                  name={`notes`}
                  render={({ field }) => (
                    <FormItem className="w-full max-w-96">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <AutosizeTextarea
                          disabled={form.formState.isSubmitting}
                          placeholder="Notes sur le client"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SelectRole display={open} />
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <CheckboxForm
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      title="Profile complet"
                      description="Indique si le profil de l'utilisateur est complet."
                    />
                  )}
                />

                <AddressForm />
                <BillingAddressForm />
              </div>
              <FormButton className="ml-auto">{action}</FormButton>
            </form>
          </Form>
        </>
      </AnimateHeight>
    </>
  );
};
