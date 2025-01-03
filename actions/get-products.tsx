import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getProducts = unstable_cache(
  async () => {
    const products = await prismadb.product.findMany({
      where: {
        isArchived: false,
        product: {
          isArchived: false,
          isPro: false,
        },
      },
      include: { options: { orderBy: { index: "asc" } }, product: true },
      orderBy: {
        index: "asc",
      },
    });
    return products;
  },
  ["getProducts"],
  { revalidate: 60 * 60 * 24 * 7, tags: ["products", "categories"] },
);

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
      include: { options: { orderBy: { index: "asc" } }, product: true },
      orderBy: {
        index: "asc",
      },
    });
    return products;
  },
  ["getProductsByCategoryName"],
  { revalidate: 60 * 60 * 24, tags: ["products", "categories"] },
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
      include: { options: { orderBy: { index: "asc" } }, product: true },
      orderBy: {
        index: "asc",
      },
    });
    return products;
  },
  ["getProProductsByCategoryName"],
  { revalidate: 60 * 60 * 24, tags: ["products", "categories"] },
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
  ["getMainProductsByCategoryName"],
  { revalidate: 60 * 60, tags: ["products", "categories"] },
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
  ["getProMainProductsByCategoryName"],
  { revalidate: 60 * 60, tags: ["products", "categories"] },
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
        options: { orderBy: { index: "asc" } },
        product: true,
      },
      orderBy: {
        index: "asc",
      },
    });
    return products;
  },
  ["getFeaturedProducts"],
  { revalidate: 60 * 60, tags: ["products"] },
);
