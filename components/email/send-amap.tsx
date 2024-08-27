import { Section, Text } from "@react-email/components";
import MainBody, { ButtonRedirect } from "./common";

export interface AMAPEmailProps {
  baseUrl: string;
  id: string;
  email: string;
  startDate: string;
  endDate: string;
}

export const SendAMAPEmail = ({ baseUrl, id, email, startDate, endDate }: AMAPEmailProps) => (
  <MainBody baseUrl={baseUrl} previewText={`Votre contrat AMAP Laiterie du Pont Robert`}>
    <SendAMAPBody baseUrl={baseUrl} id={id} email={email} startDate={startDate} endDate={endDate} />
  </MainBody>
);

SendAMAPEmail.PreviewProps = {
  date: "24 juin 2024",
  startDate: "3 septembre 2024",
  endDate: "31 décembre 2024",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  email: "admin@admin.fr",
  id: "CM-27-6-24_04KYX",
} as AMAPEmailProps;

export const SendAMAPBody = ({ baseUrl, id, email, startDate, endDate }: AMAPEmailProps) => (
  <>
    <Text className="text-left text-base">Bonjour,</Text>

    <Text className="text-left text-base">{`Nous vous remercions d'avoir passé commande chez nous. Veuillez trouver ci-joint le contrat AMAP pour la période entre le ${startDate} et le ${endDate} .
`}</Text>

    <Text className="text-left text-base">
      {
        "Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
      }
    </Text>

    <Text className="text-center text-base">Merci pour votre confiance.</Text>
  </>
);

export default SendAMAPEmail;
