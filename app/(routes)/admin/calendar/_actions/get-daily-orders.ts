"use server";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { getOrdersByDate } from "../_functions/get-orders";
import { READ_ONLY_ADMIN } from "@/components/auth";

const schema = z.object({
  from: z.date(),
  to: z.date(),
});

async function getDailyOrders(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    roles: READ_ONLY_ADMIN,
    schema,
    serverAction: async ({ from, to }) => {
      // await addDelay(20000);
      console.log({ from, to });
      return await getOrdersByDate({ from, to });
    },
  });
}

export default getDailyOrders;
