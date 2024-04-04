"use client";
import Invoice from "@/components/pdf/create-invoice";
import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import { Download, ExternalLink } from "lucide-react";
import { DataInvoiceType } from "./data-invoice";
import { saveAs } from "file-saver";

const DisplayPDF = ({
  data,
  isPaid,
}: {
  data: DataInvoiceType;
  isPaid: boolean;
}) => {
  const saveFile = () => {
    pdf(<Invoice isPaid={isPaid} dataInvoice={data} />)
      .toBlob()
      .then((blob) => saveAs(blob, `facture-${data.order.id}.pdf`));
  };

  const viewFile = () => {
    pdf(<Invoice isPaid={isPaid} dataInvoice={data} />)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
      });
  };
  return (
    <div className="flex flex-row gap-1">
      <Button
        variant={"expandIcon"}
        Icon={ExternalLink}
        iconPlacement="right"
        onClick={viewFile}
      >
        {"Afficher"}
      </Button>
      <Button
        variant={"expandIcon"}
        Icon={Download}
        iconPlacement="right"
        onClick={saveFile}
      >
        {"Télecharger"}
      </Button>
    </div>
  );
};

export default DisplayPDF;
