import useServerAction from "@/hooks/use-server-action";
import { createInvoicePDF64StringAction } from "../server-actions/user-actions";
import { toast } from "sonner";
import base64ToBlob from "@/lib/base-64-to-blob";
import { saveAs } from "file-saver";
import { PdfButton } from "./pdf-button";

export function DisplayUserInvoice({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const { serverAction, loading } = useServerAction(createInvoicePDF64StringAction);
  const onViewFile = async () => {
    function onSuccess(result?: { base64String: string; date: string; type: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
    await serverAction({ data: { pdfId: invoiceId }, onSuccess });
  };

  const onSaveFile = async () => {
    function onSuccess(result?: { base64String: string; date: string; type: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      const fileName =
        result.type === "monthly"
          ? `Facture Mensuelle ${result.date} - Laiterie du Pont Robert.pdf`
          : `Facture ${invoiceId} - Laiterie du Pont Robert.pdf`;
      saveAs(blob, fileName);
    }
    await serverAction({ data: { pdfId: invoiceId }, onSuccess });
  };

  return <PdfButton disabled={loading} onViewFile={onViewFile} onSaveFile={onSaveFile} />;
}
