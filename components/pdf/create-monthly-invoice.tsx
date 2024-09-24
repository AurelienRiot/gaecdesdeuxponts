import { Fragment } from "react";

import { StyleSheet, Text, View } from "@react-pdf/renderer";
import Details from "./details";
import MainDocument, { borderColor, tableRowsCount } from "./main-document";
import PaidWatermark from "./paid-watermark";
import type { DataOrder, MonthlyPDFDataType } from "./pdf-data";
import { InvoiceTableBlankSpace, InvoiceTableFooter, InvoiceTableHeader, InvoiceTableRow } from "./table";
import { dateFormatter } from "@/lib/date-utils";

// Create Document Component
const MonthlyInvoice = ({
  isPaid,
  data,
}: {
  isPaid: boolean;
  data: MonthlyPDFDataType;
}) => {
  data.orders.sort((a, b) => a.dateOfShipping.getTime() - b.dateOfShipping.getTime());
  for (const order of data.orders) {
    order.items.sort((a, b) => a.desc.localeCompare(b.desc));
  }
  return (
    <MainDocument
      customer={data.customer}
      title={`Facture mensuelle ${data.date}`}
      details={<Details pdfData={data} title={`Facture mensuelle`} />}
    >
      <Fragment>
        <ShippingItemsTable orders={data.orders} />
        {isPaid && <PaidWatermark />}
      </Fragment>
    </MainDocument>
  );
};

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

function chunkOrdersByLines(orders: DataOrder[], totalLines: number) {
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

const ShippingItemsTable = ({ orders }: { orders: DataOrder[] }) => {
  const totalLines = orders.reduce((acc, order) => acc + order.items.length + 1, 0);
  const chunks = chunkOrdersByLines(orders, totalLines);

  const { totalHT, totalTTC } = calculateOverallTotals(orders);

  if (chunks.length === 1) {
    return (
      <View style={itemsTableStyles.tableContainer}>
        <InvoiceTableHeader />
        <MonthlyInvoiceTableRow orders={chunks[0]} />

        <InvoiceTableBlankSpace rowsCount={tableRowsCount - totalLines} />
        <InvoiceTableFooter totalHT={totalHT} totalTTC={totalTTC} />
      </View>
    );
  }
  const chunk1 = chunks.shift();
  return (
    <>
      <View style={[itemsTableStyles.tableContainer, { marginBottom: 50 }]}>
        <InvoiceTableHeader />
        <MonthlyInvoiceTableRow orders={chunk1} />

        <InvoiceTableBlankSpace rowsCount={tableRowsCount - totalLines} />
      </View>
      {chunks.map((chunk, index) => {
        const marginTop = index === chunks.length - 1 ? 0 : 50;
        return (
          <View key={chunk[0].id} break style={[itemsTableStyles.tableContainer, { marginTop }]}>
            <InvoiceTableHeader />
            <MonthlyInvoiceTableRow orders={chunk} />

            {index === chunks.length - 1 && <InvoiceTableFooter totalHT={totalHT} totalTTC={totalTTC} />}
          </View>
        );
      })}
    </>
  );
};

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
});

const MonthlyInvoiceTableRow = ({
  orders,
}: {
  orders: DataOrder[] | undefined;
}) => {
  if (!orders) return null;
  return (
    <Fragment>
      {orders.map((order, i) => (
        <Fragment key={i}>
          <View style={tableRowStyles.row}>
            <Text
              style={tableRowStyles.order}
            >{`Commande n° ${order.id} du ${dateFormatter(order.dateOfShipping)} `}</Text>
          </View>
          <InvoiceTableRow key={i} items={order.items} />
        </Fragment>
      ))}
    </Fragment>
  );
};

function calculateOverallTotals(orders: DataOrder[]) {
  let totalTTC = 0;
  let totalHT = 0;

  for (const order of orders) {
    for (const item of order.items) {
      totalTTC += item.priceTTC * item.qty;
      totalHT += (item.priceTTC * item.qty) / item.tax;
    }
  }

  return {
    totalTTC,
    totalHT,
  };
}
