"use client";

import { useToastPromise } from "@/components/ui/sonner";
import useServerAction from "@/hooks/use-server-action";
import base64ToBlob from "@/lib/base-64-to-blob";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { createInvoicePDF64StringAction } from "../server-actions/pdf64-string-actions";

import { cn } from "@/lib/utils";
import { sendInvoiceAction } from "../server-actions/create-send-invoice-action";
import { PdfButton } from "./pdf-button";

export function DisplayInvoice({
  invoiceId,
  isSend,
  onSendClassName,
  onSaveClassName,
  onViewClassName,
  disabled,
}: {
  invoiceId: string;
  isSend: boolean;
  onSendClassName?: string;
  onSaveClassName?: string;
  onViewClassName?: string;
  disabled?: boolean;
}) {
  const { toastServerAction, loading: toastLoading } = useToastPromise({
    serverAction: sendInvoiceAction,
    message: "Envoi de la facture",
    errorMessage: "Envoi de la facture annulé",
  });
  const { serverAction, loading } = useServerAction(createInvoicePDF64StringAction);
  const onViewFile = async () => {
    function onSuccess(result?: { base64String: string; date: string; type: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
    await serverAction({ data: { invoiceId }, onSuccess });
  };

  const onSaveFile = async () => {
    function onSuccess(result?: { base64String: string; date: string; type: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      const fileName =
        result.type === "monthly"
          ? `Facture Mensuelle ${result.date} - Laiterie du Pont Robert.pdf`
          : `Facture ${invoiceId} - Laiterie du Pont Robert.pdf`;
      saveAs(blob, fileName);
    }
    await serverAction({ data: { invoiceId }, onSuccess });
  };

  const onSendFile = async (setSend: (send: boolean) => void) => {
    toastServerAction({ data: { invoiceId }, onSuccess: () => setSend(true) });
  };
  return (
    <PdfButton
      disabled={loading || toastLoading || disabled}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
      isSend={isSend}
      onSendClassName={cn("hidden", onSendClassName)}
      onSaveClassName={cn("inline-flex", onSaveClassName)}
      onViewClassName={cn("inline-flex", onViewClassName)}
    />
  );
}
