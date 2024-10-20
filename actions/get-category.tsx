import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getCategoryByName = unstable_cache(
  async (categoryName: string) => {
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
  },
  ["getCategoryByName"],
  { revalidate: 60 * 60 * 10, tags: ["categories", "products"] },
);

export const getProCategories = unstable_cache(
  async () => {
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
  },
  ["getProCategories"],
  { revalidate: 60 * 60 * 10, tags: ["categories", "products"] },
);

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
            products: {
              some: { isArchived: false, product: { isArchived: false } },
            },
          },
        },
      },
    });
    return category;
  },
  ["getCategories"],
  { revalidate: 60 * 60 * 10, tags: ["categories", "products"] },
);
