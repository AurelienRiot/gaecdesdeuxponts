"use server";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import z from "zod";

const schema = z.object({
  checked: z.boolean(),
});

async function changeInvoice(data: z.infer<typeof schema>) {
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
              create: { sendInvoiceEmail: checked },
              update: { sendInvoiceEmail: checked },
            },
          },
        },
      });

      // revalidateTag("users");

      return {
        success: true,
        message: "",
      };
    },
  });
}

export default changeInvoice;