"use client";

import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useServerAction from "@/hooks/use-server-action";
import { cn } from "@/lib/utils";
import { Clipboard, ClipboardCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import changeEmail from "../_actions/change-email";

function MailForm({ email, id }: { email: string | null; id: string }) {
  const [display, setDisplay] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      toast.success("Email copié", { position: "top-center" });
      setCopied(true);
      setTimeout(() => setCopied(false), 1000 * 60);
    }
  };

  return (
    <div className="py-4 space-y-4">
      <button type="button" onClick={handleCopy} className="font-bold flex gap-2 items-center">
        {copied ? <ClipboardCheck className="size-4 text-green-500" /> : <Clipboard className="size-4 " />}
        <span>{email}</span>
      </button>
      <Button
        className={email?.includes("acompleter") ? "font-bold text-destructive" : ""}
        onClick={() => setDisplay(!display)}
      >
        Changer l'email
      </Button>
      {display && (
        <form className="flex flex-wrap gap-4" action={onSumbit}>
          <Input
            type={"email"}
            name="email"
            className="w-full sm:max-w-xs"
            placeholder="Entrez la nouvelle adresse email"
          />
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
