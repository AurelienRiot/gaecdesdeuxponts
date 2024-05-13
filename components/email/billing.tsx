import { Section, Text } from "@react-email/components";
import MainBody, { ButtonProfile } from "./common";

export interface BillingEmailProps {
  baseUrl: string;
  date: string;
  price: string;
  id: string;
}

export const BillingEmail = ({
  date,
  baseUrl,
  price,
  id,
}: BillingEmailProps) => (
  <MainBody
    baseUrl={baseUrl}
    previewText="Confirmation du paiement de votre commande - Laiterie du Pont Robert"
  >
    <BillingBody price={price} baseUrl={baseUrl} date={date} id={id} />
  </MainBody>
);

BillingEmail.PreviewProps = {
  date: "01/01/2022",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  price: "50€",
  id: "FA_123456789",
} as BillingEmailProps;

export const BillingBody = ({
  date,
  price,
  baseUrl,
  id,
}: BillingEmailProps) => (
  <>
    <Text className="text-left text-base ">Bonjour,</Text>

    <Text className="text-left text-base ">{`
    Nous avons le plaisir de vous informer que le paiement de votre commande numéro ${id} du ${date} pour un montant de ${price} a été confirmée.

`}</Text>

    <Text className="text-left text-base ">
      {
        "Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
      }
    </Text>
    <Section className="text-center">
      <Text className="text-center text-base ">
        Retrouver la facture et les informations de votre commande dans votre
        espace client
      </Text>

      <ButtonProfile
        href={`${baseUrl}/dashboard-user/orders`}
        text="Voir ma commande"
      />
    </Section>

    <Text className="text-center text-base ">
      Merci encore pour votre achat et pour la confiance que vous nous accordez.
    </Text>
  </>
);

export default BillingEmail;
