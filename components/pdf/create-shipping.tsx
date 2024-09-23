import { Fragment } from "react";

import { G, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import Details from "./details";
import MainDocument, { borderColor, foregroundColor, mainColor, tableRowsCount } from "./main-document";
import type { PDFData } from "./pdf-data";
import { ShippingTableStyles } from "./table";
import { SVGSignature } from "./signature";

// Create Document Component
const ShippingOrder = ({ pdfData }: { pdfData: PDFData }) => (
  <MainDocument
    customer={pdfData.customer}
    title={`Bon de livraison ${pdfData.order.id}`}
    details={<Details pdfData={pdfData} title="Bon de livraison" />}
  >
    <Fragment>
      <ShippingItemsTable pdfData={pdfData} />
      <Signature dateOfShipping={pdfData.order.dateOfShipping} />
    </Fragment>
  </MainDocument>
);

export default ShippingOrder;

const ShippingItemsTable = ({ pdfData }: { pdfData: PDFData }) => (
  <View style={ShippingTableStyles.tableContainer}>
    <ShippingTableHeader />
    <ShippingTableRow items={pdfData.order.items} />
    <ShippingTableBlankSpace rowsCount={tableRowsCount - pdfData.order.items.length} />
  </View>
);

const ShippingTableHeader = () => (
  <View style={ShippingTableStyles.container}>
    <Text style={ShippingTableStyles.ref}>Reférence produit</Text>
    <Text style={ShippingTableStyles.description}>Description</Text>
    <Text style={ShippingTableStyles.qty}>Qte</Text>
    <Text style={ShippingTableStyles.price}>Prix HT (€)</Text>
  </View>
);

const ShippingTableRow = ({ items }: { items: PDFData["order"]["items"] }) => {
  const rows = items.map((item, i) => (
    <View style={ShippingTableStyles.rowItem} key={i}>
      <Text style={ShippingTableStyles.refItem}>{item.id}</Text>
      <Text style={ShippingTableStyles.descriptionItem}>{item.desc}</Text>
      <Text style={ShippingTableStyles.qtyItem}>{item.qty}</Text>
      <Text style={ShippingTableStyles.priceItem}>{(item.priceTTC / item.tax).toFixed(3)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

const ShippingTableBlankSpace = ({ rowsCount }: { rowsCount: number }) => {
  const blankRows = rowsCount > 0 ? Array(rowsCount).fill(0) : [];
  const rows = blankRows.map((x, i) => (
    <View style={ShippingTableStyles.rowBlank} key={`BR${i}`}>
      <Text style={ShippingTableStyles.refBlank}>-</Text>
      <Text style={ShippingTableStyles.descriptionBlank}>-</Text>
      <Text style={ShippingTableStyles.qtyBlank}>-</Text>
      <Text style={ShippingTableStyles.priceBlank}>-</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

const signatureStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  container1: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

const Signature = ({ dateOfShipping }: { dateOfShipping: string | null }) => (
  <View style={signatureStyle.container}>
    <View style={signatureStyle.container1}>
      <Text>Livré le : {dateOfShipping}</Text>
    </View>
    <View style={signatureStyle.container2}>
      <Text>Signature :</Text>
      <SVGSignature />
    </View>
  </View>
);
