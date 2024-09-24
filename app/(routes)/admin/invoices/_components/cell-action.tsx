"use client";

import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import { AlertModal } from "@/components/ui/alert-modal-form";
import useServerAction from "@/hooks/use-server-action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import deleteInvoice from "../_actions/delete-invoice";
import type { InvoiceColumn } from "./columns";
import { useConfirm } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Send, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useToastPromise } from "@/components/ui/sonner";
import { sendInvoiceAction } from "@/components/pdf/server-actions/create-send-invoice-action";
import validateInvoice from "../_actions/validate-invoice";
import { MdPaid } from "react-icons/md";

interface CellActionProps {
  data: InvoiceColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { serverAction, loading } = useServerAction(deleteInvoice);
  const { serverAction: validateInvoiceAction, loading: validateLoading } = useServerAction(validateInvoice);
  const { toastServerAction, loading: toastLoading } = useToastPromise({
    serverAction: sendInvoiceAction,
    message: "Facture envoyée",
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

  function onSendEmail() {
    toastServerAction({ data: { invoiceId: data.id }, onSuccess: () => router.refresh() });
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
          <DropdownMenuItem disabled={loading || toastLoading} onClick={onSendEmail}>
            <Send className="mr-2 h-4 w-4" />
            Envoyer par mail
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
