import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const ContactPage = () => {
  return (
    <Container className="px-4 py-5">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary">
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
            <Skeleton className="h-2 w-10" />
          </div>
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-secondary">
              {"Heures d'ouverture"}
            </h2>
            <p>Du lundi au vendredi: 9h00 - 17h00</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ContactPage;
