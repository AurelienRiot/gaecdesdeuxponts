import { getProCategories } from "@/actions/get-category";
import Spinner from "@/components/animations/spinner";
import { makeCategoryUrl } from "@/components/product/product-function";
import { Category } from "@prisma/client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Produits Professionels",
};

const PageProductsPro = async () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Produits pour professionnels</h2>
      <Suspense fallback={<Spinner size={20} />}>
        <CategoriesList />
      </Suspense>
    </div>
  );
};

const CategoriesList = async () => {
  const categories = await getProCategories();

  return (
    <ul className="flex">
      {categories.map((category) => (
        <li key={category.name}>
          <Link
            href={makeCategoryUrl(category.name, true)}
            className={
              "block max-w-md select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            }
          >
            <h2 className="flex items-center justify-center text-3xl font-medium leading-none">
              <CategoryImage category={category} /> {category.name}
            </h2>
            <p className="line-clamp-3 text-left text-sm leading-snug text-muted-foreground">
              {category.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const CategoryImage = ({ category }: { category: Category }) => {
  return (
    <span className="relative mr-2 h-20 w-20 overflow-clip rounded-md">
      <Image
        src={category.imageUrl}
        alt={category.name}
        fill
        sizes="80px"
        className="h-full w-full object-cover"
      />
    </span>
  );
};

export default PageProductsPro;
