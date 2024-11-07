"use server";

import safeServerAction from "@/lib/server-action";
import { defaultOrderSchema, type DefaultOrderFormValues } from "../_components/schema";
import { SHIPPING } from "@/components/auth";
import prismadb from "@/lib/prismadb";

async function updateDefaultOrdersAction(data: DefaultOrderFormValues) {
  return await safeServerAction({
    data,
    roles: SHIPPING,
    schema: defaultOrderSchema,
    serverAction: async ({ day, defaultOrderProducts, userId }) => {
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
            defaultOrderProducts: { create: defaultOrderProducts },
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
            defaultOrderProducts: { create: defaultOrderProducts },
          },
        });
      }

      return { success: true, message: "Commande par défault mise à jour" };
    },
  });
}

export default updateDefaultOrdersAction;
