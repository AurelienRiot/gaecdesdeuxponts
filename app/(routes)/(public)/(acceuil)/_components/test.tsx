"use client";
import Footer from "@/components/footer";
import BackgroundGrid from "@/components/grid";
import MobileNav from "@/components/navbar-public/mobile-nav";
import NavbarAction from "@/components/navbar-public/navbar-actions";
import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useCategoriesContext } from "@/context/categories-context";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SwipeCarousel } from "./swipe-carousel";

const MainPage = () => {
  return (
    <div
      className="grid  h-[1900px]  w-full grid-cols-[1fr] grid-rows-[1fr_3fr_6fr_1fr] 
      [grid-template-areas:'header'________________________________________________________________________________________________________________________________________________________________'main'__________________________________________________________________________________________________________________________________________________________________'products'______________________________________________________________________________________________________________________________________________________________'why'___________________________________________________________________________________________________________________________________________________________________'footer']
      lg:h-[1000px] 
      lg:grid-cols-[2fr_1fr] lg:[grid-template-areas:'main_____header'_______________________________________________________________________________________________________________________________________________________'main_____why'__________________________________________________________________________________________________________________________________________________________'products_why'__________________________________________________________________________________________________________________________________________________________'footer___why'] "
    >
      <MainSection className="[grid-area:main]" />
      <HeaderSection className="[grid-area:header] " />
      <WhySection className="[grid-area:why] lg:bg-gradient-to-b lg:from-slate-50/50 lg:from-[37.5%] lg:to-orange-50/50 lg:to-[87.5%] lg:dark:from-neutral-900/50  lg:dark:to-zinc-950/50" />

      <ProductSection className="[grid-area:products] lg:bg-gradient-to-b lg:from-slate-50/50  lg:to-orange-50/50 lg:dark:from-neutral-900/50 lg:dark:to-zinc-950/50" />

      <Footer className=" mt-4 [grid-area:footer] lg:mt-0 lg:border-0 lg:bg-orange-50/50 lg:dark:bg-zinc-950/50" />
    </div>
  );
};

const MainSection = ({ className }: { className?: string }) => {
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
      className={cn(" relative flex items-start  justify-center   ", className)}
    >
      <Image
        src="/champ.webp"
        alt="image"
        fill
        priority
        className="h-full w-full object-cover   grayscale"
      />

      <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-b from-neutral-800/80 from-25% to-neutral-800/20 " />

      <TypewriterEffectSmooth
        className="absolute  z-20 px-4 py-2 text-center font-display text-3xl font-bold tracking-wider text-neutral-50 [text-shadow:0px_0px_50px_hsla(0,_0%,_0%,_.4)]  sm:text-5xl "
        words={words}
      />
    </div>
  );
};

const HeaderSection = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        " flex items-center justify-between rounded-md  px-2    dark:border-b  ",
        className,
      )}
    >
      <MobileNav className="ml-2 " />
      <div className="ml-2 flex items-center justify-center ">
        <Link
          href="/"
          className="relative flex items-center gap-2 text-primary transition-all hover:scale-105 "
        >
          <p className="font-mono   font-bold text-primary">
            {" "}
            Laiterie du Pont Robert
          </p>
        </Link>
      </div>
      <NavbarAction className="ml-0 mr-2 px-0" />
    </div>
  );
};

const WhySection = ({ className }: { className?: string }) => {
  const whyWords = [
    {
      image: "/health-benefits.webp",
      text: "Bienfaits pour la santé",
      description:
        "Notre lait cru préserve tous les nutriments essentiels et offre une sélection gustative naturelle et riche.",
    },
    {
      image: "/natural-taste.webp",
      text: "Goût naturel",
      description:
        "Profitez d'un goût authentique, avec un lait non homogénéisé qui conserve sa saveur et sa texture originales.",
    },
    {
      image: "/ethical.webp",
      text: " Pratiques éthiques",
      description:
        "Nos vaches sont élevées avec soin, dans des conditions qui respectent leur bien-être et l'environnement.",
    },
  ];
  return (
    <div
      className={cn(
        "  relative  mt-4 flex items-center justify-center ",
        className,
      )}
    >
      <BackgroundGrid />
      <div className=" space-y-6 px-4 text-center ">
        <h2 className="mb-4 text-center text-2xl font-semibold text-primary">
          Pourquoi choisir notre lait ?
        </h2>
        {whyWords.map((word) => (
          <div key={word.image} className="flex flex-col items-center">
            <Image
              src={word.image}
              alt={word.text}
              width={80}
              height={80}
              className=" cursor-pointer rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-medium ">{word.text}</h3>
            <p className="mt-2 text-center text-lg ">{word.description}</p>
          </div>
        ))}

        <Button
          asChild
          variant={"expandIcon"}
          Icon={ArrowRightIcon}
          iconPlacement="right"
          className="mx-auto mt-8"
        >
          <Link href="/faq">En savoir plus</Link>
        </Button>
      </div>
    </div>
  );
};

const ProductSection = ({ className }: { className?: string }) => {
  const categories = useCategoriesContext()?.categories;
  if (!categories) {
    return null;
  }
  //  <div className=" w-full space-y-4 [grid-area:products] lg:bg-gradient-to-b lg:from-slate-50 lg:to-orange-50  lg:dark:from-neutral-900 lg:dark:to-zinc-950 ">
  //       <h2 className="py-6 text-3xl md:text-5xl">Découvrez Nos Produits</h2>
  //       <SwipeCarousel className=" " />
  //     </div>
  return (
    <div className={cn("overflow-hidden [grid-area:products] ", className)}>
      <h2 className="pt-6 text-center text-2xl font-semibold text-primary">
        Découvrez Nos Produits
      </h2>
      <SwipeCarousel />
    </div>
  );
};

export default MainPage;
