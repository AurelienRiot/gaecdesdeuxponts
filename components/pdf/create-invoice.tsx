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
} from "@react-pdf/renderer";
import { DataInvoiceType } from "./data-invoice";

const tableRowsCount = 11;

const mainColor = "#00008B";
const foregroundColor = "#FFFFFF";
const borderColor = mainColor;

const MainStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 10,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// Create Document Component
const Invoice = ({ dataInvoice }: { dataInvoice: DataInvoiceType }) => (
  <Document>
    <Page size="A4" style={MainStyles.page}>
      <View style={MainStyles.header}>
        <Company />
        <Details invoice={dataInvoice} title="Facture" />
      </View>

      <BillTo invoice={dataInvoice} />
      <InvoiceItemsTable invoice={dataInvoice} />
      <InvoiceThankYouMsg />
    </Page>
  </Document>
);

export default Invoice;

const CompanyStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
  },
  logo: {
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
    <Text>gaecdesdeuxponts@gmail.com</Text>
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
    {!!invoice.customer.phone && <Text>{invoice.customer.phone}</Text>}
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

const Logo = () => (
  <Svg viewBox="0 0 1024 1024" style={CompanyStyles.logo}>
    <G
      transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
      fill="#000000"
      stroke="none"
    >
      <Path
        d="M4915 8449 c-414 -20 -961 -186 -1365 -414 -131 -74 -341 -215 -440
    -295 -41 -33 -105 -84 -142 -112 -38 -28 -68 -54 -68 -58 0 -4 -40 -51 -89
    -104 -49 -52 -127 -141 -173 -197 -46 -56 -101 -121 -123 -144 -22 -23 -49
    -59 -60 -80 -11 -22 -49 -89 -84 -150 -133 -230 -241 -473 -241 -540 0 -98 94
    -154 182 -109 17 9 59 42 93 74 77 72 122 87 208 72 118 -22 183 -84 227 -218
    29 -85 66 -118 128 -111 59 6 77 26 159 182 129 241 241 395 422 576 371 370
    843 599 1365 660 60 7 169 9 275 6 472 -14 923 -185 1306 -494 261 -210 524
    -539 645 -806 47 -104 90 -137 163 -123 44 8 73 40 96 107 55 161 126 221 261
    222 78 1 113 -15 190 -88 67 -63 88 -75 135 -75 96 0 147 80 114 181 -35 105
    -143 329 -223 462 -441 734 -1093 1235 -1911 1467 -346 98 -648 129 -1050 109z"
      />
      <Path
        d="M5860 6202 c-34 -34 -40 -46 -40 -82 0 -77 60 -140 135 -140 14 0 25
    -3 25 -7 0 -5 -354 -7 -787 -5 -882 3 -840 6 -907 -68 -58 -65 -66 -110 -66
    -386 0 -224 -2 -245 -21 -289 -16 -36 -20 -59 -15 -92 7 -54 39 -130 68 -160
    26 -28 39 -20 76 51 29 56 28 29 17 384 -5 145 -3 182 7 182 7 0 23 3 36 6
    l22 6 0 -387 c0 -306 -3 -386 -12 -382 -160 60 -536 160 -743 196 -320 56
    -768 77 -1106 51 -155 -13 -450 -53 -527 -73 -68 -18 -102 -50 -102 -94 0 -38
    37 -83 67 -83 10 0 97 13 193 29 673 112 1340 62 1997 -150 177 -57 385 -137
    514 -197 164 -76 389 -216 389 -242 0 -6 -22 -10 -49 -10 -42 0 -53 -4 -70
    -26 -28 -36 -27 -79 4 -109 23 -24 31 -25 137 -25 62 -1 777 -3 1589 -6 1631
    -6 1522 -10 1549 56 17 40 4 80 -30 97 -20 10 -341 13 -1527 13 -1332 0 -1503
    2 -1503 15 0 47 379 253 650 353 588 218 1112 306 1686 282 231 -10 303 -17
    571 -57 181 -27 182 -27 204 -7 48 43 43 106 -11 138 -35 20 -235 57 -445 82
    -210 24 -789 25 -992 1 -296 -34 -847 -166 -996 -238 -25 -11 -50 -16 -68 -12
    -29 5 -29 6 -29 77 0 39 3 108 7 154 5 66 9 82 22 82 28 0 115 47 143 76 41
    44 68 116 78 207 11 97 18 125 54 194 l26 53 33 -20 c36 -23 115 -27 150 -8
    43 22 48 38 41 126 l-6 82 45 0 c53 0 97 29 97 65 0 32 -75 69 -129 63 -22 -2
    -37 0 -35 4 3 5 13 8 23 8 25 0 68 36 86 70 8 16 15 48 15 71 0 35 -6 47 -40
    81 -22 22 -45 38 -52 36 -19 -7 -22 -62 -4 -78 20 -16 20 -54 0 -74 -20 -20
    -68 -21 -84 -1 -9 11 -35 15 -106 15 -79 0 -97 -3 -110 -19 -12 -13 -24 -16
    -47 -12 -43 9 -55 32 -38 73 8 18 14 46 15 63 2 45 -27 44 -74 -3z m-270
    -1061 l0 -249 -57 18 c-189 59 -473 72 -711 34 l-42 -7 0 40 c0 68 11 103 31
    103 10 0 21 -9 24 -20 8 -25 40 -43 63 -36 14 5 16 16 14 60 -4 53 -3 54 27
    61 17 4 31 10 31 15 0 17 -102 99 -130 105 -64 14 -117 -20 -167 -105 -33 -57
    -38 -80 -15 -80 22 0 32 -34 32 -110 l0 -47 -39 -7 c-22 -3 -47 -9 -57 -13
    -16 -6 -17 2 -11 112 5 105 9 124 37 181 50 103 136 155 229 139 39 -6 55 -17
    166 -105 28 -22 73 -48 100 -57 97 -33 241 -16 357 43 l48 24 0 75 0 75 35 0
    35 0 0 -249z m-205 -370 c50 -11 110 -26 135 -33 l45 -14 -165 -81 c-91 -44
    -189 -96 -218 -116 l-54 -37 -102 60 c-95 54 -149 81 -296 147 -55 24 -55 25
    -30 37 32 17 145 44 230 56 102 14 351 4 455 -19z"
      />
      <Path
        d="M2315 6036 c-30 -46 17 -102 65 -76 23 12 28 68 8 88 -20 20 -56 14
    -73 -12z"
      />
      <Path
        d="M2435 6036 c-30 -46 8 -96 58 -77 48 18 37 93 -15 99 -20 2 -31 -4
    -43 -22z"
      />
      <Path
        d="M2566 6044 c-19 -18 -21 -55 -4 -72 7 -7 24 -12 38 -12 14 0 31 5 38
    12 28 28 2 88 -38 88 -10 0 -26 -7 -34 -16z"
      />
      <Path
        d="M7605 6036 c-35 -54 36 -116 77 -66 23 28 23 52 0 73 -26 24 -59 21
    -77 -7z"
      />
      <Path
        d="M7738 6049 c-12 -6 -18 -22 -18 -45 0 -27 5 -37 25 -46 53 -24 100
    46 57 85 -21 19 -39 21 -64 6z"
      />
      <Path
        d="M7856 6044 c-30 -30 -10 -94 30 -94 20 0 54 37 54 58 0 22 -30 52
    -53 52 -8 0 -23 -7 -31 -16z"
      />
      <Path
        d="M2020 5767 c-38 -19 -55 -61 -40 -98 7 -16 21 -34 31 -39 10 -6 202
    -10 477 -10 436 0 461 1 483 19 33 27 33 95 0 122 -22 18 -46 19 -475 19 -343
    0 -457 -3 -476 -13z"
      />
      <Path
        d="M3213 5770 c-55 -23 -65 -88 -21 -130 19 -17 35 -20 124 -20 99 0
    103 1 123 26 26 33 27 75 2 105 -17 22 -28 24 -113 26 -51 2 -103 -2 -115 -7z"
      />
      <Path
        d="M6824 5766 c-52 -23 -61 -87 -18 -127 l26 -24 688 -3 687 -3 32 26
    c42 36 44 93 5 124 -26 21 -34 21 -708 21 -549 -1 -687 -3 -712 -14z"
      />
      <Path
        d="M1999 5330 c-26 -26 -30 -36 -25 -63 12 -64 25 -67 251 -67 178 0
    205 2 224 18 32 25 38 81 13 112 -20 25 -21 25 -226 28 l-206 3 -31 -31z"
      />
      <Path
        d="M2685 5348 c-49 -26 -59 -77 -24 -122 l20 -26 369 0 369 0 20 26 c38
    48 24 104 -30 123 -44 15 -696 15 -724 -1z"
      />
      <Path
        d="M6823 5350 c-34 -14 -56 -54 -48 -90 13 -59 17 -60 378 -60 l328 0
    24 25 c40 40 30 96 -22 123 -26 14 -625 16 -660 2z"
      />
      <Path
        d="M7726 5339 c-34 -27 -37 -88 -4 -119 21 -19 34 -20 256 -20 133 0
    241 4 252 10 26 14 41 64 29 99 -16 47 -41 51 -283 51 -211 0 -225 -1 -250
    -21z"
      />
      <Path
        d="M2025 4540 c-53 -21 -68 -83 -32 -126 l25 -29 967 0 967 0 19 24 c21
    25 25 71 9 101 -6 11 -27 24 -48 30 -45 12 -1876 13 -1907 0z"
      />
      <Path
        d="M6290 4537 c-48 -24 -61 -79 -30 -127 13 -21 268 -26 1212 -25 734 0
    748 0 767 20 11 11 23 34 27 52 5 27 1 37 -24 63 l-30 30 -949 0 c-738 0 -953
    -3 -973 -13z"
      />
      <Path
        d="M2018 4230 c-25 -26 -29 -36 -24 -63 4 -18 16 -41 27 -52 19 -20 32
    -20 767 -20 411 0 1012 1 1335 3 l588 2 24 25 c16 15 25 36 25 55 0 19 -9 40
    -25 55 l-24 25 -1331 0 -1332 0 -30 -30z"
      />
      <Path
        d="M2926 3980 c-36 -11 -59 -32 -108 -98 -49 -66 -98 -99 -171 -113 -96
    -20 -152 -1 -236 76 -75 69 -123 90 -184 82 -50 -7 -86 -41 -94 -89 -7 -45 20
    -105 148 -333 261 -466 631 -858 1064 -1127 242 -151 480 -265 725 -349 356
    -122 595 -166 956 -176 479 -13 856 55 1314 234 652 256 1215 741 1589 1368
    130 217 185 335 177 378 -13 70 -80 108 -162 92 -24 -4 -56 -25 -99 -65 -76
    -71 -112 -90 -180 -97 -103 -11 -197 42 -265 147 -45 71 -113 94 -202 70 -55
    -16 -88 -48 -205 -204 -311 -412 -716 -700 -1198 -850 -323 -101 -629 -126
    -985 -80 -439 57 -835 233 -1185 527 -135 113 -245 232 -368 395 -56 76 -113
    148 -127 161 -55 52 -134 72 -204 51z"
      />
      <Path
        d="M3516 3970 c-56 -7 -76 -27 -76 -77 0 -55 28 -73 110 -73 62 0 74 3
    95 25 32 31 33 75 3 102 -27 24 -64 30 -132 23z"
      />
      <Path
        d="M3920 3973 c-33 -12 -60 -47 -60 -78 0 -59 64 -96 123 -71 75 31 77
    118 3 146 -29 11 -43 11 -66 3z"
      />
      <Path
        d="M4395 3973 c-129 -4 -141 -7 -161 -44 -13 -26 -13 -36 -3 -60 6 -17
    20 -34 30 -39 11 -6 215 -10 513 -10 483 0 497 1 516 20 12 12 20 33 20 55 0
    53 -28 75 -97 76 -200 3 -734 4 -818 2z"
      />
      <Path
        d="M5515 3945 c-30 -30 -32 -64 -4 -99 l20 -26 374 0 c205 0 381 3 390
    6 24 10 46 60 39 89 -14 55 -17 55 -422 55 l-373 0 -24 -25z"
      />
      <Path
        d="M6531 3944 c-28 -35 -26 -67 3 -101 24 -27 27 -28 112 -26 109 4 120
    7 139 43 20 38 19 52 -6 84 -20 25 -24 26 -124 26 -100 0 -104 -1 -124 -26z"
      />
      <Path
        d="M3670 3693 c-44 -16 -63 -67 -44 -118 18 -47 -32 -45 1502 -45 l1439
    0 27 21 c23 18 27 27 24 68 -6 88 126 81 -1503 80 -786 0 -1437 -3 -1445 -6z"
      />
      <Path
        d="M4120 3393 c-54 -20 -69 -92 -27 -131 l23 -22 548 0 547 0 24 26 c30
    32 32 73 6 105 l-19 24 -544 2 c-298 1 -550 -1 -558 -4z"
      />
      <Path
        d="M5466 3378 c-36 -32 -43 -77 -18 -108 l20 -25 304 -5 c166 -3 318 -2
    336 3 39 10 68 60 58 101 -13 52 -37 56 -370 56 -302 0 -305 0 -330 -22z"
      />
    </G>
  </Svg>
);
