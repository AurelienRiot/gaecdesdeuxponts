import Image from "next/image";

const PageLaFerme = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">
          À propos de nous
        </h2>
        <div className="flex flex-wrap items-center justify-center text-center md:text-left">
          <div className="w-[80vw] p-4 lg:w-[40vw]">
            <Image
              src="/ferme.webp"
              width={2936}
              height={1168}
              alt="Photo de la ferme"
              className="o rounded-lg shadow-md"
            />
          </div>
          <div className="w-[80vw] p-4 lg:w-[40vw]">
            <p className="mb-4 text-lg text-gray-700">
              {
                " Fondée en 1992, notre ferme familiale est située au cœur de la              région de Normandie, où nous cultivons avec passion et respect de              l'environnement. Nos pratiques agricoles durables soutiennent la              biodiversité et préservent les ressources naturelles."
              }
            </p>
            <p className="text-lg text-gray-700">
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
