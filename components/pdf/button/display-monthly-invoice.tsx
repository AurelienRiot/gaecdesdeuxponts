"use client";

import { useToastPromise } from "@/components/ui/sonner";
import useServerAction from "@/hooks/use-server-action";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import type { monthlyOrdersType } from "../pdf-data";
import { createMonthlyPDF64String } from "../server-actions/create-pdf64-string";
import base64ToBlob from "@/lib/base-64-to-blob";

import { sendMonthlyInvoice } from "../server-actions/send-montly-invoice-action";
import { PdfButton } from "./pdf-button";

export const DisplayMonthlyInvoice = ({
  orders,
  isSend,
}: {
  orders: monthlyOrdersType[];
  isSend: boolean;
}) => {
  const { serverAction, loading: createMonthlyPDF64StringLoading } = useServerAction(createMonthlyPDF64String);
  const { toastServerAction, loading: sendFactureLoading } = useToastPromise({
    serverAction: sendMonthlyInvoice,
    message: "Envoi de la facture mensuelle",
    errorMessage: "Envoi de la facture mensuelle annulé",
  });

  const orderIds = orders.map((order) => order.orderId);

  const onViewFile = async () => {
    function onSuccess(result?: { base64String: string; date: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
    await serverAction({ data: { orderIds }, onSuccess });
  };

  const onSaveFile = async () => {
    function onSuccess(result?: { base64String: string; date: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      saveAs(blob, `Facture mensuelle ${result.date}.pdf`);
    }
    await serverAction({ data: { orderIds }, onSuccess });
  };

  const onSendFile = async (setSend: (send: boolean) => void) => {
    toastServerAction({ data: { orderIds }, onSuccess: () => setSend(true) });
  };

  return (
    <PdfButton
      disabled={createMonthlyPDF64StringLoading || sendFactureLoading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
      isSend={isSend}
    />
  );
};
