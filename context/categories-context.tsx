"use client";
import { Category } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCategories } from "./categories-fetch";

type CategoriesContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const CategoriesContext = createContext<
  CategoriesContextType | undefined
>(undefined);

export const CategoriesProvider: React.FC<{
  children: React.ReactNode;
  isPro: boolean;
}> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      <CategoriesInitialValue isPro={false} />
      {children}
    </CategoriesContext.Provider>
  );
};

const CategoriesInitialValue = ({ isPro }: { isPro: boolean }) => {
  const { setCategories } = useCategoriesContext();

  useEffect(() => {
    fetchCategories(isPro).then((categories) => {
      setCategories(categories);
    });
  }, [setCategories, isPro]);
  return null;
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
