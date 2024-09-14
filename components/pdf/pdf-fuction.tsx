import type { AMAPOrderWithItemsAndUser, FullOrder } from "@/types";
import { renderToBuffer } from "@react-pdf/renderer";
import AmapPDF from "./create-amap";
import Invoice from "./create-invoice";
import MonthlyInvoice from "./create-monthly-invoice";
import ShippingOrder from "./create-shipping";
import AmapPDFForm from "./formulaire-amap";
import { createAMAPData, createMonthlyPDFData, createPDFData, type AMAPType } from "./pdf-data";

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

export { generatePdfSring64 };
