"use client";

import { useToastPromise } from "@/components/ui/sonner";
import { SendAMAP } from "../server-actions/send-amap";
import useServerAction from "@/hooks/use-server-action";
import { createAMAPPDF64String } from "../server-actions/create-pdf64-string";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { base64ToBlob } from "../pdf-fuction";
import PdfButton from "./pdf-button";

export const DisplayAMAPOrder = ({ orderId, isSend }: { orderId: string; isSend: boolean }) => {
  const { toastServerAction, loading: sendBLLoading } = useToastPromise({
    serverAction: SendAMAP,
    message: "Envoi du contrat",
    errorMessage: "Envoi du contrat annulé",
  });
  const { serverAction, loading: createPDF64StringLoading } = useServerAction(createAMAPPDF64String);

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
    await serverAction({ data: { orderId }, onSuccess });
  };

  const onSaveFile = async () => {
    function onSuccess(result?: string) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result);
      saveAs(blob, `Contrat AMAP ${orderId}.pdf`);
    }
    await serverAction({ data: { orderId }, onSuccess });
  };

  const onSendFile = async (setSend: (send: boolean) => void) => {
    toastServerAction({ data: { orderId }, onSuccess: () => setSend(true) });
  };

  return (
    <PdfButton
      disabled={sendBLLoading || createPDF64StringLoading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
      isSend={isSend}
    />
  );
};
