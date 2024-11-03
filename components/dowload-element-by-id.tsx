"use client";

import { IconButton } from "@/components/ui/button";
import html2canvas from "html2canvas"; // Import html2canvas
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function DownloadElement({ id, className }: { id: string; className?: string }) {
  const downloadElement = async () => {
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
    <IconButton
      data-html2canvas-ignore="true"
      Icon={Download}
      onClick={downloadElement}
      className={cn("size-4", className)}
    />
  );
}

export default DownloadElement;
