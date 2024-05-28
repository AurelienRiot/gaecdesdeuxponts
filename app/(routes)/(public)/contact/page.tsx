import GetUser from "@/actions/get-user";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { LoadingButton } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "./_components/contact-form";
import InfoContact from "./_components/info-contact";

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
      <Suspense fallback={<ContactFormLoading />}>
        <Form />
      </Suspense>
    </Container>
  );
};

export default ContactPage;

const Form = async () => {
  const user = await GetUser();
  return (
    <ContactForm name={user?.name} email={user?.email} phone={user?.phone} />
  );
};

const ContactFormLoading = async () => (
  <>
    <div className="mt-8 flex items-center justify-between">
      <Heading
        title="Formulaire de Contact"
        description="Demande d'information"
      />
    </div>
    <Separator className="my-2" />
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <div>{"Nom/Prénom ou nom d'entreprise"}</div>
          <Input disabled={true} placeholder="Nom" />
        </div>

        <div className="space-y-2">
          <div>Email</div>
          <div className="flex items-start gap-x-4">
            <Input disabled={true} placeholder="exemple@mail.com" />
          </div>
        </div>

        <div className="space-y-2">
          <div>{"Numéro de téléphone (facultatif)"}</div>
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="space-y-2">
          <div>Sujet</div>
          <div className="flex items-start gap-x-4">
            <Input disabled={true} placeholder="Renseignement" />
          </div>
        </div>

        <div className="space-y-2">
          <div>Message</div>
          <div className="flex items-start gap-x-4">
            <AutosizeTextarea placeholder="..." disabled={true} />
          </div>
        </div>
      </div>
      <LoadingButton disabled={true}>Envoyer</LoadingButton>
    </div>
  </>
);
