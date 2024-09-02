import { Fragment } from "react";

import { StyleSheet, Text, View } from "@react-pdf/renderer";
import Details from "./details";
import MainDocument, { borderColor, foregroundColor, mainColor, tableRowsCount } from "./main-document";
import PaidWatermark from "./paid-watermark";
import type { MonthlyPDFDataType } from "./pdf-data";

// Create Document Component
const MonthlyInvoice = ({
  isPaid,
  data,
}: {
  isPaid: boolean;
  data: MonthlyPDFDataType;
}) => (
  <MainDocument
    customer={data.customer}
    title={`Facture mensuelle ${data.date}`}
    details={<Details pdfData={data} title={`Facture mensuelle`} />}
  >
    <Fragment>
      <ShippingItemsTable data={data} />
      {isPaid && <PaidWatermark />}
    </Fragment>
  </MainDocument>
);

export default MonthlyInvoice;

const itemsTableStyles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: borderColor,
  },
});

function chunkOrdersByLines(orders: MonthlyPDFDataType["orders"], totalLines: number) {
  const maxLinesFirstChunk = 15;
  const maxLinesOtherChunks = 28;
  const chunks = [];
  let currentChunk = [];
  let currentLinesCount = 0;
  let currentMaxLines = maxLinesFirstChunk; // Start with the first chunk limit

  for (const order of orders) {
    const orderLines = 1 + order.items.length; // 1 for title + number of items

    // Check if adding this order would exceed the maximum lines allowed in the current chunk
    if (currentLinesCount + orderLines >= currentMaxLines) {
      // Save the current chunk and start a new one
      chunks.push(currentChunk);
      currentChunk = [];
      currentLinesCount = 0;

      // After the first chunk, set the max lines for the next chunks
      currentMaxLines = maxLinesOtherChunks;
    }

    // Add the current order to the chunk
    currentChunk.push(order);
    currentLinesCount += orderLines;
  }

  // Add the last chunk if it contains any orders
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

const ShippingItemsTable = ({ data }: { data: MonthlyPDFDataType }) => {
  const totalLines = data.orders.reduce((acc, order) => acc + order.items.length + 1, 0);
  const chunks = chunkOrdersByLines(data.orders, totalLines);
  console.log(chunks);

  if (chunks.length === 1) {
    return (
      <View style={itemsTableStyles.tableContainer}>
        <ShippingTableHeader />
        <ShippingTableRow orders={chunks[0]} />

        <ShippingTableBlankSpace rowsCount={tableRowsCount - totalLines} />
        <InvoiceTableFooter orders={data.orders} />
      </View>
    );
  }
  const chunk1 = chunks.shift();
  return (
    <>
      <View style={[itemsTableStyles.tableContainer, { marginBottom: 50 }]}>
        <ShippingTableHeader />
        <ShippingTableRow orders={chunk1} />

        <ShippingTableBlankSpace rowsCount={tableRowsCount - totalLines} />
      </View>
      {chunks.map((chunk, index) => {
        const marginTop = index === chunks.length - 1 ? 0 : 50;
        return (
          <View key={chunk[0].id} break style={[itemsTableStyles.tableContainer, { marginTop }]}>
            <ShippingTableHeader />
            <ShippingTableRow orders={chunk} />

            {index === chunks.length - 1 && <InvoiceTableFooter orders={data.orders} />}
          </View>
        );
      })}
    </>
  );
};

const tableHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    backgroundColor: mainColor,
    color: foregroundColor,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 24,
    textAlign: "center",
    fontWeight: "bold",
    flexGrow: 1,
  },
  description: {
    width: "40%",
    height: "100%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  unit: {
    width: "20%",
    height: "100%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "10%",
    height: "100%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  totalHT: {
    width: "15%",
    height: "100%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  totalTTC: {
    paddingTop: 4,
    height: "100%",
    width: "15%",
  },
});
const ShippingTableHeader = () => (
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
  order: {
    width: "100%",
    textAlign: "left",
    paddingLeft: 4,
    paddingRight: 4,
    flexWrap: "wrap",
    fontWeight: "bold",
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

const ShippingTableRow = ({
  orders,
}: {
  orders: MonthlyPDFDataType["orders"] | undefined;
}) => {
  if (!orders) return null;
  return (
    <Fragment>
      {orders.map((order, i) => (
        <Fragment key={i}>
          <View style={tableRowStyles.row}>
            <Text style={tableRowStyles.order}>{`Commande n° ${order.id} du ${order.dateOfShipping} `}</Text>
          </View>
          {order.items.map((item, i) => (
            <View style={tableRowStyles.row} key={i}>
              <Text style={tableRowStyles.description}>{item.desc}</Text>
              <Text style={tableRowStyles.unit}>{(item.priceTTC / 1.055).toFixed(2)}</Text>
              <Text style={tableRowStyles.qty}>{item.qty}</Text>
              <Text style={tableRowStyles.totalHT}>{((item.priceTTC / 1.055) * item.qty).toFixed(2)}</Text>

              <Text style={tableRowStyles.totalTTC}>{(item.priceTTC * item.qty).toFixed(2)}</Text>
            </View>
          ))}
        </Fragment>
      ))}
    </Fragment>
  );
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
  orders,
}: {
  orders: MonthlyPDFDataType["orders"];
}) => {
  const totalHT = orders
    .map((order) => (order.totalPrice || 0) / 1.055)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const totalTTC = orders
    .map((order) => order.totalPrice || 0)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <>
      <View style={tableFooterStyles.row}>
        <Text style={tableFooterStyles.description}>TOTAL HT ( € )</Text>
        <Text style={tableFooterStyles.total}> {totalHT.toFixed(2)}</Text>
      </View>
      <View style={tableFooterStyles.row}>
        <Text style={tableFooterStyles.description}>TVA 5,5% ( € )</Text>
        <Text style={tableFooterStyles.total}> {(totalTTC - totalHT).toFixed(2)}</Text>
      </View>
      <View style={tableFooterStyles.row}>
        <Text style={tableFooterStyles.description}>TOTAL TTC ( € )</Text>
        <Text style={tableFooterStyles.total}>{totalTTC.toFixed(2)}</Text>
      </View>
    </>
  );
};
