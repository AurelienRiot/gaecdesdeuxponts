"use client";

import { useToastPromise } from "@/components/ui/sonner";
import useServerAction from "@/hooks/use-server-action";
import base64ToBlob from "@/lib/base-64-to-blob";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { createAMAPPDF64String } from "../server-actions/create-pdf64-string";
import { SendAMAP } from "../server-actions/send-amap-action";
import { PdfButton } from "./pdf-button";

export const DisplayAMAPOrder = ({ orderId, isSend }: { orderId: string; isSend: boolean }) => {
  const { toastServerAction, loading: toastLoading } = useToastPromise({
    serverAction: SendAMAP,
    message: "Envoi du contrat",
    errorMessage: "Envoi du contrat annulé",
  });
  const { serverAction, loading } = useServerAction(createAMAPPDF64String);

  async function onViewFile() {
    function onSuccess(result?: string) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
    await serverAction({ data: { orderId }, onSuccess });
  }

  async function onSaveFile() {
    function onSuccess(result?: string) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result);
      saveAs(blob, `Contrat AMAP ${orderId}.pdf`);
    }
    await serverAction({ data: { orderId }, onSuccess });
  }

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
};
