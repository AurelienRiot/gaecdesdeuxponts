import { Document, Image, Page, StyleSheet, Text, View, Font, Link } from "@react-pdf/renderer";
import type { PDFData } from "./pdf-data";

export const tableRowsCount = 10;
export const mainColor = "#D3D3D3";
export const foregroundColor = "#000000";
export const borderColor = "#000000";
export const watermarkColor = "rgb(255, 0, 0)";

// Font.register({
//   family: "Open Sans",
//   fonts: [
//     { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf", fontWeight: 400 },
//     { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf", fontWeight: 600 },
//   ],
// });

if (typeof window === "undefined") {
  console.log("server: ", process.cwd());
  Font.register({
    family: "Inter",
    fonts: [
      { src: `${process.cwd()}/app/pdf/fonts/inter.ttf`, fontWeight: 400 },
      { src: `${process.cwd()}/app/pdf/fonts/inter-bold.ttf`, fontWeight: 600 },
    ],
  });
} else {
  Font.register({
    family: "Inter",
    fonts: [
      { src: "/fonts/inter.ttf", fontWeight: 400 },
      { src: "/fonts/inter-bold.ttf", fontWeight: 600 },
    ],
  });
}

export const MainStyles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
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
  invoice,
}: {
  title: string;
  children: JSX.Element;
  details: JSX.Element;
  customer: PDFData["customer"];
  invoice?: boolean;
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
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
        fixed
      />
      {invoice ? <InvoiceThankYouMsg /> : <ThankYouMsg />}
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
    <Text>
      {customer.name}
      {customer.company ? ` - ${customer.company}` : ""}
    </Text>
    {!!customer.billingAddress && customer.shippingAddress === customer.billingAddress ? (
      <Text>{customer.billingAddress}</Text>
    ) : (
      <>
        <Text>Adresse de facturation : {customer.billingAddress}</Text>
        <Text>Adresse de livraison : {customer.shippingAddress}</Text>
      </>
    )}

    {!!customer.phone && <Text>{customer.phone}</Text>}
    {!!customer.email && <Text>{customer.email}</Text>}
  </View>
);

const CompanyStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    marginBottom: 10,
  },
  logo1: {
    width: 80,
    height: 80,
  },
  logo2: {
    width: 117,
    height: 80,
  },
  contact: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: 500,
  },
});

export const Company = () => (
  <View style={CompanyStyles.headerContainer}>
    <Logo />
    <Text>Gaec des deux ponts</Text>
    <Text>6 B le Pont Robert 44290 MASSERAC</Text>
    <Text>06 72 06 45 55</Text>
    <Text style={CompanyStyles.contact}>
      laiteriedupontrobert@gmail.com - <Link href="https://www.laiteriedupontrobert.fr">laiteriedupontrobert.fr</Link>
    </Text>
  </View>
);

const Logo = () => (
  <View style={CompanyStyles.logoContainer}>
    {/* eslint-disable-next-line jsx-a11y/alt-text */}
    <Image style={CompanyStyles.logo1} src={getImagePath("logo-font-blanc.png")} cache={false} />
    {/* eslint-disable-next-line jsx-a11y/alt-text */}
    <Image style={CompanyStyles.logo2} src={getImagePath("certification-bio.jpeg")} cache={false} />
  </View>
);

const getImagePath = (image: string) => {
  const isClient = typeof window !== "undefined";
  return isClient ? `/${image}` : `${process.cwd()}/app/pdf/images/${image}`;
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
    fontSize: 8,
    textAlign: "left",
  },
});

export const ThankYouMsg = () => (
  <View style={thankYouMsgStyles.titleContainer}>
    <Text style={thankYouMsgStyles.reportTitle}>Merci de votre confiance</Text>
    <Text style={thankYouMsgStyles.iban}>IBAN : FR76 1360 6000 6846 3201 0973 614, Code Bic : AGRIFRPP836</Text>
    <Text style={thankYouMsgStyles.iban}>Siret : 844 554 147 00018 ,N° TVA intracom : FR46844554147</Text>
  </View>
);

const InvoiceThankYouMsg = () => (
  <View style={thankYouMsgStyles.titleContainer}>
    <Text style={thankYouMsgStyles.reportTitle}>Merci de votre confiance,</Text>
    <Text style={thankYouMsgStyles.iban}>
      Modalités de paiement : Virement bancaire (IBAN : FR76 1360 6000 6846 3201 0973 614, Code Bic : AGRIFRPP836) ou
      chèque à l'ordre du Gaec des deux ponts. Conditions de paiement : 30 jours fin de mois.
    </Text>
    <Text style={thankYouMsgStyles.iban}>Pénalités de retard : 10% du montant total en cas de retard de paiement</Text>
    <Text style={thankYouMsgStyles.iban}>Siret : 844 554 147 00018 ,N° TVA intracom : FR46844554147</Text>
  </View>
);

export default MainDocument;
