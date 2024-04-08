import ImageV2 from "./components/image-v2";
import NosProduits from "./components/nos-produits";
import { PartenaireCards } from "./components/partenaires";
import WhyChooseUs from "./components/why-choose-us";

export default function Home() {
  return (
    <>
      {" "}
      <ImageV2 />
      <NosProduits />
      <WhyChooseUs />
      <PartenaireCards />
    </>
  );
}
