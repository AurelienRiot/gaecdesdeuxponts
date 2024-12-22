"use server";
import { ADMIN, SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateAmap } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const shippedDaySchema = z.object({
  id: z.string(),
  shippedDay: z.date(),
  checked: z.boolean(),
});

async function setShippedDay(data: z.infer<typeof shippedDaySchema>) {
  return await safeServerAction({
    data,
    schema: shippedDaySchema,
    roles: SHIPPING_ONLY,
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

      // revalidateAmap();

      return {
        success: true,
        message: "",
      };
    },
  });
}
export { setShippedDay };
