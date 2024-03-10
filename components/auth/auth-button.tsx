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
        <LogIn className="h-6 w-6 transition-all duration-300 " />{" "}
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
      <svg
        className="h-12 w-12 rounded-sm border-2 border-[#4285F4] bg-white  p-2 hover:border-[#4285F4]/90"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 533.5 544.3"
      >
        <path
          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
          fill="#4285f4"
        />
        <path
          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
          fill="#34a853"
        />
        <path
          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
          fill="#fbbc04"
        />
        <path
          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
          fill="#ea4335"
        />
      </svg>
      <span className="mr-4 self-center font-medium text-white sm:text-lg">
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
