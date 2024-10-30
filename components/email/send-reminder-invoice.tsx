import { Text } from "@react-email/components";
import MainBody from "./common";

const SendReminderInvoiceEmail = (props: ReminderInvoiceEmailProps) => (
  <MainBody baseUrl={props.baseUrl} previewText={`Rappel de paiement de facture en attente`} notifications>
    <ReminderSendInvoiceBody {...props} />
  </MainBody>
);

// SendReminderInvoiceEmail.PreviewProps = {
//   date: "24 juin 2024",
//   baseUrl: "https://www.laiteriedupontrobert.fr",
//   price: "50€",
//   email: "admin@admin.fr",
//   id: "FA_2024_0038",
//   type: "single",
// } as ReminderInvoiceEmailProps;

SendReminderInvoiceEmail.PreviewProps = {
  date: "juin 2024",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  price: "50€",
  email: "admin@admin.fr",
  id: "FA_2024_0038",
  type: "monthly",
} as ReminderInvoiceEmailProps;

interface ReminderInvoiceEmailProps {
  baseUrl: string;
  date: string;
  price: string;
  email: string;
  id: string;
  type: "single" | "monthly";
}

const ReminderSendInvoiceBody = ({ date, price, baseUrl, id, email, type }: ReminderInvoiceEmailProps) => (
  <>
    <Text className="text-left text-base">Bonjour,</Text>

    {type === "single" && (
      <Text className="text-left text-base">{`Nous souhaitons vous rappeler que la facture n° ${id}, d’un montant de ${price}, émise le ${date}, reste en attente de règlement.`}</Text>
    )}
    {type === "monthly" && (
      <Text className="text-left text-base">{`Nous souhaitons vous rappeler que la facture n° ${id}, d’un montant de ${price}, de ${date}, reste en attente de règlement.`}</Text>
    )}
    <Text className="text-left text-base">Pour faciliter la transaction, voici les informations de règlement :</Text>

    <Text className="text-left text-base">
      <strong>IBAN :</strong> FR76 1360 6000 6846 3201 0973 614 <br />
      <strong>BIC :</strong> AGRIFRPP836
    </Text>

    <Text className="text-left text-base">
      {
        "Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
      }
    </Text>

    <Text className="text-center text-base">Merci pour votre confiance.</Text>
  </>
);

export default SendReminderInvoiceEmail;
