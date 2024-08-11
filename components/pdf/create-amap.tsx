import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Fragment } from "react";
import Details from "./details";
import { Company, borderColor, foregroundColor, mainColor } from "./main-document";
import type { AMAPType } from "./pdf-data";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://www.laiteriedupontrobert.fr/fonts/inter.ttf", fontWeight: 400 },
    { src: "https://www.laiteriedupontrobert.fr/fonts/inter-bold.ttf", fontWeight: 600 },
  ],
});

export const MapaStyle = StyleSheet.create({
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
    textIndent: 30,
  },
  paragraph: {
    textIndent: 30,
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

const AmapPDF = ({ data }: { data: AMAPType }) => (
  <Document title={`Contrat AMAP ${data.customer.orderId}`}>
    <Page size="A4" style={MapaStyle.page}>
      <View style={MapaStyle.header}>
        <Company />
        <Details pdfData={data} title="Contrat AMAP" />
      </View>
      <ContenueContrat />
      <Engagement />
      <Description />
      <Consommateur customer={data.customer} />
      <Commande order={data.order} />
      <DateDistribution />
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
      <Text
        style={MapaStyle.pageNumbers}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default AmapPDF;

function ContenueContrat() {
  return (
    <View style={MapaStyle.container}>
      <Text style={MapaStyle.title}>Contenu du contrat</Text>
      <Text style={MapaStyle.paragraph}>
        Le présent contrat est passé entre le/la consommateur.trice et les producteurs pour l’approvisionnement toutes
        les deux semaines (semaines impaires) de produits laitiers bio pour une durée totale de 9 mois (d’avril à
        décembre) soit 20 semaines en 2024.
      </Text>
      <Text style={MapaStyle.paragraph}>
        Les producteurs s’engagent à exercer leur activité dans le respect de la charte des AMAP : qualité sanitaire des
        produits, respect de la biodiversité, de l’environnement.
      </Text>
      <Text style={MapaStyle.paragraph}>
        Le/la consommateur.trice et les producteurs doivent respecter la charte des AMAP consultable via le lien{" "}
        <Link href="http://www.reseau-amap.org/docs/chartedesamap.PDF">
          http://www.reseau-amap.org/docs/chartedesamap.PDF
        </Link>
        .
      </Text>
      <Text style={MapaStyle.paragraph}>
        La distribution du lait cru aura lieu toutes les deux semaines, les mardis soir, au local de l’ancien presbytère
        en face de la gendarmerie de Guémené Penfao, de 18h à 19h, en alternance avec les fromages de chèvre.
      </Text>
      <Text style={MapaStyle.paragraph}>
        Sur la période du contrat, certaines distributions pourront être susceptibles de ne pas être assurées si des
        difficultés ponctuelles sont rencontrées sur la ferme. Si cela devait arriver, les producteurs en informeront
        les consommateurs.trices aussi vite que possible et au moins une semaine à l’avance. Dans ce cas, soit les
        produits laitiers seront déposés au local de l’ancien presbytère et la distribution se fera en l’absence des
        producteurs, soit la distribution sera décalée à la semaine suivante. Le nombre de livraisons sera, dans tous
        les cas, conforme au nombre de mois prévus dans le contrat.
      </Text>
    </View>
  );
}

function Engagement() {
  return (
    <View style={MapaStyle.container}>
      <Text style={MapaStyle.title}>Engagement</Text>
      <Text style={MapaStyle.paragraph}>
        L’engagement suivant est souscrit et réglé par chèque(s) à la signature du contrat pour toutes les livraisons du
        contrat. Les chèques seront remplis à l’ordre de Gaec des deux ponts.
      </Text>
      <Text style={MapaStyle.paragraph}>
        Le/la consommateur.trice s’engage sur la totalité de la durée du contrat soit 9 mois.
      </Text>
      <Text style={MapaStyle.paragraph}>
        En cas d’oubli, le lait cru peut être retiré à la ferme le soir même de la distribution, sinon les produits
        seront perdus.
      </Text>
    </View>
  );
}

function Description() {
  return (
    <View style={[MapaStyle.container, { marginTop: 20 }]} break>
      <Text style={MapaStyle.title}>Descriptif des produits</Text>
      <Text style={{ fontWeight: "bold" }}>- Lait Cru Bio</Text>
      <Text style={[MapaStyle.paragraph, { textIndent: 0, marginTop: 10 }]}>
        En provenance directe de la ferme, notre lait cru est riche en nutriments essentiels tels que les vitamines, les
        minéraux et les enzymes naturelles qui sont souvent détruits lors de la pasteurisation.Notre lait cru doit être
        conservé entre 0°C et 4°C et consommé dans les 3 jours suivant l'achat pour garantir sa fraîcheur et sa qualité.
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

function Consommateur({ customer }: { customer: AMAPType["customer"] }) {
  return (
    <View style={MapaStyle.container}>
      <Text style={MapaStyle.title}>Consommateur.trice</Text>
      {!!customer.name && <Text>{customer.name}</Text>}
      {!!customer.facturationAddress && <Text>{customer.facturationAddress}</Text>}
      {!!customer.phone && <Text>{customer.phone}</Text>}
      {!!customer.email && <Text>{customer.email}</Text>}
    </View>
  );
}

function Commande({ order }: { order: AMAPType["order"] }) {
  return (
    <View style={MapaStyle.container}>
      <Text style={MapaStyle.title}>Commande</Text>
      <InvoiceTableHeader />
      <InvoiceTableRow items={order.items} />
      <InvoiceTableFooter order={order} />
      <View style={{ marginTop: 10, display: "flex", flexDirection: "row", gap: 4 }}>
        <Text style={{ fontWeight: "bold", textDecoration: "underline" }}>Semaine d'absence pévues :</Text>
        <Text>{order.weeksOfAbsence}</Text>
      </View>
      <View style={{ marginTop: 10, display: "flex", flexDirection: "row", gap: 4 }}>
        <Text style={{ fontWeight: "bold", textDecoration: "underline" }}>Règlement :</Text>
        <View style={{ fontSize: 10 }}>
          <Text>Si montant inférieur à 40 €, un seul chèque</Text>
          <Text>Si montant supérieur à 40 €, deux chèques encaissés au début et au milieu du contrat.</Text>
          <Text style={{ fontWeight: "bold" }}>A l’ordre du Gaec des deux ponts</Text>
        </View>
      </View>
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

const InvoiceTableHeader = () => (
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

const InvoiceTableRow = ({ items }: { items: AMAPType["order"]["items"] }) => {
  const rows = items.map((item, i) => (
    <View style={tableRowStyles.row} key={i}>
      <Text style={tableRowStyles.description}>{item.desc}</Text>
      <Text style={tableRowStyles.unit}>{item.priceTTC}</Text>
      <Text style={tableRowStyles.qty}>{item.qty}</Text>
      <Text style={tableRowStyles.totalTTC}>{(item.priceTTC * item.qty).toFixed(2)}</Text>
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

const InvoiceTableFooter = ({
  order,
}: {
  order: AMAPType["order"];
}) => {
  const totalPrice = (
    order.items.reduce((acc, item) => acc + item.priceTTC * item.qty, 0) * order.numberOfWeek
  ).toFixed(2);
  return (
    <>
      <View style={tableFooterStyles.row}>
        <Text style={[tableFooterStyles.description, { fontSize: 10 }]}>
          Nombre de semaines prévues (possibilité de soustraire 2 semaines de vacances : merci de m’indiquer les numéros
          de vos semaines d’absence)
        </Text>
        <Text style={tableFooterStyles.total}> X {order.numberOfWeek}</Text>
      </View>
      <View style={tableFooterStyles.row}>
        <Text style={[tableFooterStyles.description, { fontWeight: "bold" }]}>MONTANT TOTAL ( € )</Text>
        <Text style={tableFooterStyles.total}> {totalPrice}</Text>
      </View>
    </>
  );
};

function DateDistribution() {
  return (
    <View break style={MapaStyle.container}>
      <Text style={MapaStyle.title}>Dates de distribution des Camemberts</Text>
      <Text style={MapaStyle.paragraph}>Avril : le 09 et le 23</Text>
      <Text style={MapaStyle.paragraph}> Mai : le 07 et le 21</Text>
      <Text style={MapaStyle.paragraph}>Juin : le 04 et le 18</Text>
      <Text style={MapaStyle.paragraph}>Juillet : le 02, le 16 et le 30 </Text>
      <Text style={MapaStyle.paragraph}>Août : le 13 et le 27 </Text>
      <Text style={MapaStyle.paragraph}>Septembre : le 10 et le 24 </Text>
      <Text style={MapaStyle.paragraph}>Octobre : le 08 et le 22 </Text>
      <Text style={MapaStyle.paragraph}>Novembre : le 05 et le 19 </Text>
      <Text style={MapaStyle.paragraph}>Décembre : le 03, le 17 et le 31</Text>
    </View>
  );
}
<Text style={MapaStyle.paragraph}></Text>;
