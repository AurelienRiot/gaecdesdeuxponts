import { dateFormatter, dateMonthYear, getDaysBetweenDates } from "@/lib/date-utils";
import { addressFormatter, formatFrenchPhoneNumber } from "@/lib/utils";
import type {
  AMAPOrderWithItems,
  FullInvoice,
  FullOrderWithInvoicePayment,
  InvoiceOrderWithItems,
  UserWithAddress,
} from "@/types";

type CustomerForPDF = {
  name: string;
  company?: string | null;
  userId: string;
  shippingAddress: string;
  billingAddress: string;
  phone?: string | null;
  email: string;
};

export const createCustomer = (user: UserWithAddress): CustomerForPDF => {
  const shippingAddress = user.address ? addressFormatter(user.address, true) : "";
  const billingAddress = user.billingAddress ? addressFormatter(user.billingAddress, true) : shippingAddress;
  return {
    name: user.name || "",
    userId: user.id,
    company: user.company,
    email: user.email || "",
    phone: formatFrenchPhoneNumber(user.phone),
    shippingAddress,
    billingAddress,
  };
};

export const createDataOrder = (order: FullOrderWithInvoicePayment): DataOrder => {
  return {
    id: order.id,
    dateOfEdition: dateFormatter(order.dateOfEdition || new Date()),
    dateOfPayment: order.invoiceOrder[0]?.invoice.dateOfPayment
      ? dateFormatter(order.invoiceOrder[0].invoice.dateOfPayment)
      : null,
    dateOfShipping: order.dateOfShipping ?? order.datePickUp,
    items: order.orderItems.map((item) => ({
      id: item.itemId,
      desc: item.name,
      tax: item.tax,
      priceTTC: item.price,
      qty: item.quantity,
    })),
    totalPrice: order.totalPrice,
  };
};

export const createInvoiceDataOrder = (order: InvoiceOrderWithItems): DataOrder => {
  if (!order.dateOfShipping) {
    throw new Error("Date de livraison incorrect");
  }
  return {
    id: order.orderId,
    dateOfEdition: dateFormatter(order.dateOfShipping),
    dateOfShipping: order.dateOfShipping,
    items: order.invoiceOrderItems.map((item) => ({
      id: item.itemId,
      desc: item.name,
      priceTTC: item.price,
      tax: item.tax,
      qty: item.quantity,
    })),
    totalPrice: order.totalPrice,
  };
};

export type DataOrder = {
  id: string;
  dateOfEdition: string;
  dateOfShipping: Date;
  dateOfPayment?: string | null;
  totalPrice: number;
  items: ItemDataOrder[];
};
export type ItemDataOrder = {
  id: string;
  desc: string;
  qty: number;
  tax: number;
  priceTTC: number;
};
export type PDFData = {
  customer: CustomerForPDF;
  order: DataOrder;
};

export const createPDFData = (order: FullOrderWithInvoicePayment): PDFData => {
  if (!order.customer) {
    throw new Error("Client invalide");
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
  dateOfPayment: Date | null;
  isPaid: boolean;
};

export type MonthlyPDFDataType = {
  date: string;
  invoiceId: string;
  dateOfEdition: string;
  dateOfPayment?: string | null;
  customer: CustomerForPDF;
  orders: DataOrder[];
};

export type InvoicePDFDate = {
  invoiceId: string;
  dateOfEdition: string;
  dateOfPayment?: string | null;
  customer: CustomerForPDF;
  order: DataOrder;
};
export const createInvoicePDFData = (invoice: FullInvoice): InvoicePDFDate => {
  if (!invoice.orders[0].dateOfShipping) {
    throw new Error("Date invalide");
  }

  if (!invoice.customer) {
    throw new Error("Client invalide");
  }
  const customer = invoice.customer;
  return {
    dateOfEdition: dateFormatter(invoice.dateOfEdition),
    dateOfPayment: invoice.dateOfPayment ? dateFormatter(invoice.dateOfPayment) : null,
    invoiceId: invoice.id,
    customer,
    order: createInvoiceDataOrder(invoice.orders[0]),
  };
};
export const createMonthlyInvoicePDFData = (invoice: FullInvoice): MonthlyPDFDataType => {
  if (!invoice.orders[0].dateOfShipping) {
    throw new Error("Date invalide");
  }

  const date = dateMonthYear(invoice.orders.map((order) => order.dateOfShipping));

  if (!invoice.customer) {
    throw new Error("Client invalide");
  }
  const customer = invoice.customer;
  return {
    invoiceId: invoice.id,
    dateOfEdition: dateFormatter(invoice.dateOfEdition),
    dateOfPayment: invoice.dateOfPayment ? dateFormatter(invoice.dateOfPayment) : null,
    date,
    customer,
    orders: invoice.orders.map(createInvoiceDataOrder),
  };
};

export const pdfData: PDFData = {
  customer: {
    name: "Pub Demystify",
    company: "Gaec des deux ponts",
    userId: "CS_2R374KQ",
    shippingAddress: "Avenue deis PORTISOL, 83600, Fréjus, FR",
    billingAddress: "venelle Koad ar Runig, 29470, Plougastel-Daoulas, FR",
    phone: "+33356452546",
    email: "pub.demystify390@passmail.net",
  },
  order: {
    id: "CM_5-9-24_ZNIPY",
    dateOfEdition: "8 juin 2024",
    dateOfPayment: "19 juin 2024",
    dateOfShipping: new Date("2024-06-08"),
    totalPrice: 44,
    items: [
      {
        id: "PR_LRBL182",
        desc: "Fromage blanc",
        tax: 1,
        priceTTC: 10,
        qty: 3,
      },
      {
        id: "PR_LRBL182",
        desc: "Crème liquide 25cl",
        tax: 1.055,
        priceTTC: 2,
        qty: 1,
      },
      {
        id: "PR_LRBL182",
        desc: "Crème liquide 1L",
        tax: 1.055,
        priceTTC: 8,
        qty: 1,
      },
      {
        id: "PR_LRBL182",
        desc: "Crème liquide 50cl",
        tax: 1.055,
        priceTTC: 4,
        qty: 1,
      },
    ],
  },
};

export const invoicePDFData: InvoicePDFDate = {
  invoiceId: "7-6-2024-0sUttHF",
  dateOfEdition: "8 juin 2024",
  dateOfPayment: "19 juin 2024",
  customer: {
    name: "Pub Demystify",
    company: "Gaec des deux ponts",
    userId: "clvurl15d000cn7yjhkdo7wo2",
    shippingAddress: "Avenue deis PORTISOL, 83600, Fréjus, FR",
    billingAddress: "venelle Koad ar Runig, 29470, Plougastel-Daoulas, FR",
    phone: "+33356452546",
    email: "pub.demystify390@passmail.net",
  },
  order: {
    id: "7-6-2024-0sUttHF",
    dateOfEdition: "8 juin 2024",
    dateOfPayment: "19 juin 2024",
    dateOfShipping: new Date("2024-06-08"),
    totalPrice: 44,
    items: [
      {
        id: "clx5wkbeh0019t35l3aby38q6",
        desc: "Fromage blanc",
        tax: 1.055,
        priceTTC: 10,
        qty: 3,
      },
      {
        id: "clx5wkbeh001at35leiz5khp8",
        desc: "Crème liquide 25cl",
        tax: 1,
        priceTTC: 2,
        qty: 1,
      },
      {
        id: "clx5wkbeh001bt35lkoc4e6ro",
        desc: "Crème liquide 1L",
        tax: 1.2,
        priceTTC: 8,
        qty: 1,
      },
      {
        id: "clx5wkbeh001ct35lidijjyz4",
        desc: "Crème liquide 50cl",
        tax: 1.055,
        priceTTC: 4,
        qty: 1,
      },
    ],
  },
};

export const monthlyPDFData: MonthlyPDFDataType = {
  date: "juin 2024",
  invoiceId: "7-6-2024-0sUttHF",
  dateOfEdition: "8 juin 2024",
  dateOfPayment: "19 juin 2024",
  customer: {
    name: "Pub Demystify",
    company: "Gaec des deux ponts",
    userId: "clvurl15d000cn7yjhkdo7wo2",
    shippingAddress: "Avenue deis PORTISOL, 83600, Fréjus, FR",
    billingAddress: "venelle Koad ar Runig, 29470, Plougastel-Daoulas, FR",
    phone: "+33356452546",
    email: "pub.demystify390@passmail.net",
  },
  orders: [
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

    ...Array.from({ length: 7 }, (_, i) => ({
      id: "7-6-2024-0sUttHF",
      dateOfEdition: "8 juin 2024",
      dateOfPayment: "19 juin 2024",
      dateOfShipping: new Date("2024-06-08"),
      totalPrice: 44,
      items: [
        {
          id: "clx5wkbeh0019t35l3aby38q6",
          desc: "Fromage blanc",
          tax: 1.055,
          priceTTC: 10,
          qty: 3,
        },
      ],
    })),
  ],
};

export const createDataAMAPOrder = (order: AMAPOrderWithItems): AMAPType["contrat"] => {
  return {
    id: order.id,
    dateOfEdition: order.dateOfEdition,
    type: "AMAP de Guemene Penfao",
    startDate: order.startDate,
    endDate: order.endDate,
    dayOfAbsence: order.daysOfAbsence,
    shippingDay: order.shippingDays,
    items: order.amapItems.map((item) => ({
      id: item.itemId,
      desc: item.name,
      priceTTC: item.price,
      qty: item.quantity,
    })),
    totalPrice: order.totalPrice,
  };
};

export const createAMAPData = (order: AMAPOrderWithItems, user: UserWithAddress): AMAPType => {
  return {
    customer: createCustomer(user),
    contrat: createDataAMAPOrder(order),
  };
};

export type AMAPType = {
  customer: CustomerForPDF;
  contrat: {
    id: string;
    dateOfEdition: Date;
    startDate: Date;
    endDate: Date;
    type: "AMAP de Guemene Penfao" | string;
    dayOfAbsence: Date[];
    shippingDay: Date[];
    totalPrice: number;
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
    name: "Nom :",
    userId: "CS_JTF0B99",
    shippingAddress: "Adresse :",
    billingAddress: "Adresse :",
    phone: "Tél :",
    email: "email :",
  },
  contrat: {
    id: "CA-0sUttHF",
    type: "AMAP de Guemene Penfao",
    dateOfEdition: new Date(),
    totalPrice: 60,
    dayOfAbsence: [],
    shippingDay: getDaysBetweenDates({ from: new Date(1725314400000), to: new Date(1735599600000), day: 2 }) as Date[],
    startDate: new Date(1725314400000),
    endDate: new Date(1735599600000),
    items: [
      {
        id: "PR_7HDJDXU",
        desc: "Lait cru bidon 2L",
        priceTTC: 2.2,
        qty: 3,
      },
      {
        id: "PR_7HDJDXU",
        desc: "Lait cru bouteille verre 1L",
        priceTTC: 1.1,
        qty: 3,
      },
    ],
  },
};
