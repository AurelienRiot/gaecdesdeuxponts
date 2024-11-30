"server only";

import prismadb from "@/lib/prismadb";

export type GetDefaultOrdersType = Awaited<ReturnType<typeof getDefaultOrders>>;

async function getDefaultOrders(id?: string) {
  return await prismadb.user.findUnique({
    where: {
      id,
    },
    select: {
      role: true,
      name: true,
      company: true,
      favoriteProducts: { select: { productId: true } },
      defaultOrders: { include: { defaultOrderProducts: true } },
    },
  });
}

export default getDefaultOrders;
