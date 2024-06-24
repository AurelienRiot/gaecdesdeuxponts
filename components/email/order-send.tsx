import { Section, Text } from "@react-email/components";
import MainBody, { ButtonRedirect } from "./common";

export const OrderSendEmail = ({ date, baseUrl, price, id, name }: BillingEmailProps) => (
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
} as BillingEmailProps;

export interface BillingEmailProps {
	baseUrl: string;
	date: string;
	price: string;
	id: string;
	name: string;
}

export const OrderSendBody = ({ date, price, baseUrl, id, name }: BillingEmailProps) => (
	<Section className="text-center">
		<Text className="text-left text-base">{`Commande numéro ${id} passée le ${date} pour un montant de ${price} par ${name}.
`}</Text>

		<ButtonRedirect href={`${baseUrl}/admin/orders/${id}`} text="Voir la commande" />
	</Section>
);

export default OrderSendEmail;
