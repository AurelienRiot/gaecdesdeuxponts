"use client";

import { useToastPromise } from "@/components/ui/sonner";
import useServerAction from "@/hooks/use-server-action";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { createPDF64String } from "../server-actions/create-pdf64-string";
import base64ToBlob from "@/lib/base-64-to-blob";

import { sendFacture } from "../server-actions/send-facture-action";
import { PdfButton } from "./pdf-button";

export function DisplayInvoice({ orderId, isSend }: { orderId: string; isSend: boolean }) {
  const { toastServerAction, loading: sendFactureLoading } = useToastPromise({
    serverAction: sendFacture,
    message: "Envoi de la facture",
    errorMessage: "Envoi de la facture annulé",
  });
  const { serverAction, loading: createPDF64StringLoading } = useServerAction(createPDF64String);
  const onViewFile = async () => {
    function onSuccess(result?: string) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
    await serverAction({ data: { orderId, type: "invoice" }, onSuccess });
  };

  const onSaveFile = async () => {
    function onSuccess(result?: string) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result);
      saveAs(blob, `Facture ${orderId}.pdf`);
    }
    await serverAction({ data: { orderId, type: "invoice" }, onSuccess });
  };

  const onSendFile = async (setSend: (send: boolean) => void) => {
    toastServerAction({ data: { orderId }, onSuccess: () => setSend(true) });
  };
  return (
    <PdfButton
      disabled={sendFactureLoading || createPDF64StringLoading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
      isSend={isSend}
    />
  );
}
