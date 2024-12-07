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
import { useRouter } from "next/navigation";

export function onViewSuccess(result?: { base64String: string; date: string; type: string }) {
  if (!result) {
    toast.error("Erreur");
    return;
  }
  const blob = base64ToBlob(result.base64String);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export function onSaveSuccess(invoiceId: string, result?: { base64String: string; date: string; type: string }) {
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
  const router = useRouter();
  const { serverAction, loading } = useServerAction(createInvoicePDF64StringAction);
  const onViewFile = async () => {
    await serverAction({ data: { invoiceId }, onSuccess: onViewSuccess });
  };

  const onSaveFile = async () => {
    await serverAction({ data: { invoiceId }, onSuccess: (result) => onSaveSuccess(invoiceId, result) });
  };

  const onSendFile = async (setSend: (send: boolean) => void) => {
    function onError(result?: { invoiceId: string; userId?: string; incomplete?: boolean }) {
      if (result?.incomplete) {
        router.push(`/admin/users/${result.userId}?incomplete=true`);
        toast.error("Utilisateur incomplet", { position: "top-center" });
        return;
      }
    }
    toastServerAction({ data: { invoiceId }, onSuccess: () => setSend(true), onError });
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
