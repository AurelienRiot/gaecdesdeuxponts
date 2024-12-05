"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
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
