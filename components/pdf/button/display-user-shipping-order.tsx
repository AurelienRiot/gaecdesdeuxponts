"use client";
import useServerAction from "@/hooks/use-server-action";
import { createShippingPDF64StringAction } from "../server-actions/user-actions";
import base64ToBlob from "@/lib/base-64-to-blob";
import { PdfButton } from "./pdf-button";
import { toast } from "sonner";
import saveAs from "file-saver";

export function DisplayUserShippingOrder({ orderId }: { orderId: string }) {
  const { serverAction, loading } = useServerAction(createShippingPDF64StringAction);

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
    await serverAction({ data: { pdfId: orderId }, onSuccess });
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
    await serverAction({ data: { pdfId: orderId }, onSuccess });
  };

  return <PdfButton onSaveClassName="inline-flex" disabled={loading} onViewFile={onViewFile} onSaveFile={onSaveFile} />;
}
