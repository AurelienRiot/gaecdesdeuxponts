"server only";
import { getUserName } from "@/components/table-custom-fuction";
import { createProduct, createProductList } from "@/components/table-custom-fuction/cell-orders";
import prismadb from "@/lib/prismadb";
import { addDays } from "date-fns/addDays";
import { unstable_cache } from "next/cache";
import type { AMAPColumn } from "../../amap/_components/columns";
import { getUnitLabel } from "@/components/product/product-function";
import type { ProductQuantities } from "@/components/google-events/get-orders-for-events";

export const getAMAPOrders = unstable_cache(
  async ({ from, to }: { from: Date; to: Date }) => {
    const amapOrders = await prismadb.aMAPOrder.findMany({
      where: {
        startDate: {
          gte: from,
          lte: to,
        },
      },

      include: { user: true, amapItems: true, shop: true },
    });

    const groupOrdersByShopName = amapOrders.reduce(
      (accumulator, order) => {
        const shopName = order.shop.name;

        if (!accumulator[shopName]) {
          accumulator[shopName] = [];
        }
        const formattedOrders = {
          id: order.id,
          userId: order.user.id,
          name: getUserName(order.user),
          shopName: order.shop.name,
          shopId: order.shop.id,
          totalPrice: order.totalPrice,
          totalPaid: order.totalPaid,
          startDate: order.startDate,
          endDate: order.endDate,
          shippingDays: order.shippingDays,
          shippedDays: order.shippedDays,
          dateOfEdition: order.dateOfEdition,
          productsList: createProductList(order.amapItems),
          products: createProduct(order.amapItems),
        };

        accumulator[shopName].push(formattedOrders);
        return accumulator;
      },
      {} as Record<string, AMAPColumn[]>,
    );
    return Object.entries(groupOrdersByShopName).map(([shopName, orders]) => ({ shopName, orders }));
  },
  ["getAMAPOrders"],
  { revalidate: 60 * 60 * 24, tags: ["amap-orders"] },
);

export const getGroupedAMAPOrders =
  // unstable_cache(
  async () => {
    const amapOrders = await prismadb.aMAPOrder.findMany({
      where: {
        endDate: {
          gte: addDays(new Date(), -1),
        },
      },
      select: {
        shippingDays: true,
        amapItems: { select: { itemId: true, name: true, quantity: true, unit: true } },
        shop: { select: { name: true, address: true, id: true, imageUrl: true } },
      },
    });

    // Adjust the groupedData type definition to include imageUrl separately
    const groupedData: {
      [shopName: string]: {
        imageUrl: string | null;
        shippingDays: {
          [dateStr: string]: {
            [itemId: string]: ProductQuantities;
          };
        };
      };
    } = {};

    for (const order of amapOrders) {
      const shopName = order.shop.name;
      const shopImageUrl = order.shop.imageUrl; // Get the image URL of the shop

      if (!groupedData[shopName]) {
        groupedData[shopName] = { imageUrl: shopImageUrl, shippingDays: {} }; // Initialize with the image URL
      }

      const shippingDays = order.shippingDays;
      for (const shippingDay of shippingDays) {
        const dateStr = new Date(shippingDay).toISOString();

        if (!groupedData[shopName].shippingDays[dateStr]) {
          groupedData[shopName].shippingDays[dateStr] = {};
        }

        for (const item of order.amapItems) {
          const { itemId, name, quantity, unit } = item;

          if (!groupedData[shopName].shippingDays[dateStr][itemId]) {
            groupedData[shopName].shippingDays[dateStr][itemId] = {
              itemId,
              name,
              unit: getUnitLabel(unit).quantity,
              quantity: 0,
            };
          }

          groupedData[shopName].shippingDays[dateStr][itemId].quantity += quantity;
        }
      }
    }

    const result = Object.keys(groupedData).map((shopName) => {
      const { imageUrl, shippingDays } = groupedData[shopName]; // Extract image URL and shipping days
      const shippingDaysArray = Object.keys(shippingDays).map((dateStr) => {
        const items = Object.values(shippingDays[dateStr]);
        return {
          date: dateStr,
          items,
        };
      });

      return {
        shopName,
        shopImageUrl: imageUrl, // Include the image URL in the result
        shippingDays: shippingDaysArray,
      };
    });

    return result;
  };
//   ["getGroupedAMAPOrders"],
//   { revalidate: 60 * 60 * 24 * 15, tags: ["amap-orders"] },
// );
