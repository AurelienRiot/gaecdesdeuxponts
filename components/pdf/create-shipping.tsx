import { Fragment } from "react";

import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { DataShippingOrderType } from "./data-shipping";
import Details from "./details";
import MainDocument, {
  borderColor,
  foregroundColor,
  mainColor,
  tableRowsCount,
} from "./main-document";

// Create Document Component
const ShippingOrder = ({ dataOrder }: { dataOrder: DataShippingOrderType }) => (
  <MainDocument
    customer={dataOrder.customer}
    title={`Bon_de_livraison-${dataOrder.order.id}`}
    details={<Details invoice={dataOrder} title="Bon de livraison" />}
  >
    <Fragment>
      <ShippingItemsTable invoice={dataOrder} />
      <Signature />
      <InvoiceThankYouMsg />
    </Fragment>
  </MainDocument>
);

export default ShippingOrder;

const itemsTableStyles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: borderColor,
  },
});

const ShippingItemsTable = ({
  invoice,
}: {
  invoice: DataShippingOrderType;
}) => (
  <View style={itemsTableStyles.tableContainer}>
    <ShippingTableHeader />
    <ShippingTableRow items={invoice.order.items} />
    <ShippingTableBlankSpace
      rowsCount={tableRowsCount - invoice.order.items.length}
    />
  </View>
);

const tableHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    backgroundColor: mainColor,
    color: foregroundColor,
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
  },
  ref: {
    width: "40%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  description: {
    width: "40%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
});

const ShippingTableHeader = () => (
  <View style={tableHeaderStyles.container}>
    <Text style={tableHeaderStyles.ref}>Reférence produit</Text>
    <Text style={tableHeaderStyles.description}>Description</Text>
    <Text style={tableHeaderStyles.qty}>Qte</Text>
  </View>
);

const tableRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    paddingVertical: 2,
    alignItems: "center",
    fontStyle: "bold",
  },
  ref: {
    width: "40%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
  },
  description: {
    width: "40%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
  },

  qty: {
    width: "20%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const ShippingTableRow = ({
  items,
}: {
  items: DataShippingOrderType["order"]["items"];
}) => {
  const rows = items.map((item, i) => (
    <View style={tableRowStyles.row} key={i}>
      <Text style={tableRowStyles.ref}>{item.id}</Text>
      <Text style={tableRowStyles.description}>{item.desc}</Text>
      <Text style={tableRowStyles.qty}>{item.qty}</Text>
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
    fontStyle: "bold",
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

const ShippingTableBlankSpace = ({ rowsCount }: { rowsCount: number }) => {
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

const signatureStyle = StyleSheet.create({
  container1: {
    marginTop: 30,
    marginBottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    marginBottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const Signature = () => (
  <Fragment>
    <View style={signatureStyle.container1}>
      <Text>Reçu le :</Text>
      <Text>Livré le :</Text>
    </View>
    <View style={signatureStyle.container2}>
      <Text>Signature expediteur :</Text>
      <Text>Signature destinataire :</Text>
    </View>
  </Fragment>
);

const thankYouMsgStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  reportTitle: {
    fontSize: 12,
    textAlign: "left",
    textTransform: "uppercase",
  },
  iban: {
    fontSize: 10,
    textAlign: "left",
  },
});

const InvoiceThankYouMsg = () => (
  <View style={thankYouMsgStyles.titleContainer}>
    <Text style={thankYouMsgStyles.reportTitle}>Merci de votre confiance</Text>
  </View>
);
