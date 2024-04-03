"use server";
import prismadb from "@/lib/prismadb";

export const fetchProducts = async (isPro: boolean) => {
  const products = await prismadb.product.findMany({
    where: {
      isPro: isPro,
      isArchived: false,
    },
  });
  return products;
};
