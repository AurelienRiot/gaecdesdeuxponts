import prismadb from "@/lib/prismadb";
import { addHours } from "date-fns";
import { getUnitLabel } from "../product/product-function";
import { directionGoogle } from "./direction-google";

export const origin = "6 le Pont Robert 44290 Massérac";
export const destination = "Pont de l'Eau, 44460 Avessac, France";

async function getOrders({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const start = startDate.toISOString().split("T")[0];
  // return dummieDate;

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
      customer: { select: { shippingAddress: true } },
      user: { select: { company: true, email: true, image: true, name: true } },
    },
  });

  const amapOrders = await prismadb.aMAPOrder
    .findMany({
      where: {
        startDate: {
          lte: startDate,
        },
        endDate: {
          gte: endDate,
        },
      },
      include: {
        user: { select: { name: true, email: true } },
        amapItems: { select: { itemId: true, name: true, quantity: true, unit: true } },
        shop: { select: { name: true, address: true, id: true, imageUrl: true } },
      },
    })
    .then((orders) =>
      orders.filter((order) =>
        order.shippingDays.some((day) => addHours(day, 2).toISOString().split("T")[0] === start),
      ),
    )
    .then((orders) =>
      orders.map((order) => ({
        shopName: order.shop.name,
        shopId: order.shop.id,
        address: order.shop.address,
        image: order.shop.imageUrl,
        orderItems: order.amapItems.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          unit: getUnitLabel(item.unit).quantity,
        })),
      })),
    );

  const groupedAMAPOrders = amapOrders.reduce(
    (acc, order) => {
      const key = order.shopName;
      if (!acc[key]) {
        acc[key] = order;
      } else {
        const newItems = acc[key].orderItems;
        for (const item of order.orderItems) {
          const existingItem = newItems.find((i) => i.itemId === item.itemId);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            newItems.push(item);
          }
        }
        acc[key] = { ...order, orderItems: newItems };
      }
      return acc;
    },
    {} as Record<string, (typeof amapOrders)[0]>,
  );

  let formattedOrders = orders.map((order) => ({
    id: order.id,
    customerId: order.userId,
    shippingAddress: order.customer?.shippingAddress,
    name: order.user?.name,
    company: order.user?.company,
    image: order.user?.image,
    orderItems: order.orderItems.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      unit: getUnitLabel(item.unit).quantity,
    })),
  }));

  const waypoints = formattedOrders.map((order) => order.shippingAddress || "");

  const orderWaypoints = await directionGoogle({ origin, destination, waypoints });
  if (orderWaypoints.success && orderWaypoints.data) {
    formattedOrders = orderWaypoints.data.map((index) => formattedOrders[index]);
  }

  const productQuantities = orders
    .flatMap((order) =>
      order.orderItems.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        unit: getUnitLabel(item.unit).quantity,
      })),
    )
    .concat(Object.values(groupedAMAPOrders).flatMap((order) => order.orderItems.map((item) => item)))
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

  return { productQuantities, formattedOrders, groupedAMAPOrders };
}

export default getOrders;

const dummieDate = {
  productQuantities: [
    {
      itemId: "PR_7dud9y",
      name: "Lait cru bouteille plastique",
      quantity: 5,
      unit: null,
    },
    {
      itemId: "PR_lppxu7",
      name: "Lait pasteurisé entier bouteille verre",
      quantity: 4,
      unit: null,
    },
    {
      itemId: "PR_K7PBWYK",
      name: "Lait cru bio bidon 2L",
      quantity: 4,
      unit: null,
    },
  ],
  formattedOrders: [
    {
      id: "CM_27-8-24_BPZOQ",
      customerId: "CS_DRMIGXM",
      shippingAddress: "6 Rue de Plessé, 44460, Avessac, FR",
      name: "Éric et Aline Pecquery - Proxi l'épicerie du village AVESSAC",
      company: "Proxi l'épicerie du village AVESSAC",
      image: "https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/farm/gqy08ightzdlbkxxbzgr",
      orderItems: [
        {
          itemId: "PR_7dud9y",
          name: "Lait cru bouteille plastique",
          quantity: 5,
          unit: null,
        },
        {
          itemId: "PR_lppxu7",
          name: "Lait pasteurisé entier bouteille verre",
          quantity: 4,
          unit: null,
        },
      ],
    },
  ],
  groupedAMAPOrders: {
    "AMAP de Guemene Penfao": {
      shopName: "AMAP de Guemene Penfao",
      shopId: "SH_DVKCW7G",
      address: "1 Rue de l'Hotel de Ville 44290 Guémené-Penfao",
      image: "https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/farm/q19sqjlljj3tlcj2jzkz",
      orderItems: [
        {
          itemId: "PR_K7PBWYK",
          name: "Lait cru bio bidon 2L",
          quantity: 4,
          unit: null,
        },
      ],
    },
  },
};
