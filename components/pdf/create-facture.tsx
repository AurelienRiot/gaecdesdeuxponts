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

const dataInvoice = {
  id: "5df3180a09ea16dc4b95f910",
  invoice_no: "201906-28",
  balance: "$2,283.74",
  company: "MANTRI",
  email: "susanafuentes@mantrix.com",
  phone: "+1 (872) 588-3809",
  address: "922 Campus Road, Drytown, Wisconsin, 1986",
  trans_date: "2019-09-12",
  due_date: "2019-10-12",
  items: [
    {
      sno: 1,
      desc: "ad sunt culpa occaecat qui",
      qty: 5,
      price: 405.89,
    },
    {
      sno: 2,
      desc: "cillum quis sunt qui aute",
      qty: 5,
      price: 373.11,
    },
    {
      sno: 3,
      desc: "ea commodo labore culpa irure",
      qty: 5,
      price: 458.61,
    },
    {
      sno: 4,
      desc: "nisi consequat et adipisicing dolor",
      qty: 10,
      price: 725.24,
    },
    {
      sno: 5,
      desc: "proident cillum anim elit esse",
      qty: 4,
      price: 141.02,
    },
  ],
};

const MainStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 100,
    height: 100,
  },
});

// Create Document Component
const Invoice = () => (
  <Document>
    <Page size="A4" style={MainStyles.page}>
      <Logo />
      <InvoiceTitle title="Invoice" />
      <InvoiceNo invoice={dataInvoice} />
      <BillTo invoice={dataInvoice} />
      <InvoiceItemsTable invoice={dataInvoice} />
      <InvoiceThankYouMsg />
    </Page>
  </Document>
);

export default Invoice;

const headingStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  reportTitle: {
    color: "#61dafb",
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
  invoiceNoContainer: {
    flexDirection: "row",
    marginTop: 36,
    justifyContent: "flex-end",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 60,
  },
});

const InvoiceNo = ({ invoice }: { invoice: typeof dataInvoice }) => (
  <Fragment>
    <View style={noStyles.invoiceNoContainer}>
      <Text style={noStyles.label}>Invoice No:</Text>
      <Text style={noStyles.invoiceDate}>{invoice.invoice_no}</Text>
    </View>
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>Date: </Text>
      <Text>{invoice.trans_date}</Text>
    </View>
  </Fragment>
);

const billStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 36,
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
});

const BillTo = ({ invoice }: { invoice: typeof dataInvoice }) => (
  <View style={billStyles.headerContainer}>
    <Text style={billStyles.billTo}>Bill To:</Text>
    <Text>{invoice.company}</Text>
    <Text>{invoice.address}</Text>
    <Text>{invoice.phone}</Text>
    <Text>{invoice.email}</Text>
  </View>
);

const tableRowsCount = 11;

const itemsTableStyles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#bff0fd",
  },
});

const InvoiceItemsTable = ({ invoice }: { invoice: typeof dataInvoice }) => (
  <View style={itemsTableStyles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow items={invoice.items} />
    <InvoiceTableBlankSpace rowsCount={tableRowsCount - invoice.items.length} />
    <InvoiceTableFooter items={invoice.items} />
  </View>
);

const borderColor = "#90e5fc";
const tableHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
  },
  description: {
    width: "60%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: "15%",
  },
});

const InvoiceTableHeader = () => (
  <View style={tableHeaderStyles.container}>
    <Text style={tableHeaderStyles.description}>Item Description</Text>
    <Text style={tableHeaderStyles.qty}>Qty</Text>
    <Text style={tableHeaderStyles.rate}>@</Text>
    <Text style={tableHeaderStyles.amount}>Amount</Text>
  </View>
);

const tableRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  description: {
    width: "60%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  rate: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  amount: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const InvoiceTableRow = ({
  items,
}: {
  items: (typeof dataInvoice)["items"];
}) => {
  const rows = items.map((item) => (
    <View style={tableRowStyles.row} key={item.sno.toString()}>
      <Text style={tableRowStyles.description}>{item.desc}</Text>
      <Text style={tableRowStyles.qty}>{item.qty}</Text>
      <Text style={tableRowStyles.rate}>{item.price}</Text>
      <Text style={tableRowStyles.amount}>
        {(item.qty * item.price).toFixed(2)}
      </Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

const tableBlankSpaceStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
    color: "white",
  },
  description: {
    width: "60%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
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
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontSize: 12,
    fontStyle: "bold",
  },
  description: {
    width: "85%",
    textAlign: "right",
    borderRightColor: borderColor,
    borderRightWidth: 1,
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
  items: (typeof dataInvoice)["items"];
}) => {
  const total = items
    .map((item) => item.qty * item.price)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={tableFooterStyles.row}>
      <Text style={tableFooterStyles.description}>TOTAL</Text>
      <Text style={tableFooterStyles.total}>{total.toFixed(2)}</Text>
    </View>
  );
};

const thankYouMsgStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  reportTitle: {
    fontSize: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

const InvoiceThankYouMsg = () => (
  <View style={thankYouMsgStyles.titleContainer}>
    <Text style={thankYouMsgStyles.reportTitle}>
      Thank you for your business
    </Text>
  </View>
);

const Logo = () => (
  <Svg viewBox="0 0 934.000000 918.000000" style={MainStyles.logo}>
    <G
      transform="translate(0.000000,918.000000) scale(0.100000,-0.100000)"
      fill="#000000"
      stroke="none"
    >
      <Path
        d="M4530 8084 c-273 -18 -501 -51 -711 -104 -539 -136 -1022 -381 -1439
-731 -127 -106 -371 -352 -466 -469 -888 -1094 -1030 -2595 -361 -3830 81
-149 232 -378 337 -510 106 -133 414 -442 546 -546 555 -438 1145 -682 1860
-770 191 -23 587 -23 779 0 599 73 1121 263 1600 581 208 138 339 248 541 449
202 203 305 326 440 531 311 471 492 968 560 1535 24 197 24 553 0 750 -94
789 -422 1477 -971 2039 -593 607 -1369 979 -2210 1060 -115 11 -424 20 -505
15z m480 -219 c137 -14 365 -53 475 -81 521 -131 1076 -428 1460 -781 224
-207 396 -407 567 -663 273 -408 454 -921 509 -1436 7 -71 9 -218 6 -410 -5
-321 -12 -384 -78 -689 -65 -297 -185 -593 -364 -894 -239 -403 -709 -866
-1145 -1128 -364 -219 -799 -375 -1220 -437 -283 -42 -389 -49 -620 -43 -348
10 -629 59 -950 166 -432 145 -763 322 -1105 594 -266 212 -617 620 -800 931
-190 324 -328 721 -386 1116 -20 134 -23 195 -23 445 0 220 4 320 17 415 86
622 283 1106 632 1555 265 340 513 573 847 795 485 322 973 493 1578 553 101
10 479 5 600 -8z"
      />
      <Path
        d="M4455 7484 c-197 -29 -261 -41 -390 -74 -276 -70 -502 -169 -733
-320 -170 -111 -248 -174 -387 -315 -321 -324 -561 -746 -664 -1165 -32 -132
-41 -211 -47 -410 -5 -175 -4 -187 15 -218 26 -41 60 -55 99 -41 44 15 60 58
82 217 55 387 203 738 453 1075 71 95 303 336 402 416 342 277 728 440 1145
482 332 33 689 -56 980 -246 90 -58 271 -236 325 -319 21 -33 52 -96 70 -140
35 -89 71 -246 62 -269 -4 -10 -27 -16 -79 -19 -57 -4 -82 -11 -113 -31 -96
-64 -152 -149 -141 -213 8 -39 8 -39 -124 -49 -47 -4 -222 -27 -390 -52 -493
-73 -771 -71 -1315 9 -259 38 -508 44 -613 15 -105 -28 -172 -67 -247 -142
-124 -124 -165 -231 -205 -540 -47 -366 -105 -681 -145 -794 -8 -23 -28 -60
-45 -81 -57 -72 -74 -125 -74 -230 1 -80 5 -106 29 -165 36 -91 92 -175 115
-175 42 0 121 137 141 245 14 78 7 135 -30 230 -28 74 -29 78 -15 118 35 97
96 378 129 593 19 128 35 238 36 245 3 61 67 -252 93 -456 18 -135 20 -336 6
-440 -16 -108 -35 -164 -85 -241 l-45 -72 39 -123 c22 -68 51 -161 64 -205
l25 -82 -30 -6 c-17 -3 -59 -6 -93 -6 -67 0 -259 -17 -287 -26 -28 -8 -21 -31
34 -113 60 -89 98 -137 232 -289 377 -430 831 -691 1436 -825 203 -45 433 -60
697 -46 177 9 245 20 448 71 351 88 617 205 895 391 178 119 343 270 527 482
106 122 253 317 253 336 0 9 -7 22 -15 29 -31 26 -281 44 -626 44 l-336 1 -7
75 c-9 107 -36 433 -36 446 0 6 35 38 78 71 171 133 222 241 297 638 39 204
91 424 128 544 l22 74 70 14 c75 16 256 97 292 132 37 35 54 78 55 139 2 79
-15 123 -74 190 -53 60 -128 169 -128 188 0 6 19 17 42 25 112 37 203 129 234
237 40 136 -64 211 -217 156 -54 -20 -68 -14 -96 40 -38 73 -293 341 -423 446
-240 191 -573 358 -891 444 -205 56 -375 78 -634 81 -132 2 -253 1 -270 -1z
m1920 -1075 c22 -6 62 -27 89 -47 60 -44 90 -106 105 -214 17 -120 72 -228
156 -302 77 -68 91 -94 74 -143 -9 -27 -23 -40 -71 -64 -78 -39 -103 -36 -146
21 -19 25 -45 48 -59 52 -38 10 -52 27 -86 97 -48 100 -133 181 -225 216 -97
36 -125 72 -130 164 -4 62 -2 69 34 124 62 92 151 126 259 96z m-2738 -740
c517 -90 896 -102 1273 -39 63 10 180 30 260 44 267 45 387 43 489 -6 88 -42
172 -154 187 -247 4 -23 10 -41 14 -41 4 0 9 -58 9 -129 2 -99 9 -161 31 -271
37 -176 40 -305 10 -401 -10 -35 -60 -138 -111 -228 -100 -180 -122 -230 -265
-591 -53 -135 -101 -249 -105 -254 -20 -22 -20 11 -1 131 12 70 29 175 38 233
9 58 33 157 53 220 66 202 71 225 71 306 0 107 -21 185 -79 307 -27 56 -57
125 -66 152 -18 57 -30 74 -65 98 -62 43 -113 4 -160 -120 -40 -106 -61 -142
-118 -211 -78 -93 -193 -166 -335 -214 -82 -27 -327 -37 -327 -13 0 8 -4 15
-10 15 -5 0 -7 -6 -4 -14 4 -11 0 -13 -15 -9 -27 7 -27 10 9 28 35 18 41 19
38 4 -2 -6 5 -13 14 -14 10 -2 17 0 17 3 -4 24 3 52 11 52 6 0 8 -12 5 -27 -3
-16 -2 -22 1 -15 3 6 13 12 21 12 11 0 14 8 11 34 -2 19 -1 33 2 31 3 -2 12 0
20 6 11 6 7 9 -15 9 -131 4 -280 50 -387 120 -41 27 -108 85 -151 129 -66 69
-86 99 -137 205 -33 69 -70 132 -82 141 -30 20 -66 19 -105 -5 -59 -36 -200
-243 -296 -435 -60 -121 -177 -381 -215 -480 -17 -44 -45 -114 -61 -155 l-30
-75 0 57 c-1 31 5 87 13 125 8 37 19 109 26 158 20 160 17 150 46 151 14 1 23
0 20 -3 -3 -3 1 -21 9 -40 18 -42 18 -46 5 -38 -6 4 -7 -1 -3 -11 5 -13 8 -14
11 -5 4 11 6 11 14 0 7 -11 8 -9 4 5 -4 10 -1 25 6 33 24 29 31 258 11 380
-16 104 -39 180 -99 325 -79 192 -93 300 -54 413 11 32 20 59 20 61 0 1 -17 1
-37 0 -21 0 -40 4 -42 9 -7 15 88 83 142 101 122 41 200 40 464 -7z m870
-1184 c4 -4 3 -5 -4 -2 -6 4 -13 2 -15 -5 -3 -8 -6 -6 -10 4 -7 17 15 19 29 3z
m-685 -165 c67 -26 120 -56 260 -151 62 -42 144 -89 183 -104 93 -37 221 -58
323 -53 72 3 80 1 54 -9 -49 -20 -202 -36 -284 -30 -143 11 -251 51 -381 139
-68 46 -117 68 -152 68 -38 0 -32 -32 20 -96 53 -64 57 -100 24 -189 -52 -140
-230 -238 -373 -204 -95 22 -170 74 -212 145 -39 66 -32 154 19 257 67 136
167 221 287 247 63 13 170 4 232 -20z m1402 -402 c3 -62 7 -194 8 -293 l3
-179 -40 -9 c-149 -33 -305 -74 -397 -103 l-107 -35 -98 25 c-252 63 -590 117
-853 136 -176 13 -186 17 -175 84 8 57 15 61 33 24 29 -56 103 -49 115 12 8
39 22 38 33 -2 13 -46 52 -63 97 -44 45 19 50 27 48 98 -1 56 1 62 41 108 47
54 66 97 67 148 1 17 3 32 5 32 2 0 33 -11 68 -24 108 -41 213 -59 348 -59
199 -1 381 37 624 133 83 32 156 59 163 59 7 1 13 -36 17 -111z m518 -311 c14
-42 18 -70 12 -76 -12 -12 -164 -22 -164 -11 0 15 52 153 73 195 l20 40 18
-40 c10 -22 29 -70 41 -108z m-2511 83 c14 -8 19 -21 19 -55 0 -59 25 -85 80
-85 33 0 42 4 52 25 18 40 28 29 28 -31 l0 -57 -100 5 c-55 3 -103 7 -106 11
-3 3 -8 48 -11 101 -6 101 -3 108 38 86z m462 -576 c46 -8 64 -35 48 -71 -11
-23 -12 -24 -148 -21 l-138 3 -3 32 c-5 48 25 63 123 63 44 0 97 -3 118 -6z
m301 -20 c20 -20 20 -27 -3 -55 -16 -21 -22 -22 -45 -11 -17 8 -26 19 -26 35
0 44 43 62 74 31z m-679 -24 c0 -20 -5 -25 -25 -25 -28 0 -41 32 -18 46 23 15
43 5 43 -21z m1950 4 c23 -23 15 -66 -15 -81 -38 -19 -239 -17 -268 3 -26 18
-28 50 -5 76 14 16 33 18 144 18 104 0 131 -3 144 -16z m501 -9 c15 -23 15
-27 1 -49 -9 -13 -28 -26 -43 -29 -43 -8 -267 4 -281 16 -16 12 -17 59 -1 75
8 8 58 12 160 12 146 0 148 0 164 -25z m358 9 c20 -19 20 -44 3 -68 -18 -25
-104 -33 -131 -14 -24 19 -24 67 0 85 25 18 109 17 128 -3z m-1580 -130 c21
-20 20 -43 -1 -66 -14 -15 -32 -18 -120 -18 -118 0 -143 8 -143 48 0 47 14 52
136 52 89 0 116 -3 128 -16z m1012 -92 c21 -14 25 -45 8 -63 -22 -25 -46 -24
-69 1 -35 39 17 92 61 62z m-1753 -33 c18 -10 23 -45 9 -67 -14 -21 -62 -29
-201 -31 -156 -2 -184 8 -179 62 2 20 11 35 24 42 25 13 321 7 347 -6z m1318
-159 c27 -15 25 -64 -3 -84 -19 -13 -78 -16 -419 -16 -227 0 -409 4 -423 10
-38 14 -51 46 -31 76 l15 24 421 0 c271 0 427 -4 440 -10z"
      />
      <Path
        d="M4595 5437 c-52 -18 -84 -21 -237 -22 -158 0 -179 -3 -197 -19 -67
-61 30 -136 177 -137 88 -1 173 25 268 82 61 37 118 94 109 110 -9 14 -54 9
-120 -14z"
      />
      <Path
        d="M4621 4486 c-9 -11 -9 -16 1 -22 7 -4 10 -4 6 1 -4 4 -3 14 3 22 6 7
9 13 6 13 -2 0 -10 -6 -16 -14z"
      />
      <Path
        d="M4563 4483 c-15 -6 11 -63 28 -63 8 0 7 5 -1 15 -7 8 -10 21 -7 30 7
16 -2 24 -20 18z"
      />
      <Path d="M3154 4424 c-6 -3 -9 -16 -6 -30 l4 -25 14 27 c19 36 17 40 -12 28z" />
      <Path
        d="M4515 6757 c-94 -31 -159 -89 -198 -176 -30 -63 -29 -177 0 -243 72
-159 250 -227 408 -154 78 35 117 74 151 150 36 79 39 177 7 248 -28 62 -94
131 -150 158 -57 27 -163 35 -218 17z"
      />
    </G>
  </Svg>
);
