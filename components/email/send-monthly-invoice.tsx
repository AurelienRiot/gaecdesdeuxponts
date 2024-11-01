import { Section, Text } from "@react-email/components";
import MainBody, { ButtonRedirect } from "./common";

const SendMonthlyInvoiceEmail = ({ date, baseUrl, email }: MonthlyInvoiceProps) => (
  <MainBody baseUrl={baseUrl} previewText={`Votre facture mensuelle de ${date}`}>
    <SendMonthlyInvoiceBody baseUrl={baseUrl} date={date} email={email} />
  </MainBody>
);

SendMonthlyInvoiceEmail.PreviewProps = {
  date: "juin 2024",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  email: "admin@admin.fr",
} as MonthlyInvoiceProps;

interface MonthlyInvoiceProps {
  baseUrl: string;
  date: string;
  email: string;
}

const SendMonthlyInvoiceBody = ({ date, baseUrl, email }: MonthlyInvoiceProps) => (
  <>
    <Text className="text-left text-base">Bonjour,</Text>

    <Text className="text-left text-base">{`Nous vous remercions d'avoir passé commande chez nous. Veuillez trouver ci-joint la facture mensuelle de ${date}.
`}</Text>

    <Text className="text-left text-base">
      {
        "Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
      }
    </Text>
    <Section className="text-center">
      <Text className="text-center text-base">
        Retrouver les informations de vos commandes dans votre espace client en vous connectant avec votre adresse email
        : {email}
      </Text>

      <ButtonRedirect
        href={`${baseUrl}/profile/factures?emaillogin=${encodeURIComponent(email)}`}
        text="Voir ma commande"
      />
    </Section>

    <Text className="text-center text-base">Merci pour votre confiance.</Text>
  </>
);

export default SendMonthlyInvoiceEmail;
