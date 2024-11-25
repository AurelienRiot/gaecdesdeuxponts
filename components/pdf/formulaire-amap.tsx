import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  AMAPStyle,
  Commande,
  Consommateur,
  ContenueContrat,
  Description,
  Engagement,
  getNumberOfMonths,
} from "./create-amap";
import Details from "./details";
import { Company } from "./main-document";
import type { AMAPType } from "./pdf-data";

// Font.register({
//   family: "Inter",
//   fonts: [
//     { src: "https://www.laiteriedupontrobert.fr/fonts/inter.ttf", fontWeight: 400 },
//     { src: "https://www.laiteriedupontrobert.fr/fonts/inter-bold.ttf", fontWeight: 600 },
//   ],
// });

const AmapPDFForm = ({ data }: { data: AMAPType }) => {
  // const numberOfWeeks = getNumberOfWeeks(
  //   data.contrat.startDate,
  //   data.contrat.endDate,
  //   data.contrat.weeksOfAbsence.length,
  // );
  const numberOfWeeks = data.contrat.shippingDay.length;
  // data.contrat.frequency === "hebdomadaire"
  //   ? Math.round((data.contrat.endDate.getTime() - data.contrat.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
  //   : data.contrat.frequency === "mensuel"
  //     ? Math.round((data.contrat.endDate.getTime() - data.contrat.startDate.getTime()) / (30 * 24 * 60 * 60 * 1000))
  //     : Math.round((data.contrat.endDate.getTime() - data.contrat.startDate.getTime()) / (60 * 24 * 60 * 60 * 1000));

  const numberOfMonths = getNumberOfMonths(data.contrat.startDate, data.contrat.endDate);
  return (
    <Document title={`Formulaire AMAP Laiterie du Pont Robert`}>
      <Page size="A4" style={AMAPStyle.page}>
        <View style={AMAPStyle.header}>
          <Company />
          <Details title="Formulaire AMAP" />
        </View>
        <ContenueContrat numberOfWeeks={numberOfWeeks} numberOfMonths={numberOfMonths} data={data} />
        <Engagement numberOfMonths={numberOfMonths} />
        <Description />
        <Consommateur customer={data.customer} />
        <Commande numberOfWeeks={numberOfWeeks} order={data.contrat} form={true} />
        <DateDistribution />

        <Text
          style={AMAPStyle.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

const DateDistribution = () => (
  <View style={[AMAPStyle.container, { marginTop: 40 }]}>
    <Text style={AMAPStyle.title}>Dates de distribution des produits laitiers</Text>

    <Text style={{ marginBottom: 10, fontWeight: 600 }}>Barrer les dates où il n'y auras pas de livraison</Text>
    <Text>Septembre : le 03, le 10, le 17 et le 24 </Text>
    <Text>Octobre : le 01, le 08, le 15, le 22 et le 29 </Text>
    <Text>Novembre : le 05, le 12, le 19 et le 26 </Text>
    <Text>Décembre : le 03, le 10, le 17, le 24 et le 31</Text>
  </View>
);

export default AmapPDFForm;
