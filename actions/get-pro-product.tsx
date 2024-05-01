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
    },
  });
  return products;
};
