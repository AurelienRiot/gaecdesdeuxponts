"use client";

import { Button } from "@/components/ui/button";

import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const WhyChooseUs = () => {
  return (
    <div className="bg-background py-8">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-2xl font-semibold text-primary">
          Pourquoi choisir notre lait ?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <Image
              src="/health-benefits.webp"
              alt="Santé"
              width={80}
              height={80}
              className=" rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-medium text-accent">
              Bienfaits pour la santé
            </h3>
            <p className="mt-2 text-center text-lg text-secondary">
              Notre lait cru préserve tous les nutriments essentiels et offre
              une expérience gustative naturelle et riche.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/natural-taste.webp"
              alt="Goût"
              width={80}
              height={80}
              className=" rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-medium text-accent">
              Goût naturel
            </h3>
            <p className="mt-2 text-center text-lg text-secondary">
              {
                "Profitez d'un goût authentique, avec un lait non homogénéisé qui conserve sa saveur et sa texture originales."
              }
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/ethical.webp"
              alt="Éthique"
              width={80}
              height={80}
              className=" rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-medium text-accent">
              Pratiques éthiques
            </h3>
            <p className="mt-2 text-center text-lg text-secondary">
              {
                "Nos vaches sont élevées avec soin, dans des conditions qui respectent leur bien-être et l'environnement."
              }
            </p>
          </div>
        </div>
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

export default WhyChooseUs;
