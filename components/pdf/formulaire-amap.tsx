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
        <DateDistribution shippingDay={data.contrat.shippingDay} />

        <Text
          style={AMAPStyle.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

const DateDistribution = ({ shippingDay }: { shippingDay: Date[] }) => {
  const groupedDates = shippingDay.reduce(
    (acc, date) => {
      const month = date.getMonth();
      const monthName = new Date(0, month).toLocaleString("fr", { month: "long" });
      if (!acc[monthName]) acc[monthName] = [];
      acc[monthName].push(date);
      return acc;
    },
    {} as Record<string, Date[]>,
  );
  return (
    <View style={[AMAPStyle.container, { marginTop: 40 }]}>
      <Text style={AMAPStyle.title}>Dates de distribution des produits laitiers</Text>

      <Text style={{ marginBottom: 10, fontWeight: "bold" }}>Barrer les dates où il n'y auras pas de livraison</Text>
      {Object.entries(groupedDates).map(([month, dates]) => (
        <Text key={month}>
          {month} :
          {dates
            .map((date, index) => (index === dates.length - 1 ? ` et le ${date.getDate()}` : ` le ${date.getDate()},`))
            .join("")}
        </Text>
      ))}
    </View>
  );
};

export default AmapPDFForm;
