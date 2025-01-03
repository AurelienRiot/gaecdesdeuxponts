"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateAmap } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { schema, type AMAPFormValues } from "../_components/amap-schema";

async function updateAMAP(data: AMAPFormValues) {
  return await safeServerAction({
    schema: schema,
    data,
    roles: SHIPPING_ONLY,
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
      totalPaid,
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
          totalPaid,
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
                icon: product.icon,
                name: product.name,
                description: product.description,
              };
            }),
          },
        },
      });
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);
      // const nextDayShippingDay = (() => {
      //   for (const date of shippingDays.sort((a, b) => b.getTime() - a.getTime())) {
      //     if (date.getTime() <= today.getTime()) {
      //       return date;
      //     }
      //   }
      // })();
      // if (nextDayShippingDay) {
      //   const event = await createOrdersEvent(nextDayShippingDay);
      //   if (!event.success) {
      //     console.log(event.message);
      //   }
      // }
      revalidateAmap();
      return {
        success: true,
        message: "Commande AMAP mis à jour",
      };
    },
  });
}

export default updateAMAP;
