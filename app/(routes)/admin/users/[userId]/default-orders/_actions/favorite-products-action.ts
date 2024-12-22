"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateFavoriteProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  productIds: z.array(z.string()),
});

async function favoriteProductsAction(data: z.infer<typeof schema>) {
  return await safeServerAction({
    schema,
    data,
    roles: ADMIN,
    serverAction: async ({ userId, productIds }) => {
      await prismadb.favoriteProduct.deleteMany({
        where: {
          userId,
        },
      });
      await prismadb.favoriteProduct.createMany({
        data: productIds.map((productId) => ({
          userId,
          productId,
        })),
      });
      revalidateFavoriteProducts();

      return {
        success: true,
        message: "",
      };
    },
  });
}

export default favoriteProductsAction;
