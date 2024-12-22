"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  optionIds: z.array(z.string()),
  name: z.string(),
});

export async function updateOption(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ name, optionIds }) => {
      await prismadb.option.updateMany({
        where: { id: { in: optionIds } },
        data: {
          name,
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
