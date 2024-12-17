"use server";
import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
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
      // console.log(stock);
      revalidateTag("stocks");
      return { success: true, message: "Stock mis à jour" };
    },
  });
}
