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
    serverAction: async ({ day, defaultOrderProducts, userId, confirmed }) => {
      const defaultOrder = await prismadb.defaultOrder.findUnique({
        where: {
          userId_day: {
            userId,
            day,
          },
        },
      });
      if (!defaultOrder) {
        await prismadb.defaultOrder.create({
          data: {
            userId,
            day,
            confirmed,
            defaultOrderProducts: { create: defaultOrderProducts },
          },
        });
      } else {
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
              defaultOrderProducts: { create: defaultOrderProducts },
            },
          });
        }
      }
      revalidateTag("defaultOrders");
      return { success: true, message: "Commande par défault mise à jour" };
    },
  });
}

export default updateDefaultOrdersAction;
