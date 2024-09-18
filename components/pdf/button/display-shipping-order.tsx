"use client";

import { useToastPromise } from "@/components/ui/sonner";
import useServerAction from "@/hooks/use-server-action";
import base64ToBlob from "@/lib/base-64-to-blob";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { createPDF64String } from "../server-actions/create-pdf64-string";
import { SendBL } from "../server-actions/send-bl-action";
import { PdfButton } from "./pdf-button";

export function DisplayShippingOrder({ orderId, isSend }: { orderId: string; isSend: boolean }) {
  const { toastServerAction, loading: toastLoading } = useToastPromise({
    serverAction: SendBL,
    message: "Envoi du BL",
    errorMessage: "Envoi du BL annulé",
  });
  const { serverAction, loading } = useServerAction(createPDF64String);

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
    await serverAction({ data: { orderId, type: "shipping" }, onSuccess });
  };

  const onSaveFile = async () => {
    function onSuccess(result?: string) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result);
      saveAs(blob, `Bon de livraison ${orderId}.pdf`);
    }
    await serverAction({ data: { orderId, type: "shipping" }, onSuccess });
  };

  const onSendFile = async (setSend: (send: boolean) => void) => {
    toastServerAction({ data: { orderId }, onSuccess: () => setSend(true) });
  };

  return (
    <PdfButton
      disabled={loading || toastLoading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
      isSend={isSend}
    />
  );
}
