"server only";

import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

export async function updateStocks(orderItems: { quantity: number; stocks: string[] }[]) {
  const updatePromises = []; // Array to hold all update promises

  for (const item of orderItems) {
    for (const stockId of item.stocks) {
      updatePromises.push(
        prismadb.stock
          .update({
            where: { id: stockId },
            data: { totalQuantity: { decrement: item.quantity } },
          })
          .catch(() => {
            console.log("Stock not found");
          }),
      );
    }
  }

  await Promise.all(updatePromises);
  revalidateTag("stocks");
}
