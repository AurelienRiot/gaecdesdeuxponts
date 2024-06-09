import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { mainColor } from "./main-document";
import { MonthlyPDFDataType, PDFData } from "./pdf-data";

const detailsStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginTop: 14,
  },
});

type DetailsProps =
  | {
      title: "Facture" | "Bon de commande" | "Bon de livraison";
      pdfData: PDFData;
    }
  | {
      title: "Facture mensuelle";
      pdfData: MonthlyPDFDataType;
    };

const noStyles = StyleSheet.create({
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {},
});

const Details = ({ title, pdfData }: DetailsProps) => (
  <View style={detailsStyles.container}>
    <InvoiceTitle title={title} />
    {title !== "Facture mensuelle" ? (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>N° de commande : </Text>
        <Text style={noStyles.invoiceDate}>{pdfData.order?.id}</Text>
      </View>
    ) : (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>{pdfData.date} </Text>
      </View>
    )}
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>N° de client : </Text>
      <Text style={noStyles.invoiceDate}>{pdfData.customer.id}</Text>
    </View>
    {title === "Facture" && pdfData.order.dateOfPayment && (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>Date de facturation : </Text>
        <Text style={noStyles.invoiceDate}>{pdfData.order.dateOfPayment}</Text>
      </View>
    )}
    {title !== "Facture mensuelle" ? (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>{"Date de d'édition :"} </Text>
        <Text style={noStyles.invoiceDate}>{pdfData.order.dateOfEdition}</Text>
      </View>
    ) : (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>{"Date de d'édition :"} </Text>
        <Text style={noStyles.invoiceDate}>
          {pdfData.orders.length > 0 && pdfData.orders[0].dateOfEdition}
        </Text>
      </View>
    )}
  </View>
);

const headingStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 4,
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

export default Details;
