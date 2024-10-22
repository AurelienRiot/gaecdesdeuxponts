"use client";

import { AddressForm } from "@/components/address-form";
import { BillingAddressForm } from "@/components/billing-address-form";
import CheckboxForm from "@/components/chekbox-form";
import InputImageModal from "@/components/images-upload/image-modal";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import ButtonBackward from "@/components/ui/button-backward";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import useServerAction from "@/hooks/use-server-action";
import { createId } from "@/lib/id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import createUser from "../_actions/create-user";
import SelectRole from "./select-role";
import { schema, type UserFormValues } from "./user-schema";
import CcInvoiceForm from "./cc-invoice-form";
import UserLinks from "./user-links";

export const CreateUserForm = () => {
  const { serverAction } = useServerAction(createUser);
  const router = useRouter();

  const title = "Créer l'utilisateur";
  const description = "Créer un utilisateur";
  const action = "Créer l'utilisateur";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: createId("user"),
      name: "",
      email: "",
      company: "",
      raisonSocial: "",
      completed: true,
      phone: "",
      role: "pro",
      ccInvoice: [],
      links: [],
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

  const role = form.watch("role");

  const onSubmit = async (data: UserFormValues) => {
    data.name = data.name.trim();
    console.log(data);
    function onSuccess() {
      router.back();
      router.refresh();
    }
    await serverAction({ data, onSuccess });
  };
  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="mb-8 flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title={title} description={description} />
        </div>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))} className="w-full space-y-8">
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
            <SelectRole display />
            <div className="flex flex-wrap gap-8 ">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled={form.formState.isSubmitting} placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === "pro" && (
                <>
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entreprise</FormLabel>
                        <FormControl>
                          <Input
                            disabled={form.formState.isSubmitting || role !== "pro"}
                            placeholder="Entreprise"
                            {...field}
                          />
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
                          <Input
                            disabled={form.formState.isSubmitting || role !== "pro"}
                            placeholder="Raison sociale"
                            {...field}
                          />
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
                name="completed"
                render={({ field }) => (
                  <CheckboxForm
                    ref={field.ref}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                    title="Profile complet"
                    description="Indique si le profile de l'utilisateur est complet."
                  />
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
              <UserLinks />
              <CcInvoiceForm />
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
