import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface WelcomeEmailProviderProps {
  url: string;
  baseUrl: string;
}

export const WelcomeEmailProvider = ({
  url,
  baseUrl,
}: WelcomeEmailProviderProps) => (
  <Html>
    <Head />
    <Preview>Bienvenue sur GAEC des deux ponts</Preview>
    <Body style={main}>
      <Container style={container}>
        <a href={baseUrl} target="_blank">
          <Img
            src={`${baseUrl}/icone.jpeg`}
            width="50"
            height="50"
            alt="GAEC des deux ponts Logo"
            style={logo}
          />
        </a>
        <Text style={paragraph}>Bonjour,</Text>
        <Text style={paragraph}>Bienvenue sur GAEC des deux ponts</Text>
        <Section style={btnContainer}>
          <Button style={button} href={url} target="_blank">
            Connectez-vous en cliquant ici
          </Button>
        </Section>
        <Text style={paragraph}>
          Cordialement,
          <br />
          GAEC des deux ponts
        </Text>
        <Hr style={hr} />
        <Text style={footer}>6 B le Pont Robert 44290 MASSERAC</Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmailProvider;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
