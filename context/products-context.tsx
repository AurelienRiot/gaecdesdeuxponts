"use client";
import { Product } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts } from "./products-fetch";
import { ProductWithCategoryImagesAndLinkedProducts } from "@/types";

type ProductsContextType = {
  products: ProductWithCategoryImagesAndLinkedProducts[] | undefined;
  setProducts: React.Dispatch<
    React.SetStateAction<
      ProductWithCategoryImagesAndLinkedProducts[] | undefined
    >
  >;
};

export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export const ProductsProvider: React.FC<{
  children: React.ReactNode;
  isPro: boolean;
}> = ({ children, isPro }) => {
  const [products, setProducts] = useState<
    ProductWithCategoryImagesAndLinkedProducts[] | undefined
  >(undefined);
  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      <ProductsInitialValue isPro={isPro} />
      {children}
    </ProductsContext.Provider>
  );
};

const ProductsInitialValue = ({ isPro }: { isPro: boolean }) => {
  const { setProducts } = useProductsContext();

  useEffect(() => {
    fetchProducts(isPro).then((products) => {
      setProducts(products);
    });
  }, [setProducts, isPro]);
  return null;
};

export function useProductsContext() {
  const context = useContext(ProductsContext);

  if (context === undefined) {
    throw new Error(
      "useProductsContext must be used within a ProductsProvider",
    );
  }

  return context;
}
