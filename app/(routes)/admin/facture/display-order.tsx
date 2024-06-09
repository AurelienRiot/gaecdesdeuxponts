"use client";
import Order from "@/components/pdf/create-commande";
import { pdfData } from "@/components/pdf/pdf-data";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayOrder = () => {
  return (
    <PDFViewer className="h-full w-full">
      <Order data={pdfData} />
    </PDFViewer>
  );
};

export default DisplayOrder;
