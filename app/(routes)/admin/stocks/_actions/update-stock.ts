"use server";
import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateStocks } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import z from "zod";

const schema = z.object({
  id: z.string().min(1, { message: "Le nom est obligatoire" }),
  quantity: z.coerce.number(),
});
export default async function updateStock(formdata: FormData) {
  await safeServerAction({
    schema,
    roles: SHIPPING_ONLY,
    data: Object.fromEntries(formdata.entries()) as unknown as z.infer<typeof schema>,
    serverAction: async ({ id, quantity }) => {
      await prismadb.stock.update({
        where: { id },
        data: {
          totalQuantity: {
            increment: quantity,
          },
        },
      });
      revalidateStocks("stocks");
      return { success: true, message: "Stock mis à jour" };
    },
  });
}
