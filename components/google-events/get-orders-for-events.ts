import { getGroupedAMAPOrders } from "@/app/(routes)/admin/calendar/_functions/get-amap-orders";
import { getOrdersByDate } from "@/app/(routes)/admin/calendar/_functions/get-orders";
import { extractProductQuantities, getAmapOrdersForTheDay } from ".";

export const getAllOrders = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  // return dummieDate;
  const [orders, amapOrders] = await Promise.all([
    getOrdersByDate({ from: startDate, to: endDate }),

    getGroupedAMAPOrders(startDate),
  ]);

  const todayAmapOrders = getAmapOrdersForTheDay(amapOrders, startDate);

  const productQuantities = extractProductQuantities(orders.data, todayAmapOrders);

  return productQuantities;
};

export default getAllOrders;

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
      userId: "CS_DRMIGXM",
      shippingAddress: "6 Rue de Plessé, 44460, Avessac, FR",
      name: "Éric et Aline Pecquery - Proxi l'épicerie du village AVESSAC",
      company: "Proxi l'épicerie du village AVESSAC",
      image: "https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/farm/gqy08ightzdlbkxxbzgr",
      orderItems: [
        {
          itemId: "PR_7dud9y",
          name: "Lait cru bouteille plastique",
          tax: 1.055,
          quantity: 5,
          unit: null,
        },
        {
          itemId: "PR_lppxu7",
          name: "Lait pasteurisé entier bouteille verre",
          tax: 1.055,
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
          tax: 1.055,
          quantity: 4,
          unit: null,
        },
      ],
    },
  },
};
