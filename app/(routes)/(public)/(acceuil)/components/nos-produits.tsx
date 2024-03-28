"use client";
import { Button } from "@/components/ui/button";
import { useCategoriesContext } from "@/context/categories-context";
import Image from "next/image";
import Link from "next/link";

const NosProduits = () => {
  const categories = useCategoriesContext()?.categories;
  if (!categories) {
    return null;
  }
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-transparent py-6 font-bold text-primary">
      <h2 className="text-xl sm:text-3xl md:text-5xl">
        Découvrez nos produits
      </h2>
      <div className="flex w-full flex-wrap justify-center gap-10">
        {categories.map((category, index) => (
          <CategoryCard
            index={index}
            key={category.id}
            name={category.name}
            description={category.description || ""}
            href={`/category/${category.id}`}
            imageUrl={category.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default NosProduits;

const CategoryCard = ({
  imageUrl,
  name,
  description,
  href,
  index,
}: {
  imageUrl: string;
  name: string;
  description: string;
  href: string;
  index: number;
}) => {
  const backgroundColors = [
    "var(--slate-900)",
    "var(--stone-900)",
    "var(--neutral-900)",
  ];
  return (
    <div className="group relative aspect-square h-full w-[400px] max-w-[90vw] overflow-hidden rounded-md border-2 border-slate-50 shadow-lg">
      <div
        className="flex h-1/2 flex-col justify-center  p-6"
        style={{
          backgroundColor: backgroundColors[index % backgroundColors.length],
        }}
      >
        <h3 className="mb-2 text-center text-xl font-semibold text-neutral-50">
          {name}
        </h3>
        <p className="text-sm font-light tracking-wide text-neutral-300">
          {description}
        </p>
      </div>

      <div className=" absolute inset-0 right-0 top-0 z-10 bg-slate-200  transition-all duration-200 group-hover:right-1/2 group-hover:top-1/2">
        {" "}
        <Image
          src={imageUrl}
          fill
          className="object-cover "
          alt={name}
          sizes="(max-width: 450px) 90vw,  400px"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-0  h-1/2 w-0  overflow-hidden transition-all duration-200 group-hover:w-1/2">
        <Button
          asChild
          variant={"shine"}
          className="  absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 "
        >
          <Link href={href}>En savoir +</Link>
        </Button>
      </div>
    </div>
  );
};
