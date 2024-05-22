import { DataInvoiceType } from "./data-invoice";

export type DataShippingOrderType = DataInvoiceType;

export const data: DataShippingOrderType = {
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
    dateOfShipping: "03/03/2024",
    dateOfPayment: null,
    totalPrice: null,
    items: [
      {
        priceTTC: 160,
        id: "5df3180a09ea16dc4b95f910",
        desc: "ad sunt culpa occaecat qui ad sunt culpa occaecat qui",
        qty: 5,
      },
      {
        id: "5df3180a09ea16dc4b95f910",
        priceTTC: 160,
        desc: "cillum quis sunt qui aute",
        qty: 5,
      },
      {
        id: "5df3180a09ea16dc4b95f910",
        priceTTC: 160,
        desc: "ea commodo labore culpa irure",
        qty: 5,
      },
      {
        id: "5df3180a09ea16dc4b95f910",
        desc: "nisi consequat et adipisicing dolor",
        priceTTC: 160,
        qty: 10,
      },
      {
        id: "5df3180a09ea16dc4b95f910",
        priceTTC: 160,
        desc: "proident cillum anim elit esse",
        qty: 4,
      },
    ],
  },
};

// export function createDataInvoice(
//   order: OrderWithItemsAndUserAndShop,
// ): DataShippingOrderType {
//   const address =
//     order.user.address.length > 0
//       ? addressFormatter(order.user.address[0])
//       : "";

//   return {
//     customer: {
//       id: order.userId || "",
//       name: order.user.name || "",
//       email: order.user.email || "",
//       phone: order.user.phone || "",
//       address: address,
//     },
//     order: {
//       id: order.id,
//       dateOfEdition: dateFormatter(new Date()),
//       items: order.orderItems.map((item) => ({
//         desc: item.name,
//         priceTTC: item.price,
//         qty: item.quantity,
//       })),
//       total: order.totalPrice,
//     },
//   };
// }
