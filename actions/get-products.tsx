import prismadb from "@/lib/prismadb";

export const getProductsByCategoryName = async (categoryName: string) => {
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
};

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
