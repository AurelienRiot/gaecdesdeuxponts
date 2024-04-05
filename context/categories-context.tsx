"use client";
import { Category } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCategories } from "./categories-fetch";

type CategoriesContextType = {
  categories: Category[] | undefined;
  setCategories: React.Dispatch<React.SetStateAction<Category[] | undefined>>;
};

export const CategoriesContext = createContext<
  CategoriesContextType | undefined
>(undefined);

export const CategoriesProvider: React.FC<{
  children: React.ReactNode;
  isPro: boolean;
}> = ({ children, isPro }) => {
  const [categories, setCategories] = useState<Category[] | undefined>(
    undefined,
  );
  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const data = await fetchCategories(isPro);
      setCategories(data);
    };

    fetchAndSetCategories();
  }, [isPro]);
  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export function useCategoriesContext() {
  const context = useContext(CategoriesContext);

  if (context === undefined) {
    throw new Error(
      "useCategoriesContext must be used within a CategoriesProvider",
    );
  }

  return context;
}
