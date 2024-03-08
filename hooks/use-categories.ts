import { Category } from "@prisma/client";
import { create } from "zustand";

type CategoriesStore = {
  categories: Category[];
  addCategories: (categories: Category[]) => void;
};

export const useCategories = create<CategoriesStore>((set) => ({
  categories: [],
  addCategories: (categories: Category[]) =>
    set((state) => ({ categories: categories })),
}));
