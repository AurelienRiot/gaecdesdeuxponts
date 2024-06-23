"use client";

import { AddressForm, addressSchema } from "@/components/address-form";
import {
  BillingAddressForm,
  billingAddressSchema,
} from "@/components/billing-address-form";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Button } from "@/components/ui/button";
import ButtonBackward from "@/components/ui/button-backward";
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
import type{ UserWithOrdersAndAdress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import * as z from "zod";
import { deleteUser } from "../../_components/server-action";
import { updateUser } from "../_actions/update-user";
import { Checkbox } from "@/components/ui/checkbox";

interface UserFormProps {
  initialData: UserWithOrdersAndAdress;
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
  isPro: z.boolean().default(false).optional(),
  address: addressSchema,
  billingAddress: billingAddressSchema,
});

export type UserFormValues = z.infer<typeof formSchema>;

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const title = "Modifier l'utilisateur";
  const description = "Modifier un utilisateur";
  const toastMessage = "Utilisateur mise à jour.";
  const action = "Enregistrer les modifications";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
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
    await updateUser(data, initialData.id)
      .then(() => {
        router.push(`/admin/users`);
        router.refresh();
        toast.success(toastMessage);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const isPro = form.watch("isPro");

  const onDelete = async () => {
    const deleteU = await deleteUser({ id: initialData.id });
    if (!deleteU.success) {
      toast.error(deleteU.message);
    } else {
      router.push(`/admin/users`);
      router.refresh();
      toast.success("Utilisateur supprimée");
    }
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        <Button
          disabled={form.formState.isSubmitting}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />

      <p>{initialData?.email}</p>

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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >Entreprise</FormLabel>
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
    </>
  );
};
