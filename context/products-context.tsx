"use client";
import { ProductWithCategory } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchProProducts, fetchProducts } from "./products-fetch";

type ProductsContextType = {
  products: ProductWithCategory[] | undefined;
  setProducts: React.Dispatch<
    React.SetStateAction<ProductWithCategory[] | undefined>
  >;
};

export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export const ProductsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [products, setProducts] = useState<ProductWithCategory[] | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    fetchAndSetProducts();
  }, []);
  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const ProductsProProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [products, setProducts] = useState<ProductWithCategory[] | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      const data = await fetchProProducts();
      setProducts(data);
    };

    fetchAndSetProducts();
  }, []);
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
