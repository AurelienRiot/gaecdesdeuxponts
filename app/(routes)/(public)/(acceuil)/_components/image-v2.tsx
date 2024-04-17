"use client";
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
    <div
      id="image-main"
      className=" relative  flex h-[60vh] w-full  items-start justify-center  sm:h-[50vh]"
    >
      <Image
        src="/champ.webp"
        alt="image"
        fill
        priority
        className="h-full w-full object-cover   grayscale"
      />

      <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-b from-neutral-800/80 from-25% to-neutral-800/0 " />

      {/* <h1 className="absolute  z-10 px-4 py-24 text-center font-display ">
        Du lait frais du pie de la vache à votre verre
      </h1> */}
      <TypewriterEffectSmooth
        className="absolute  z-20 px-4 py-2 text-center font-display text-xl font-bold tracking-wider text-neutral-50 [text-shadow:0px_0px_50px_hsla(0,_0%,_0%,_.4)] sm:py-10 sm:text-3xl md:text-4xl lg:text-5xl "
        words={words}
      />
    </div>
  );
};

export default ImageV2;
