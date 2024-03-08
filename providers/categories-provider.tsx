"use client";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@prisma/client";
import { useEffect } from "react";

export function CategoriesProvider({ categories }: { categories: Category[] }) {
  const addCategories = useCategories((s) => s.addCategories);

  useEffect(() => {
    addCategories(categories);
  }, [categories, addCategories]);

  return null;
}
