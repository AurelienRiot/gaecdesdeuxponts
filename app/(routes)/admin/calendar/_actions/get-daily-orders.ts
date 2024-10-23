"use server";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { getOrdersByDate } from "../_functions/get-orders";
import { addDelay } from "@/lib/utils";

const schema = z.object({
  from: z.date(),
  to: z.date(),
});

async function getDailyOrders(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    roles: ["admin", "readOnlyAdmin"],
    schema,
    serverAction: async ({ from, to }) => {
      // await addDelay(20000);

      return await getOrdersByDate({ from, to });
    },
  });
}

export default getDailyOrders;
