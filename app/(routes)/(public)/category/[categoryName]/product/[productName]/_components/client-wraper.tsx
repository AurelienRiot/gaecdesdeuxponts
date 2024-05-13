"use client";
import { OptionsArray } from "@/app/(routes)/admin/products/[productId]/page";
import Gallery from "@/components/gallery/gallery";
import Info from "@/components/product/info";
import MainProductCart from "@/components/product/main-product-cart";
import ProductList from "@/components/products-list";
import { ProductWithOptionsAndMain } from "@/types";
import { MainProduct } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ClientWrapper = ({
  products,
  suggestedProducts,
  optionsArray,
}: {
  products: ProductWithOptionsAndMain[];
  suggestedProducts: MainProduct[];
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
    <div className="px-4 py-10 sm:px-6 lg:px-8">
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
        <div className="space-y-10 py-20">
          <h2 className="text-center text-3xl font-bold text-primary lg:text-5xl ">
            Autres produits de la categorie {product.product.categoryName}
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            {suggestedProducts.map((item) => (
              <MainProductCart data={item} key={item.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientWrapper;
