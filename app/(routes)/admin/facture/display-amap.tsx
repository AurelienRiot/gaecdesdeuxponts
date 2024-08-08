"use client";
import AmapPDF from "@/components/pdf/create-amap";
import { AMAPData } from "@/components/pdf/pdf-data";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayOrder = () => {
  return (
    <PDFViewer className="h-full w-full ">
      <AmapPDF data={AMAPData} />
    </PDFViewer>
  );
};

export default DisplayOrder;
