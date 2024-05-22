"use client";
import Order from "@/components/pdf/create-commande";
import { data } from "@/components/pdf/data-order";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayOrder = () => {
  return (
    <PDFViewer className="h-full w-full">
      <Order data={data} />
    </PDFViewer>
  );
};

export default DisplayOrder;
