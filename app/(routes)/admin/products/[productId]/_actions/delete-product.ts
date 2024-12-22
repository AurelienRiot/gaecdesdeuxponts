"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
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

      revalidateProducts();
      return {
        success: true,
        message: "",
      };
    },
  });
}
