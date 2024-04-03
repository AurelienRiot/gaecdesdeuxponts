"use server";

import prismadb from "@/lib/prismadb";

export const fetchCategories = async (isPro: boolean) => {
  const categories = await prismadb.category.findMany({
    where: {
      products: {
        some: { isPro: isPro, isArchived: false },
      },
    },
  });

  return categories;
};
