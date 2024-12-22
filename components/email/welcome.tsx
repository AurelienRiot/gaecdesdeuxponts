import { Heading, Section, Text } from "@react-email/components";
import MainBody from "./common";

export interface WelcomeEmailProps {
  otp: string;
  baseUrl: string;
  connectionLink: string;
}

export const WelcomeEmail = ({ otp, baseUrl, connectionLink }: WelcomeEmailProps) => (
  <MainBody
    baseUrl={baseUrl}
    previewText={`Bienvenue ! Entrez votre code unique ${otp} pour vous connecter et passer commande`}
  >
    <WelcomeBody otp={otp} connectionLink={connectionLink} />
  </MainBody>
);

export default WelcomeEmail;

WelcomeEmail.PreviewProps = {
  otp: "123456",
  baseUrl: "https://www.laiteriedupontrobert.fr",
  connectionLink:
    "https://www.laiteriedupontrobert.fr/api/auth/callback/email?callbackUrl=https%3A%2F%2Fwww.laiteriedupontrobert.fr%2Fprofile&token=b0b2b01a2878e339d4753261e61a28a523da0e59f0704546fd8f2a1e647d78ed&email=yoyololo1235%40gmail.com",
} as WelcomeEmailProps;

const WelcomeBody = ({ otp, connectionLink }: { otp: string; connectionLink: string }) => (
  <>
    <Text className="text-center text-base">Bonjour,</Text>
    <Text className="text-center text-base">Bienvenue sur Laiterie du Pont Robert</Text>
    <OTPEmail otp={otp} connectionLink={connectionLink} />
  </>
);

function OTPEmail({ otp, connectionLink }: { otp: string; connectionLink: string }) {
  return (
    <Section className="py-6 px-8 mx-auto">
      <Heading className="text-xl font-bold text-gray-800 mb-4">Vérifiez votre adresse e-mail</Heading>
      <Text className="text-sm text-gray-800 mb-3">
        Merci de vous être inscrit sur notre site. Pour confirmer que c’est bien vous, veuillez saisir le code de
        vérification suivant lorsque vous y êtes invité. Si vous n'êtes pas à l'origine de cette demande, vous pouvez
        ignorer ce message en toute sécurité.
      </Text>
      <Section className="flex items-center justify-center">
        <Text className="text-center font-bold text-sm text-gray-800">Code de verification</Text>
        <Text className="text-center font-bold text-4xl my-2 text-gray-800">{otp}</Text>
        <Text className="text-center text-sm text-gray-800">(Valide 10 minutes)</Text>
      </Section>
      <Section className="mt-4">
        <Text className="text-center text-sm text-gray-800 mb-2">
          Vous pouvez aussi vous connecter en cliquant sur le lien ci-dessous :
        </Text>
        <a href={connectionLink} className="text-center text-sm text-blue-500 hover:text-blue-700 truncate">
          https://www.laiteriedupontrobert.fr/api/auth/callback/email?...
        </a>
      </Section>
    </Section>
  );
}
