"use server";
import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateStocks } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import z from "zod";

const schema = z.object({
  id: z.string(),
});
export default async function deleteStock(data: z.infer<typeof schema>) {
  return await safeServerAction({
    schema,
    data,
    roles: ADMIN,
    serverAction: async ({ id }) => {
      await prismadb.stock.delete({
        where: { id },
      });
      revalidateStocks("stocksName");
      return { success: true, message: "Stock supprimé" };
    },
  });
}
