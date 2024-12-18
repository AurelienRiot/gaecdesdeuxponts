"use server";

import { SHIPPING } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { defaultOrderSchema, type DefaultOrderFormValues } from "../_components/schema";

async function updateDefaultOrdersAction(data: DefaultOrderFormValues) {
  return await safeServerAction({
    data,
    roles: SHIPPING,
    schema: defaultOrderSchema,
    serverAction: async ({ day, defaultOrderProducts, shopId, userId, confirmed }) => {
      revalidateTag("defaultOrders");

      const defaultOrder = await prismadb.defaultOrder.findUnique({
        where: {
          userId_day: {
            userId,
            day,
          },
        },
      });

      if (!defaultOrder) {
        if (defaultOrderProducts.length === 0) {
          return { success: true, message: "" };
        }
        const defaultOrders = await prismadb.defaultOrder.create({
          data: {
            userId,
            day,
            shopId: shopId || null,
            confirmed,
            defaultOrderProducts: { create: defaultOrderProducts },
          },
          select: {
            user: {
              select: {
                defaultOrders: {
                  select: {
                    day: true,
                  },
                },
              },
            },
          },
        });

        return {
          success: true,
          // message: `Commande par défault de ${DAYS_OF_WEEK[day]} crée`,
          message: "",
          data: defaultOrders.user.defaultOrders.map((order) => order.day),
        };
      }

      if (defaultOrderProducts.length === 0) {
        await prismadb.defaultOrder.delete({
          where: { id: defaultOrder.id },
        });
      } else {
        await Promise.all([
          prismadb.defaultOrderProduct.deleteMany({
            where: { defaultOrderId: defaultOrder.id },
          }),
          prismadb.defaultOrder.update({
            where: { id: defaultOrder.id },
            data: {
              confirmed,
              shopId: shopId || null,

              defaultOrderProducts: { create: defaultOrderProducts },
            },
          }),
        ]);
      }

      const defaultOrders = await prismadb.defaultOrder.findMany({
        where: { userId },
        select: { day: true },
      });

      return {
        success: true,
        // message: `Commande par défault de ${DAYS_OF_WEEK[day]} mise à jour`,
        message: "",
        data: defaultOrders.map((order) => order.day),
      };
    },
  });
}

export default updateDefaultOrdersAction;
