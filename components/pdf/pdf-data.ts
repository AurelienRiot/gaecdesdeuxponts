import { dateFormatter, dateMonthYear } from "@/lib/date-utils";
import { addressFormatter, formatFrenchPhoneNumber } from "@/lib/utils";
import type { FullOrder, UserWithAddress } from "@/types";
import type { Customer } from "@prisma/client";

export const createCustomer = (user: UserWithAddress) => {
  const shippingAddress = user.address ? addressFormatter(user.address, true) : "";
  const facturationAddress = user.billingAddress ? addressFormatter(user.billingAddress, true) : shippingAddress;
  return {
    customerId: user.id,
    name: user.company ? `${user.name} - ${user.company}` : user.name || "",
    email: user.email || "",
    phone: formatFrenchPhoneNumber(user.phone),
    shippingAddress,
    facturationAddress,
  };
};

export const createDataOrder = (order: FullOrder): DataOrder => {
  return {
    id: order.id,
    dateOfEdition: dateFormatter(order.dateOfEdition || new Date()),
    dateOfPayment: order.dateOfPayment ? dateFormatter(order.dateOfPayment) : null,
    dateOfShipping: order.dateOfShipping ? dateFormatter(order.dateOfShipping) : null,
    items: order.orderItems.map((item) => ({
      id: item.itemId,
      desc: item.name,
      priceTTC: item.price,
      qty: item.quantity,
    })),
    totalPrice: order.totalPrice,
  };
};

export type DataOrder = {
  id: string;
  dateOfEdition: string;
  dateOfShipping: string | null;
  dateOfPayment: string | null;
  totalPrice: number;
  items: {
    id: string;
    desc: string;
    qty: number;
    priceTTC: number;
  }[];
};

export type PDFData = {
  customer: Customer;
  order: DataOrder;
};

export const createPDFData = (order: FullOrder): PDFData => {
  if (!order.customer) {
    order.customer = {
      id: "clvurl15d000cn7yjhkdo7wo2",
      orderId: "7-6-2024-0sUttHF",
      customerId: "clvurl15d000cn7yjhkdo7wo2",
      name: "Anonyme",
      email: "",
      phone: "",
      shippingAddress: "",
      facturationAddress: "",
    };
  }
  return {
    customer: order.customer,
    order: createDataOrder(order),
  };
};

export type monthlyOrdersType = {
  orderId: string;
  month: number;
  year: number;
  invoiceEmail: Date | null;
  isPaid: boolean;
};

export type MonthlyPDFDataType = {
  date: string;
  customer: Customer;
  orders: DataOrder[];
};

export const createMonthlyPDFData = (orders: FullOrder[]): MonthlyPDFDataType => {
  if (!orders[0].dateOfShipping) {
    throw new Error("Date invalide");
  }
  const date = dateMonthYear(orders[0].dateOfShipping);

  const customer = orders[orders.length - 1].customer;
  if (!customer) {
    throw new Error("Customer not found");
  }

  const monthlyPDFData = {
    date,
    customer,
    orders: orders.map(createDataOrder),
  };
  return monthlyPDFData;
};

export const pdfData: PDFData = {
  customer: {
    id: "clx5ubreg000tt35lvpqjzlqs",
    name: "Pub Demystify - des",
    customerId: "clvurl15d000cn7yjhkdo7wo2",
    shippingAddress: "Avenue deis PORTISOL, 83600, Fréjus, FR",
    facturationAddress: "venelle Koad ar Runig, 29470, Plougastel-Daoulas, FR",
    phone: "+33356452546",
    email: "pub.demystify390@passmail.net",
    orderId: "7-6-2024-0sUttHF",
  },
  order: {
    id: "7-6-2024-0sUttHF",
    dateOfEdition: "8 juin 2024",
    dateOfPayment: "19 juin 2024",
    dateOfShipping: "4 juin 2024",
    totalPrice: 44,
    items: [
      {
        id: "clx5wkbeh0019t35l3aby38q6",
        desc: "Fromage blanc",
        priceTTC: 10,
        qty: 3,
      },
      {
        id: "clx5wkbeh001at35leiz5khp8",
        desc: "Crème liquide 25cl",
        priceTTC: 2,
        qty: 1,
      },
      {
        id: "clx5wkbeh001bt35lkoc4e6ro",
        desc: "Crème liquide 1L",
        priceTTC: 8,
        qty: 1,
      },
      {
        id: "clx5wkbeh001ct35lidijjyz4",
        desc: "Crème liquide 50cl",
        priceTTC: 4,
        qty: 1,
      },
    ],
  },
};

export const monthlyPDFData: MonthlyPDFDataType = {
  date: "juin 2024",
  customer: {
    id: "clx5ubreg000tt35lvpqjzlqs",
    name: "Pub Demystify - des",
    customerId: "clvurl15d000cn7yjhkdo7wo2",
    shippingAddress: "Avenue deis PORTISOL, 83600, Fréjus, FR",
    facturationAddress: "venelle Koad ar Runig, 29470, Plougastel-Daoulas, FR",
    phone: "+33356452546",
    email: "pub.demystify390@passmail.net",
    orderId: "7-6-2024-0sUttHF",
  },
  orders: [
    {
      id: "7-6-2024-0sUttHF",
      dateOfEdition: "8 juin 2024",
      dateOfPayment: "19 juin 2024",
      dateOfShipping: "4 juin 2024",
      totalPrice: 44,
      items: [
        {
          id: "clx5wkbeh0019t35l3aby38q6",
          desc: "Fromage blanc",
          priceTTC: 10,
          qty: 3,
        },
        {
          id: "clx5wkbeh001at35leiz5khp8",
          desc: "Crème liquide 25cl",
          priceTTC: 2,
          qty: 1,
        },
        {
          id: "clx5wkbeh001bt35lkoc4e6ro",
          desc: "Crème liquide 1L",
          priceTTC: 8,
          qty: 1,
        },
        {
          id: "clx5wkbeh001ct35lidijjyz4",
          desc: "Crème liquide 50cl",
          priceTTC: 4,
          qty: 1,
        },
      ],
    },

    {
      id: "7-6-2024-0sUttHF",
      dateOfEdition: "8 juin 2024",
      dateOfPayment: "19 juin 2024",
      dateOfShipping: "4 juin 2024",
      totalPrice: 44,
      items: [
        {
          id: "clx5wkbeh0019t35l3aby38q6",
          desc: "Fromage blanc",
          priceTTC: 10,
          qty: 3,
        },
        {
          id: "clx5wkbeh001at35leiz5khp8",
          desc: "Crème liquide 25cl",
          priceTTC: 2,
          qty: 1,
        },
        {
          id: "clx5wkbeh001bt35lkoc4e6ro",
          desc: "Crème liquide 1L",
          priceTTC: 8,
          qty: 1,
        },
        {
          id: "clx5wkbeh001ct35lidijjyz4",
          desc: "Crème liquide 50cl",
          priceTTC: 4,
          qty: 1,
        },
      ],
    },
    // {
    //   id: "7-6-2024-0sUttHF",
    //   dateOfEdition: "8 juin 2024",
    //   dateOfPayment: "19 juin 2024",
    //   dateOfShipping: "4 juin 2024",
    //   totalPrice: 44,
    //   items: [
    //     {
    //       id: "clx5wkbeh0019t35l3aby38q6",
    //       desc: "Fromage blanc",
    //       priceTTC: 10,
    //       qty: 3,
    //     },
    //     {
    //       id: "clx5wkbeh001at35leiz5khp8",
    //       desc: "Crème liquide 25cl",
    //       priceTTC: 2,
    //       qty: 1,
    //     },
    //     {
    //       id: "clx5wkbeh001bt35lkoc4e6ro",
    //       desc: "Crème liquide 1L",
    //       priceTTC: 8,
    //       qty: 1,
    //     },
    //     {
    //       id: "clx5wkbeh001ct35lidijjyz4",
    //       desc: "Crème liquide 50cl",
    //       priceTTC: 4,
    //       qty: 1,
    //     },
    //   ],
    // },
    // {
    //   id: "7-6-2024-0sUttHF",
    //   dateOfEdition: "8 juin 2024",
    //   dateOfPayment: "19 juin 2024",
    //   dateOfShipping: "4 juin 2024",
    //   totalPrice: 44,
    //   items: [
    //     {
    //       id: "clx5wkbeh0019t35l3aby38q6",
    //       desc: "Fromage blanc",
    //       priceTTC: 10,
    //       qty: 3,
    //     },
    //     {
    //       id: "clx5wkbeh001at35leiz5khp8",
    //       desc: "Crème liquide 25cl",
    //       priceTTC: 2,
    //       qty: 1,
    //     },
    //     {
    //       id: "clx5wkbeh001bt35lkoc4e6ro",
    //       desc: "Crème liquide 1L",
    //       priceTTC: 8,
    //       qty: 1,
    //     },
    //     {
    //       id: "clx5wkbeh001ct35lidijjyz4",
    //       desc: "Crème liquide 50cl",
    //       priceTTC: 4,
    //       qty: 1,
    //     },
    //   ],
    // },
    {
      id: "7-6-2024-0sUttHF",
      dateOfEdition: "8 juin 2024",
      dateOfPayment: "19 juin 2024",
      dateOfShipping: "4 juin 2024",
      totalPrice: 44,
      items: [
        {
          id: "clx5wkbeh0019t35l3aby38q6",
          desc: "Fromage blanc",
          priceTTC: 10,
          qty: 3,
        },
        {
          id: "clx5wkbeh001at35leiz5khp8",
          desc: "Crème liquide 25cl",
          priceTTC: 2,
          qty: 1,
        },
        {
          id: "clx5wkbeh001bt35lkoc4e6ro",
          desc: "Crème liquide 1L",
          priceTTC: 8,
          qty: 1,
        },
        {
          id: "clx5wkbeh001ct35lidijjyz4",
          desc: "Crème liquide 50cl",
          priceTTC: 4,
          qty: 1,
        },
      ],
    },
  ],
};

export type AMAPType = {
  customer: Customer;
  order: {
    id: string;
    dateOfEdition: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    numberOfWeek: number;
    weeksOfAbsence: number;
    items: {
      id: string;
      desc: string;
      priceTTC: number;
      qty: number;
    }[];
  };
};

export const AMAPData: AMAPType = {
  customer: {
    id: "clx5ubreg000tt35lvpqjzlqs",
    name: "Pub Demystify - des",
    customerId: "CS_JTF0B99",
    shippingAddress: "Avenue deis PORTISOL, 83600, Fréjus, FR",
    facturationAddress: "venelle Koad ar Runig, 29470, Plougastel-Daoulas, FR",
    phone: "+33356452546",
    email: "pub.demystify390@passmail.net",
    orderId: "CA-0sUttHF",
  },
  order: {
    id: "CA-0sUttHF",
    dateOfEdition: "8 juin 2024",
    totalPrice: 60,
    numberOfWeek: 20,
    weeksOfAbsence: 0,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(12)),
    items: [
      {
        id: "PR-0sUttHF",
        desc: "Lait cru",
        priceTTC: 1,
        qty: 3,
      },
      {
        id: "PR-065KINES",
        desc: "Lait pasteurisé",
        priceTTC: 2,
        qty: 4,
      },
    ],
  },
};
