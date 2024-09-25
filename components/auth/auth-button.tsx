"use client";
import { Button, LoadingButton } from "@/components/ui/button";
import { addDelay, cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../animations/spinner";
import { Icons } from "../icons";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { optSchema } from "../zod-schema";
import useServerAction from "@/hooks/use-server-action";
import validateOTP from "./validate-otp";
import { useRouter } from "next/navigation";

export const LoginButton = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Button
      className={cn("bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground", props.className)}
      title="Se connecter"
      asChild
    >
      <Link href={"/login"} {...props}>
        {" "}
        <LogIn className="h-6 w-6 transition-all" />{" "}
      </Link>
    </Button>
  );
};

export const LogoutButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button title="Se deconnecter" onClick={() => signOut({ callbackUrl: "/" })} {...props}>
      <LogOut className="h-6 w-6" />
    </Button>
  );
};
export const LogoutButtonText = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button title="Se deconnecter" variant={"destructive"} onClick={() => signOut({ callbackUrl: "/" })} {...props}>
      Déconnexion
    </Button>
  );
};

export const GoogleButton = ({ callbackUrl }: { callbackUrl: string }) => {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        setLoading(true);
        await signIn("google", {
          callbackUrl,
        });
        setLoading(false);
      }}
      className="relative mx-auto flex w-[306px] items-center justify-between gap-4 rounded-sm bg-[#4285F4] shadow-xl duration-200 ease-linear hover:bg-[#4285F4]/90 active:scale-95"
    >
      <Icons.google />
      <span className="mx-auto self-center font-medium text-white sm:text-lg">
        {loading ? (
          <Spinner size={40} className="absolute left-[135px] top-1 font-sans text-white" />
        ) : (
          "Se connecter avec Google"
        )}
      </span>
    </button>
  );
};

const formSchema = z.object({
  email: z
    .string({ required_error: "Veuillez entrer votre email" })
    .email({ message: "L'email n'est pas un email valide" })
    .min(1, { message: "Veuillez entrer votre email" })
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
    await signIn("email", {
      email: data.email.trim().toLowerCase(),
      redirect: false,
      callbackUrl,
    })
      .then((res) => {
        if (res?.error) {
          toast.error("Erreur veuillez réessayer", { position: "top-center" });
        } else {
          toast.success("Vérifiez votre boite mail", { position: "top-center" });
          setSuccess(true);
        }
      })
      .catch(() => {
        toast.error("Erreur veuillez réessayer", { position: "top-center" });
      });
  };
  const email = form.watch("email");
  return (
    <>
      {!success && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-1.5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md">
                      Entrer votre email pour recevoir le code unique et vous connecter
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoCapitalize="off"
                        disabled={form.formState.isSubmitting}
                        autoComplete="email"
                        placeholder="exemple@email.com"
                        {...field}
                      />
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
              {"   Recevoir le code  "}
            </LoadingButton>
          </form>
        </Form>
      )}

      <motion.div initial={{ scale: 0 }} animate={success ? { scale: 1 } : { scale: 0 }} transition={{ duration: 0.3 }}>
        <OPTForm email={email} />
      </motion.div>
    </>
  );
};

function OPTForm({ email }: { email: string }) {
  const router = useRouter();
  const { serverAction } = useServerAction(validateOTP);
  const form = useForm<z.infer<typeof optSchema>>({
    resolver: zodResolver(optSchema),
    defaultValues: {
      otp: "",
      email,
    },
  });

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);
  async function onSubmit(data: z.infer<typeof optSchema>) {
    function onSuccess(url?: string) {
      if (!url) {
        toast.error("Erreur, veuillez reessayer");
        router.refresh();
        return;
      }
      router.push(url);
      router.refresh();
    }
    function onError(errorData?: string) {
      if (errorData) router.refresh();
    }
    await serverAction({ data, onSuccess, onError });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="text-center mx-auto space-y-4">
              <FormLabel className="text-2xl">Code de vérification</FormLabel>
              <FormControl>
                <InputOTP
                  disabled={form.formState.isSubmitting}
                  maxLength={6}
                  onComplete={form.handleSubmit(onSubmit)}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>Entrer le code unique envoyé par mail</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton disabled={form.formState.isSubmitting} type="submit" className="w-full">
          Valider
        </LoadingButton>
      </form>
    </Form>
  );
}
