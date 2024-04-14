import React, { Fragment } from "react";

import {
  Page,
  Document,
  Svg,
  Path,
  StyleSheet,
  View,
  Text,
  G,
  Image,
} from "@react-pdf/renderer";
import { DataInvoiceType } from "./data-invoice";
import { formatPhoneNumber } from "react-phone-number-input";

const tableRowsCount = 11;

const mainColor = "#00008B";
const foregroundColor = "#FFFFFF";
const borderColor = mainColor;
const logoColor = "#000000";
const watermarkColor = "rgb(255, 0, 0)";

const MainStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 10,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.5,
    flexDirection: "column",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// Create Document Component
const Invoice = ({
  dataInvoice,
  isPaid,
}: {
  isPaid: boolean;
  dataInvoice: DataInvoiceType;
}) => (
  <Document title={`Facture-${dataInvoice.order.id}`}>
    <Page size="A4" style={MainStyles.page}>
      <View style={MainStyles.header}>
        <Company />
        <Details invoice={dataInvoice} title="Facture" />
      </View>

      <BillTo invoice={dataInvoice} />
      <InvoiceItemsTable invoice={dataInvoice} />
      <InvoiceThankYouMsg />
      {isPaid && <PaidWatermark />}
    </Page>
  </Document>
);

export default Invoice;

const CompanyStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
  },
  logo: {
    marginBottom: 10,
    width: 100,
    height: 100,
  },
});

const Company = () => (
  <View style={CompanyStyles.headerContainer}>
    <Logo />
    <Text>Gaec des deux ponts</Text>
    <Text>6 B le Pont Robert 44290 MASSERAC</Text>
    <Text>06 72 06 45 55</Text>
    <Text>laiteriedupontrobert@gmail.com</Text>
  </View>
);

const detailsStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginTop: 24,
  },
});

const Details = ({
  title,
  invoice,
}: {
  title: string;
  invoice: DataInvoiceType;
}) => (
  <View style={detailsStyles.container}>
    <InvoiceTitle title={title} />
    <InvoiceNo invoice={invoice} />
  </View>
);

const headingStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "flex-end",
  },
  reportTitle: {
    color: mainColor,
    letterSpacing: 4,
    fontSize: 25,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

const InvoiceTitle = ({ title }: { title: string }) => (
  <View style={headingStyles.titleContainer}>
    <Text style={headingStyles.reportTitle}>{title}</Text>
  </View>
);

const noStyles = StyleSheet.create({
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {},
});

const InvoiceNo = ({ invoice }: { invoice: DataInvoiceType }) => (
  <Fragment>
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>N° de facture : </Text>
      <Text style={noStyles.invoiceDate}>{invoice.order.id}</Text>
    </View>
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>N° de client : </Text>
      <Text style={noStyles.invoiceDate}>{invoice.customer.id}</Text>
    </View>
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>Date de facturation : </Text>
      <Text style={noStyles.invoiceDate}>{invoice.order.dateOfPayment}</Text>
    </View>
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>{"Date de d'édition :"} </Text>
      <Text style={noStyles.invoiceDate}>{invoice.order.dateOfEdition}</Text>
    </View>
  </Fragment>
);

const billStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 15,
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
  },
});

const BillTo = ({ invoice }: { invoice: DataInvoiceType }) => (
  <View style={billStyles.headerContainer}>
    <Text style={billStyles.billTo}>À :</Text>
    {!!invoice.customer.name && <Text>{invoice.customer.name}</Text>}
    {!!invoice.customer.address && <Text>{invoice.customer.address}</Text>}
    {!!invoice.customer.phone && (
      <Text>{formatPhoneNumber(invoice.customer.phone)}</Text>
    )}
    {!!invoice.customer.email && <Text>{invoice.customer.email}</Text>}
  </View>
);

const itemsTableStyles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: borderColor,
  },
});

const InvoiceItemsTable = ({ invoice }: { invoice: DataInvoiceType }) => (
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
  items: DataInvoiceType["order"]["items"];
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
  items: DataInvoiceType["order"]["items"];
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
    <Text style={thankYouMsgStyles.iban}>
      IBAN : FR76 1234 5678 9012 3456 7890
    </Text>
    <Text style={thankYouMsgStyles.iban}>Code Bic : AGRIFRPP836</Text>
  </View>
);

const watermark = StyleSheet.create({
  container: {
    position: "absolute",
    top: "75%",
    left: "20%",
    zIndex: 9999,
    transform: "rotate(-45deg)",
    opacity: 0.5,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: watermarkColor,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  watermarkText: {
    fontSize: 60,
    color: watermarkColor,
  },
});

const PaidWatermark = () => (
  <View style={watermark.container}>
    <Text style={watermark.watermarkText}>Payé</Text>
  </View>
);

const Logo = () => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <Image style={CompanyStyles.logo} src="\logo-font-blanc.png" cache={false} />
);
