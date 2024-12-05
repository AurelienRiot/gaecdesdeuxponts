"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});
export async function deleteProduct(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ id }) => {
      await prismadb.product.delete({
        where: {
          id,
        },
      });

      revalidateTag("categories");
      revalidateTag("products");
      revalidatePath("/category", "layout");
      return {
        success: true,
        message: "",
      };
    },
  });
}
