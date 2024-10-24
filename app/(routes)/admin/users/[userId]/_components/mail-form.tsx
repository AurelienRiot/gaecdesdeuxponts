"use client";

import FormLoadingButton from "@/components/form-loading-button";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import useServerAction from "@/hooks/use-server-action";
import { useQueryClient } from "@tanstack/react-query";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import changeEmail from "../_actions/change-email";
import { useOrdersQueryClient } from "../../../calendar/_components/orders-query";

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
  const { refectOrders } = useOrdersQueryClient();
  const router = useRouter();

  async function onSumbit(formData: FormData) {
    const email = formData.get("email") as string;

    serverAction({
      data: { email, id },
      onSuccess: () => {
        refectOrders();
        router.refresh();
        onClose();
      },
    });
  }

  return (
    <Modal
      title="Changer l'email"
      description="Entrez le nouvel email ci-dessous"
      className="top-[30%]"
      isOpen={openModal}
      onClose={onClose}
    >
      <form action={onSumbit} className="space-y-4">
        <div className="space-y-4">
          <Input name="email" id="email" placeholder="exemple@email.fr" className="col-span-3" />
        </div>
        <DialogFooter>
          <FormLoadingButton>Mettre à jour l'email</FormLoadingButton>
        </DialogFooter>
      </form>
    </Modal>
  );
}
