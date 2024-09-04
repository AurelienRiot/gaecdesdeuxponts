import type { AMAPOrderWithItemsAndUser, FullOrder } from "@/types";
import { renderToBuffer } from "@react-pdf/renderer";
import AmapPDF from "./create-amap";
import Invoice from "./create-invoice";
import MonthlyInvoice from "./create-monthly-invoice";
import ShippingOrder from "./create-shipping";
import { type AMAPType, createAMAPData, createMonthlyPDFData, createPDFData } from "./pdf-data";
import AmapPDFForm from "./formulaire-amap";

async function generatePdfSring64({
  data,
  type,
}:
  | {
      data: FullOrder;
      type: "invoice" | "shipping";
    }
  | { data: FullOrder[]; type: "monthly" }
  | { data: AMAPOrderWithItemsAndUser; type: "amap" }
  | { data: AMAPType; type: "formulaire" }): Promise<string> {
  let buffer: Buffer;
  switch (type) {
    case "invoice":
      buffer = await renderToBuffer(<Invoice dataInvoice={createPDFData(data)} isPaid={!!data.dateOfPayment} />);
      break;
    case "shipping":
      buffer = await renderToBuffer(<ShippingOrder pdfData={createPDFData(data)} />);
      break;
    case "monthly": {
      const isPaid = data.every((order) => !!order.dateOfPayment);
      buffer = await renderToBuffer(<MonthlyInvoice data={createMonthlyPDFData(data)} isPaid={isPaid} />);
      break;
    }
    case "amap": {
      buffer = await renderToBuffer(<AmapPDF data={createAMAPData(data, data.user)} />);
      break;
    }
    case "formulaire": {
      buffer = await renderToBuffer(<AmapPDFForm data={data} />);
      break;
    }
  }

  return buffer.toString("base64");
}

function base64ToBlob(base64: string, contentType = "application/pdf", sliceSize = 512): Blob {
  const byteCharacters = Buffer.from(base64, "base64").toString("binary");
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });

  return blob;
}

export { generatePdfSring64, base64ToBlob };
