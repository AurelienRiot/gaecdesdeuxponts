import { dateFormatter } from "@/lib/date-utils";
import { addressFormatter } from "@/lib/utils";
import { OrderWithItemsAndUserAndShop } from "@/types";
import { DataInvoiceType } from "./data-invoice";

export type DataOrderType = DataInvoiceType;

export const data: DataOrderType = {
  customer: {
    id: "5df3180a09ea16dc4b95f910",
    name: "MANTRI",
    email: "susanafuentes@mantrix.com",
    phone: "+1 (872) 588-3809",
    address: "922 Campus Road, Drytown, Wisconsin, 1986",
  },
  order: {
    id: "9ea16dc4b95f9105df3180a0",
    dateOfEdition: "03/03/2024",
    dateOfPayment: "",
    dateOfShipping: "03/03/2024",
    items: [
      {
        id: "5df3180a09ea16dc4b95f910",
        priceTTC: 450,
        desc: "ad sunt culpa occaecat qui ad sunt culpa occaecat qui",
        qty: 5,
      },
      {
        id: "5df3180a09ea16dc4b95f910",
        priceTTC: 400,
        desc: "cillum quis sunt qui aute",
        qty: 5,
      },
      {
        id: "5df3180a09ea16dc4b95f910",
        priceTTC: 500,
        desc: "ea commodo labore culpa irure",
        qty: 5,
      },
      {
        priceTTC: 800,
        id: "5df3180a09ea16dc4b95f910",
        desc: "nisi consequat et adipisicing dolor",
        qty: 10,
      },
      {
        id: "5df3180a09ea16dc4b95f910",
        priceTTC: 160,
        desc: "proident cillum anim elit esse",
        qty: 4,
      },
    ],
    totalPrice: 2000,
  },
};

export function createDataOrder(
  order: OrderWithItemsAndUserAndShop,
): DataOrderType {
  const address = order.user.address
    ? addressFormatter(order.user.address)
    : "";

  return {
    customer: {
      id: order.userId || "",
      name: order.user.name || "",
      email: order.user.email || "",
      phone: order.user.phone || "",
      address: address,
    },
    order: {
      id: order.id,
      dateOfEdition: dateFormatter(new Date()),
      dateOfPayment: null,
      dateOfShipping: null,
      items: order.orderItems.map((item) => ({
        id: item.id,
        desc: item.name,
        priceTTC: item.price,
        qty: item.quantity,
      })),
      totalPrice: order.totalPrice,
    },
  };
}
