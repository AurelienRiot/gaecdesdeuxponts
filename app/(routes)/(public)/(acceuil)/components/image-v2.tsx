import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Image from "next/image";

const ImageV2 = () => {
  const words = [
    {
      text: "Du",
    },
    {
      text: "lait",
    },
    {
      text: "frais",
    },
    {
      text: "du",
    },
    {
      text: "pis",
    },
    {
      text: "de",
    },
    {
      text: "la",
    },
    {
      text: "vache",
    },
    {
      text: "à",
    },
    {
      text: "votre",
    },
    {
      text: "verre",
    },
  ];
  return (
    <div className="relative flex h-[75vh] w-full items-start  justify-center overflow-hidden">
      <Image
        src="/champ.webp"
        alt="image"
        fill
        className="h-full w-full object-cover   grayscale"
      />
      <div className="absolute inset-0 z-10 h-full w-full bg-slate-800/50" />
      {/* <h1 className="absolute  z-10 px-4 py-24 text-center font-display ">
        Du lait frais du pie de la vache à votre verre
      </h1> */}
      <TypewriterEffectSmooth
        className="absolute  z-10 px-4 py-24 text-center text-3xl font-bold tracking-wider text-slate-50 [text-shadow:0px_0px_50px_hsla(0,_0%,_0%,_.4)] sm:text-5xl "
        words={words}
      />
    </div>
  );
};

export default ImageV2;
