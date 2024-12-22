import FeaturesWithHeading from "./_components/features";
import ImageAccueil from "./_components/image-accueil";
import { PartenaireCards } from "./_components/partenaires";

export const revalidate = 604800;

export default async function Home() {
  return (
    <>
      <ImageAccueil />
      {/* <PorteOuverte /> */}
      {/* <Suspense fallback={<ProductListSkeleton title="Découvrer nos produits" />}>
        <NosProduits title="Découvrer nos produits" />
      </Suspense> */}
      <FeaturesWithHeading />
      <PartenaireCards />
    </>
  );
}
