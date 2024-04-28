import { Button } from "@/components/ui/button";
import DebugContainer from "@/components/debug/debug-container";
import Image from "next/image";
import Link from "next/link";

const ImageAccueil = () => {
  return (
    <section
      className="grid grid-cols-1 gap-12
      md:grid-cols-2 lg:grid-cols-[2fr_3fr]"
    >
      <div className="flex flex-col justify-center text-center @container">
        <h2 className="mb-4 text-2xl font-bold @sm:text-3xl @md:text-4xl @lg:text-5xl">
          Lait cru frais directement de le ferme
        </h2>
        <p className="mb-8 @md:text-lg">
          Découvrez le goût pur et crémeux de notre lait cru frais de la ferme.
          Rempli de nutriments essentiels, notre lait provient directement de
          nos vaches heureuses et en bonne santé.
        </p>
        <div className="mx-auto flex gap-4">
          <Button asChild>
            <Link href="/#Découvrer nos produits">Acheter</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href="/#la-ferme">En savoir plus</Link>
          </Button>
        </div>
      </div>
      <div>
        <Image
          alt="Farm Hero Image"
          className="h-auto w-full rounded-md object-cover"
          height={2630}
          src="/vache-champs.webp"
          width={4676}
        />
      </div>
    </section>
  );
};

export default ImageAccueil;
