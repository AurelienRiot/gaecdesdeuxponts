import { getPercentage } from "@/lib/utils";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Fragment } from "react";
import { borderColor, foregroundColor, mainColor } from "./main-document";
import type { ItemDataOrder } from "./pdf-data";

export const ShippingTableStyles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: borderColor,
  },
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
    fontWeight: 600,
    flexGrow: 1,
  },
  ref: {
    width: "25%",
    height: "100%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  description: {
    width: "45%",
    height: "100%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "8%",
    height: "100%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  price: {
    width: "22%",
    height: "100%",
    paddingTop: 4,
  },

  rowItem: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    paddingVertical: 2,
    alignItems: "center",
    // fontStyle: 600,
  },

  refItem: {
    width: "25%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
  },
  descriptionItem: {
    width: "45%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
  },

  qtyItem: {
    width: "8%",
    textAlign: "right",
    paddingRight: 8,
  },
  priceItem: {
    width: "22%",
    textAlign: "right",
    paddingRight: 8,
  },

  rowBlank: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    // fontStyle: 600,
    color: "white",
  },
  refBlank: {
    width: "30%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
  },
  descriptionBlank: {
    width: "40%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
  },

  qtyBlank: {
    width: "10%",
    textAlign: "right",
    paddingRight: 8,
  },
  priceBlank: {
    width: "20%",
    textAlign: "right",
    paddingRight: 8,
  },
});

export const invoiceTableHeaderStyles = StyleSheet.create({
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
    fontWeight: 600,
    flexGrow: 1,
  },
  description: {
    height: "100%",
    width: "40%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
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
    width: "6%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
  },
  totalHT: {
    height: "100%",
    width: "14%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
  },
  tax: {
    height: "100%",
    width: "6%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
  },
  totalTTC: {
    height: "100%",
    width: "14%",
    paddingTop: 4,
  },
});

export const InvoiceTableHeader = () => (
  <View style={invoiceTableHeaderStyles.container}>
    <Text style={invoiceTableHeaderStyles.description}>Description</Text>
    <Text style={invoiceTableHeaderStyles.unit}>Prix unitaire HT (€)</Text>
    <Text style={invoiceTableHeaderStyles.qty}>Qte</Text>
    <Text style={invoiceTableHeaderStyles.totalHT}>Total HT (€)</Text>
    <Text style={invoiceTableHeaderStyles.tax}>TVA</Text>
    <Text style={invoiceTableHeaderStyles.totalTTC}>Total TTC (€)</Text>
  </View>
);

export const invoiceTableRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    paddingVertical: 2,
    alignItems: "center",
    // fontStyle: 600,
  },
  description: {
    width: "40%",
    textAlign: "left",
    paddingLeft: 4,
    paddingRight: 4,
    flexWrap: "wrap",
  },

  unit: {
    width: "20%",
    textAlign: "right",
    paddingRight: 4,
  },
  qty: {
    width: "6%",
    textAlign: "right",
    paddingRight: 4,
  },
  totalHT: {
    width: "14%",
    textAlign: "right",
    paddingRight: 4,
  },
  tax: {
    height: "100%",
    width: "6%",
    textAlign: "right",
  },
  totalTTC: {
    width: "14%",
    textAlign: "right",
    paddingRight: 4,
  },
});

export const InvoiceTableRow = ({ items }: { items: ItemDataOrder[] }) => {
  const rows = items.map((item, i) => (
    <View style={invoiceTableRowStyles.row} key={i}>
      <Text style={invoiceTableRowStyles.description}>{item.desc}</Text>
      <Text style={invoiceTableRowStyles.unit}>{(item.priceTTC / item.tax).toFixed(3)}</Text>
      <Text style={invoiceTableRowStyles.qty}>{item.qty}</Text>
      <Text style={invoiceTableRowStyles.totalHT}>{((item.priceTTC / item.tax) * item.qty).toFixed(3)}</Text>
      <Text style={invoiceTableRowStyles.tax}>{getPercentage(item.tax)}</Text>
      <Text style={invoiceTableRowStyles.totalTTC}>{(item.priceTTC * item.qty).toFixed(3)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export const invoiceTableBlankSpaceStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    // fontStyle: 600,
    color: "white",
  },
  description: {
    width: "100%",
  },
});

export const InvoiceTableBlankSpace = ({ rowsCount }: { rowsCount: number }) => {
  const blankRows = rowsCount > 0 ? Array(rowsCount).fill(0) : [];

  const rows = blankRows.map((x, i) => (
    <View style={invoiceTableBlankSpaceStyles.row} key={`BR${i}`}>
      <Text style={invoiceTableBlankSpaceStyles.description}>-</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export const invoiceTableFooterStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    fontSize: 12,
    // fontStyle: 600,
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

export const InvoiceTableFooter = ({
  totalHT,
  totalTTC,
}: {
  totalHT: number;
  totalTTC: number;
}) => {
  return (
    <>
      <View style={invoiceTableFooterStyles.row}>
        <Text style={invoiceTableFooterStyles.description}>TOTAL HT (€)</Text>
        <Text style={invoiceTableFooterStyles.total}> {totalHT.toFixed(2)}</Text>
      </View>
      <View style={invoiceTableFooterStyles.row}>
        <Text style={invoiceTableFooterStyles.description}>TVA (€)</Text>
        <Text style={invoiceTableFooterStyles.total}> {(totalTTC - totalHT).toFixed(2)}</Text>
      </View>
      <View style={invoiceTableFooterStyles.row}>
        <Text style={invoiceTableFooterStyles.description}>TOTAL TTC (€)</Text>
        <Text style={invoiceTableFooterStyles.total}>{totalTTC.toFixed(2)}</Text>
      </View>
    </>
  );
};
