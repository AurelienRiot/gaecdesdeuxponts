import { dateFormatter } from "@/lib/date-utils";
import { addressFormatter } from "@/lib/utils";
import { UserWithOrdersAndAdress } from "@/types";
import { Customer, DataOrder } from "./data-invoice";

export type DataMonthlyInvoiceType = {
  customer: Customer;
  order: DataOrder[];
};

export const data: DataMonthlyInvoiceType = {
  customer: {
    id: "5df3180a09ea16dc4b95f910",
    name: "MANTRI",
    email: "susanafuentes@mantrix.com",
    phone: "+1 (872) 588-3809",
    address: "922 Campus Road, Drytown, Wisconsin, 1986",
  },
  order: [
    {
      id: "9ea16dc4b95f9105df3180a0",
      dateOfEdition: "03/03/2024",
      dateOfShipping: "03/03/2024",
      dateOfPayment: null,
      totalPrice: 10000,
      items: [
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "ad sunt culpa occaecat qui ad sunt culpa occaecat qui",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "cillum quis sunt qui aute",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "ea commodo labore culpa irure",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "nisi consequat et adipisicing dolor",
          qty: 10,
        },
        {
          id: "5df3180a09ea16dc4b95f910",
          priceTTC: 450,
          desc: "proident cillum anim elit esse",
          qty: 4,
        },
      ],
    },
    {
      id: "9ea16dc4b95f9105df3180a0",
      dateOfEdition: "03/03/2024",
      dateOfShipping: "03/03/2024",
      dateOfPayment: null,
      totalPrice: 10000,
      items: [
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "ad sunt culpa occaecat qui ad sunt culpa occaecat qui",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "cillum quis sunt qui aute",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "ea commodo labore culpa irure",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "nisi consequat et adipisicing dolor",
          qty: 10,
        },
        {
          id: "5df3180a09ea16dc4b95f910",
          priceTTC: 450,
          desc: "proident cillum anim elit esse",
          qty: 4,
        },
      ],
    },
    {
      id: "9ea16dc4b95f9105df3180a0",
      dateOfEdition: "03/03/2024",
      dateOfShipping: "03/03/2024",
      dateOfPayment: null,
      totalPrice: 10000,
      items: [
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "ad sunt culpa occaecat qui ad sunt culpa occaecat qui",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "cillum quis sunt qui aute",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "ea commodo labore culpa irure",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "nisi consequat et adipisicing dolor",
          qty: 10,
        },
        {
          id: "5df3180a09ea16dc4b95f910",
          priceTTC: 450,
          desc: "proident cillum anim elit esse",
          qty: 4,
        },
      ],
    },
    {
      id: "9ea16dc4b95f9105df3180a0",
      dateOfEdition: "03/03/2024",
      dateOfShipping: "03/03/2024",
      dateOfPayment: null,
      totalPrice: 10000,
      items: [
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "ad sunt culpa occaecat qui ad sunt culpa occaecat qui",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "cillum quis sunt qui aute",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "ea commodo labore culpa irure",
          qty: 5,
        },
        {
          priceTTC: 450,
          id: "5df3180a09ea16dc4b95f910",
          desc: "nisi consequat et adipisicing dolor",
          qty: 10,
        },
        {
          id: "5df3180a09ea16dc4b95f910",
          priceTTC: 450,
          desc: "proident cillum anim elit esse",
          qty: 4,
        },
      ],
    },
  ],
};

export function createMonthlyDataInvoice({
  month,
  year,
  user,
}: {
  user: UserWithOrdersAndAdress;
  month: number;
  year: number;
}): { data: DataMonthlyInvoiceType; isPaid: boolean } {
  const orders = user.orders.filter((order) => {
    if (!order.dateOfShipping) {
      return false;
    }
    const date = new Date(order.dateOfShipping);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });

  const isPaid = orders.every((order) => order.dateOfPayment);

  const address = user.address ? addressFormatter(user.address) : "";

  const data = {
    customer: {
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: address,
    },
    order: orders.map((order) => ({
      id: order.id,
      dateOfEdition: dateFormatter(new Date()),
      dateOfShipping: order.dateOfShipping
        ? dateFormatter(new Date(order.dateOfShipping))
        : null,
      dateOfPayment: order.dateOfPayment
        ? dateFormatter(new Date(order.dateOfPayment))
        : null,
      totalPrice: order.totalPrice,
      items: order.orderItems.map((item) => ({
        desc: item.name,
        priceTTC: item.price,
        qty: item.quantity,
        id: item.id,
      })),
    })),
  };

  return { data, isPaid };
}
