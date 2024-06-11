import {
  Document,
  Page,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import { PDFData } from "./pdf-data";

export const tableRowsCount = 10;
export const mainColor = "#D3D3D3";
export const foregroundColor = "#000000";
export const borderColor = "#000000";
export const watermarkColor = "rgb(255, 0, 0)";

const MainStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 20,
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 1.5,
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    marginTop: -10,
    justifyContent: "space-between",
  },
  pageNumbers: {
    position: "absolute",
    bottom: 5,
    right: 10,
    textAlign: "center",
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
  customer: PDFData["customer"];
}) => (
  <Document title={title}>
    <Page size="A4" style={MainStyles.page}>
      <View style={MainStyles.header}>
        <Company />
        {details}
      </View>

      <BillTo customer={customer} />
      {children}

      <Text
        style={MainStyles.pageNumbers}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} / ${totalPages}`
        }
        fixed
      />
      <InvoiceThankYouMsg />
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

const BillTo = ({ customer }: { customer: PDFData["customer"] }) => (
  <View style={billStyles.headerContainer}>
    <Text style={billStyles.billTo}>À :</Text>
    {!!customer.name && <Text>{customer.name}</Text>}
    {!!customer.facturationAddress && (
      <Text>{customer.facturationAddress}</Text>
    )}
    {!!customer.phone && <Text>{customer.phone}</Text>}
    {!!customer.email && <Text>{customer.email}</Text>}
  </View>
);

const CompanyStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
  },
  logo: {
    marginBottom: 10,
    width: 80,
    height: 80,
  },
  contact: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: 500,
  },
});

const Company = () => (
  <View style={CompanyStyles.headerContainer}>
    <Logo />
    <Text>Gaec des deux ponts</Text>
    <Text>6 B le Pont Robert 44290 MASSERAC</Text>
    <Text>06 72 06 45 55</Text>
    <Text style={CompanyStyles.contact}>
      laiteriedupontrobert@gmail.com - laiteriedupontrobert.fr
    </Text>
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
      IBAN : FR76 1234 5678 9012 3456 7890 Code Bic : AGRIFRPP836
    </Text>
    <Text style={thankYouMsgStyles.iban}>
      Siret : 844 554 147 00018 APE : ***** N° TVA intracom : ***** Capital :
      *****€
    </Text>
  </View>
);

export default MainDocument;
