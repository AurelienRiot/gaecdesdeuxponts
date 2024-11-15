"use server";

import { SHIPPING } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { defaultOrderSchema, type DefaultOrderFormValues } from "../_components/schema";
import { DAYS_OF_WEEK } from "@/lib/date-utils";

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
          return { success: false, message: "Aucun produits dans la commande par défault" };
        }
        await prismadb.defaultOrder.create({
          data: {
            userId,
            day,
            shopId,
            confirmed,
            defaultOrderProducts: { create: defaultOrderProducts },
          },
        });
        return { success: true, message: `Commande par défault de ${DAYS_OF_WEEK[day]}  crée` };
      }

      if (defaultOrderProducts.length === 0) {
        await prismadb.defaultOrder.delete({
          where: {
            id: defaultOrder.id,
          },
        });
      } else {
        await prismadb.defaultOrderProduct.deleteMany({
          where: {
            defaultOrderId: defaultOrder.id,
          },
        });
        await prismadb.defaultOrder.update({
          where: {
            id: defaultOrder.id,
          },
          data: {
            confirmed,
            shopId,
            defaultOrderProducts: { create: defaultOrderProducts },
          },
        });
      }
      return { success: true, message: `Commande par défault de ${DAYS_OF_WEEK[day]}  mise à jour` };
    },
  });
}

export default updateDefaultOrdersAction;
