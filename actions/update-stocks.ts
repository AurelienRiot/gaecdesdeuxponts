"server only";

import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

export async function updateStocks(orderItems: { quantity: number; stocks: string[] }[], reverse = false) {
  const stockQuantityMap = new Map<string, number>();

  for (const { quantity, stocks } of orderItems) {
    for (const stockId of stocks) {
      stockQuantityMap.set(stockId, (stockQuantityMap.get(stockId) ?? 0) + quantity);
    }
  }

  // Build update promises for each stockId
  const updatePromises = Array.from(stockQuantityMap, ([stockId, total]) =>
    prismadb.stock
      .update({
        where: { id: stockId },
        data: {
          totalQuantity: reverse ? { increment: total } : { decrement: total },
        },
      })
      .catch(() => console.log("Stock not found")),
  );

  await Promise.all(updatePromises);
  revalidateTag("stocks");
}
