"use client";
import ShippingOrder from "@/components/pdf/create-shipping";
import { pdfData } from "@/components/pdf/pdf-data";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayShippingOrder = () => {
  return (
    <PDFViewer className="h-full w-full">
      <ShippingOrder pdfData={pdfData} />
    </PDFViewer>
  );
};

export default DisplayShippingOrder;
