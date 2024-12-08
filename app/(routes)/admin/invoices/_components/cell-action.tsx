"use client";

import DeleteButton from "@/components/animations/icons/delete";
import Spinner from "@/components/animations/spinner";
import { onSaveSuccess, onViewSuccess } from "@/components/pdf/button/display-invoice";
import { sendInvoiceAction } from "@/components/pdf/server-actions/create-send-invoice-action";
import { createInvoicePDF64StringAction } from "@/components/pdf/server-actions/pdf64-string-actions";
import { BsSendPlus } from "@/components/react-icons";
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
import { BadgeEuro, Copy, Download, FileSearch, MoreHorizontal, Repeat, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import deleteInvoice from "../_actions/delete-invoice";
import validateInvoice from "../_actions/validate-invoice";
import type { InvoiceColumn } from "./columns";
import { useInvoiceModal } from "./payment-method-modal";

interface CellActionProps {
  data: InvoiceColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { setInvoiceId, setIsOpen } = useInvoiceModal();
  const { serverAction, loading } = useServerAction(deleteInvoice);
  const { serverAction: getInvoicePDF, loading: pdfLoading } = useServerAction(createInvoicePDF64StringAction);
  const { toastServerAction: validateInvoiceAction, loading: validateLoading } = useToastPromise({
    serverAction: validateInvoice,
    message: "Validation de la facture",
    errorMessage: "Erreur lors de la validation de la facture",
  });
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
    if (data.status !== "Payé") {
      setInvoiceId(data.id);
      setIsOpen(true);
    } else {
      validateInvoiceAction({
        delay: false,
        data: { id: data.id, isPaid: false, paymentMethod: null },
        // onSuccess: () => router.refresh(),
      });
    }
  }

  function changePaymentMethod() {
    setInvoiceId(data.id);
    setIsOpen(true);
  }

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("N° de facture copié");
  };

  const onViewFile = async () => {
    getInvoicePDF({ data: { invoiceId: data.id }, onSuccess: onViewSuccess });
  };

  const onSaveFile = async () => {
    getInvoicePDF({ data: { invoiceId: data.id }, onSuccess: (result) => onSaveSuccess(data.id, result) });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 relative w-8">
            <div className="absolute inset-0 -translate-x-4 -translate-y-4  py-8 px-8 "></div>
            <span className="sr-only w-0">Ouvrir le menu</span>
            {loading || validateLoading || invoiceToastLoading || pdfLoading ? (
              <Spinner className="size-4" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)} className="cursor-copy">
            <Copy className="mr-2 h-4 w-4" />
            Copier Id
          </DropdownMenuItem>
          {data.status !== "Payé" ? (
            <>
              <DropdownMenuItem disabled={loading || invoiceToastLoading} onClick={onSendEmail}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer par mail
              </DropdownMenuItem>
              <DropdownMenuItem disabled={loading || invoiceToastLoading} onClick={onSendReminder}>
                <BsSendPlus className="mr-2 h-4 w-4" />
                Envoyer un rappel
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem disabled={loading || validateLoading} onClick={onSaveFile}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger la facture
              </DropdownMenuItem>
              <DropdownMenuItem disabled={loading || validateLoading} onClick={onViewFile}>
                <FileSearch className="mr-2 h-4 w-4" />
                Afficher la facture
              </DropdownMenuItem>
              <DropdownMenuItem disabled={loading || validateLoading} onClick={changePaymentMethod}>
                <Repeat className="mr-2 h-4 w-4" />
                Changer la méthode de paiement
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem disabled={loading || validateLoading} onClick={onPaid}>
            <BadgeEuro className="mr-2 h-4 w-4" />
            {data.status === "Payé" ? "Annuler le paiement" : "Valider le paiement"}
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            asChild
            disabled={loading}
            onClick={onDelete}
            className="w-full
          "
          >
            <DeleteButton svgClassName=" size-4">Supprimer</DeleteButton>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
