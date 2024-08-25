import prismadb from "@/lib/prismadb";

async function getOrders({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const orders = await prismadb.order.findMany({
    where: {
      dateOfShipping: {
        gte: startDate,
        lte: endDate,
      },
      NOT: { shop: null },
    },
    include: {
      orderItems: { select: { itemId: true, name: true, quantity: true, unit: true } },
      customer: { select: { customerId: true, name: true, shippingAddress: true } },
      user: { select: { company: true, email: true } },
    },
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    customerId: order.customer?.customerId,
    shippingAddress: order.customer?.shippingAddress,
    name: order.customer?.name,
    company: order.user?.company,
    orderItems: order.orderItems.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
    })),
  }));

  const productQuantities = orders
    .flatMap((order) =>
      order.orderItems.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
    )
    .reduce((acc: { itemId: string; name: string; quantity: number; unit: string | null }[], curr) => {
      const existing = acc.find((item) => item.itemId === curr.itemId);
      if (curr.quantity < 0) return acc;
      if (existing) {
        existing.quantity += curr.quantity;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

  return { productQuantities, formattedOrders };
}

export default getOrders;
