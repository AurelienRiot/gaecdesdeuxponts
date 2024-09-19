import prismadb from "@/lib/prismadb";
import { getUnitLabel } from "../product/product-function";
import { addDays } from "date-fns";
import { Option } from "@prisma/client";

export const getAllOrders = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  // return dummieDate;
  const [orders, amapOrders] = await Promise.all([
    prismadb.order.findMany({
      where: {
        dateOfShipping: {
          gte: startDate,
          lte: endDate,
        },
        NOT: { shop: null },
        deletedAt: null,
      },
      select: {
        id: true,
        shippingEmail: true,
        orderItems: { select: { itemId: true, name: true, quantity: true, unit: true } },
        customer: { select: { shippingAddress: true } },
        user: { select: { company: true, email: true, image: true, name: true, id: true } },
      },
    }),

    prismadb.aMAPOrder
      .findMany({
        where: {
          endDate: {
            gte: addDays(new Date(), -1), // new Date(),
          },
        },
        select: {
          shippingDays: true,
          user: { select: { name: true, email: true, id: true } },
          amapItems: { select: { itemId: true, name: true, quantity: true, unit: true } },
          shop: { select: { name: true, address: true, id: true, imageUrl: true } },
        },
      })
      .then((orders) => orders.filter((order) => order.shippingDays.some((day) => day >= startDate && day < endDate)))
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
      ),
  ]);

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

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    customerId: order.user.id,
    shippingAddress: order.customer?.shippingAddress,
    shippingEmail: order.shippingEmail,
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

  // if (formattedOrders.length > 1) {
  //   const waypoints = formattedOrders.map((order) => order.shippingAddress || "");

  //   const orderWaypoints = await directionGoogle({ origin: origin.label, destination: destination.label, waypoints });
  //   if (orderWaypoints.success && orderWaypoints.data) {
  //     formattedOrders = orderWaypoints.data.map((index) => formattedOrders[index]);
  //   }
  // }

  const productQuantities = extractProductQuantities(
    orders
      .flatMap((order) =>
        order.orderItems.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          unit: getUnitLabel(item.unit).quantity,
          quantity: item.quantity,
        })),
      )
      .concat(Object.values(groupedAMAPOrders).flatMap((order) => order.orderItems.map((item) => item))),
  );

  return { productQuantities, formattedOrders, groupedAMAPOrders };
};

export default getAllOrders;

export type ProductQuantities = {
  itemId: string;
  name: string;
  unit: string;
  quantity: number;
};

const excludedNames = new Set(["Consigne bouteille verre 1L", "Bouteille verre 1L", "Consigne bouteille verre"]);

const aggregationRules: { match: RegExp; aggregateTo: string }[] = [
  {
    match: /^Lait cru bouteille verre 1L$/i,
    aggregateTo: "Casier lait cru 1L",
  },
  {
    match: /^(Lait cru bouteille verre 1L consignée|Lait cru bio 1L)$/i,
    aggregateTo: "Casier lait cru consignée 1L",
  },
];

function getAggregateProducts(products: ProductQuantities[]): ProductQuantities[] {
  const aggregatedMap: Map<string, { quantity: number; itemId: string; unit: string }> = new Map();

  for (const product of products) {
    const { name, quantity, itemId, unit } = product;

    // Skip excluded product names
    if (excludedNames.has(name) || quantity <= 0) {
      continue;
    }

    let aggregatedName: string | null = null;

    for (const rule of aggregationRules) {
      if (rule.match.test(name)) {
        aggregatedName = rule.aggregateTo;
        break;
      }
    }

    if (aggregatedName) {
      // Aggregate under the specified name
      const existing = aggregatedMap.get(aggregatedName);
      if (existing) {
        existing.quantity += quantity;
      } else {
        aggregatedMap.set(aggregatedName, { quantity, itemId, unit });
      }
    } else {
      // Otherwise, aggregate by the original product name
      const key = name;
      const existing = aggregatedMap.get(key);
      if (existing) {
        existing.quantity += quantity;
      } else {
        aggregatedMap.set(key, { quantity, itemId, unit });
      }
    }
  }

  // Convert the aggregated map to an array of ProductQuantities
  const aggregatedProducts: ProductQuantities[] = [];

  for (const [name, { quantity, itemId, unit }] of aggregatedMap.entries()) {
    aggregatedProducts.push({
      name,
      itemId,
      unit,
      quantity: name.includes("Casier") ? quantity / 12 : quantity,
    });
  }

  return aggregatedProducts;
}

export function extractProductQuantities(productQuantities: ProductQuantities[]): {
  aggregateProducts: ProductQuantities[];
  totaleQuantity: { name: string; quantity: number; unit: string }[];
} {
  const aggregateProducts = getAggregateProducts(productQuantities);
  const totaleLiters = aggregateProducts.reduce((acc, curr) => {
    const liter = extractLiters(curr.name);
    const coef = curr.name.includes("Casier") ? 12 : 1;
    if (liter) {
      return acc + liter * curr.quantity * coef;
    }
    return acc;
  }, 0);

  return { aggregateProducts, totaleQuantity: [{ name: "lait cru", quantity: totaleLiters, unit: "L" }] };
}

function extractLiters(productName: string): number | null {
  try {
    if (productName.includes("vrac")) return 1;
    const regex = /\b\d+([.,]\d+)?\s?(L|liter|litre|liters|litres)\b/i;
    const match = productName.match(regex);
    if (match) {
      const numberString = match[0]
        .replace(/[Ll]iter(s)?/i, "")
        .trim()
        .replace(",", ".");
      const number = Number.parseFloat(numberString);
      return Number.isNaN(number) ? null : number;
    }
    return null;
  } catch (error) {
    console.error(`Error extracting liters from "${productName}":`, error);
    return null;
  }
}

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
