"server only";

import prismadb from "@/lib/prismadb";

async function getDayOrders() {
  return await prismadb.dayOrder.findMany({ include: { dayOrderUsers: { orderBy: { index: "asc" } } } });
}
export type GetDayOrdersType = Awaited<ReturnType<typeof getDayOrders>>;
export default getDayOrders;
