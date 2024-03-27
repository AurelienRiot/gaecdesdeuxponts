"use client";
import { Button, LoadingButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../animations/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Icons } from "../icons";

export const LoginButton = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
) => {
  return (
    <Button
      className={cn(
        "bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground",
        props.className,
      )}
      title="Se connecter"
      asChild
    >
      <Link href={"/login"} {...props}>
        {" "}
        <LogIn className="h-6 w-6 transition-all " />{" "}
      </Link>
    </Button>
  );
};

export const LogoutButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <Button
      title="Se deconnecter"
      onClick={() => signOut({ callbackUrl: "/" })}
      {...props}
    >
      <LogOut className="h-6 w-6" />
    </Button>
  );
};
export const LogoutButtonText = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <Button
      title="Se deconnecter"
      onClick={() => signOut({ callbackUrl: "/" })}
      {...props}
    >
      Déconnexion
    </Button>
  );
};

export const GoogleButton = ({ callbackUrl }: { callbackUrl: string }) => {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        setLoading(true);
        await signIn("google", {
          callbackUrl,
        });
        setLoading(false);
      }}
      className="relative flex w-[306px] items-center justify-between  gap-4 rounded-sm bg-[#4285F4] shadow-xl  duration-200 ease-linear  hover:bg-[#4285F4]/90 active:scale-95"
    >
      <Icons.google />
      <span className="mx-auto  self-center font-medium text-white sm:text-lg">
        {loading ? (
          <Spinner
            size={40}
            className=" absolute left-[135px] top-1   text-white"
          />
        ) : (
          "Se connecter avec Google"
        )}
      </span>
    </button>
  );
};

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "L'email doit être un email valide" })
    .min(1, { message: "L'email ne peut pas être vide" })
    .max(100, { message: "L'email ne peut pas dépasser 100 caractères" }),
});

type EmailFormValues = z.infer<typeof formSchema>;

export const EmailButton = ({ callbackUrl }: { callbackUrl: string }) => {
  const [success, setSuccess] = useState(false);
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    const authentifier = await signIn("email", {
      email: data.email.trim().toLowerCase(),
      redirect: false,
      callbackUrl,
    });
    if (authentifier?.error) {
      toast.error("Erreur veuillez réessayer");
    } else {
      toast.success("Vérifiez votre boite mail");
      setSuccess(true);
    }
  };

  return (
    <>
      {success ? null : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => onSubmit(form.getValues()))}>
            <div className="grid w-full  items-center gap-1.5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-start gap-x-4">
                        <Input
                          type="email"
                          autoCapitalize="off"
                          disabled={form.formState.isSubmitting}
                          autoComplete="email"
                          placeholder="exemple@email.com"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <LoadingButton
              type="submit"
              disabled={form.formState.isSubmitting}
              className="mt-4 w-full transition-transform duration-200 ease-linear active:scale-95"
              size="lg"
            >
              {"   Se connecter avec l'email  "}
            </LoadingButton>
          </form>
        </Form>
      )}

      <motion.div
        initial={{ scale: 0 }}
        animate={success ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-center text-xl">E-mail envoyé ! </p>
        <p className="text-center text-xl">
          Veuillez vérifier votre boîte mail.
        </p>
      </motion.div>
    </>
  );
};
