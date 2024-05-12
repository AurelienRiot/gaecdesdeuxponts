"use client";
import { OptionsArray } from "@/app/(routes)/admin/products/[productId]/page";
import Gallery from "@/components/gallery/gallery";
import Info from "@/components/product/info";
import ProductList from "@/components/products-list";
import { ProductWithOptionsAndMain } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ClientWrapper = ({
  products,
  suggestedProducts,
  optionsArray,
}: {
  products: ProductWithOptionsAndMain[];
  suggestedProducts: ProductWithOptionsAndMain[];
  optionsArray: OptionsArray;
}) => {
  const [product, setProduct] = useState(products[0]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const optionsValue = optionsArray.map((option) => {
      return { name: option.name, value: searchParams.get(option.name) };
    });
    const selectedProduct = products.find((product) => {
      return optionsValue.every(({ name, value }, index) => {
        return (
          !value ||
          product.options.find((option) => option.name === name)?.value ===
            value
        );
      });
    });
    if (selectedProduct) {
      setProduct(selectedProduct);
    }
  }, [searchParams, products, optionsArray]);

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <Gallery
          images={[...product.product.imagesUrl, ...product.imagesUrl]}
        />
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <Info
            sameProducts={products}
            product={product}
            optionsArray={optionsArray}
          />
        </div>
      </div>
      <hr className="my-10" />
      {suggestedProducts.length > 0 && (
        <ProductList title="Produits Similaires" items={suggestedProducts} />
      )}
    </div>
  );
};

export default ClientWrapper;
