"use client";
import Gallery from "@/components/gallery/gallery";
import Info from "@/components/info";
import ProductCart from "@/components/product-cart";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import ButtonBackward from "@/components/ui/button-backward";
import { useCategoriesContext } from "@/context/categories-context";
import { useProductsContext } from "@/context/products-context";
import { mergeWithoutDuplicates } from "@/lib/utils";
import { ProductWithCategoryImagesAndLinkedProducts } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ProTab = () => {
  const { products } = useProductsContext();
  const { categories } = useCategoriesContext();

  const searchParams = useSearchParams();
  const product = products?.find(
    (item) =>
      item.name === decodeURIComponent(searchParams.get("product") || ""),
  );

  if (product) {
    return <DisplayProduct product={product} />;
  }
  const scrollToTarget = (target: string) => {
    const targetElement = document.getElementById(target);
    const scrollContainer = document.getElementById("store");
    if (targetElement && scrollContainer) {
      const parentRect = scrollContainer.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const relativeTop = targetRect.top - parentRect.top;
      scrollContainer.scrollTop = relativeTop - 20;
    }
  };
  return (
    <>
      <div className=" w-full flex-col   p-6 ">
        <h2 className=" text-2xl font-semibold">
          Produits pour professionnels
        </h2>
        <div className="  flex flex-wrap gap-4  py-4">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <Button
                key={category.id}
                aria-label={`Toggle ${category.name}`}
                variant={"outline"}
                onClick={() => scrollToTarget(category.name)}
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
              if (!products) return null;
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
    </>
  );
};

const DisplayCategory = ({
  products,
}: {
  products: ProductWithCategoryImagesAndLinkedProducts[];
}) => {
  return (
    <div>
      <h2 id={products[0].category.name}>{products[0].category.name}</h2>
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

const DisplayProduct = ({
  product,
}: {
  product: ProductWithCategoryImagesAndLinkedProducts;
}) => {
  const linkProducts = mergeWithoutDuplicates(
    product.linkedBy,
    product.linkedProducts,
  );

  const excludeIds = linkProducts.map((product) => product.id);
  excludeIds.push(product.id);

  useEffect(() => {
    const scrollContainer = document.getElementById("tab-container");
    if (scrollContainer) {
      // Faire défiler l'élément vers le haut
      scrollContainer.scrollTop = 0;
    }
  }, []);

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <ButtonBackward url={`/dashboard-user?tab=store`} />
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <Gallery images={product.images} />
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <Info data={product} linkProducts={linkProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProTab;
