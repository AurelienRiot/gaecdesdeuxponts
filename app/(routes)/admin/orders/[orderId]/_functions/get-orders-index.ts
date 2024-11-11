import { getLocalIsoString } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";

async function getOrdersIndex(userId: string, dateOfShipping?: Date | null) {
  if (!dateOfShipping) return null;
  const day = new Date(getLocalIsoString(dateOfShipping)).getUTCDay();
  const dayOrder = await prismadb.dayOrder.findUnique({
    where: {
      day,
    },
    select: {
      dayOrderUsers: true,
    },
  });
  if (!dayOrder || dayOrder.dayOrderUsers.length === 0) return null;
  const index = dayOrder.dayOrderUsers.find((user) => user.userId === userId)?.index;
  return index ?? null;
}

export default getOrdersIndex;
