"use client";

import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useServerAction from "@/hooks/use-server-action";
import { cn } from "@/lib/utils";
import { Clipboard, ClipboardCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import changeEmail from "../_actions/change-email";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";

function MailForm({ email, id }: { email: string | null; id: string }) {
  const [display, setDisplay] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      toast.success("Email copié", { position: "top-center" });
      setCopied(true);
    }
  };
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (copied) {
      timeoutId = setTimeout(() => setCopied(false), 1000 * 60);
    }
    return () => clearTimeout(timeoutId); // Cleanup function
  }, [copied]);

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
      <EmailModal id={id} openModal={display} onClose={() => setDisplay(false)} />
    </div>
  );
}

export default MailForm;

function EmailModal({ id, onClose, openModal }: { id: string; onClose: () => void; openModal: boolean }) {
  const { serverAction } = useServerAction(changeEmail);
  const router = useRouter();

  async function onSumbit(formData: FormData) {
    const email = formData.get("email") as string;

    serverAction({
      data: { email, id },
      onSuccess: () => {
        router.refresh();
        onClose();
      },
    });
  }
  return (
    <Modal
      title="Changer l'email"
      description="Entrez le nouvel email ci-dessous. Cliquez sur sauvegarder une fois terminé."
      isOpen={openModal}
      onClose={onClose}
    >
      <form action={onSumbit} className="space-y-4">
        <div className="space-y-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input name="email" id="email" placeholder="exemple@email.fr" className="col-span-3" />
        </div>
        <DialogFooter>
          <LoadingButton type="submit">Mettre à jour l'email</LoadingButton>
        </DialogFooter>
      </form>
    </Modal>
  );
}

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
