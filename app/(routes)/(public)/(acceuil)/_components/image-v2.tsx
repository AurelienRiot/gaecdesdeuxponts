"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Image from "next/image";

const ImageV2 = () => {
  const words = [
    {
      text: "Site",
    },
    {
      text: "en",
    },
    {
      text: "construction",
    },
  ];
  return (
    <div id="image-main" className=" relative  flex h-[60vh] w-full  items-start justify-center  sm:h-[50vh]">
      <Image src="/champ.webp" alt="image" fill priority className="h-full w-full object-cover   grayscale" />

      <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-b from-neutral-800/80 from-25% to-neutral-800/0 " />
      <TypewriterEffectSmooth
        className="absolute  z-20 px-4 py-2 text-center font-display text-xl font-bold tracking-wider text-orange-500 [text-shadow:0px_0px_50px_hsla(0,_0%,_0%,_.4)] sm:py-10 sm:text-3xl md:text-4xl lg:text-5xl "
        words={words}
      />
    </div>
  );
};

export default ImageV2;
