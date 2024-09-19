"use client";

import { IconButton } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { saveAs } from "file-saver";

function DownloadCards({ className, date }: { date: string; className?: string }) {
  const downloadChart = async () => {
    const element = document.getElementById("amap-cards");
    if (element) {
      element.classList.remove("hidden");
      const opt = {
        filename: `Commande AMAP ${date}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      try {
        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'enregistrement du PDF");
      }
      element.classList.add("hidden");
    }
  };

  return <IconButton data-html2canvas-ignore="true" Icon={Download} onClick={downloadChart} className={className} />;
}

export default DownloadCards;
