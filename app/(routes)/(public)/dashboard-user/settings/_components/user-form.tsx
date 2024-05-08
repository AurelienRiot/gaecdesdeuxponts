"use client";

import { AddressForm, FullAdress } from "@/components/address-form";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Button, LoadingButton } from "@/components/ui/button";
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
import { useUserContext } from "@/context/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Address } from "@prisma/client";
import { Trash } from "lucide-react";
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
    adress: FullAdress;
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
  adress: z
    .object({
      label: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      line1: z.string().optional(),
      line2: z.string().optional(),
      postalCode: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
});

export type UserFormValues = z.infer<typeof formSchema>;

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
}: UserFormProps) => {
  const [open, setOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<FullAdress>(
    initialData.adress
      ? {
          label: initialData.adress.label || "",
          city: initialData.adress.city || "",
          country: initialData.adress.country || "FR",
          line1: initialData.adress.line1 || "",
          line2: initialData.adress.line2 || "",
          postalCode: initialData.adress.postalCode || "",
          state: initialData.adress.state || "",
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

  const title = initialData.name
    ? "Modifier votre profil"
    : "Completer votre  profil";
  const toastMessage = "Profil mise à jour";
  const action = "Enregistrer les modifications";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      company: initialData.company,
      phone: initialData.phone,
      adress: selectedAddress,
    },
  });

  const router = useRouter();
  const { setUser } = useUserContext();

  const onSubmit = async (data: UserFormValues) => {
    data.name = data.name.trim();
    data.adress = selectedAddress;

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
            address: [data.adress as Address],
          }
        : null,
    );
    router.push("/dashboard-user");
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
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className=" flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-3xl font-bold "> {title} </h2>

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
      <Separator className="mt-4" />
      <p className=" py-6  text-base font-bold sm:text-lg">
        {initialData.email}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 pb-4"
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
            {initialData.role === "pro" && (
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="entreprise"
                        {...field}
                      />
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

            <AddressForm
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              className="max-w-lg sm:col-span-2"
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
    </>
  );
};
