"use server";
import { checkReadOnlyAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { addHours } from "date-fns";
import { z } from "zod";

const schema = z.object({
  date: z.date(),
});

async function getTodaysOrders(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    getUser: checkReadOnlyAdmin,
    schema: schema,
    serverAction: async ({ date }) => {
      const startDate = date;
      const endDate = addHours(date, 24);

      const orders = await prismadb.order.findMany({
        where: {
          dateOfShipping: {
            gte: startDate,
            lte: endDate,
          },
          deletedAt: null,
          shippingEmail: null,
          OR: [{ shopId: null }, { shopId: "" }],
        },

        select: {
          user: { select: { address: true } },
        },
      });
      if (orders.length === 0) {
        return { success: false, message: "Aucune commande n'a été trouvée" };
      }
      return { success: true, data: orders, message: "Commandes trouvées" };
    },
  });
}

export default getTodaysOrders;
