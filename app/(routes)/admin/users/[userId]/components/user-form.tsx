"use client";

import { AddressForm, FullAdress } from "@/components/address-form";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Button, LoadingButton } from "@/components/ui/button";
import ButtonBackward from "@/components/ui/button-backward";
import {
  Form,
  FormControl,
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
import { Address, Order, User } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as z from "zod";
import { deleteUser } from "../../components/server-action";
import { updateUser } from "./server-action";

interface UserFormProps {
  initialData: User & { address: Address[]; orders: Order[] };
}

const formSchema = z.object({
  name: z.string().min(1),
  phone: z.string().refine(
    (value) => {
      return value === "" || isValidPhoneNumber(value);
    },
    {
      message: "Le numéro de téléphone n'est pas valide",
    },
  ),
  address: z.object({
    label: z.string(),
    city: z.string(),
    country: z.string(),
    line1: z.string(),
    line2: z.string(),
    postalCode: z.string(),
    state: z.string(),
  }),
});

export type UserFormValues = z.infer<typeof formSchema>;

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<FullAdress>(
    initialData.address[0]
      ? {
          label: initialData.address[0].label || "",
          city: initialData.address[0].city || "",
          country: initialData.address[0].country || "FR",
          line1: initialData.address[0].line1 || "",
          line2: initialData.address[0].line2 || "",
          postalCode: initialData.address[0].postalCode || "",
          state: initialData.address[0].state || "",
        }
      : {
          label: "",
          city: "",
          country: "FR",
          line1: "",
          line2: "",
          postalCode: "",
          state: "",
        },
  );

  const title = "Modifier l'utilisateur";
  const description = "Modifier un utilisateur";
  const toastMessage = "Utilisateur mise à jour.";
  const action = "Enregistrer les modifications";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
      phone: initialData.phone || "",
      address: selectedAddress,
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    data.name = data.name.trim();
    data.address = selectedAddress;

    const result = await updateUser(data, initialData.id);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    router.push(`/admin/users`);
    router.refresh();
    toast.success(toastMessage);
  };

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
        {initialData && (
          <Button
            disabled={form.formState.isSubmitting}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
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
            <AddressForm
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </div>
          <LoadingButton
            disabled={form.formState.isSubmitting}
            className="ml-auto"
            type="submit"
          >
            {action}
          </LoadingButton>
        </form>
      </Form>
      <ButtonBackward />
    </>
  );
};
