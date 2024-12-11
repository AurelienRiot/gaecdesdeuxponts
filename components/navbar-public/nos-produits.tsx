import { getCategories } from "@/actions/get-category";
import Spinner from "@/components/animations/spinner";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuListItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { Category } from "@prisma/client";
import Image from "next/image";
import { Suspense } from "react";

const NosProduits = () => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Nos produits</NavigationMenuTrigger>
      <NavigationMenuContent>
        <Suspense fallback={<Spinner size={20} />}>
          <CategoriesList />
        </Suspense>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

const CategoriesList = async () => {
  const categories = await getCategories();

  return (
    <ul className="grid w-[calc(100vw-165px)] max-w-[420px] grid-cols-1 gap-1 p-1 xs:p-4 sm:w-[420px] sm:grid-cols-2">
      {categories.map((category) => (
        <NavigationMenuListItem
          key={category.name}
          title={category.name}
          href={`/category/${encodeURIComponent(category.name)}`}
          Icone={<CategoryImage category={category} />}
        >
          {category.description}
        </NavigationMenuListItem>
      ))}
    </ul>
  );
};

const CategoryImage = ({ category }: { category: Category }) => {
  return (
    <div className="relative mr-2 h-5 w-5 overflow-clip rounded-md">
      <Image src={category.imageUrl} alt={category.name} fill sizes="20px" className="h-full w-full object-cover" />
    </div>
  );
};

export default NosProduits;
