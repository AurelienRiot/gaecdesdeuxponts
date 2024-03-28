"use client";
import { Category } from "@prisma/client";
import { createContext, useContext, useState } from "react";

type CategoriesContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const CategoriesContext = createContext<
  CategoriesContextType | undefined
>(undefined);

export const CategoriesProvider: React.FC<{
  children: React.ReactNode;
  cat: Category[];
}> = ({ children, cat }) => {
  const [categories, setCategories] = useState(cat);
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
