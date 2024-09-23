"use client";
import Invoice from "@/components/pdf/create-invoice";
import { invoicePDFData } from "@/components/pdf/pdf-data";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayInvoice = () => {
  return (
    <PDFViewer className="h-full w-full">
      <Invoice isPaid={true} dataInvoice={invoicePDFData} />
    </PDFViewer>
  );
};

export default DisplayInvoice;
