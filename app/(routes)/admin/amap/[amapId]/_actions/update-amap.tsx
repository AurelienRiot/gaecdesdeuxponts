"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { schema, type AMAPFormValues } from "../_components/amap-schema";

async function updateAMAP(data: AMAPFormValues) {
  return await safeServerAction({
    schema: schema,
    data,
    getUser: checkAdmin,
    serverAction: async ({
      id,
      amapItems,
      dateOfEdition,
      daysOfAbsence,
      endDate,
      shippingDays,
      shopId,
      startDate,
      totalPrice,
      userId,
    }) => {
      await prismadb.aMAPItem.deleteMany({
        where: {
          orderId: id,
        },
      });

      await prismadb.aMAPOrder.update({
        where: {
          id,
        },
        data: {
          totalPrice,
          userId,
          shippingDays,
          daysOfAbsence,
          dateOfEdition,
          startDate,
          endDate,
          shopId,
          amapItems: {
            create: amapItems.map((product) => {
              return {
                itemId: product.itemId,
                price: product.price,
                quantity: product.quantity,
                unit: product.unit,
                name: product.name,
                description: product.description,
              };
            }),
          },
        },
      });

      // if (data.dateOfShipping) {
      //   const event = await createOrdersEvent({ date: data.dateOfShipping });
      //   if (!event.success) {
      //     console.log(event.message);
      //   }
      // }

      return {
        success: true,
        message: "Commande AMAP mise à jour",
      };
    },
  });
}

export default updateAMAP;
