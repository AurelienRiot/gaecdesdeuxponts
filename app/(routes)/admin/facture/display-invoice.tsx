"use client";
import Invoice from "@/components/pdf/create-invoice";
import { pdfData } from "@/components/pdf/pdf-data";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayInvoice = () => {
  return (
    <PDFViewer className="h-full w-full">
      <Invoice isPaid={true} dataInvoice={pdfData} />
    </PDFViewer>
  );
};

export default DisplayInvoice;
