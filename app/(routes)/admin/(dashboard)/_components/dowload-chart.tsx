"use client";

import { IconButton } from "@/components/ui/button";
import html2canvas from "html2canvas"; // Import html2canvas
import { Download } from "lucide-react";

function DownloadChart({ id }: { id: string }) {
  const downloadChart = async () => {
    const chartElement = document.getElementById(id); // Get the chart element
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${id}.png`;
      link.click();
    }
  };

  return (
    <IconButton data-html2canvas-ignore="true" Icon={Download} onClick={downloadChart} className="size-10 hidden" />
  );
}

export default DownloadChart;
