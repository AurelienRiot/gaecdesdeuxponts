import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import ArticlePromotion from "./_components/article-promotion";
import ImageAccueil from "./_components/image-accueil";
import NosProduits from "./_components/nos-produits";
import { PartenaireCards } from "./_components/partenaires";
import WhyChooseUs from "./_components/why-choose-us";
import { Suspense } from "react";
import { ProductCart } from "@/components/skeleton-ui/product-cart-skeleton";

export default function Home() {
  return (
    <>
      <TypewriterEffectSmooth
        className="justify-center px-4 py-2 text-center  font-display  text-5xl  font-bold tracking-wider [text-shadow:0px_0px_50px_hsla(0,_0%,_0%,_.4)] sm:py-10"
        words={words}
      />

      <ImageAccueil />
      <Suspense
        fallback={Array(4)
          .fill(null)
          .map((_, i) => (
            <ProductCart key={i} />
          ))}
      >
        <NosProduits />
      </Suspense>
      <WhyChooseUs />
      <ArticlePromotion />
      <PartenaireCards />
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
