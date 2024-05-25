import {
  Document,
  Page,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import { DataInvoiceType } from "./data-invoice";

export const tableRowsCount = 10;
export const mainColor = "#00008B";
export const foregroundColor = "#FFFFFF";
export const borderColor = mainColor;
export const watermarkColor = "rgb(255, 0, 0)";

const MainStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 10,
    paddingBottom: 10,
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

const MainDocument = ({
  title,
  children,
  details,
  customer,
}: {
  title: string;
  children: JSX.Element;
  details: JSX.Element;
  customer: DataInvoiceType["customer"];
}) => (
  <Document title={title}>
    <Page size="A4" style={MainStyles.page}>
      <View style={MainStyles.header}>
        <Company />
        {details}
      </View>

      <BillTo customer={customer} />
      {children}
    </Page>
  </Document>
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

const BillTo = ({ customer }: { customer: DataInvoiceType["customer"] }) => (
  <View style={billStyles.headerContainer}>
    <Text style={billStyles.billTo}>À :</Text>
    {!!customer.name && <Text>{customer.name}</Text>}
    {!!customer.address && <Text>{customer.address}</Text>}
    {!!customer.phone && <Text>{customer.phone}</Text>}
    {!!customer.email && <Text>{customer.email}</Text>}
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

const Logo = () => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <Image
    style={CompanyStyles.logo}
    src="https://www.laiteriedupontrobert.fr/logo-font-blanc.png"
    cache={false}
  />
);

export default MainDocument;
