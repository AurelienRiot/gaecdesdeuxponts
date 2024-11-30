"use server";
import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { formatUser } from "../../../orders/[orderId]/_functions/get-users-for-orders";

const linkShopSchema = z.object({
  shopId: z.string(),
  userId: z.string(),
});

async function linkShop(data: z.infer<typeof linkShopSchema>) {
  return await safeServerAction({
    data,
    schema: linkShopSchema,
    roles: ADMIN,
    serverAction: async ({ userId, shopId }) => {
      await prismadb.shop.update({
        where: {
          id: shopId,
        },
        data: {
          userId,
        },
      });

      const user = await prismadb.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          address: true,
          billingAddress: true,
          shop: { include: { links: true, shopHours: { orderBy: { day: "asc" } } } },
          defaultOrders: { select: { day: true } },
          favoriteProducts: { select: { productId: true } },
        },
      });

      const data = user ? formatUser(user) : undefined;

      revalidateTag("shops");
      revalidateTag("users");
      return {
        success: true,
        message: "Magasin lié au client",
        data,
      };
    },
  });
}

export default linkShop;
