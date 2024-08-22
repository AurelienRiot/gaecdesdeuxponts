import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Fragment } from "react";
import Details from "./details";
import { Company, InvoiceThankYouMsg, borderColor, foregroundColor, mainColor } from "./main-document";
import type { AMAPType } from "./pdf-data";
import {
  AMAPStyle,
  Commande,
  Consommateur,
  ContenueContrat,
  DateDistribution,
  Description,
  Engagement,
  getNumberOfMonths,
  getNumberOfWeeks,
} from "./create-amap";

// Font.register({
//   family: "Inter",
//   fonts: [
//     { src: "https://www.laiteriedupontrobert.fr/fonts/inter.ttf", fontWeight: 400 },
//     { src: "https://www.laiteriedupontrobert.fr/fonts/inter-bold.ttf", fontWeight: 600 },
//   ],
// });

const AmapPDFForm = ({ data }: { data: AMAPType }) => {
  const numberOfWeeks = getNumberOfWeeks(
    data.contrat.startDate,
    data.contrat.endDate,
    data.contrat.weeksOfAbsence.length,
  );
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

export default AmapPDFForm;
