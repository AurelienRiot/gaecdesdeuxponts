import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const MainBody = ({
  children,
  previewText,
  baseUrl,
}: {
  children: React.ReactNode;
  previewText: string;
  baseUrl: string;
}) => (
  <Html>
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
        alt="Laiterie du Pont Robert Logo"
        className="mr-auto"
      />
    </a>
  </>
);

export const ButtonProfile = ({
  href,
  text,
}: {
  href: string;
  text: string;
}) => (
  <Button
    className="rounded-lg bg-green-500 px-6 py-3 text-center text-base text-primary"
    href={href}
    target="_blank"
  >
    {text}
  </Button>
);

export default MainBody;
