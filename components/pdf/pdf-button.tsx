"use client";
import { Button } from "@/components/ui/button";
import useServerAction from "@/hooks/use-server-action";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import Spinner from "../animations/spinner";
import { useToastPromise } from "../ui/sonner";
import type { monthlyOrdersType } from "./pdf-data";
import { SendBL, createMonthlyPDF64String, createPDF64String, sendFacture, sendMonthlyInvoice } from "./server-actions";
import { useState } from "react";

function base64ToBlob(base64: string, contentType = "application/pdf", sliceSize = 512): Blob {
  const byteCharacters = Buffer.from(base64, "base64").toString("binary");
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });

  return blob;
}

export const DisplayInvoice = ({ orderId, isSend }: { orderId: string; isSend: boolean }) => {
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
};

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

export const DisplayShippingOrder = ({ orderId, isSend }: { orderId: string; isSend: boolean }) => {
  const { toastServerAction, loading: sendBLLoading } = useToastPromise({
    serverAction: SendBL,
    message: "Envoi du BL",
    errorMessage: "Envoi du BL annulé",
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
      disabled={sendBLLoading || createPDF64StringLoading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
      isSend={isSend}
    />
  );
};

function PdfButton({
  onViewFile,
  onSaveFile,
  onSendFile,
  disabled,
  isSend,
}: {
  onViewFile: () => void;
  onSaveFile: () => void;
  onSendFile: (setSend: (send: boolean) => void) => void;
  disabled?: boolean;
  isSend: boolean;
}) {
  const [send, setSend] = useState(isSend);
  return (
    <div className="flex flex-wrap gap-1">
      <Button onClick={onViewFile} type="button" disabled={disabled}>
        {disabled && <Spinner className="h-5 w-5" />}
        {"Afficher"}
      </Button>
      <Button onClick={onSaveFile} type="button" disabled={disabled}>
        {disabled && <Spinner className="h-5 w-5" />}

        {"Télecharger"}
      </Button>
      <Button onClick={() => onSendFile(setSend)} type="button" disabled={disabled}>
        {disabled && <Spinner className="h-5 w-5 mr-2" />}

        {send ? "Renvoyer par mail" : "Envoyer par mail"}
      </Button>
    </div>
  );
}
