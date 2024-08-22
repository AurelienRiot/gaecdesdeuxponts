import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getISOWeek } from "date-fns";
import { Fragment } from "react";
import Details from "./details";
import { Company, InvoiceThankYouMsg, borderColor, foregroundColor, mainColor } from "./main-document";
import type { AMAPType } from "./pdf-data";

// Font.register({
//   family: "Inter",
//   fonts: [
//     { src: "https://www.laiteriedupontrobert.fr/fonts/inter.ttf", fontWeight: 400 },
//     { src: "https://www.laiteriedupontrobert.fr/fonts/inter-bold.ttf", fontWeight: 600 },
//   ],
// });

export const AMAPStyle = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 11,
    paddingTop: 20,
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 1.5,
    position: "relative",
  },
  container: {
    paddingHorizontal: 35,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textIndent: 15,
  },
  paragraph: {
    textIndent: 15,
  },

  header: {
    flexDirection: "row",
    marginTop: -10,
    marginBottom: 30,
    justifyContent: "space-between",
  },
  pageNumbers: {
    position: "absolute",
    bottom: 5,
    right: 10,
    textAlign: "center",
  },
});

export function getNumberOfWeeks(startDate: Date, endDate: Date, weeksOfAbsence: number) {
  const startWeek = getISOWeek(startDate);
  const endWeek = getISOWeek(endDate);
  if (endWeek < startWeek) return endWeek + 52 - startWeek - weeksOfAbsence + 1;
  return endWeek - startWeek - weeksOfAbsence;
}

export function getNumberOfMonths(startDate: Date, endDate: Date) {
  return endDate.getMonth() - startDate.getMonth() + 1;
}

const AmapPDF = ({ data }: { data: AMAPType }) => {
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
    <Document title={`Contrat AMAP ${data.customer.orderId}`}>
      <Page size="A4" style={AMAPStyle.page}>
        <View style={AMAPStyle.header}>
          <Company />
          <Details pdfData={data} title="Contrat AMAP" />
        </View>
        <ContenueContrat numberOfWeeks={numberOfWeeks} numberOfMonths={numberOfMonths} data={data} />
        <Engagement numberOfMonths={numberOfMonths} />
        <Description />
        <Consommateur customer={data.customer} />
        <Commande numberOfWeeks={numberOfWeeks} order={data.contrat} />
        <DateDistribution />
        (
        <Text
          style={{
            position: "absolute",
            bottom: 5,
            left: 10,
            textAlign: "center",
          }}
          render={({ pageNumber }) => (pageNumber === 2 ? "À remplir en 2 exemplaires" : null)}
          fixed
        />
        )
        <Text
          style={AMAPStyle.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default AmapPDF;

export function ContenueContrat({
  numberOfWeeks,
  numberOfMonths,
  data,
}: { numberOfWeeks: number; numberOfMonths: number; data: AMAPType }) {
  return (
    <View style={AMAPStyle.container}>
      <Text style={AMAPStyle.title}>Contenu du contrat AMAP</Text>
      <Text style={AMAPStyle.paragraph}>
        Le présent contrat est passé entre le/la consommateur.trice et les producteurs pour l’approvisionnement toutes
        les semaines de produits laitiers bio pour une durée totale de {numberOfMonths} mois (
        {data.contrat.startDate.toLocaleString("fr-FR", { month: "long" })} à{" "}
        {data.contrat.endDate.toLocaleString("fr-FR", { month: "long" })}) pour {numberOfWeeks} semaines.
      </Text>
      <Text style={AMAPStyle.paragraph}>
        Les producteurs s’engagent à exercer leur activité dans le respect de la charte des AMAP : qualité sanitaire des
        produits, respect de la biodiversité, de l’environnement.
      </Text>
      <Text style={AMAPStyle.paragraph}>
        Le/la consommateur.trice et les producteurs doivent respecter la charte des AMAP consultable via le lien{" "}
        <Link href="http://www.reseau-amap.org/docs/chartedesamap.PDF">
          http://www.reseau-amap.org/docs/chartedesamap.PDF
        </Link>
        .
      </Text>
      <Text style={AMAPStyle.paragraph}>
        La distribution des produits laitiers aura lieu toutes les semaines, les mardis soir, au local de l’ancien
        presbytère en face de la gendarmerie de Guémené Penfao, de 18h à 19h.
      </Text>
      <Text style={AMAPStyle.paragraph}>
        Sur la période du contrat, certaines distributions pourront être susceptibles de ne pas être assurées si des
        difficultés ponctuelles sont rencontrées sur la ferme. Si cela devait arriver, les producteurs en informeront
        les consommateurs.trices aussi vite que possible et au moins une semaine à l’avance. Dans ce cas, soit les
        produits laitiers seront déposés au local de l’ancien presbytère et la distribution se fera en l’absence des
        producteurs. Le nombre de livraisons sera, dans tous les cas, conforme au nombre de mois prévus dans le contrat.
      </Text>
    </View>
  );
}

export function Engagement({ numberOfMonths }: { numberOfMonths: number }) {
  return (
    <View style={AMAPStyle.container}>
      <Text style={AMAPStyle.title}>Engagement</Text>
      <Text style={AMAPStyle.paragraph}>
        L’engagement suivant est souscrit et réglé par chèque(s) à la signature du contrat pour toutes les livraisons du
        contrat. Les chèques seront remplis à l’ordre de Gaec des deux ponts.
      </Text>
      <Text style={AMAPStyle.paragraph}>
        Le/la consommateur.trice s’engage sur la totalité de la durée du contrat soit {numberOfMonths} mois.
      </Text>
      <Text style={AMAPStyle.paragraph}>
        En cas d’oubli, le lait cru peut être retiré à la ferme le lendemain de la distribution, sinon les produits
        seront perdus.
      </Text>
    </View>
  );
}

export function Description() {
  return (
    <View style={[AMAPStyle.container, { marginTop: 20 }]} break>
      <Text style={AMAPStyle.title}>Descriptif des produits</Text>
      <Text style={{ fontWeight: "bold" }}>- Lait cru bio bidon 2L</Text>
      <Text style={[AMAPStyle.paragraph, { textIndent: 0, marginTop: 10 }]}>
        En provenance directe de la ferme, notre lait cru est riche en nutriments essentiels tels que les vitamines, les
        minéraux et les enzymes naturelles qui sont souvent détruits lors de la pasteurisation.Notre lait cru doit être
        conservé entre 0°C et 4°C et consommé dans les 5 jours suivant l'achat pour garantir sa fraîcheur et sa qualité.
        Il est important de respecter scrupuleusement la chaîne du froid pour éviter toute contamination.
      </Text>
    </View>
  );
}

export const ConsommateurStyle = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
  },
});

export function Consommateur({ customer }: { customer: AMAPType["customer"] }) {
  return (
    <View style={AMAPStyle.container}>
      <Text style={AMAPStyle.title}>Consommateur.trice</Text>
      {!!customer.name && <Text>{customer.name}</Text>}
      {!!customer.facturationAddress && <Text>{customer.facturationAddress}</Text>}
      {!!customer.phone && <Text>{customer.phone}</Text>}
      {!!customer.email && <Text>{customer.email}</Text>}
    </View>
  );
}

export function Commande({
  order,
  numberOfWeeks,
  form,
}: { order: AMAPType["contrat"]; numberOfWeeks: number; form?: boolean }) {
  return (
    <View style={AMAPStyle.container}>
      <Text style={AMAPStyle.title}>Commande</Text>
      <InvoiceTableHeader />
      <InvoiceTableRow items={order.items} form={form} />
      <InvoiceTableFooter numberOfWeeks={numberOfWeeks} order={order} form={form} />
      <View style={{ marginTop: 10, display: "flex", flexDirection: "row", gap: 4 }}>
        <Text style={{ fontWeight: "bold", textDecoration: "underline" }}>Semaine d'absence pévues :</Text>
        {!form && <Text>{order.weeksOfAbsence.length}</Text>}
      </View>
      (
      <View style={{ marginTop: 10, display: "flex", flexDirection: "row", gap: 4 }}>
        <Text style={{ fontWeight: "bold", textDecoration: "underline" }}>Règlement :</Text>
        <View style={{ fontSize: 10 }}>
          <Text>Si montant inférieur à 40 €, un seul chèque</Text>
          <Text>Si montant supérieur à 40 €, deux chèques encaissés au début et au milieu du contrat.</Text>
          <Text style={{ fontWeight: "bold" }}>A l’ordre du Gaec des deux ponts</Text>
        </View>
      </View>
      )
      {!form && (
        <View
          style={{
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Fait à</Text>
          <Text style={{ marginRight: 50 }}> , le</Text>
        </View>
      )}
      {!form && (
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Signature du /de la consommateur.trice :</Text>
          <Text style={{ marginRight: 20 }}>Signature des producteurs :</Text>
        </View>
      )}
    </View>
  );
}

const tableHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: mainColor,
    color: foregroundColor,
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontWeight: "bold",
    flexGrow: 1,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: borderColor,
  },
  description: {
    height: "100%",
    width: "40%",
    paddingTop: 4,
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  unit: {
    height: "100%",
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
  },
  qty: {
    height: "100%",
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingTop: 4,
  },
  totalTTC: {
    height: "100%",
    width: "15%",
    paddingTop: 4,
  },
});

export const InvoiceTableHeader = () => (
  <View style={tableHeaderStyles.container}>
    <Text style={tableHeaderStyles.description}>Produit</Text>
    <Text style={tableHeaderStyles.unit}>Prix unitaire ( € )</Text>
    <Text style={tableHeaderStyles.qty}>Qte</Text>
    <Text style={tableHeaderStyles.totalTTC}>Total ( € )</Text>
  </View>
);

const tableRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: borderColor,
    paddingVertical: 2,
    alignItems: "center",
  },
  description: {
    width: "40%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
  },

  unit: {
    width: "20%",
    textAlign: "right",
    paddingRight: 8,
  },
  qty: {
    width: "20%",
    textAlign: "right",
    paddingRight: 8,
  },
  totalTTC: {
    width: "20%",
    textAlign: "right",
    paddingRight: 8,
  },
});

export const InvoiceTableRow = ({ items, form }: { items: AMAPType["contrat"]["items"]; form?: boolean }) => {
  const rows = items.map((item, i) => (
    <View style={tableRowStyles.row} key={i}>
      <Text style={tableRowStyles.description}>{item.desc}</Text>
      <Text style={tableRowStyles.unit}>{item.priceTTC}</Text>
      <Text style={tableRowStyles.qty}>{!form && item.qty}</Text>
      <Text style={tableRowStyles.totalTTC}>{!form && (item.priceTTC * item.qty).toFixed(2)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

const tableFooterStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 24,
    fontSize: 12,
    borderBottom: 1,
    borderLeft: 1,
    borderRight: 1,
    borderColor: borderColor,
    // fontStyle: "bold",
  },
  description: {
    width: "80%",
    textAlign: "center",
    paddingRight: 8,
  },
  total: {
    width: "20%",
    textAlign: "right",
    paddingRight: 8,
  },
});

export const InvoiceTableFooter = ({
  order,
  numberOfWeeks,
  form,
}: {
  order: AMAPType["contrat"];
  numberOfWeeks: number;
  form?: boolean;
}) => {
  const totalPrice = (order.items.reduce((acc, item) => acc + item.priceTTC * item.qty, 0) * numberOfWeeks).toFixed(2);
  return (
    <>
      <View style={tableFooterStyles.row}>
        <Text style={[tableFooterStyles.description, !form ? { fontSize: 10 } : { fontSize: 10, textAlign: "right" }]}>
          Nombre de semaines prévues
          {/* (possibilité de soustraire 2 semaines de vacances : merci de m’indiquer les numéros 
          de vos semaines d’absence)*/}
        </Text>
        {!form && <Text style={tableFooterStyles.total}> X {numberOfWeeks}</Text>}
      </View>
      <View style={tableFooterStyles.row}>
        <Text
          style={[
            tableFooterStyles.description,
            !form ? { fontWeight: "bold" } : { fontWeight: "bold", textAlign: "right" },
          ]}
        >
          MONTANT TOTAL ( € )
        </Text>
        <Text style={tableFooterStyles.total}> {!form && totalPrice}</Text>
      </View>
    </>
  );
};

export function DateDistribution({ form }: { form?: boolean }) {
  return (
    <View
      break
      style={[
        AMAPStyle.container,
        { marginTop: 20 },
        { flexDirection: "column", justifyContent: "space-between", flexGrow: 1 },
      ]}
    >
      <View>
        <Text style={AMAPStyle.title}>Dates de distribution des produits laitiers</Text>
        {!form && (
          <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
            Barrer les dates où il n'y auras pas de livraison
          </Text>
        )}
        <Text>Septembre : le 03, le 10, le 17 et le 24 </Text>
        <Text>Octobre : le 01, le 08, le 15, le 22 et le 29 </Text>
        <Text>Novembre : le 05, le 12, le 19 et le 26 </Text>
        <Text>Décembre : le 03, le 10, le 17, le 24 et le 30</Text>
      </View>
      <InvoiceThankYouMsg />
    </View>
  );
}

export function Calendar() {
  const daysInMonth = 31;
  const month = "August";
  const year = 2022;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <View style={AMAPStyle.container}>
      <Text style={AMAPStyle.title}>
        {month} {year} Calendar
      </Text>
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {days.map((day) => (
          <Text key={day} style={{ width: "14.28%", textAlign: "center", marginBottom: 10 }}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}
