import Image from "next/image";

const PageLaFerme = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">
          À propos de nous
        </h2>
        <div className="grid grid-cols-1 items-center justify-center gap-4 text-center sm:grid-cols-2 ">
          <Image
            src="/ferme.webp"
            width={2936}
            height={1168}
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
            src="/vache.webp"
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
