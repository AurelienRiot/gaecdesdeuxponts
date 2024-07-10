import { Fragment } from "react";

import { StyleSheet, Text, View } from "@react-pdf/renderer";
import Details from "./details";
import MainDocument, { borderColor, foregroundColor, mainColor, tableRowsCount } from "./main-document";
import PaidWatermark from "./paid-watermark";
import type { PDFData } from "./pdf-data";

// Create Document Component
const Invoice = ({
  dataInvoice,
  isPaid,
}: {
  isPaid: boolean;
  dataInvoice: PDFData;
}) => (
  <MainDocument
    customer={dataInvoice.customer}
    title={`Facture ${dataInvoice.order.id}`}
    details={<Details pdfData={dataInvoice} title="Facture" />}
  >
    <Fragment>
      <InvoiceItemsTable invoice={dataInvoice} />
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

const InvoiceItemsTable = ({ invoice }: { invoice: PDFData }) => (
  <View style={itemsTableStyles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow items={invoice.order.items} />
    <InvoiceTableBlankSpace rowsCount={tableRowsCount - invoice.order.items.length} />
    <InvoiceTableFooter items={invoice.order.items} />
  </View>
);

const tableHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    backgroundColor: mainColor,
    color: foregroundColor,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontWeight: "bold",
    flexGrow: 1,
  },
  description: {
    height: "100%",
    width: "40%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  unit: {
    height: "100%",
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
  },
  qty: {
    height: "100%",
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
  },
  totalHT: {
    height: "100%",
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
  },
  totalTTC: {
    height: "100%",
    width: "15%",
    paddingTop: 4,
  },
});

const InvoiceTableHeader = () => (
  <View style={tableHeaderStyles.container}>
    <Text style={tableHeaderStyles.description}>Description</Text>
    <Text style={tableHeaderStyles.unit}>Prix unitaire HT ( € )</Text>
    <Text style={tableHeaderStyles.qty}>Qte</Text>
    <Text style={tableHeaderStyles.totalHT}>Total HT ( € )</Text>
    <Text style={tableHeaderStyles.totalTTC}>Total TTC ( € )</Text>
  </View>
);

const tableRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    paddingVertical: 2,
    alignItems: "center",
    // fontStyle: "bold",
  },
  description: {
    width: "40%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
  },

  unit: {
    width: "20%",
    textAlign: "right",
    paddingRight: 8,
  },
  qty: {
    width: "10%",
    textAlign: "right",
    paddingRight: 8,
  },
  totalHT: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
  totalTTC: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const InvoiceTableRow = ({ items }: { items: PDFData["order"]["items"] }) => {
  const rows = items.map((item, i) => (
    <View style={tableRowStyles.row} key={i}>
      <Text style={tableRowStyles.description}>{item.desc}</Text>
      <Text style={tableRowStyles.unit}>{(item.priceTTC / 1.055).toFixed(2)}</Text>
      <Text style={tableRowStyles.qty}>{item.qty}</Text>
      <Text style={tableRowStyles.totalHT}>{((item.priceTTC / 1.055) * item.qty).toFixed(2)}</Text>

      <Text style={tableRowStyles.totalTTC}>{(item.priceTTC * item.qty).toFixed(2)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

const tableBlankSpaceStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    // fontStyle: "bold",
    color: "white",
  },
  description: {
    width: "60%",
  },
  qty: {
    width: "10%",
  },
  rate: {
    width: "15%",
  },
  amount: {
    width: "15%",
  },
});

const InvoiceTableBlankSpace = ({ rowsCount }: { rowsCount: number }) => {
  const blankRows = rowsCount > 0 ? Array(rowsCount).fill(0) : [];
  const rows = blankRows.map((x, i) => (
    <View style={tableBlankSpaceStyles.row} key={`BR${i}`}>
      <Text style={tableBlankSpaceStyles.description}>-</Text>
      <Text style={tableBlankSpaceStyles.qty}>-</Text>
      <Text style={tableBlankSpaceStyles.rate}>-</Text>
      <Text style={tableBlankSpaceStyles.amount}>-</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

const tableFooterStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    fontSize: 12,
    // fontStyle: "bold",
  },
  description: {
    width: "85%",
    textAlign: "right",
    paddingRight: 8,
  },
  total: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const InvoiceTableFooter = ({
  items,
}: {
  items: PDFData["order"]["items"];
}) => {
  const totalHT = items
    .map((item) => (item.qty * item.priceTTC) / 1.055)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const totalTTC = items
    .map((item) => item.qty * item.priceTTC)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <>
      <View style={tableFooterStyles.row}>
        <Text style={tableFooterStyles.description}>TOTAL HT ( € )</Text>
        <Text style={tableFooterStyles.total}> {totalHT.toFixed(2)}</Text>
      </View>
      <View style={tableFooterStyles.row}>
        <Text style={tableFooterStyles.description}>TVA 20% ( € )</Text>
        <Text style={tableFooterStyles.total}> {(totalTTC - totalHT).toFixed(2)}</Text>
      </View>
      <View style={tableFooterStyles.row}>
        <Text style={tableFooterStyles.description}>TOTAL TTC ( € )</Text>
        <Text style={tableFooterStyles.total}>{totalTTC.toFixed(2)}</Text>
      </View>
    </>
  );
};
