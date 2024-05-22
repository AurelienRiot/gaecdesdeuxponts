"use client";
import ShippingOrder from "@/components/pdf/create-shipping";
import { data } from "@/components/pdf/data-shipping";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayShippingOrder = () => {
  return (
    <PDFViewer className="h-full w-full">
      <ShippingOrder dataOrder={data} />
    </PDFViewer>
  );
};

export default DisplayShippingOrder;
