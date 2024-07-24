"use client";

import { IconButton } from "@/components/ui/button";
import html2canvas from "html2canvas"; // Import html2canvas
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import { toast } from "sonner";

function DownloadChart({ id }: { id: string }) {
  const downloadChart = async () => {
    const chartElement = document.getElementById(id); // Get the chart element
    if (chartElement) {
      await html2canvas(chartElement)
        .then((canvas) => {
          const img = canvas.toDataURL();
          saveAs(img, `${id}.png`);
        })
        .catch(() => {
          toast.error("Erreur lors de l'enregistrement de l'image");
        });
    }
  };

  return (
    <IconButton data-html2canvas-ignore="true" Icon={Download} onClick={downloadChart} className="size-10 hidden" />
  );
}

export default DownloadChart;
