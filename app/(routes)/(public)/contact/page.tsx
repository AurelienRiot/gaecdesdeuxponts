import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactForm } from "./components/contact-form";
import GetUser from "@/actions/get-user";
import Link from "next/link";

export const metadata = {
  title: "GAEC des deux ponts - Contact",
  description: "Contact GAEC des deux ponts",
};

const ContactPage = async () => {
  const user = await GetUser();

  const name = user?.name;
  const email = user?.email;

  return (
    <Container className="px-4 py-5">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-5xl font-bold text-primary">
            Contactez-nous
          </h1>
          <p>
            Nous sommes là pour répondre à toutes vos questions sur notre lait
            cru et nos pratiques à la ferme.
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-secondary">Adresse</h2>
            <Skeleton className="h-2 w-10" />
          </div>
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-secondary">Téléphone</h2>
            <Skeleton className="h-2 w-10" />
          </div>
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-secondary">Email</h2>
            <Link href="mailto:contact@riottech.fr">
              <Skeleton className="h-2 w-10" />
            </Link>
          </div>
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-secondary">
              {"Heures d'ouverture"}
            </h2>
            <p>Du lundi au vendredi: 9h00 - 17h00</p>
          </div>
        </div>
      </div>
      <ContactForm name={name} email={email} />
    </Container>
  );
};

export default ContactPage;
