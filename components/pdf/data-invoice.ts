import { dateFormatter } from "@/lib/utils";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};
export type DataOrder = {
  id: string;
  dateOfEdition: string;
  dateOfShipping: string | null;
  dateOfPayment: string | null;
  items: {
    id: string;
    desc: string;
    qty: number;
    priceTTC: number;
  }[];
  totalPrice: number | null;
};

export type DataInvoiceType = {
  customer: Customer;
  order: DataOrder;
};

export const data: DataInvoiceType = {
  customer: {
    id: "clvurl15d000cn7yjhkdo7wo2",
    name: "MANTRI",
    email: "susanafuentes@mantrix.com",
    phone: "+1 (872) 588-3809",
    address: "922 Campus Road, Drytown, Wisconsin, 1986",
  },
  order: {
    id: "RwZJdKN8VZIq0__djiWeq",
    dateOfEdition: dateFormatter(new Date()),
    dateOfPayment: dateFormatter(new Date()),
    dateOfShipping: dateFormatter(new Date()),
    items: [
      {
        id: "PR_clw6c4e5g0001jurxfos6jkhl",
        priceTTC: 10,
        desc: "Fromage blanc",
        qty: 5,
      },
      {
        id: "PR_clw7wb8u600041e4kk8bs9c62",
        priceTTC: 2,
        desc: "Crème liquide 25cl",
        qty: 2,
      },
      {
        id: "PR_clw7wb8u600001e4k8wkufzcq",
        priceTTC: 10,
        desc: "Crème liquide 1L",
        qty: 1,
      },
    ],
    totalPrice: 64,
  },
};
