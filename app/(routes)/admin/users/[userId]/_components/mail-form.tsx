"use client";

import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useServerAction from "@/hooks/use-server-action";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useState } from "react";
import { useFormStatus } from "react-dom";
import changeEmail from "../_actions/change-email";

function MailForm({ email, id }: { email: string | null; id: string }) {
  const [display, setDisplay] = useState(false);
  const { serverAction } = useServerAction(changeEmail);
  const router = useRouter();

  async function onSumbit(formData: FormData) {
    const email = formData.get("email") as string;
    serverAction({
      data: { email, id },
      onSuccess: () => {
        router.refresh();
        setDisplay(false);
      },
    });
  }
  return (
    <div className="py-4 space-y-4">
      <p className="font-bold">{email}</p>
      <Button
        className={email?.includes("acompleter") ? "font-bold text-destructive" : ""}
        onClick={() => setDisplay(!display)}
      >
        Changer l'email
      </Button>
      {display && (
        <form className="flex gap-4" action={onSumbit}>
          <Input type={"email"} name="email" className="max-w-xs" placeholder="Entrez la nouvelle adresse email" />
          <LoadingButton type="submit">Valider</LoadingButton>
        </form>
      )}
    </div>
  );
}

export default MailForm;

const LoadingButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, children, ...props }, ref) => {
    const { pending } = useFormStatus();
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || pending}
        ref={ref}
        {...props}
      >
        <>
          {pending && <Loader2 className={cn("h-4 w-4 animate-spin", children ? "mr-2" : "")} />}
          {children}
        </>
      </button>
    );
  },
);
