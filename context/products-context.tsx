"use client";
import { ProductWithCategoryImagesAndLinkedProducts } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts } from "./products-fetch";

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

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      const data = await fetchProducts(isPro);
      setProducts(data);
    };

    fetchAndSetProducts();
  }, [isPro]);
  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
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
