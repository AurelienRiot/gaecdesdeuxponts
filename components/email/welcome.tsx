import { Section, Text } from "@react-email/components";
import MainBody, { ButtonProfile } from "./common";

export interface WelcomeEmailProps {
  url: string;
  baseUrl: string;
}

export const WelcomeEmail = ({ url, baseUrl }: WelcomeEmailProps) => (
  <MainBody
    baseUrl={baseUrl}
    previewText="Bienvenue ! Cliquez ici pour vous connecter et passer commande"
  >
    <WelcomeBody url={url} />
  </MainBody>
);

export default WelcomeEmail;

WelcomeEmail.PreviewProps = {
  url: "https://www.laiteriedupontrobert.fr",
  baseUrl: "https://www.laiteriedupontrobert.fr",
} as WelcomeEmailProps;

const WelcomeBody = ({ url }: { url: string }) => (
  <>
    <Text className="text-center text-base">Bonjour,</Text>
    <Text className="text-center text-base">
      Bienvenue sur Laiterie du Pont Robert
    </Text>
    <Section className="text-center">
      <ButtonProfile href={url} text="Connectez-vous en cliquant ici" />
    </Section>
  </>
);
