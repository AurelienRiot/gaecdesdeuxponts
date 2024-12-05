"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const schema = z.array(
  z.object({
    optionIds: z.array(z.string()),
    index: z.number(),
  }),
);

async function updateOptionsIndex(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async (options) => {
      await Promise.all(
        options.map(async ({ optionIds, index }) => {
          await prismadb.option.updateMany({
            where: { id: { in: optionIds } },
            data: {
              index,
            },
          });
        }),
      );

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

export default updateOptionsIndex;
