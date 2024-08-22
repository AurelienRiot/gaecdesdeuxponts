"use client";
import AmapPDFForm from "@/components/pdf/formulaire-amap";
import { AMAPData } from "@/components/pdf/pdf-data";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayOrder = () => {
  return (
    <PDFViewer className="h-full w-full ">
      <AmapPDFForm data={AMAPData} />
    </PDFViewer>
  );
};

export default DisplayOrder;
