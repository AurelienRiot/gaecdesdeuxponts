"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { schema, type AMAPFormValues } from "../_components/amap-schema";

async function createAMAP(data: AMAPFormValues) {
  return await safeServerAction({
    schema: schema,
    data,
    roles: SHIPPING_ONLY,
    serverAction: async ({ amapItems, ...data }) => {
      await prismadb.aMAPOrder.create({
        data: {
          ...data,
          amapItems: {
            create: amapItems.map(({ itemId, price, quantity, unit, name, description, icon }) => {
              return {
                itemId,
                price,
                quantity,
                unit,
                name,
                icon,
                description,
              };
            }),
          },
        },
      });

      const event = await createOrdersEvent(data.startDate);
      if (!event.success) {
        console.log(event.message);
      }
      revalidateTag("amap-orders");
      revalidatePath("/admin/calendar");
      return {
        success: true,
        message: "Commande AMAP crée",
        data: {
          id: data.id,
        },
      };
    },
  });
}

export default createAMAP;
