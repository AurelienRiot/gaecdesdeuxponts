import Image from "next/image";
import Ferme from "@/public/ferme.webp";
import Vache from "@/public/vache.webp";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "À propos de nous",
    description:
      "Nous possédons une exploitation d’une surface totale de 130ha, dont 40% sont " +
      "des prairies naturelles humides de fond de vallée, régulièrement inondées " +
      "en hiver par les crues de la rivière du Don. Bien que le contexte naturel et le " +
      "caractère sensible de ces prairies limitent les périodes d’exploitation de ces " +
      "prairies, nous y prêtons une attention très particulière et " +
      "cherchons à les valoriser au maximum pour l’alimentation de leur troupeau " +
      "et l’autonomie alimentaire de leur ferme.",
  };
}

const PageLaFerme = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">
          À propos de nous
        </h2>
        <div className="grid grid-cols-1 items-center justify-center gap-4 text-center sm:grid-cols-2 ">
          <Image
            src={Ferme}
            width={2936}
            height={1168}
            placeholder="blur"
            alt="Photo de la ferme"
            className=" rounded-lg  shadow-md "
          />
          <div className="space-y-2 text-base lg:text-lg ">
            <p>
              {
                " Fondée en 1992, notre ferme familiale est située au cœur de la              région de Normandie, où nous cultivons avec passion et respect de              l'environnement. Nos pratiques agricoles durables soutiennent la              biodiversité et préservent les ressources naturelles."
              }
            </p>
            <p>
              Nous nous engageons à fournir des produits frais et de haute
              qualité directement de la ferme à votre table. Découvrez nos
              légumes biologiques, nos fromages artisanaux et notre gamme de
              produits faits maison.
            </p>
          </div>
          <div className="space-y-2 text-base lg:text-lg ">
            <p>
              {
                " Fondée en 1992, notre ferme familiale est située au cœur de la              région de Normandie, où nous cultivons avec passion et respect de              l'environnement. Nos pratiques agricoles durables soutiennent la              biodiversité et préservent les ressources naturelles."
              }
            </p>
            <p>
              Nous nous engageons à fournir des produits frais et de haute
              qualité directement de la ferme à votre table. Découvrez nos
              légumes biologiques, nos fromages artisanaux et notre gamme de
              produits faits maison.
            </p>
          </div>
          <Image
            src={Vache}
            placeholder="blur"
            width={1200}
            height={1600}
            alt="Photo de la ferme"
            className=" max-h-[50vh] w-auto justify-self-center rounded-lg  object-contain shadow-md sm:row-span-2 "
          />
          <div className="space-y-2 text-base lg:text-lg ">
            <p>
              {
                " Fondée en 1992, notre ferme familiale est située au cœur de la              région de Normandie, où nous cultivons avec passion et respect de              l'environnement. Nos pratiques agricoles durables soutiennent la              biodiversité et préservent les ressources naturelles."
              }
            </p>
            <p>
              Nous nous engageons à fournir des produits frais et de haute
              qualité directement de la ferme à votre table. Découvrez nos
              légumes biologiques, nos fromages artisanaux et notre gamme de
              produits faits maison.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageLaFerme;
