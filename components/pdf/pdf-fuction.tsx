import type { AMAPOrderWithItemsAndUser, FullInvoice, FullOrderWithInvoicePayment } from "@/types";
import { renderToBuffer } from "@react-pdf/renderer";
import AmapPDF from "./create-amap";
import Invoice from "./create-invoice";
import MonthlyInvoice from "./create-monthly-invoice";
import ShippingOrder from "./create-shipping";
import AmapPDFForm from "./formulaire-amap";
import {
  createAMAPData,
  createInvoicePDFData,
  createMonthlyInvoicePDFData,
  createPDFData,
  type AMAPType,
} from "./pdf-data";

async function generatePdfSring64({
  data,
  type,
}:
  | {
      data: FullOrderWithInvoicePayment;
      type: "shipping";
    }
  | { data: FullInvoice; type: "single" | "monthly" }
  | { data: AMAPOrderWithItemsAndUser; type: "amap" }
  | { data: AMAPType; type: "formulaire" }): Promise<string> {
  let buffer: Buffer;
  switch (type) {
    case "single":
      buffer = await renderToBuffer(<Invoice dataInvoice={createInvoicePDFData(data)} isPaid={!!data.dateOfPayment} />);
      break;
    case "shipping":
      buffer = await renderToBuffer(<ShippingOrder pdfData={createPDFData(data)} />);
      break;
    case "monthly": {
      buffer = await renderToBuffer(
        <MonthlyInvoice data={createMonthlyInvoicePDFData(data)} isPaid={!!data.dateOfPayment} />,
      );
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
