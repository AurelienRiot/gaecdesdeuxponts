"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { addDelay } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const deleteSchema = z.object({
  id: z.string(),
  shippedDay: z.date(),
  checked: z.boolean(),
});

async function setShippedDay(data: z.infer<typeof deleteSchema>) {
  return await safeServerAction({
    data,
    schema: deleteSchema,
    getUser: checkAdmin,
    serverAction: async ({ id, shippedDay, checked }) => {
      if (!checked) {
        const amapOrder = await prismadb.aMAPOrder.findUnique({
          where: { id },
          select: { shippedDays: true },
        });
        if (!amapOrder) {
          return {
            success: false,
            message: "Une erreur est survenue",
          };
        }
        await prismadb.aMAPOrder
          .update({
            where: { id },
            data: { shippedDays: amapOrder.shippedDays.filter((day) => day.getTime() !== shippedDay.getTime()) },
          })
          .catch((e) => {
            console.log(e);
            return {
              success: false,
              message: "Une erreur est survenue",
            };
          });
      } else {
        await prismadb.aMAPOrder
          .update({
            where: { id },
            data: { shippedDays: { push: shippedDay } },
          })
          .catch((e) => {
            console.log(e);
            return {
              success: false,
              message: "Une erreur est survenue",
            };
          });
      }

      revalidateTag("amap-orders");

      return {
        success: true,
        message: "",
      };
    },
  });
}
export { setShippedDay };
