import { Handshake, Heart, Leaf, Palette, Recycle, Truck } from "lucide-react";

interface Feature {
  id: number;
  name: string;
  description: string;
  icon: JSX.Element;
}

const iconSize = 18;

const FeaturesData: Feature[] = [
  {
    id: 1,
    name: "Fraîcheur Fermière",
    description:
      "Tous nos produits proviennent directement de la ferme, garantissant la fraîcheur du lait et des produits laitiers livrés directement à votre porte.",
    icon: <Truck size={iconSize} />,
  },
  {
    id: 2,
    name: "Qualité Biologique",
    description:
      "Savourez le goût naturel de nos produits laitiers 100% biologiques, sans additifs ni conservateurs.",
    icon: <Leaf size={iconSize} />,
  },
  {
    id: 3,
    name: "Bienfaits pour la Santé",
    description:
      "Le lait cru est riche en nutriments et en enzymes essentiels connus pour stimuler la santé et améliorer la digestion.",
    icon: <Heart size={iconSize} />,
  },
  {
    id: 4,
    name: "Emballage Écologique",
    description:
      "Nos emballages sont conçus pour être respectueux de l'environnement, assurant un impact minimal sur l'environnement tout en maintenant la fraîcheur des produits.",
    icon: <Recycle size={iconSize} />,
  },
  {
    id: 5,
    name: "Soutien aux Agriculteurs Locaux",
    description:
      "En choisissant nos produits, vous aidez à soutenir les fermes locales et contribuez à des pratiques agricoles durables.",
    icon: <Handshake size={iconSize} />,
  },
  {
    id: 6,
    name: "Commandes Personnalisables",
    description:
      "Créez des commandes personnalisées selon vos préférences. Mélangez et assortissez pour trouver votre sélection de produits laitiers idéale.",
    icon: <Palette size={iconSize} />,
  },
];

const FeaturesGrid = () => {
  return (
    <div>
      <div className="mt-8 grid w-full grid-cols-1 gap-12 text-foreground md:grid-cols-2 xl:grid-cols-3">
        {FeaturesData.map((feature) => {
          return (
            <div key={feature.id} className="width-fit space-y-2 text-left">
              <div className=" w-fit rounded-lg bg-green-500 p-1 text-center ">
                {feature.icon}
              </div>
              <h3 className="md:text-md font-semibold  sm:text-base lg:text-lg">
                {feature.name}
              </h3>
              <p className="font-regular lg:text-md max-w-sm text-xs sm:text-sm md:text-base ">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FeaturesWithHeading = () => {
  return (
    <div className="my-12 flex w-full flex-col items-center justify-center">
      <h2 className="mb-2 max-w-3xl text-center text-2xl font-semibold text-primary  md:text-4xl ">
        Découvrez la Pureté du Lait Directement de la Ferme
      </h2>
      <p className="max-w-sm text-center  text-secondary-foreground">
        Nos produits laitiers sont issus de fermes locales, garantissant une
        fraîcheur et une qualité inégalées. Profitez de la richesse naturelle du
        lait cru et des produits faits maison, sans conservateurs ni additifs.
      </p>
      <FeaturesGrid />
    </div>
  );
};

export default FeaturesWithHeading;
