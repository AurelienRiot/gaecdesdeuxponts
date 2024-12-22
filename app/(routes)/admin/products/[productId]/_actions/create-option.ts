"use server";

import { ADMIN } from "@/components/auth";
import { createId } from "@/lib/id";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  productIds: z.array(z.string()),
  name: z.string(),
  index: z.number(),
});

export async function createOption(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ productIds, name, index }) => {
      const newOptions = productIds.map((productId) => ({ id: createId("option"), index, name, value: "", productId }));
      await prismadb.option.createMany({
        data: newOptions,
      });

      revalidateProducts();
      return {
        success: true,
        message: "Produit creé",
      };
    },
  });
}
