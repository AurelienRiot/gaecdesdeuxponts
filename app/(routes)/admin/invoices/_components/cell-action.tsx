"use client";

import { sendInvoiceAction } from "@/components/pdf/server-actions/create-send-invoice-action";
import { BsSendPlus, MdPaid } from "@/components/react-icons";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToastPromise } from "@/components/ui/sonner";
import useServerAction from "@/hooks/use-server-action";
import { Copy, MoreHorizontal, Send, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import deleteInvoice from "../_actions/delete-invoice";
import validateInvoice from "../_actions/validate-invoice";
import type { InvoiceColumn } from "./columns";

interface CellActionProps {
  data: InvoiceColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { serverAction, loading } = useServerAction(deleteInvoice);
  const { serverAction: validateInvoiceAction, loading: validateLoading } = useServerAction(validateInvoice);
  const { toastServerAction: invoiceToast, loading: invoiceToastLoading } = useToastPromise({
    serverAction: sendInvoiceAction,
    message: "Envoie de la facture",
    errorMessage: "Erreur lors de l'envoi de la facture",
  });

  const confirm = useConfirm();

  const onDelete = async () => {
    const result = await confirm({
      title: "Confirmation de la suppression de la facture",
      description: "Etes-vous sur de vouloir supprimer cette facture ?",
    });
    if (!result) {
      return;
    }

    await serverAction({
      data: { id: data.id },
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  async function onSendReminder() {
    const result = await confirm({
      title: `Confirmation de l'envoi du rappel de la facture pour ${data.name}`,
      description: "Etes-vous sur de vouloir envoyer ce rappel ?",
    });
    if (!result) {
      return;
    }

    invoiceToast({ data: { invoiceId: data.id, reminder: true }, onSuccess: () => router.refresh() });
  }

  async function onSendEmail() {
    const result = await confirm({
      title: `Confirmation de l'envoi de la facture pour ${data.name}`,
      description: "Etes-vous sur de vouloir envoyer cette facture ?",
    });
    if (!result) {
      return;
    }

    invoiceToast({ data: { invoiceId: data.id }, onSuccess: () => router.refresh() });
  }

  function onPaid() {
    validateInvoiceAction({
      data: { id: data.id, isPaid: data.status !== "Payé" },
      onSuccess: () => router.refresh(),
    });
  }

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("N° de facture copié");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0">
            <span className="sr-only w-0">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)} className="cursor-copy">
            <Copy className="mr-2 h-4 w-4" />
            Copier Id
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading || invoiceToastLoading} onClick={onSendEmail}>
            <Send className="mr-2 h-4 w-4" />
            Envoyer par mail
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading || invoiceToastLoading} onClick={onSendReminder}>
            <BsSendPlus className="mr-2 h-4 w-4" />
            Envoyer un rappel
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading || validateLoading} onClick={onPaid}>
            <MdPaid className="mr-2 h-4 w-4" />
            {data.status === "Payé" ? "Annuler le paiement" : "Valider le paiement"}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading} onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
