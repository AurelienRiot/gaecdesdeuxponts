import { getProCategories } from "@/actions/get-category";
import Spinner from "@/components/animations/spinner";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const PageProductsPro = async () => {
  return (
    <div className=" space-y-6    p-6">
      <h2 className=" text-3xl font-bold">Produits pour professionnels</h2>
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
            href={`/dashboard-user/produits-pro/category/${encodeURIComponent(category.name)}`}
            className={
              "block select-none  space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            }
          >
            <div className="justify-left flex items-center text-base font-medium leading-none">
              <CategoryImage category={category} /> {category.name}
            </div>
            <p className="line-clamp-3 text-left   text-sm leading-snug text-muted-foreground">
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
    <div className="relative  mr-2  h-5 w-5 overflow-clip  rounded-md">
      <Image
        src={category.imageUrl}
        alt={category.name}
        fill
        sizes="20px"
        className=" h-full w-full object-cover"
      />
    </div>
  );
};

export default PageProductsPro;
