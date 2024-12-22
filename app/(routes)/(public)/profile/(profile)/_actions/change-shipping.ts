"use server";
import prismadb from "@/lib/prismadb";
import { revalidateUsers } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import z from "zod";

const schema = z.object({
  checked: z.boolean(),
});

async function changeShipping(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    serverAction: async ({ checked }, user) => {
      await prismadb.user.update({
        where: {
          id: user.id,
        },
        data: {
          notifications: {
            upsert: {
              create: { sendShippingEmail: checked },
              update: { sendShippingEmail: checked },
            },
          },
        },
      });

      revalidateUsers(user.id);

      return {
        success: true,
        message: "",
      };
    },
  });
}

export default changeShipping;
