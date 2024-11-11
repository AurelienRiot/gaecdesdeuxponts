import { Text } from "@react-email/components";
import MainBody from "./common";

const OrderEmail = ({ date, baseUrl, price, id, email }: OrderEmailProps) => (
  <MainBody baseUrl={baseUrl} previewText={`Votre commande d'un montant de ${price}`}>
    <OrderBody price={price} baseUrl={baseUrl} date={date} id={id} email={email} />
  </MainBody>
);

OrderEmail.PreviewProps = {
  date: "01/01/2022",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  price: "50€",
  email: "admin@admin.fr",
  id: "FA_123456789",
} as OrderEmailProps;

interface OrderEmailProps {
  email: string;
  baseUrl: string;
  date: string;
  price: string;
  id: string;
}

const OrderBody = ({ date, price, baseUrl, id, email }: OrderEmailProps) => (
  <>
    <Text className="text-left text-base">Bonjour,</Text>

    <Text className="text-left text-base">{`Nous vous remercions d'avoir passé commande chez nous. Nous avons bien reçu votre commande numéro ${id} passée le ${date} pour un montant de ${price}.
`}</Text>

    <Text className="text-left text-base">
      {
        "Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
      }
    </Text>
    {/* <Section className="text-center">
      <Text className="text-center text-base">
        Retrouver les informations de votre commande dans votre espace client
      </Text>

      <ButtonRedirect
        href={`${baseUrl}/profile/commandes?emaillogin=${encodeURIComponent(email)}`}
        text="Voir ma commande"
      />
    </Section> */}

    <Text className="text-center text-base">Merci pour votre confiance.</Text>
  </>
);

export default OrderEmail;
