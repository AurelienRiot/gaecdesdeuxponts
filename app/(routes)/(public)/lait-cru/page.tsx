import BidonLait from "@/public/bidon-lait.jpg";
import VacheChamps from "@/public/vache-champs2.webp";
import Veau from "@/public/veau.webp";
import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Lait Cru",
    description:
      "Nous nous engageons à produire du lait cru bio de la plus haute qualité, en adoptant une approche respectueuse de l’environnement et de nos animaux. Le lait cru est un produit non pasteurisé qui conserve tous ses nutriments et saveurs naturels. Pour assurer une qualité irréprochable, nous suivons des pratiques rigoureuses de gestion de l’élevage et de la traite. Nos vaches pâturent librement dans des prairies naturelles, ce qui leur permet de se nourrir d’herbes fraîches et variées, contribuant à un lait riche et savoureux. Nous surveillons attentivement leur santé et leur bien-être, garantissant ainsi un produit final sain et nutritif.",
  };
}

const LaitCruPage = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-5xl font-bold">La Démarche du Lait Cru </h1>
        <div className="grid grid-cols-1 items-center justify-center gap-4 text-center sm:grid-cols-2">
          <Image
            src={VacheChamps}
            width={3175}
            height={1662}
            placeholder="blur"
            alt="Vache champs"
            className="mx-auto max-w-sm rounded-lg shadow-md sm:max-w-full md:max-w-sm"
          />
          <div className="space-y-2 text-base lg:text-lg">
            <p>
              Nous nous engageons à produire du lait cru bio de la plus haute qualité, en adoptant une approche
              respectueuse de l’environnement et de nos animaux. Le lait cru est un produit non pasteurisé qui conserve
              tous ses nutriments et saveurs naturels. Pour assurer une qualité irréprochable, nous suivons des
              pratiques rigoureuses de gestion de l’élevage et de la traite.
            </p>
            <p>
              Nos vaches pâturent librement dans des prairies naturelles, ce qui leur permet de se nourrir d’herbes
              fraîches et variées, contribuant à un lait riche et savoureux. Nous surveillons attentivement leur santé
              et leur bien-être, garantissant ainsi un produit final sain et nutritif.
            </p>
          </div>
          <div className="space-y-2 text-base lg:text-lg">
            <p>
              La production de lait cru nécessite un soin particulier durant le processus de traite et de stockage pour
              prévenir toute contamination. Nous utilisons des équipements de traite modernes et désinfectés
              régulièrement pour maintenir des conditions d’hygiène optimale.
            </p>
            <p>
              Le lait est ensuite refroidi rapidement après la traite pour préserver sa fraîcheur et ses qualités
              nutritives. Ce lait cru est conditionné et distribué directement aux consommateurs sans subir de
              traitements thermiques, conservant ainsi tous les enzymes et probiotiques bénéfiques qui peuvent être
              détruits lors de la pasteurisation.
            </p>
          </div>
          <Image
            src={BidonLait}
            width={500}
            height={500}
            placeholder="blur"
            alt="Bidon lait"
            className="mx-auto max-w-sm rounded-lg shadow-md sm:max-w-full md:max-w-sm"
          />
          <Image
            src={Veau}
            width={5184}
            height={3456}
            placeholder="blur"
            alt="Veau"
            className="mx-auto hidden max-w-sm rounded-lg shadow-md sm:block sm:max-w-full md:max-w-sm"
          />
          <div className="space-y-2 text-base lg:text-lg">
            <p>
              Notre démarche repose également sur une transparence totale et une relation de confiance avec nos clients.
              Nous invitons les consommateurs à visiter notre ferme pour découvrir nos méthodes de production et
              rencontrer nos vaches. En achetant notre lait cru bio, vous soutenez une agriculture durable et locale,
              tout en profitant d’un produit authentique et savoureux.
            </p>
            <p>
              Nous croyons fermement que le lait cru, lorsqu’il est produit dans des conditions rigoureuses et
              respectueuses, est non seulement bénéfique pour la santé, mais aussi pour l’environnement et l’économie
              locale.
            </p>
          </div>
          <Image
            src={Veau}
            width={5184}
            height={3456}
            placeholder="blur"
            alt="Veau"
            className="mx-auto max-w-sm rounded-lg shadow-md sm:hidden sm:max-w-full md:max-w-sm"
          />
          T
        </div>
      </div>
    </section>
  );
};
export default LaitCruPage;
