import { Heading, Section, Text } from "@react-email/components";
import MainBody from "./common";

export interface WelcomeEmailProps {
  otp: string;
  baseUrl: string;
}

export const WelcomeEmail = ({ otp, baseUrl }: WelcomeEmailProps) => (
  <MainBody
    baseUrl={baseUrl}
    previewText={`Bienvenue ! Entrez votre code unique ${otp} pour vous connecter et passer commande`}
  >
    <WelcomeBody otp={otp} />
  </MainBody>
);

export default WelcomeEmail;

WelcomeEmail.PreviewProps = {
  otp: "123456",
  baseUrl: "https://www.laiteriedupontrobert.fr",
} as WelcomeEmailProps;

const WelcomeBody = ({ otp }: { otp: string }) => (
  <>
    <Text className="text-center text-base">Bonjour,</Text>
    <Text className="text-center text-base">Bienvenue sur Laiterie du Pont Robert</Text>
    <OTPEmail otp={otp} />
  </>
);

function OTPEmail({ otp }: { otp: string }) {
  return (
    <Section className="py-6 px-8 mx-auto ">
      <Heading className="text-xl font-bold text-gray-800 mb-4">Vérifiez votre adresse e-mail</Heading>
      <Text className="text-sm text-gray-800 mb-3">
        Merci de vous être inscrit sur notre site. Pour confirmer que c’est bien vous, veuillez saisir le code de
        vérification suivant lorsque vous y êtes invité. Si vous n'êtes pas à l'origine de cette demande, vous pouvez
        ignorer ce message en toute sécurité.
      </Text>
      <Section className="flex items-center justify-center">
        <Text className="text-center font-bold text-sm text-gray-800">Code de verification</Text>
        <Text className="text-center font-bold text-4xl my-2 text-gray-800">{otp}</Text>
        <Text className="text-center text-sm text-gray-800">(Ce code est valide pour 10 minutes)</Text>
      </Section>
    </Section>
  );
}
