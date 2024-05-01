"use server";

import { checkPro } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

export const fetchCategories = async () => {
  const categories = await prismadb.category.findMany({
    where: {
      products: {
        some: { isPro: false, isArchived: false },
      },
    },
  });

  return categories;
};

export const fetchProCategories = async () => {
  const user = checkPro();
  if (!user) {
    return undefined;
  }

  const categories = await prismadb.category.findMany({
    where: {
      products: {
        some: { isPro: true, isArchived: false },
      },
    },
  });

  return categories;
};
