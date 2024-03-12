"use client";
import Invoice from "@/components/pdf/create-invoice";
import { data } from "@/components/pdf/data-invoice";
import { PDFViewer } from "@react-pdf/renderer";

const Test = () => {
  return (
    <PDFViewer className="h-full w-full">
      <Invoice dataInvoice={data} />
    </PDFViewer>
  );
};

export default Test;
