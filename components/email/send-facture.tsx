import { Section, Text } from "@react-email/components";
import MainBody, { ButtonRedirect } from "./common";

const SendFactureEmail = ({ date, baseUrl, price, id, email }: FactureEmailProps) => (
  <MainBody baseUrl={baseUrl} previewText={`Votre commande d'un montant de ${price}`} notifications>
    <SendFactureBody price={price} baseUrl={baseUrl} date={date} id={id} email={email} />
  </MainBody>
);

SendFactureEmail.PreviewProps = {
  date: "24 juin 2024",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  price: "50€",
  email: "admin@admin.fr",
  id: "CM-27-6-24_04KYX",
} as FactureEmailProps;

interface FactureEmailProps {
  baseUrl: string;
  date: string;
  price: string;
  email: string;
  id: string;
}

const SendFactureBody = ({ date, price, baseUrl, id, email }: FactureEmailProps) => (
  <>
    <Text className="text-left text-base">Bonjour,</Text>

    <Text className="text-left text-base">{`Nous vous remercions d'avoir passé commande chez nous. Veuillez trouver ci-joint la facture de votre commande du ${date} pour un montant de ${price}.
`}</Text>

    <Text className="text-left text-base">
      {
        "Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
      }
    </Text>
    <Section className="text-center">
      <Text className="text-center text-base">
        Retrouver les informations de votre commande dans votre espace client en vous connectant avec votre adresse
        email : {email}
      </Text>

      <ButtonRedirect
        href={`${baseUrl}/profile/factures?emaillogin=${encodeURIComponent(email)}`}
        text="Voir ma commande"
      />
    </Section>

    <Text className="text-center text-base">Merci pour votre confiance.</Text>
  </>
);

export default SendFactureEmail;
