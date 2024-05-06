import prismadb from "@/lib/prismadb";

export const getCategoryByName = async (categoryName: string) => {
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
};

export const getCategories = async () => {
  const category = await prismadb.category.findMany({
    where: {
      products: {
        some: {
          isPro: false,
          isArchived: false,
          products: { some: { isArchived: false } },
        },
      },
    },
  });
  return category;
};

export const getProCategories = async () => {
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
};
