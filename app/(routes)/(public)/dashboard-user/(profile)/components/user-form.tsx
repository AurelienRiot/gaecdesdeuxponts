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
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import * as z from "zod";
import { deleteUser, updateUser } from "./server-action";
import {
  ICONS,
  Tab,
  moveSelectedTabToTop,
  useTabsContext,
} from "./tabs-animate";

interface UserFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    adress: FullAdress;
  };
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom est obligatoire",
  }),
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

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

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

  const title = "Modifier le profil";
  const toastMessage = "Profil mise à jour";
  const action = "Enregistrer les modifications";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      phone: initialData.phone,
      adress: selectedAddress,
    },
  });

  const { setTabs, setHovering } = useTabsContext();

  const onSubmit = async (data: UserFormValues) => {
    data.name = data.name.trim();
    data.adress = selectedAddress;

    const result = await updateUser(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    redirectTab({ tab: "user", router, searchParams, setTabs });

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
      />
      <div className=" flex flex-col items-center justify-between gap-4 md:flex-row">
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
            />
          </div>
          <LoadingButton
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            disabled={form.formState.isSubmitting}
            className="ml-auto "
            type="submit"
          >
            {action}
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

const redirectTab = ({
  tab: tabName,
  setTabs,
  router,
  searchParams,
}: {
  tab: keyof typeof ICONS;
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  router: AppRouterInstance;
  searchParams: URLSearchParams;
}) => {
  if (searchParams.get("tab") === tabName) {
    setTabs((tabs) => moveSelectedTabToTop(tabName, tabs));
    router.refresh();
  } else {
    router.push(`/dashboard-user?tab=${tabName}`);
  }
};
