import { Body, Button, Container, Head, Hr, Html, Img, Preview, Tailwind, Text } from "@react-email/components";

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const MainBody = ({
  children,
  previewText,
  baseUrl,
  notifications = false,
}: {
  children: React.ReactNode;
  previewText: string;
  baseUrl: string;
  notifications?: boolean;
}) => (
  <Html lang="fr">
    <Head />
    <Preview>{previewText}</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: "#0f172a",
            },
          },
        },
      }}
    >
      <Body style={main} className="mx-auto my-auto bg-white px-2 font-sans">
        <Container className="mx-auto my-[40px] max-w-2xl rounded border border-solid border-[#eaeaea] p-[20px]">
          {children}
          <Footer baseUrl={baseUrl} />
          {notifications && <Notification />}
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

const Footer = ({ baseUrl }: { baseUrl: string }) => (
  <>
    <Text className="text-left text-base">
      Cordialement,
      <br />
      Laiterie du Pont Robert
    </Text>
    <Hr className="my-5 border-[#cccccc]" />
    <a href={baseUrl} target="_blank" rel="noreferrer">
      <Img
        src={`${baseUrl}/signature.webp`}
        width="230"
        height="75"
        alt="Signature Laiterie du Pont Robert"
        className="mr-auto"
      />
    </a>
  </>
);

const Notification = () => (
  <Text className="text-left text-xs">
    Vous pouvez désactiver l'envoi de mails pour les bons de livraison et les factures sur votre profil sur le site.
    <a
      href="https://www.laiteriedupontrobert.fr/profile"
      target="_blank"
      rel="noreferrer"
      className="text-blue-500 underline"
    >
      Désactiver
    </a>
    .
    <br />
    Si le lien ne fonctionne pas, copiez et collez cette URL dans votre navigateur:
    <span className="text-blue-500 underline">https://www.laiteriedupontrobert.fr/profile</span>
  </Text>
);

export const ButtonRedirect = ({
  href,
  text,
}: {
  href: string;
  text: string;
}) => (
  <>
    <Button
      className="rounded-lg bg-green-500 px-6 py-3 text-center text-base text-primary"
      href={href}
      target="_blank"
    >
      {text}
    </Button>
    <Text className="mt-2 text-center text-sm">
      Si le bouton ne fonctionne pas, copiez et collez cette URL dans votre navigateur:
      <span className="text-blue-500 underline">{href}</span>
    </Text>
  </>
);

export default MainBody;
