import { ScreenFitText } from "@/app/(routes)/(public)/(acceuil)/_components/screen-fit-text";
import ArticlePromotion from "./_components/article-promotion";
import ImageV2 from "./_components/image-v2";
import NosProduits from "./_components/nos-produits";
import { PartenaireCards } from "./_components/partenaires";
import WhyChooseUs from "./_components/why-choose-us";

export default function Home() {
  return (
    <>
      {" "}
      {/* <ScreenFitText text="Laiterie du Pont Robert" /> */}
      <ImageV2 />
      <NosProduits />
      <WhyChooseUs />
      <ArticlePromotion />
      <PartenaireCards />
    </>
  );
}
