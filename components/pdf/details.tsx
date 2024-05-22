import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { DataInvoiceType } from "./data-invoice";
import { DataMonthlyInvoiceType } from "./data-monthly-invoice";
import { DataOrderType } from "./data-order";
import { DataShippingOrderType } from "./data-shipping";
import { mainColor } from "./main-document";

const detailsStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginTop: 24,
  },
});

type DetailsProps =
  | {
      title: "Facture";
      invoice: DataInvoiceType;
    }
  | {
      title: "Facture mensuelle";
      invoice: DataMonthlyInvoiceType;
    }
  | {
      title: "Bon de commande";
      invoice: DataOrderType;
    }
  | {
      title: "Bon de livraison";
      invoice: DataShippingOrderType;
    };

const Details = ({ title, invoice }: DetailsProps) => (
  <View style={detailsStyles.container}>
    <InvoiceTitle title={title} />
    {title !== "Facture mensuelle" && (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>N° de commande : </Text>
        <Text style={noStyles.invoiceDate}>{invoice.order?.id}</Text>
      </View>
    )}
    <View style={noStyles.invoiceDateContainer}>
      <Text style={noStyles.label}>N° de client : </Text>
      <Text style={noStyles.invoiceDate}>{invoice.customer.id}</Text>
    </View>
    {title === "Facture" && (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>Date de facturation : </Text>
        <Text style={noStyles.invoiceDate}>{invoice.order.dateOfPayment}</Text>
      </View>
    )}
    {title !== "Facture mensuelle" ? (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>{"Date de d'édition :"} </Text>
        <Text style={noStyles.invoiceDate}>{invoice.order.dateOfEdition}</Text>
      </View>
    ) : (
      <View style={noStyles.invoiceDateContainer}>
        <Text style={noStyles.label}>{"Date de d'édition :"} </Text>
        <Text style={noStyles.invoiceDate}>
          {invoice.order.length > 0 && invoice.order[0].dateOfEdition}
        </Text>
      </View>
    )}
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

export default Details;
