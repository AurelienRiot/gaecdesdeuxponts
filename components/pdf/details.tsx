import { dateFormatter } from "@/lib/date-utils";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { mainColor } from "./main-document";
import type { AMAPType, MonthlyPDFDataType, PDFData } from "./pdf-data";

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
    }
  | { title: "Contrat AMAP"; pdfData: AMAPType }
  | { title: "Formulaire AMAP"; pdfData?: never };

const noStyles = StyleSheet.create({
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  invoiceDate: {
    fontSize: 12,
    // fontStyle: "bold",
  },
  label: {},
});

const Details = (data: DetailsProps) => (
  <View style={detailsStyles.container}>
    <InvoiceTitle title={data.title} />
    <OrderNumber data={data} />
    <CustomerNumber data={data} />
    <FacturationDate data={data} />
    <EditionDate data={data} />
  </View>
);

function CustomerNumber({ data }: { data: DetailsProps }) {
  if (data.title === "Formulaire AMAP") {
    return null;
  }
  return (
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>N° de client : </Text>
      <Text style={noStyles.invoiceDate}>{data.pdfData.customer.customerId}</Text>
    </View>
  );
}

function OrderNumber({ data }: { data: DetailsProps }) {
  if (data.title === "Facture mensuelle") {
    return (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>{data.pdfData.date} </Text>
      </View>
    );
  }
  if (data.title === "Contrat AMAP") {
    return (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>N° de contrat : </Text>
        <Text style={noStyles.invoiceDate}>{data.pdfData.contrat.id}</Text>
      </View>
    );
  }

  if (data.title === "Formulaire AMAP") {
    return null;
  }

  return (
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>N° de commande : </Text>
      <Text style={noStyles.invoiceDate}>{data.pdfData.customer?.orderId}</Text>
    </View>
  );
}

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

const FacturationDate = ({ data }: { data: DetailsProps }) =>
  data.title === "Facture"
    ? !!data.pdfData.order.dateOfPayment && (
        <View style={noStyles.invoiceDateContainer}>
          <Text style={noStyles.label}>Date de facturation : </Text>
          <Text style={noStyles.invoiceDate}>{data.pdfData.order.dateOfPayment}</Text>
        </View>
      )
    : null;

function EditionDate({ data }: { data: DetailsProps }) {
  if (data.title === "Facture mensuelle") {
    return (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>{"Date d'édition :"} </Text>
        <Text style={noStyles.invoiceDate}>{dateFormatter(new Date())}</Text>
      </View>
    );
  }

  if (data.title === "Contrat AMAP") {
    return (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>{"Date d'édition :"} </Text>
        <Text style={noStyles.invoiceDate}>{dateFormatter(data.pdfData.contrat.dateOfEdition)}</Text>
      </View>
    );
  }
  if (data.title === "Formulaire AMAP") {
    return null;
  }
  return (
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>{"Date d'édition :"} </Text>
      <Text style={noStyles.invoiceDate}>{data.pdfData.order.dateOfEdition}</Text>
    </View>
  );
}

const InvoiceTitle = ({ title }: { title: string }) => (
  <View style={headingStyles.titleContainer}>
    <Text style={headingStyles.reportTitle}>{title}</Text>
  </View>
);

export default Details;
