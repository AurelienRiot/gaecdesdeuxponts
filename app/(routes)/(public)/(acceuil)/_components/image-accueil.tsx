import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import VacheChamps from "@/public/vache-champs.webp";

const placeholders = [
  {
    text: "Cru",
  },
  {
    text: "Frais",
  },
  {
    text: "Bio",
  },
];

const ImageAccueil = () => {
  return (
    <section
      className="grid grid-cols-1 gap-12
      p-2 md:grid-cols-[4fr_5fr]  lg:grid-cols-[5fr_4fr]"
    >
      <div className=" flex flex-col items-center justify-center p-6 text-center @container">
        <h2 className="group mb-4 text-3xl font-bold @sm:text-4xl @md:text-5xl @lg:text-6xl">
          Lait
          <span className="relative ml-1 inline-block @sm:ml-2 @lg:ml-3">
            {placeholders.map((placeholder, i) => (
              <span
                key={i}
                className={
                  "absolute left-0 top-0 translate-y-0 animate-[disappear-top_6s_linear_infinite] text-green-500 opacity-0"
                }
                style={{ animationDelay: `${i * 2}s` }}
              >
                {placeholder.text}
              </span>
            ))}
            <span className="opacity-0">Frais</span>
          </span>
          {/*           
           cru frais
          <HoverWord className=" mx-1 ">Bio</HoverWord> */}
          <span className="block">directement de le ferme</span>
        </h2>
        <p className="mb-8 max-w-xl @md:text-lg">
          Découvrez le goût pur et crémeux de notre lait cru frais de la ferme.
          Rempli de nutriments essentiels, notre lait provient directement de
          nos vaches heureuses et en bonne santé.
        </p>
        <div className="mx-auto flex gap-4">
          <Button asChild variant={"heartbeat"}>
            <Link href="/category/Lait/product/Lait%20cru?Contenant=Bouteille%20verre">
              Acheter
            </Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href="/la-ferme">En savoir plus</Link>
          </Button>
        </div>
      </div>
      <div className="group relative ">
        <Image
          alt="Farm Hero Image"
          className="h-full w-full rounded-md object-cover"
          height={2630}
          src={VacheChamps}
          placeholder="blur"
          width={4676}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background from-5% to-25% transition-all duration-500 group-hover:translate-y-[5%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background from-[1%] to-10% transition-all duration-500 group-hover:translate-x-[-1%]" />
        <div className="absolute inset-0 bg-gradient-to-l from-background from-[1%] to-10% transition-all duration-500 group-hover:translate-x-[1%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background from-5% to-35% transition-all duration-500 group-hover:translate-y-[-5%]" />
      </div>
    </section>
  );
};

export default ImageAccueil;
