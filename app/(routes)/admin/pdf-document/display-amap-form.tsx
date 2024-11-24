"use client";
import AmapPDFForm from "@/components/pdf/formulaire-amap";
import { AMAPData } from "@/components/pdf/pdf-data";
import { PDFViewer } from "@react-pdf/renderer";

const DisplayFormAMAP = () => {
  return (
    <PDFViewer className="h-full w-full ">
      <AmapPDFForm data={AMAPData} />
    </PDFViewer>
  );
};

export default DisplayFormAMAP;
