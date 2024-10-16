import { getLocalIsoString } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import { addDays, subDays, subHours } from "date-fns";

async function getOrdersIndex(userId: string, dateOfShipping?: Date | null) {
  if (!dateOfShipping) return null;
  const localDate = getLocalIsoString(dateOfShipping);
  const beginDay = subDays(subHours(new Date(localDate), 2), 7);
  const endDay = addDays(beginDay, 1);
  console.log({ beginDay, endDay });
  const order = await prismadb.order.findMany({
    where: {
      userId,
      dateOfShipping: {
        gte: beginDay,
        lt: endDay,
      },
      deletedAt: null,
    },
    orderBy: { dateOfShipping: "desc" },
    select: { userId: true, index: true },
  });
  if (order.length === 0) return null;
  return order[0].index;
}

export default getOrdersIndex;
