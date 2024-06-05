import { authOptions } from "@/components/auth/authOptions";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";

export const getSessionUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return session.user;
};

export const getBasicUser = async () => {
 const sessionUser= await getSessionUser()

 if (!sessionUser) {
  return null;
}

 const user = await prismadb.user.findUnique({
  where: {
    id: sessionUser.id,
  },
});

return user;
}

const GetUser = async () => {
 

  const sessionUser= await getSessionUser()

  if (!sessionUser) {
    return null;
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: true,
          shop: true,
        },
      },

      address: true,
      billingAddress: true,
    },
  });

  return user;
};

export default GetUser;

const testUser = {
  id: "cltioydna0000iegfbsdhjb0g",
  name: "demystify",
  email: "pub.demystify390@passmail.net",
  emailVerified: new Date("2024-03-30T20:51:03.414Z"),
  phone: "",
  image: null,
  role: "pro",
  createdAt: new Date("2024-03-08T13:27:19.702Z"),
  updatedAt: new Date("2024-03-30T20:51:03.415Z"),
  orders: [
    {
      id: "ee30d671-1225-4e63-a414-b90bcebd0680",
      totalPrice: 16,
      name: "demystify",
      pdfUrl: "",
      isPaid: false,
      userId: "cltioydna0000iegfbsdhjb0g",
      shopId: "68cd6a50-66a3-42be-85b0-84a9c29885c7",
      datePickUp: new Date("2024-03-28T23:00:00.000Z"),
      createdAt: new Date("2024-03-11T20:51:23.250Z"),
      updatedAt: new Date("2024-03-17T18:22:32.581Z"),
      orderItems: [
        {
          id: "87a43cf2-1bde-4ed1-a702-8be2108ac62f",
          price: 2,
          quantity: 3,
          name: "lait 1L",
          categoryName: "Produits Laitiers",
          description: "lait",
          orderId: "ee30d671-1225-4e63-a414-b90bcebd0680",
        },
        {
          id: "e2b3b901-2679-47e6-abb1-b0cf37de00f2",
          price: 5,
          quantity: 1,
          name: "Lait 5L",
          categoryName: "Produits Laitiers",
          description: "uirui",
          orderId: "ee30d671-1225-4e63-a414-b90bcebd0680",
        },
        {
          id: "38e4b54a-9d62-4dd3-bdb2-6d31d7bb4e71",
          price: 5,
          quantity: 1,
          name: "Créme fraiche 12,5cl",
          categoryName: "Produits Laitiers",
          description: "iruir",
          orderId: "ee30d671-1225-4e63-a414-b90bcebd0680",
        },
      ],
      shop: {
        id: "68cd6a50-66a3-42be-85b0-84a9c29885c7",
        name: "AMAP Du Champ au Panier",
        lat: 47.762718,
        long: -1.684528,
        address: "12 Rue des Arcades 35390 La Dominelais",
        phone: "+33633458289",
        email: "amap.dominelais@gmail.com",
        description: "Shop 2 description",
        imageUrl:
          "https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/farm/ldqit2yhtqdzj0csdsp4",
        website: null,
        isArchived: false,
        createdAt: new Date("2024-03-10T23:09:14.169Z"),
        updatedAt: new Date("2024-03-10T23:09:14.169Z"),
      },
    },
  ],
  address: {
    id: "efce71b0-8932-4ca2-adce-5706fbf5191a",
    label: "Rue des Aires 04230 Cruis",
    line1: "Rue des Aires",
    line2: "",
    city: "Cruis",
    state: "Provence-Alpes-Côte d'Azur",
    postalCode: "04230",
    country: "FR",
    userId: "cltioydna0000iegfbsdhjb0g",
    createdAt: new Date("2024-03-08T13:29:44.386Z"),
    updatedAt: new Date("2024-03-08T13:29:44.386Z"),
  },
  billingAddress: null,
};
