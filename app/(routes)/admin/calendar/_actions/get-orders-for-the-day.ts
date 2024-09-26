"use server";
import { checkReadOnlyAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { addDelay } from "@/lib/utils";
import { addHours } from "date-fns";
import { z } from "zod";

const schema = z.object({
  date: z.date(),
});

async function getOrdersForTheDay(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema: schema,
    roles: ["admin", "readOnlyAdmin"],
    serverAction: async ({ date }) => {
      const startDate = date;
      const endDate = addHours(date, 24);
      await addDelay(500);
      // const orders = await prismadb.order.findMany({
      //   where: {
      //     dateOfShipping: {
      //       gte: startDate,
      //       lte: endDate,
      //     },
      //     deletedAt: null,
      //   },
      //   include: {
      //     orderItems: true,
      //   },
      // });

      return {
        success: true,
        data: {
          day: date,
          loading: false as const,
          orders: Array.from({ length: 5 }, (_, idx) => ({
            id: `${date.toISOString()}-order-${idx + 1}`,
          })),
        },
        message: "Commandes trouvées",
      };
    },
  });
}

export default getOrdersForTheDay;
