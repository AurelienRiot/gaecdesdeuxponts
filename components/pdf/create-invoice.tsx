import { Fragment } from "react";

import { StyleSheet, View } from "@react-pdf/renderer";
import Details from "./details";
import MainDocument, { borderColor, tableRowsCount } from "./main-document";
import PaidWatermark from "./paid-watermark";
import type { InvoicePDFDate, ItemDataOrder } from "./pdf-data";
import { InvoiceTableBlankSpace, InvoiceTableFooter, InvoiceTableHeader, InvoiceTableRow } from "./table";

// Create Document Component
const Invoice = ({
  dataInvoice,
  isPaid,
}: {
  isPaid: boolean;
  dataInvoice: InvoicePDFDate;
}) => (
  <MainDocument
    customer={dataInvoice.customer}
    title={`Facture ${dataInvoice.order.id}`}
    details={<Details pdfData={dataInvoice} title="Facture" />}
  >
    <Fragment>
      <InvoiceItemsTable items={dataInvoice.order.items} />
      {isPaid && <PaidWatermark />}
    </Fragment>
  </MainDocument>
);

export default Invoice;

const itemsTableStyles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: borderColor,
  },
});

const InvoiceItemsTable = ({ items }: { items: ItemDataOrder[] }) => {
  const totalHT = items
    .map((item) => (item.qty * item.priceTTC) / item.tax)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const totalTTC = items
    .map((item) => item.qty * item.priceTTC)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={itemsTableStyles.tableContainer}>
      <InvoiceTableHeader />
      <InvoiceTableRow items={items} />
      <InvoiceTableBlankSpace rowsCount={tableRowsCount - items.length} />
      <InvoiceTableFooter totalHT={totalHT} totalTTC={totalTTC} />
    </View>
  );
};
