"server only";

import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

export async function updateStocks(orderItems: { quantity: number; stocks: string[] }[], reverse = false) {
  const updatePromises = []; // Array to hold all update promises

  for (const item of orderItems) {
    for (const stockId of item.stocks) {
      updatePromises.push(
        prismadb.stock
          .update({
            where: { id: stockId },
            data: { totalQuantity: reverse ? { increment: item.quantity } : { decrement: item.quantity } },
          })
          .catch(() => {
            console.log("Stock not found");
          }),
      );
    }
  }

  await Promise.all(updatePromises);
  revalidateTag("stocks-count");
}
