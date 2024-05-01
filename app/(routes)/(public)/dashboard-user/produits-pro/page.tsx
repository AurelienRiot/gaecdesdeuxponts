"use client";

import ProductCart from "@/components/product-cart";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCategoriesContext } from "@/context/categories-context";
import { useProductsContext } from "@/context/products-context";
import { ProductWithCategory } from "@/types";

const PageProductsPro = () => {
  const { products } = useProductsContext();
  const { categories } = useCategoriesContext();

  const scrollToCategory = (categoryName: string) => {
    const categoryElement = document.getElementById(categoryName);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!products) return null;

  if (!products[0].isPro) {
    return (
      <div className=" p-6">
        Vous devez être professionnel pour voir les produits
      </div>
    );
  }

  return (
    <div className=" w-full flex-col    p-6">
      <h2 className=" text-2xl font-semibold">Produits pour professionnels</h2>
      <div className="  flex flex-wrap gap-4  py-4">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Button
              key={category.id}
              aria-label={`Toggle ${category.name}`}
              variant={"outline"}
              onClick={() => scrollToCategory(category.name)}
            >
              {category.name}
            </Button>
          ))
        ) : (
          <>
            <Skeleton className="h-4 w-[50px]  " />
            <Skeleton className="h-4 w-[50px]  " />
          </>
        )}
      </div>
      {categories && categories.length > 0
        ? categories.map((category) => {
            return (
              <DisplayCategory
                key={category.id}
                products={products.filter(
                  (product) => product.categoryId === category.id,
                )}
              />
            );
          })
        : null}
    </div>
  );
};

const DisplayCategory = ({ products }: { products: ProductWithCategory[] }) => {
  return (
    <div className="mb-6 space-y-4">
      <h2 id={products[0].category.name} className="text-3xl font-semibold">
        {products[0].category.name}
      </h2>
      <div className="md:grid-clos-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {products.length > 0 ? (
          products.map((item) => <ProductCart key={item.id} data={item} />)
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-500">
            Aucun produit disponible pour le moment
          </div>
        )}
      </div>
    </div>
  );
};

export default PageProductsPro;
