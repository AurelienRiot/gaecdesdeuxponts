import Container from "@/components/ui/container";
import { Metadata } from "next";
import { ContactForm } from "./_components/contact-form";
import InfoContact from "./_components/info-contact";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description:
      "Nous sommes là pour répondre à toutes vos questions sur notre lait cru et nos pratiques à la ferme.",
  };
}

const ContactPage = () => {
  return (
    <Container className="px-4 py-5">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-5xl font-bold text-primary">Contactez-nous</h1>
        <p>
          Nous sommes là pour répondre à toutes vos questions sur notre lait cru
          et nos pratiques à la ferme.
        </p>
      </div>

      <InfoContact />
      <ContactForm />
    </Container>
  );
};

export default ContactPage;
