import { Section, Text } from "@react-email/components";
import MainBody, { ButtonRedirect } from "./common";

const OrderSendEmail = ({ date, baseUrl, price, id, name }: OrderEmailProps) => (
  <MainBody baseUrl={baseUrl} previewText={`Commande passé d'un montant de ${price}`}>
    <OrderSendBody price={price} baseUrl={baseUrl} date={date} id={id} name={name} />
  </MainBody>
);

OrderSendEmail.PreviewProps = {
  date: "01/01/2022",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  price: "50€",
  id: "FA_123456789",
  name: "Julie",
} as OrderEmailProps;

interface OrderEmailProps {
  baseUrl: string;
  date: string;
  price: string;
  id: string;
  name: string;
}

const OrderSendBody = ({ date, price, baseUrl, id, name }: OrderEmailProps) => (
  <Section className="text-center">
    <Text className="text-left text-base">{`Commande numéro ${id} pour le ${date} d'un montant de ${price} par ${name}.
`}</Text>

    <ButtonRedirect
      href={`${baseUrl}/admin/orders/${id}?emaillogin=${encodeURIComponent("laiteriedupontrobert@gmail.com")}`}
      text="Voir la commande"
    />
  </Section>
);

export default OrderSendEmail;
