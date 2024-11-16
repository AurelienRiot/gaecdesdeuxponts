import Image from "next/image";
import Ferme from "@/public/ferme.webp";
import Vache from "@/public/vache.webp";
import Photo from "@/public/photo.webp";
import type { Metadata } from "next";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "À propos de nous",
    description:
      "Nous sommes Julie et Jean-Marc, les heureux propriétaires d’une jeune exploitation agricole située dans la vallée du Don, en plein cœur du territoire des Marais de Vilaine. Notre ferme s’étend sur 130 hectares, dont 40% sont des prairies naturelles humides. Ces prairies, souvent inondées en hiver par les crues de la rivière, sont une véritable richesse pour notre exploitation. Nous y portons une attention particulière pour les valoriser au maximum, tant pour l’alimentation de notre troupeau de 80 vaches laitières élevées en agriculture biologique que pour assurer l’autonomie alimentaire de notre ferme.",
  };
}

const PageLaFerme = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-5xl font-bold">À propos de nous</h1>
        <div className="grid grid-cols-1 items-center justify-center gap-4 text-center sm:grid-cols-2">
          <Image
            src={Photo}
            width={1106}
            height={984}
            placeholder="blur"
            alt="Photo Julie et Jean-Marc"
            className="mx-auto rounded-lg shadow-md max-w-full md:max-w-sm"
          />
          <div className="space-y-2 text-base lg:text-lg">
            <p>
              Nous sommes Julie et Jean-Marc, les heureux propriétaires d’une jeune exploitation agricole située dans la
              vallée du Don, en plein cœur du territoire des Marais de Vilaine. Notre ferme s’étend sur 160 hectares,
              dont 40% sont des prairies naturelles humides. Ces prairies, souvent inondées en hiver par les crues de la
              rivière, sont une véritable richesse pour notre exploitation.
            </p>
            <p>
              Nous y portons une attention particulière pour les valoriser au maximum, tant pour l’alimentation de notre
              troupeau de 80 vaches laitières élevées en agriculture biologique que pour assurer l’autonomie alimentaire
              de notre ferme.
            </p>
          </div>

          <p className="space-y-2 text-base lg:text-lg">
            Pour tirer le meilleur parti des prairies tout en respectant leur équilibre naturel, nous avons mis en place
            une gestion minutieuse basée sur un paturage tournant. Le troupeau en lactation a à disposition une parcelle
            d'herbe fraiche chaque matin et chaque soir.
          </p>
          <Image
            src={Vache}
            placeholder="blur"
            width={1200}
            height={1600}
            alt="Photo de la ferme"
            className="mx-auto max-h-[60vh] w-auto rounded-lg shadow-md sm:row-span-2"
          />
          <p className="space-y-2 text-base lg:text-lg">
            Située dans le périmètre du site Natura 2000 Marais de Vilaine, nos parcelles sont un véritable havre de
            biodiversité. La riche microfaune présente attire une multitude d’oiseaux au printemps, et les berges de
            notre rivière sont fréquentées par la loutre d’Europe, une espèce protégée.
          </p>

          <Image
            src={Ferme}
            width={2936}
            height={1168}
            placeholder="blur"
            alt="Ferme"
            className="mx-auto rounded-lg shadow-md"
          />
          <div className="space-y-2 text-base lg:text-lg">
            <p>
              La diversité floristique exceptionnelle de nos prairies, avec plus de 50 espèces différentes, nous
              garantit une excellente productivité ainsi qu’un fourrage appétent et nutritif pour nos animaux. Cette
              richesse floristique nous offre également une souplesse économique appréciable. Enfin, notre ferme
              contribue à la beauté paysagère de la région.
            </p>
            <p>
              Depuis le sommet du Rocher du Veau, à moins d’un kilomètre, la vue sur la vallée est spectaculaire,
              surtout au début du printemps. Nous sommes fiers de notre engagement en faveur de pratiques
              agro-écologiques et de notre contribution à la préservation de ce précieux écosystème.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageLaFerme;
