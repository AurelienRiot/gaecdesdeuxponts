"use client";

import ProductCart from "@/components/product-cart";
import { ProductCart as ProductCartSkeleton } from "@/components/skeleton-ui/product-cart-skeleton";
import NoResults from "@/components/ui/no-results";
import { useProductsContext } from "@/context/products-context";

const DisplayProducts = ({ categoryName }: { categoryName: string }) => {
  const { products } = useProductsContext();

  const productsCat = products?.filter(
    (item) => item.category.name === categoryName,
  );

  return (
    <div className="flex flex-wrap justify-center gap-12">
      {!productsCat ? (
        Array(4)
          .fill(null)
          .map((_, i) => <ProductCartSkeleton key={i} />)
      ) : productsCat.length === 0 ? (
        <NoResults />
      ) : (
        productsCat.map((item) => <ProductCart data={item} key={item.id} />)
      )}
    </div>
  );
};

export default DisplayProducts;
