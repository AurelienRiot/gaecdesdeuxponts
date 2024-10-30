import { Text } from "@react-email/components";
import MainBody from "./common";
const SendInvoiceEmail = (props: InvoiceEmailProps) => (
  <MainBody
    baseUrl={props.baseUrl}
    previewText={`Votre facture ${props.type === "single" ? `du ${props.date}` : `mensuelle de ${props.date}`}`}
    notifications
  >
    <SendInvoiceBody {...props} />
  </MainBody>
);

// SendInvoiceEmail.PreviewProps = {
//   date: "24 juin 2024",
//   baseUrl: "https://www.laiteriedupontrobert.fr",
//   price: "50€",
//   email: "admin@admin.fr",
//   id: "CM-27-6-24_04KYX",
//   type: "single",
// } as InvoiceEmailProps;

SendInvoiceEmail.PreviewProps = {
  date: "juin 2024",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  price: "50€",
  email: "admin@admin.fr",
  id: "FA_2024_0038",
  type: "monthly",
} as InvoiceEmailProps;

interface InvoiceEmailProps {
  baseUrl: string;
  price: string;
  email: string;
  id: string;
  date: string;
  type: "single" | "monthly";
}

const SendInvoiceBody = ({ date, price, baseUrl, id, email, type }: InvoiceEmailProps) => (
  <>
    <Text className="text-left text-base">Bonjour,</Text>

    {type === "single" && (
      <Text className="text-left text-base">{`Nous vous remercions d'avoir passé commande chez nous. Veuillez trouver ci-joint la facture de votre commande du ${date} pour un montant de ${price}.
`}</Text>
    )}
    {type === "monthly" && (
      <Text className="text-left text-base">{`Nous vous remercions d'avoir passé commande chez nous. Veuillez trouver ci-joint la facture mensuelle de ${date} du montant de ${price}.
`}</Text>
    )}
    <Text className="text-left text-base">
      {
        "Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
      }
    </Text>

    <Text className="text-center text-base">Merci pour votre confiance.</Text>
  </>
);

export default SendInvoiceEmail;
