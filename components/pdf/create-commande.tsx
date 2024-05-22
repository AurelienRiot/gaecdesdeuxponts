import { Fragment } from "react";

import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { DataOrderType } from "./data-order";
import Details from "./details";
import MainDocument, {
  borderColor,
  foregroundColor,
  mainColor,
  tableRowsCount,
} from "./main-document";

// Create Document Component
const Order = ({ data }: { data: DataOrderType }) => (
  <MainDocument
    customer={data.customer}
    title={`Bon_de_commande-${data.order.id}`}
    details={<Details invoice={data} title="Bon de commande" />}
  >
    <Fragment>
      <InvoiceItemsTable invoice={data} />
      <InvoiceThankYouMsg />
    </Fragment>
  </MainDocument>
);

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

const InvoiceItemsTable = ({ invoice }: { invoice: DataOrderType }) => (
  <View style={itemsTableStyles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow items={invoice.order.items} />
    <InvoiceTableBlankSpace
      rowsCount={tableRowsCount - invoice.order.items.length}
    />
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
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
  },
  description: {
    width: "40%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  unit: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  totalHT: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  totalTTC: {
    width: "15%",
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
    fontStyle: "bold",
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

const InvoiceTableRow = ({
  items,
}: {
  items: DataOrderType["order"]["items"];
}) => {
  const rows = items.map((item, i) => (
    <View style={tableRowStyles.row} key={i}>
      <Text style={tableRowStyles.description}>{item.desc}</Text>
      <Text style={tableRowStyles.unit}>
        {(item.priceTTC / 1.2).toFixed(2)}
      </Text>
      <Text style={tableRowStyles.qty}>{item.qty}</Text>
      <Text style={tableRowStyles.totalHT}>
        {((item.priceTTC / 1.2) * item.qty).toFixed(2)}
      </Text>

      <Text style={tableRowStyles.totalTTC}>
        {(item.priceTTC * item.qty).toFixed(2)}
      </Text>
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

const InvoiceTableBlankSpace = ({ rowsCount }: { rowsCount: number }) => {
  const blankRows = Array(rowsCount).fill(0);
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
    fontStyle: "bold",
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
  items: DataOrderType["order"]["items"];
}) => {
  const totalHT = items
    .map((item) => (item.qty * item.priceTTC) / 1.2)
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
        <Text style={tableFooterStyles.total}>
          {" "}
          {(totalTTC - totalHT).toFixed(2)}
        </Text>
      </View>
      <View style={tableFooterStyles.row}>
        <Text style={tableFooterStyles.description}>TOTAL TTC ( € )</Text>
        <Text style={tableFooterStyles.total}>{totalTTC.toFixed(2)}</Text>
      </View>
    </>
  );
};

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
