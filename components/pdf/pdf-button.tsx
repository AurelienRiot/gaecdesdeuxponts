"use client";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { Download, ExternalLink, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Spinner from "../animations/spinner";
import { toastPromise, useToastPromise } from "../ui/sonner";
import type { monthlyOrdersType } from "./pdf-data";
import { SendBL, createMonthlyPDF64String, createPDF64String, sendFacture } from "./server-actions";
import useServerAction from "@/hooks/use-server-action";

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

export const DisplayInvoice = ({ orderId }: { orderId: string }) => {
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

  const onSendFile = async () => {
    toastServerAction({ data: { orderId } });
  };
  return (
    <PdfButton
      disabled={sendFactureLoading || createPDF64StringLoading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
    />
  );
};

export const DisplayMonthlyInvoice = ({
  orders,
}: {
  orders: monthlyOrdersType[];
}) => {
  const { serverAction, loading: createMonthlyPDF64StringLoading } = useServerAction(createMonthlyPDF64String);

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

  const onSendFile = async () => {
    toast.error("En cours de développement");
  };

  return (
    <PdfButton
      disabled={createMonthlyPDF64StringLoading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
    />
  );
};

export const DisplayShippingOrder = ({ orderId }: { orderId: string }) => {
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

  const onSendFile = async () => {
    toastServerAction({ data: { orderId } });
  };

  return (
    <PdfButton
      disabled={sendBLLoading || createPDF64StringLoading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
    />
  );
};

function PdfButton({
  onViewFile,
  onSaveFile,
  onSendFile,
  disabled,
}: {
  onViewFile: () => void;
  onSaveFile: () => void;
  onSendFile: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-row gap-1">
      <Button
        variant={"expandIcon"}
        Icon={ExternalLink}
        iconPlacement="right"
        onClick={onViewFile}
        type="button"
        disabled={disabled}
      >
        {disabled && <Spinner className="h-5 w-5" />}
        {"Afficher"}
      </Button>
      <Button
        variant={"expandIcon"}
        Icon={Download}
        iconPlacement="right"
        onClick={onSaveFile}
        type="button"
        disabled={disabled}
      >
        {disabled && <Spinner className="h-5 w-5" />}

        {"Télecharger"}
      </Button>
      <Button
        variant={"expandIcon"}
        Icon={Send}
        iconPlacement="right"
        onClick={onSendFile}
        type="button"
        disabled={disabled}
      >
        {disabled && <Spinner className="h-5 w-5" />}

        {"Envoyer par mail"}
      </Button>
    </div>
  );
}
