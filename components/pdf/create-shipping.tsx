import { Fragment } from "react";

import { dateFormatter } from "@/lib/date-utils";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import Details from "./details";
import MainDocument, { tableRowsCount } from "./main-document";
import type { PDFData } from "./pdf-data";
import { SVGSignature } from "./signature";
import { ShippingTableStyles } from "./table";

// Create Document Component
const ShippingOrder = ({ pdfData }: { pdfData: PDFData }) => {
  return (
    <MainDocument
      customer={pdfData.customer}
      title={`Bon de livraison ${pdfData.order.id}`}
      details={<Details pdfData={pdfData} title="Bon de livraison" />}
    >
      <Fragment>
        <ShippingItemsTable pdfData={pdfData} />
        <Signature dateOfShipping={dateFormatter(pdfData.order.dateOfShipping)} />
      </Fragment>
    </MainDocument>
  );
};

export default ShippingOrder;

const ShippingItemsTable = ({ pdfData }: { pdfData: PDFData }) => {
  const items = pdfData.order.items;

  return (
    <View style={ShippingTableStyles.tableContainer}>
      <ShippingTableHeader />
      <ShippingTableRow items={items} />
      <ShippingTableBlankSpace rowsCount={tableRowsCount - items.length} />
    </View>
  );
};
const ShippingTableHeader = () => (
  <View style={ShippingTableStyles.container}>
    <Text style={ShippingTableStyles.ref}>Reférence produit</Text>
    <Text style={ShippingTableStyles.description}>Description</Text>
    <Text style={ShippingTableStyles.qty}>Qte</Text>
    <Text style={ShippingTableStyles.price}>Prix unitaire HT (€)</Text>
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
