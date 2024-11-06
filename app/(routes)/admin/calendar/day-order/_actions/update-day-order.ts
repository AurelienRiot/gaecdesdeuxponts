"use server";
import { SHIPPING } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  userIds: z.array(z.string()),
  day: z.number(),
});

async function updateDayOrder(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    roles: SHIPPING,
    schema,
    serverAction: async ({ userIds, day }) => {
      const dayOrder = await prismadb.dayOrder.findUnique({
        where: { day },
        include: { dayOrderUsers: true },
      });
      console.dir({ dayOrder }, { depth: Number.POSITIVE_INFINITY });
      if (dayOrder) {
        await prismadb.dayOrderUser.deleteMany({
          where: {
            dayOrderId: dayOrder.day,
          },
        });
        await prismadb.dayOrder.update({
          where: { day },
          data: {
            dayOrderUsers: {
              create: userIds.map((userId, index) => ({
                userId,
                index,
              })),
            },
          },
        });
      } else {
        await prismadb.dayOrder.create({
          data: {
            day,
            dayOrderUsers: {
              create: userIds.map((userId, index) => ({
                userId,
                index,
              })),
            },
          },
        });
      }

      return {
        success: true,
        message: "Ordre mis à jour",
      };
    },
  });
}

export default updateDayOrder;
