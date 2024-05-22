"use client";
import MonthlyInvoice from "@/components/pdf/create-monthly-invoice";
import { data } from "@/components/pdf/data-monthly-invoice";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayMonthlyInvoice = () => {
  return (
    <PDFViewer className="h-full w-full">
      <MonthlyInvoice isPaid={true} data={data} />
    </PDFViewer>
  );
};

export default DisplayMonthlyInvoice;
