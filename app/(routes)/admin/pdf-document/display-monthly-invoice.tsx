"use client";
import MonthlyInvoice from "@/components/pdf/create-monthly-invoice";
import { monthlyPDFData } from "@/components/pdf/pdf-data";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayMonthlyInvoice = () => {
  return (
    <PDFViewer className="h-full w-full">
      <MonthlyInvoice isPaid={true} data={monthlyPDFData} />
    </PDFViewer>
  );
};

export default DisplayMonthlyInvoice;
