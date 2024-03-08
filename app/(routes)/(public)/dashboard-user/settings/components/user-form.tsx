"use client";

import { AdressForm, FullAdress } from "@/components/adress-form";
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
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Address, User } from "@prisma/client";
import { Trash } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as z from "zod";
import { deleteUser, updateUser } from "./server-action";

interface UserFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    address: FullAdress;
  };
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
    initialData.address
      ? {
          label: initialData.address.label || "",
          city: initialData.address.city || "",
          country: initialData.address.country || "FR",
          line1: initialData.address.line1 || "",
          line2: initialData.address.line2 || "",
          postalCode: initialData.address.postalCode || "",
          state: initialData.address.state || "",
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

  const title = "Modifier le profil";
  const toastMessage = "Profil mise à jour";
  const action = "Enregistrer les modifications";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      phone: initialData.phone,
      address: selectedAddress,
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    data.name = data.name.trim();
    data.address = selectedAddress;

    const result = await updateUser(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    router.push(`/dashboard-user`);
    router.refresh();
    toast.success(toastMessage);
  };

  const onDelete = async () => {
    const deleteU = await deleteUser();
    if (!deleteU.success) {
      toast.error(deleteU.message);
    } else {
      signOut({ callbackUrl: "/" });
      toast.success("Utilisateur supprimée");
    }
    setOpen(false);
  };

  return (
    <div>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={form.formState.isSubmitting}
      />
      <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-3xl font-bold tracking-tight"> {title} </h2>

        <Button
          disabled={form.formState.isSubmitting}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
          className="ml-3"
        >
          Supprimer le compte <Trash className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <p className="p-6  font-bold">{initialData.email}</p>

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

            <AdressForm
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </div>
          <LoadingButton
            disabled={form.formState.isSubmitting}
            className="ml-auto "
            type="submit"
          >
            {action}
          </LoadingButton>
        </form>
      </Form>
      <ButtonBackward url="/dashboard-user" className="mt-4" />
    </div>
  );
};
