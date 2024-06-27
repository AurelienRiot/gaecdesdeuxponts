"use client";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { Download, ExternalLink, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Spinner from "../animations/spinner";
import type { monthlyOrdersType } from "./pdf-data";
import { SendBL, SendFacture, createMonthlyPDF64String, createPDF64String } from "./server-actions";
import { toastPromise } from "../ui/sonner";

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
  const [loading, setLoading] = useState(false);
  const onViewFile = async () => {
    setLoading(true);
    createPDF64String({ orderId, type: "invoice" })
      .then((result) => {
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        const blob = base64ToBlob(result.data);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch(() => {
        toast.error("Erreur");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSaveFile = async () => {
    setLoading(true);
    createPDF64String({ orderId, type: "invoice" })
      .then((result) => {
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        const blob = base64ToBlob(result.data);
        saveAs(blob, `Facture ${orderId}.pdf`);
      })
      .catch(() => {
        toast.error("Erreur");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSendFile = async () => {
    setLoading(true);
    toastPromise({
      serverAction: SendFacture,
      data: { orderId },
      onFinally: () => setLoading(false),
    });
  };
  return <PdfButton disabled={loading} onViewFile={onViewFile} onSaveFile={onSaveFile} onSendFile={onSendFile} />;
};

export const DisplayMonthlyInvoice = ({
  orders,
}: {
  orders: monthlyOrdersType[];
}) => {
  const [loading, setLoading] = useState(false);

  const ordersId = orders.map((order) => order.orderId);

  const onViewFile = async () => {
    setLoading(true);
    createMonthlyPDF64String(ordersId)
      .then((result) => {
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        const blob = base64ToBlob(result.data.base64String);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch(() => {
        toast.error("Erreur");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSaveFile = async () => {
    setLoading(true);
    createMonthlyPDF64String(ordersId)
      .then((resul) => {
        if (!resul.success) {
          toast.error(resul.message);
          return;
        }
        const blob = base64ToBlob(resul.data.base64String);
        saveAs(blob, `Facture mensuelle ${resul.data.date}.pdf`);
      })
      .catch(() => {
        toast.error("Erreur");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSendFile = async () => {
    toast.error("En cours de développement");
  };

  return <PdfButton disabled={loading} onViewFile={onViewFile} onSaveFile={onSaveFile} onSendFile={onSendFile} />;
};

export const DisplayShippingOrder = ({ orderId }: { orderId: string }) => {
  const [loading, setLoading] = useState(false);

  const onViewFile = async () => {
    setLoading(true);
    createPDF64String({ orderId, type: "shipping" })
      .then((result) => {
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        const blob = base64ToBlob(result.data);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch(() => {
        toast.error("Erreur");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSaveFile = async () => {
    setLoading(true);
    createPDF64String({ orderId, type: "shipping" })
      .then((result) => {
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        const blob = base64ToBlob(result.data);
        saveAs(blob, `Bon de livraison ${orderId}.pdf`);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSendFile = async () => {
    setLoading(true);
    toastPromise({
      serverAction: SendBL,
      data: { orderId },
      onFinally: () => setLoading(false),
    });
  };

  return <PdfButton disabled={loading} onViewFile={onViewFile} onSaveFile={onSaveFile} onSendFile={onSendFile} />;
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
