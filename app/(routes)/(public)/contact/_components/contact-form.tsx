"use client";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import {
  Form,
  FormButton,
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
import { toastPromise } from "@/components/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as z from "zod";
import { createContact } from "../_actions/create-contact";
import { formSchema } from "./shema";

const formSchemaWithPhone = formSchema.extend({
  phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        return !value || isValidPhoneNumber(value);
      },
      {
        message: "Le numéro de téléphone n'est pas valide",
      },
    ),
});

export type ContactFormValues = z.infer<typeof formSchemaWithPhone>;

export const ContactForm = ({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}): React.ReactNode => {
  const router = useRouter();
  const action = "Envoyer";
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      email: email || "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    toastPromise({
      serverAction: createContact,
      data,
      setLoading,
      onSuccess: () => router.push("/"),
    });

    // const abortController = new AbortController();
    // const { signal } = abortController;
    // const promise = async () => {
    //   try {
    //     await addDelay(2100, signal);

    //     await createContact(data);
    //   } catch (e) {
    //     const error = e as Error;
    //     if (error?.name === "AbortError") {
    //       throw new Error("Envoie du message annulé");
    //     }
    //     throw e; // Rethrow other errors
    //   }

    //   return signal;
    // };
    // toast.promise(promise, {
    //   position: "top-center",
    //   loading: (
    //     <div className="flex w-full items-center justify-between">
    //       <span className="align-middle">
    //         <Loader2 className="my-auto mr-2 inline size-4 animate-spin" />{" "}
    //         {"Envoie du message"}{" "}
    //       </span>
    //       <Button
    //         size={"xs"}
    //         className="animate-[hide-element_2s_forwards] text-xs"
    //         onClick={() => {
    //           console.log("Cancel!");
    //           abortController.abort();
    //         }}
    //       >
    //         Annuler
    //       </Button>
    //     </div>
    //   ),
    //   success: (data) => {
    //     return `Message envoyé`;
    //   },
    //   error: (e) => {
    //     const error = e as Error;
    //     return error?.message || "Message non envoyé";
    //   },
    //   finally: () => {
    //     setLoading(false);
    //   },
    // });
  };

  return (
    <>
      <div className="mt-8 flex  items-center justify-between">
        <Heading
          title="Formulaire de Contact"
          description="Demande d'information"
        />
      </div>
      <Separator className="my-2" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom/Prénom ou nom d'entreprise"}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="Nom"
                      {...field}
                      autoComplete="name"
                    />
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
                    <div className="flex items-start gap-x-4">
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="exemple@mail.com"
                        {...field}
                        autoComplete="email"
                      />
                    </div>
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
                  <FormLabel>{"Numéro de téléphone (facultatif)"}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Entrer un numéro de téléphone"
                      defaultCountry="FR"
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
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <div className="flex items-start gap-x-4">
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Renseignement"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <div className="flex items-start gap-x-4">
                      <AutosizeTextarea
                        {...field}
                        placeholder="..."
                        disabled={form.formState.isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormButton disabled={loading}>{action}</FormButton>
        </form>
      </Form>
    </>
  );
};
