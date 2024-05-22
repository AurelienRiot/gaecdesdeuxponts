"use client";
import Invoice from "@/components/pdf/create-invoice";
import { data } from "@/components/pdf/data-invoice";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayInvoice = () => {
  return (
    <PDFViewer className="h-full w-full">
      <Invoice isPaid={true} dataInvoice={data} />
    </PDFViewer>
  );
};

export default DisplayInvoice;
