import { Section, Text } from "@react-email/components";
import MainBody, { ButtonRedirect } from "./common";

export interface ContactSendProps {
	url: string;
	baseUrl: string;
	name: string;
	message: string;
}

export const ContactSend = ({ url, baseUrl, name, message }: ContactSendProps) => (
	<MainBody baseUrl={baseUrl} previewText={`Nouveau message de ${name}`}>
		<ContactSendBody url={url} name={name} message={message} />
	</MainBody>
);

export default ContactSend;

ContactSend.PreviewProps = {
	url: "https://www.laiteriedupontrobert.fr",
	baseUrl: "https://www.laiteriedupontrobert.fr",
	name: "Laiterie du Pont Robert",
	message: `Nous sommes Julie et Jean-Marc, les heureux propriétaires d’une jeune exploitation agricole située dans la vallée du Don, en plein cœur du territoire des Marais de Vilaine. Notre ferme s’étend sur 130 hectares, dont 40% sont des prairies naturelles humides. Ces prairies, souvent inondées en hiver par les crues de la rivière, sont une véritable richesse pour notre exploitation.
  Nous y portons une attention particulière pour les valoriser au maximum, tant pour l’alimentation de notre troupeau de 80 vaches laitières élevées en agriculture biologique que pour assurer l’autonomie alimentaire de notre ferme.`,
} as ContactSendProps;

const ContactSendBody = ({ url, name, message }: { url: string; name: string; message: string }) => (
	<>
		<Text className="text-center text-base">Nouveau message de {name} </Text>
		<Text className="text-left text-base">{message}</Text>
		<Section className="text-center">
			<ButtonRedirect href={url} text="Consulter le message en cliquant ici" />
		</Section>
	</>
);
