"use client";
import { Product } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts } from "./products-fetch";

type ProductsContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export const ProductsProvider: React.FC<{
  children: React.ReactNode;
  isPro: boolean;
}> = ({ children, isPro }) => {
  const [products, setProducts] = useState<Product[]>([]);
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
