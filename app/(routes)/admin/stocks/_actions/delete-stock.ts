"use server";
import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
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
      revalidateTag("stocks");
      return { success: true, message: "Stock supprimé" };
    },
  });
}
