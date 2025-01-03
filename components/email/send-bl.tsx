import { Text } from "@react-email/components";
import MainBody from "./common";

export interface BLEmailProps {
  baseUrl: string;
  date: string;
  id: string;
  email: string;
}

const SendBLEmail = ({ date, baseUrl, id, email }: BLEmailProps) => (
  <MainBody baseUrl={baseUrl} previewText={`Votre bon de livraison Laiterie du Pont Robert`}>
    <SendBLBody baseUrl={baseUrl} date={date} id={id} email={email} />
  </MainBody>
);

SendBLEmail.PreviewProps = {
  date: "24 juin 2024",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  email: "admin@admin.fr",
  id: "CM-27-6-24_04KYX",
} as BLEmailProps;

const SendBLBody = ({ date, baseUrl, id, email }: BLEmailProps) => (
  <>
    <Text className="text-left text-base">Bonjour,</Text>

    <Text className="text-left text-base">{`Nous vous remercions d'avoir passé commande chez nous. Veuillez trouver ci-joint le bon de livraison de votre commande numéro ${id} pour le ${date}.
`}</Text>

    <Text className="text-left text-base">
      {
        "Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
      }
    </Text>
    {/* <Section className="text-center">
      <Text className="text-center text-base">
        Retrouver les informations de votre commande dans votre espace client en vous connectant avec votre adresse
        email : {email}
      </Text>

      <ButtonRedirect
        href={`${baseUrl}/profile/commandes?emaillogin=${encodeURIComponent(email)}`}
        text="Voir ma commande"
      />
    </Section> */}

    <Text className="text-center text-base">Merci pour votre confiance.</Text>
  </>
);

export default SendBLEmail;
