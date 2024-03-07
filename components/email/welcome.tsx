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

export interface WelcomeEmailProps {
  name: string;
  baseUrl: string;
}

export const WelcomeEmail = ({ name, baseUrl }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bienvenue sur Riot Tech</Preview>
    <Body style={main}>
      <Container style={container}>
        <a href={baseUrl} target="_blank">
          <Img
            src={`${baseUrl}/image_limpa-car.jpg`}
            width="50"
            height="50"
            alt="Limpa Car Logo"
            style={logo}
          />
        </a>
        <Text style={paragraph}>Bonjour {name},</Text>
        <Text style={paragraph}>Bienvenue sur Limpa Car</Text>
        <Section style={btnContainer}>
          <Button style={button} href={`${baseUrl}/"login"`} target="_blank">
            Connectez-vous ici
          </Button>
        </Section>
        <Text style={paragraph}>
          Cordialement,
          <br />
          Limpa Car
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Rue des Frêles 35600 Bains sur Oust</Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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
