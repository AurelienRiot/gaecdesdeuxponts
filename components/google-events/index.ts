import type { GetGroupedAMAPOrdersType } from "@/app/(routes)/admin/calendar/_functions/get-amap-orders";
import type { CalendarOrdersType } from "@/app/(routes)/admin/calendar/_functions/get-orders";
import { destination as dest, origin as ori } from "@/app/(routes)/admin/direction/_components/direction-schema";
import { getUserName } from "../table-custom-fuction";
import { nanoid } from "@/lib/id";
import { getLocalIsoString } from "@/lib/date-utils";
import { getTotalMilk } from "../product";
const googleDirectionUrl = "https://www.google.fr/maps/dir";

export const createDirectionUrl = ({
  origin = ori.label,
  destination = dest.label,
  addresses,
}: {
  origin?: string;
  destination?: string;
  addresses: string[];
}) => `${googleDirectionUrl}/${origin}/${addresses.join("/")}/${destination}`;

const googleMapsLink = "https://maps.google.com/?q=";
const appleMapsLink = "https://maps.apple.com/?q=";
const wazeLink = "https://waze.com/ul?q=";

export function getMapLinks({
  address,
  name,
  service = "google",
}: { address: string; name?: string | null; service?: "google" | "apple" | "waze" }) {
  switch (service) {
    case "google":
      return `${googleMapsLink}${encodeURIComponent(address)} ${name && encodeURIComponent(name)}`;
    case "apple":
      return `${appleMapsLink}${encodeURIComponent(address)} ${name && encodeURIComponent(name)}`;
    case "waze":
      return `${wazeLink}${encodeURIComponent(address)} ${name && encodeURIComponent(name)}`;
  }
}

export type GetAmapOrdersForTheDay = ReturnType<typeof getAmapOrdersForTheDay>;
export function getAmapOrdersForTheDay(amapOrders: GetGroupedAMAPOrdersType, date: Date) {
  return amapOrders.map((order) => ({
    shopName: order.shopName,
    shopImageUrl: order.shopImageUrl,
    order: order.shippingDays.find(
      (shippingDay) => getLocalIsoString(new Date(shippingDay.date)) === getLocalIsoString(date),
    ),
  }));
}

export type ProductQuantities = {
  itemId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
};

export type GroupUsersByProduct = {
  productId: string;
  productName: string;
  unit?: string;
  totalQuantity: number;
  users: {
    userId: string;
    image?: string | null;
    userName: string;
    quantity: number;
  }[];
};
const excludedNames = new Set(["Consigne bouteille verre 1L", "Bouteille verre 1L", "Consigne bouteille verre"]);

const aggregationRules: { match: RegExp; aggregateTo: string }[] = [
  // {
  //   match: /^Lait cru bouteille verre 1L$/i,
  //   aggregateTo: "Casier lait cru 1L",
  // },
  {
    match: /^(Lait cru bouteille verre 1L consignée|Lait cru bio 1L)$/i,
    aggregateTo: "Lait cru bouteille verre 1L consignée",
  },
];

export function groupUsersByProduct(
  orders: CalendarOrdersType[],
  amapOrders: GetAmapOrdersForTheDay,
): GroupUsersByProduct[] {
  const productMap = new Map<string, GroupUsersByProduct>();

  for (const order of orders) {
    const userName = getUserName(order.user);
    const userId = order.user.id;
    const image = order.user.image;

    for (const product of order.productsList) {
      const { itemId, name, unit, quantity, price } = product;

      // **Exclude products with negative quantity**
      if (quantity <= 0 || price <= 0 || excludedNames.has(name)) {
        break; // Skip this product
      }

      let aggregatedName = name;

      for (const rule of aggregationRules) {
        if (rule.match.test(name)) {
          aggregatedName = rule.aggregateTo;
          break;
        }
      }

      if (!productMap.has(aggregatedName)) {
        productMap.set(aggregatedName, {
          productId: itemId,
          productName: aggregatedName,
          unit,
          totalQuantity: quantity, // Initialize totalQuantity
          users: [],
        });
      } else {
        // If the product already exists, add to the total quantity
        const productOrder = productMap.get(aggregatedName);
        if (productOrder) {
          productOrder.totalQuantity += quantity; // Update totalQuantity
        }
      }

      const productOrder = productMap.get(aggregatedName);
      if (productOrder) {
        productOrder.users.push({
          image,
          userId,
          userName,
          quantity,
        });
      }
    }
  }

  for (const order of amapOrders) {
    const userName = order.shopName;
    const userId = nanoid(5);
    const image = order.shopImageUrl;

    for (const product of order.order?.items || []) {
      const { itemId, name, unit, quantity } = product;
      if (!productMap.has(name)) {
        productMap.set(name, {
          productId: itemId,
          productName: name,
          unit,
          totalQuantity: quantity, // Initialize totalQuantity
          users: [],
        });
      } else {
        // If the product already exists, add to the total quantity
        const productOrder = productMap.get(name);
        if (productOrder) {
          productOrder.totalQuantity += quantity; // Update totalQuantity
        }
      }
      const productOrder = productMap.get(name);
      if (productOrder) {
        productOrder.users.push({
          image,
          userId,
          userName,
          quantity,
        });
      }
    }
  }

  return Array.from(productMap.values());
}

export function extractProductQuantities(orders: CalendarOrdersType[], amapOrders: GetAmapOrdersForTheDay) {
  const aggregateProducts = groupUsersByProduct(orders, amapOrders);
  const totaleRawMilk = getTotalMilk(
    aggregateProducts
      .filter((product) => product.productName.toLowerCase().includes("lait cru"))
      .map((product) => ({ name: product.productName, quantity: product.totalQuantity })),
  );

  return {
    aggregateProducts,
    totaleQuantity: [{ name: "lait cru", quantity: Number(totaleRawMilk.toFixed(1)), unit: "L" }],
  };
}

export function displayQuantity(name: string, quantity: number) {
  if (!name.toLowerCase().includes("bouteille verre") || quantity < 0) {
    return quantity;
  }

  const quotient = Math.floor(quantity / 12);
  const remainder = quantity % 12;

  // Construct the return value based on the conditions
  if (quotient === 0) {
    return remainder; // If quotient is 0, return only the remainder
  }
  if (quotient === 1) {
    return `12${remainder > 0 ? ` + ${remainder}` : ""}`; // If quotient is 1, return 12 and remainder if not 0
  }
  return `${quotient}x12${remainder > 0 ? ` + ${remainder}` : ""}`; // Return quotient * 12 and remainder if not 0
}
