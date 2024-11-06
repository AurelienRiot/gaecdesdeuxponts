import { getLocalIsoString } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";

async function getOrdersIndex(userId: string, dateOfShipping?: Date | null) {
  if (!dateOfShipping) return null;
  const day = new Date(getLocalIsoString(dateOfShipping)).getUTCDay();
  console.log({ day, userId });
  const dayOrder = await prismadb.dayOrder.findUnique({
    where: {
      day,
    },
    select: {
      dayOrderUsers: true,
    },
  });
  console.dir({ dayOrder }, { depth: Number.POSITIVE_INFINITY });
  if (!dayOrder || dayOrder.dayOrderUsers.length === 0) return null;
  const index = dayOrder.dayOrderUsers.find((user) => user.userId === userId)?.index;
  console.log({ index });
  return index ?? null;
}

export default getOrdersIndex;
