import { ProductList } from "@/components/skeleton-ui/products-list-skeleton";
import { Suspense } from "react";
import FeaturesWithHeading from "./_components/features";
import ImageAccueil from "./_components/image-accueil";
import NosProduits from "./_components/nos-produits";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      {/* <TypewriterEffectSmooth
        className="justify-center px-4 py-2 text-center  font-display  text-5xl  font-bold tracking-wider [text-shadow:0px_0px_50px_hsla(0,_0%,_0%,_.4)] sm:py-10"
        words={words}
      /> */}

      <ImageAccueil />
      <Suspense fallback={<ProductList title="Découvrer nos produits" />}>
        <NosProduits title="Découvrer nos produits" />
      </Suspense>
      <FeaturesWithHeading />

      {/* <PartenaireCards /> */}
    </>
  );
}

const words = [
  {
    text: "Site",
  },
  {
    text: "en",
  },
  {
    text: "construction",
    className: "text-orange-500",
  },
];
