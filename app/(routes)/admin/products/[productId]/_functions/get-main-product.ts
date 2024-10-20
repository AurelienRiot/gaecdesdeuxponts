"server only";

import prismadb from "@/lib/prismadb";
import type { MainProduct, Option, Product, ProductStock, Unit } from "@prisma/client";

export interface GetMainProductType extends MainProduct {
  products: (Product & { options: Option[]; stocks: ProductStock[] })[];
}

export const getMainProduct = async (id?: string): Promise<GetMainProductType | null> => {
  if (!id) {
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
