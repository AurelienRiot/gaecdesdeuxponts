"use server";
import prismadb from "@/lib/prismadb";

export const fetchProducts = async (isPro: boolean) => {
  const products = await prismadb.product.findMany({
    where: {
      isPro: isPro,
      isArchived: false,
    },
    include: {
      category: true,
      images: { orderBy: { createdAt: "asc" } },
      linkedBy: {
        where: { isArchived: false, isPro: true },
        select: { id: true, name: true },
      },
      linkedProducts: {
        where: { isArchived: false, isPro: true },
        select: { id: true, name: true },
      },
    },
  });
  return products;
};
