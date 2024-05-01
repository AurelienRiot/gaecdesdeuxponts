"use server";
import { checkPro } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

export const fetchProducts = async () => {
  const products = await prismadb.product.findMany({
    where: {
      isPro: false,
      isArchived: false,
    },
    include: {
      category: true,
    },
  });
  return products;
};

export const fetchProProducts = async () => {
  const user = checkPro();

  if (!user) {
    return undefined;
  }
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
