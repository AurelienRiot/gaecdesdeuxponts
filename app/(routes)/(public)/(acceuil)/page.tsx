import ImageV2 from "./components/image-v2";
import NosProduits from "./components/nos-produits";
import WhyChooseUs from "./components/why-choose-us";

export default async function Home() {
  return (
    <>
      {" "}
      <ImageV2 />
      <NosProduits />
      <WhyChooseUs />
    </>
  );
}
