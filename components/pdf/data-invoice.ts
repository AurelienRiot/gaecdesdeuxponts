export type DataInvoiceType = {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  order: {
    id: string;
    dateOfEdition: string;
    dateOfPayment: string;
    items: {
      desc: string;
      qty: number;
      priceTTC: number;
    }[];
    total: number;
  };
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
    items: [
      {
        priceTTC: 450,
        desc: "ad sunt culpa occaecat qui ad sunt culpa occaecat qui",
        qty: 5,
      },
      {
        priceTTC: 400,
        desc: "cillum quis sunt qui aute",
        qty: 5,
      },
      {
        priceTTC: 500,
        desc: "ea commodo labore culpa irure",
        qty: 5,
      },
      {
        priceTTC: 800,
        desc: "nisi consequat et adipisicing dolor",
        qty: 10,
      },
      {
        priceTTC: 160,
        desc: "proident cillum anim elit esse",
        qty: 4,
      },
    ],
    total: 2000,
  },
};
