import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const ContactPage = () => {
  return (
    <Container className="px-4 py-5">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Contactez-nous
          </h1>
          <p className="text-gray-600">
            Nous sommes là pour répondre à toutes vos questions sur notre lait
            cru et nos pratiques à la ferme.
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-gray-700">Adresse</h2>
            <Skeleton className="h-2 w-10" />
          </div>
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-gray-700">Téléphone</h2>
            <Skeleton className="h-2 w-10" />
          </div>
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-gray-700">Email</h2>
            <Skeleton className="h-2 w-10" />
          </div>
          <div className="mb-4 flex items-center gap-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {"Heures d'ouverture"}
            </h2>
            <p className="text-gray-600">Du lundi au vendredi: 9h00 - 17h00</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ContactPage;
