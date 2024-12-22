"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  optionIds: z.array(z.string()),
});

export async function deleteOption(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ optionIds }) => {
      await prismadb.option.deleteMany({
        where: { id: { in: optionIds } },
      });

      revalidateProducts();
      return {
        success: true,
        message: "",
      };
    },
  });
}
