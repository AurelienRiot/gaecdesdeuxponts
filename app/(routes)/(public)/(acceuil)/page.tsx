import { Suspense } from "react";
import FeaturesWithHeading from "./_components/features";
import ImageAccueil from "./_components/image-accueil";
import { PartenaireCards } from "./_components/partenaires";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      {/* <TypewriterEffectSmooth
        className="justify-center px-4 py-2 text-center  font-display  text-5xl  font-bold tracking-wider [text-shadow:0px_0px_50px_hsla(0,_0%,_0%,_.4)] sm:py-10"
        words={words}
      /> */}

      <ImageAccueil />
      {/* <PorteOuverte /> */}
      {/* <Suspense fallback={<ProductListSkeleton title="Découvrer nos produits" />}>
        <NosProduits title="Découvrer nos produits" />
      </Suspense> */}
      <FeaturesWithHeading />

      <Suspense fallback={null}>
        <PartenaireCards />
      </Suspense>
    </>
  );
}

// const words = [
//   {
//     text: "Site",
//   },
//   {
//     text: "en",
//   },
//   {
//     text: "construction",
//     className: "text-orange-500",
//   },
// ];

// const NosProduits = async ({ title }: { title: string }) => {
//   const products = await getFeaturedProducts();

//   return <ProductList title={title} items={products} />;
// };
