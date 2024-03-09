import Container from "@/components/ui/container";
import ImageAccueil from "./components/image-accueil";
import FarmIntroduction from "./components/introduction";
import WhyChooseUs from "./components/why-choose-us";
import dynamic from "next/dynamic";
const PDF = dynamic(() => import("./components/displayPDF"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <ImageAccueil />
      <Container>
        {" "}
        <div className=" mt-12 flex   flex-col items-center gap-4 rounded-xl bg-transparent p-6 font-bold text-primary backdrop-blur-md ">
          <h1 className="text-5xl md:text-7xl">Bienvenue</h1>
          <p className="text-2xl sm:text-3xl md:text-5xl">sur le</p>
          <p className="text-2xl sm:text-3xl md:text-5xl">
            GAEC des Deux Ponts
          </p>
          <div className="flex flex-col items-center justify-center text-lg sm:text-xl md:text-3xl">
            <p>Découvrez la fraîcheur et les bienfaits de notre lait cru,</p>
            <p>directement de notre ferme à votre table.</p>
          </div>
        </div>
        <FarmIntroduction />
        <WhyChooseUs />
        <PDF />
      </Container>
    </div>
  );
}
