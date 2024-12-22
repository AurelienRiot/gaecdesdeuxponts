"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.array(
  z.object({
    productId: z.string(),
    index: z.number(),
  }),
);

async function updateProductsIndex(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async (products) => {
      await Promise.all(
        products.map(async ({ productId, index }) => {
          await prismadb.product.updateMany({
            where: { id: productId },
            data: {
              index,
            },
          });
        }),
      );

      revalidateProducts();

      return {
        success: true,
        message: "",
      };
    },
  });
}

export default updateProductsIndex;
