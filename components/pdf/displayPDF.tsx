"use client";
import Invoice from "@/components/pdf/create-invoice";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, ExternalLink } from "lucide-react";
import { DataInvoiceType } from "./data-invoice";

const DisplayPDF = ({ data }: { data: DataInvoiceType }) => {
  return (
    <div className="flex flex-row gap-1">
      <Button variant={"expandIcon"} Icon={ExternalLink} iconPlacement="right">
        <PDFDownloadLink
          document={<Invoice dataInvoice={data} />}
          fileName={`facture-${data.order.id}.pdf`}
          download={false}
          target="_blank"
        >
          {({ blob, url, loading, error }) => "Afficher"}
        </PDFDownloadLink>
      </Button>

      <Button variant={"expandIcon"} Icon={Download} iconPlacement="right">
        <PDFDownloadLink
          document={<Invoice dataInvoice={data} />}
          fileName={`facture-${data.order.id}.pdf`}
          download
        >
          {({ blob, url, loading, error }) => "Télecharger"}
        </PDFDownloadLink>
      </Button>
    </div>
  );
};

export default DisplayPDF;
