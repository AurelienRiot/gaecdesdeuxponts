import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getProductsByCategoryName = unstable_cache(
  async (categoryName: string) => {
    const products = await prismadb.product.findMany({
      where: {
        isArchived: false,
        product: {
          categoryName: categoryName,
          isArchived: false,
          isPro: false,
        },
      },
      include: { options: true, product: true },
    });
    return products;
  },
  ["getProductsByCategoryName", "productfetch"],
  { revalidate: 60 * 60 },
);

export const getProProductsByCategoryName = unstable_cache(
  async (categoryName: string) => {
    const products = await prismadb.product.findMany({
      where: {
        isArchived: false,
        product: {
          categoryName: categoryName,
          isArchived: false,
          isPro: true,
        },
      },
      include: { options: true, product: true },
    });
    return products;
  },
  ["getProProductsByCategoryName", "productfetch"],
  { revalidate: 60 * 60 },
);

export const getMainProductsByCategoryName = unstable_cache(
  async (categoryName: string) => {
    const products = await prismadb.mainProduct.findMany({
      where: {
        isArchived: false,
        isPro: false,
        categoryName,
      },
    });
    return products;
  },
  ["getMainProductsByCategoryName", "productfetch"],
  { revalidate: 60 * 60 },
);

export const getProMainProductsByCategoryName = unstable_cache(
  async (categoryName: string) => {
    const products = await prismadb.mainProduct.findMany({
      where: {
        isArchived: false,
        isPro: true,
        categoryName,
      },
    });
    return products;
  },
  ["getProMainProductsByCategoryName", "productfetch"],
  { revalidate: 60 * 60 },
);

export const getUniqueProductsByCategory = async (categoryName: string) => {
  const products = await prismadb.mainProduct.findMany({
    where: {
      isArchived: false,
      categoryName: categoryName,
    },
  });
  return products;
};

export const getFeaturedProducts = unstable_cache(
  async () => {
    const products = await prismadb.product.findMany({
      where: {
        isArchived: false,
        isFeatured: true,
      },
      include: {
        options: true,
        product: true,
      },
    });
    return products;
  },
  ["getFeaturedProducts", "productfetch"],
  { revalidate: 60 * 60 },
);
