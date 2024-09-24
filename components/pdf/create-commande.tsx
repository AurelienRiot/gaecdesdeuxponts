import { Fragment } from "react";

import { StyleSheet, View } from "@react-pdf/renderer";
import Details from "./details";
import MainDocument, { borderColor, tableRowsCount } from "./main-document";
import type { ItemDataOrder, PDFData } from "./pdf-data";
import { InvoiceTableBlankSpace, InvoiceTableFooter, InvoiceTableHeader, InvoiceTableRow } from "./table";

// Create Document Component
const Order = ({ data }: { data: PDFData }) => {
  const items = data.order.items.sort((a, b) => a.desc.localeCompare(b.desc));
  return (
    <MainDocument
      customer={data.customer}
      title={`Bon de commande ${data.order.id}`}
      details={<Details pdfData={data} title="Bon de commande" />}
    >
      <Fragment>
        <InvoiceItemsTable items={items} />
      </Fragment>
    </MainDocument>
  );
};

export default Order;

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
