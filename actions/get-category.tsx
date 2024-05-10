import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getCategoryByName = async (categoryName: string) => {
  const category = await prismadb.category.findUnique({
    where: {
      products: {
        some: {
          isPro: false,
          isArchived: false,
          products: { some: { isArchived: false } },
        },
      },
      name: categoryName,
    },
  });
  return category;
};

export const getProCategoryByName = async (categoryName: string) => {
  const category = await prismadb.category.findUnique({
    where: {
      products: {
        some: {
          isPro: true,
          isArchived: false,
          products: { some: { isArchived: false } },
        },
      },
      name: categoryName,
    },
  });
  return category;
};

export const getCategories = unstable_cache(
  async () => {
    const category = await prismadb.category.findMany({
      where: {
        products: {
          some: {
            isPro: false,
            isArchived: false,
            products: { some: { isArchived: false } },
          },
        },
      },
    });
    return category;
  },
  ["getCategories"],
  { revalidate: 60 * 10 },
);

export const getProCategories = async () => {
  const category = await prismadb.category.findMany({
    where: {
      products: {
        some: {
          isPro: true,
          isArchived: false,
          products: { some: { isArchived: false } },
        },
      },
    },
  });
  return category;
};
