"server only";

import prismadb from "@/lib/prismadb";

export type MainProductType = NonNullable<Awaited<ReturnType<typeof getMainProduct>>>;
export const getMainProduct = async (id?: string) => {
  if (!id || id === "new") {
    return null;
  }
  return await prismadb.mainProduct.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: { options: { orderBy: { index: "asc" } }, stocks: true },
        orderBy: { index: "asc" },
      },
    },
  });
};
