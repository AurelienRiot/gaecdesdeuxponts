"use client";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Spinner from "../animations/spinner";
import type { monthlyOrdersType } from "./pdf-data";
import { createMonthlyPDF64String, createPDF64String } from "./server-actions";

function base64ToBlob(
  base64: string,
  contentType = "application/pdf",
  sliceSize = 512,
): Blob {
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
      .then((pdfString64) => {
        const blob = base64ToBlob(pdfString64);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSaveFile = async () => {
    setLoading(true);
    createPDF64String({ orderId, type: "invoice" })
      .then((pdfString64) => {
        const blob = base64ToBlob(pdfString64);
        saveAs(blob, `Facture ${orderId}.pdf`);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <PdfButton
      disabled={loading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
    />
  );
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
      .then(({ base64String }) => {
        const blob = base64ToBlob(base64String);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSaveFile = async () => {
    setLoading(true);
    createMonthlyPDF64String(ordersId)
      .then(({ base64String, date }) => {
        const blob = base64ToBlob(base64String);
        saveAs(blob, `Facture mensuelle ${date}.pdf`);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PdfButton
      disabled={loading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
    />
  );
};

export const DisplayShippingOrder = ({ orderId }: { orderId: string }) => {
  const [loading, setLoading] = useState(false);

  const onViewFile = async () => {
    setLoading(true);
    createPDF64String({ orderId, type: "shipping" })
      .then((pdfString64) => {
        const blob = base64ToBlob(pdfString64);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSaveFile = async () => {
    setLoading(true);
    createPDF64String({ orderId, type: "shipping" })
      .then((pdfString64) => {
        const blob = base64ToBlob(pdfString64);
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

  return (
    <PdfButton
      disabled={loading}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
    />
  );
};

function PdfButton({
  onViewFile,
  onSaveFile,
  disabled,
}: {
  onViewFile: () => void;
  onSaveFile: () => void;
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
    </div>
  );
}
