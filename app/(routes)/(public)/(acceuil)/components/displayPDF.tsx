"use client";
import Invoice from "@/components/pdf/create-facture";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ExternalLink } from "lucide-react";

const DisplayPDF = () => {
  return (
    <Button
      asChild
      variant={"expandIcon"}
      Icon={ExternalLink}
      iconPlacement="right"
    >
      <PDFDownloadLink
        document={<Invoice />}
        fileName={"facture.pdf"}
        download={false}
        target="_blank"
        className="cursor-pointer"
      >
        Afficher la facture
      </PDFDownloadLink>
    </Button>
  );
};

export default DisplayPDF;
