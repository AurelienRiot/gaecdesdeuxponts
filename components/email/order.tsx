import { Section, Text } from "@react-email/components";
import MainBody, { ButtonRedirect } from "./common";

export const OrderEmail = ({ date, baseUrl, price, id }: BillingEmailProps) => (
	<MainBody baseUrl={baseUrl} previewText={`Votre commande d'un montant de ${price}`}>
		<OrderBody price={price} baseUrl={baseUrl} date={date} id={id} />
	</MainBody>
);

OrderEmail.PreviewProps = {
	date: "01/01/2022",
	baseUrl: "https://www.laiteriedupontrobert.fr",
	price: "50€",
	email: "admin@admin.fr",
	id: "FA_123456789",
} as BillingEmailProps;

export interface BillingEmailProps {
	baseUrl: string;
	date: string;
	price: string;
	id: string;
}

export const OrderBody = ({ date, price, baseUrl, id }: BillingEmailProps) => (
	<>
		<Text className="text-left text-base">Bonjour,</Text>

		<Text className="text-left text-base">{`Nous vous remercions d'avoir passé commande chez nous. Nous avons bien reçu votre commande numéro ${id} passée le ${date} pour un montant de ${price}.
`}</Text>

		<Text className="text-left text-base">
			{
				"Si vous avez des questions ou des préoccupations concernant votre commande, n'hésitez pas à nous contacter à laiteriedupontrobert@gmail.com ou au 06.72.06.45.55."
			}
		</Text>
		<Section className="text-center">
			<Text className="text-center text-base">
				Retrouver les informations de votre commande dans votre espace client
			</Text>

			<ButtonRedirect href={`${baseUrl}/dashboard-user/orders`} text="Voir ma commande" />
		</Section>

		<Text className="text-center text-base">Merci pour votre confiance.</Text>
	</>
);

export default OrderEmail;
