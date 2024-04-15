"use client";

import ProductCart from "@/components/product-cart";
import { useProductsContext } from "@/context/products-context";

const DisplayProducts = ({ categoryName }: { categoryName: string }) => {
  const { products } = useProductsContext();
  if (!products) {
    return null;
  }
  const productsCat = products.filter(
    (item) => item.category.name === categoryName,
  );

  return (
    <div className="md:grid-clos-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {productsCat.length > 0 ? (
        productsCat.map((item) => <ProductCart key={item.id} data={item} />)
      ) : (
        <div className="flex h-full w-full items-center justify-center text-neutral-500">
          Aucun produit disponible pour le moment
        </div>
      )}
    </div>
  );
};

export default DisplayProducts;
