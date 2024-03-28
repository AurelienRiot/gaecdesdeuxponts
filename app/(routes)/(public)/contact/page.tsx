import GetUser from "@/actions/get-user";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { LoadingButton } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "./components/contact-form";

export const metadata = {
  title: "GAEC des deux ponts - Contact",
  description: "Contact GAEC des deux ponts",
};

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

      <Suspense fallback={<ContactFormLoading />}>
        <Form />
      </Suspense>

      <div className="mt-8">
        <p>6 B le Pont Robert 44290 MASSERAC</p>
        <p>06 72 06 45 55</p>
        <Link href="mailto:contact@riottech.fr">
          gaecdesdeuxponts@gmail.com
        </Link>
        <p>Du lundi au vendredi: 9h00 - 17h00</p>
      </div>
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
      <LoadingButton disabled={true} variant={"shadow"}>
        Envoyer
      </LoadingButton>
    </div>
  </>
);
