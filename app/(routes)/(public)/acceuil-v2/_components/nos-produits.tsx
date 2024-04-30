"use client";
import Spinner from "@/components/animations/spinner";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuListItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCategoriesContext } from "@/context/categories-context";
import { Category } from "@prisma/client";
import Image from "next/image";

const NosProduits = () => {
  const { categories } = useCategoriesContext();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Nos produits</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[calc(100vw-165px)] max-w-[420px] grid-cols-1 gap-1 p-1 xs:p-4 sm:w-[420px] sm:grid-cols-2 ">
          {categories ? (
            categories.map((category) => (
              <NavigationMenuListItem
                key={category.name}
                title={category.name}
                href={`/category/${encodeURIComponent(category.name)}`}
                Icone={<CategoryImage category={category} />}
              >
                {category.description}
              </NavigationMenuListItem>
            ))
          ) : (
            <Spinner size={20} />
          )}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
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

export default NosProduits;
