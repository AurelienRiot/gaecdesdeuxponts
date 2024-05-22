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
    id: "5df3180a09ea16dc4b95f910",
    name: "MANTRI",
    email: "susanafuentes@mantrix.com",
    phone: "+1 (872) 588-3809",
    address: "922 Campus Road, Drytown, Wisconsin, 1986",
  },
  order: {
    id: "9ea16dc4b95f9105df3180a0",
    dateOfEdition: "03/03/2024",
    dateOfPayment: "01/03/2024",
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
        id: "5df3180a09ea16dc4b95f910",
        priceTTC: 800,
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
