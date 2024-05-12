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

export const getMainProductsByCategoryName = async (categoryName: string) => {
  const products = await prismadb.mainProduct.findMany({
    where: {
      isArchived: false,
      isPro: false,
      categoryName,
    },
    include: { products: { include: { options: true } } },
  });
  return products;
};

export const getProMainProductsByCategoryName = async (
  categoryName: string,
) => {
  const products = await prismadb.mainProduct.findMany({
    where: {
      isArchived: false,
      isPro: true,
      categoryName,
    },
    include: { products: { include: { options: true } } },
  });
  return products;
};

export const getUniqueProductsByCategory = async (categoryName: string) => {
  const products = await prismadb.mainProduct.findMany({
    where: {
      isArchived: false,
      categoryName: categoryName,
    },
  });
  return products;
};

export const getFeaturedProducts = async () => {
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
};
