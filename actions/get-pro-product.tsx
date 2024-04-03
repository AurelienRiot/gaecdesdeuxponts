"use server";
import { checkPro } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

export const getProProducts = async () => {
  const isPro = await checkPro();
  if (!isPro) return [];
  const products = await prismadb.product.findMany({
    where: {
      isPro: true,
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
  console.log(products[0].name);
  return products;
};
