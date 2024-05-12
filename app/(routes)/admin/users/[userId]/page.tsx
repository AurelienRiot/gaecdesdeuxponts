import ButtonBackward from "@/components/ui/button-backward";
import prismadb from "@/lib/prismadb";
import {
  addressFormatter,
  currencyFormatter,
  dateFormatter,
} from "@/lib/utils";
import { OrderColumn } from "./_components/order-column";
import { OrderTable } from "./_components/order-table";
import { UserForm } from "./_components/user-form";

export const dynamic = "force-dynamic";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const user = await prismadb.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      address: true,
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: true,
          shop: { select: { name: true, id: true } },
        },
      },
    },
  });

  if (!user) {
    return (
      <>
        <div>Utilisateur introuvable </div>
        <ButtonBackward />
      </>
    );
  }

  const formatedUser = {
    ...user,
    orders: [],
  };

  const formattedOrders: OrderColumn[] = (user?.orders || []).map((order) => ({
    id: order.id,
    products: order.orderItems
      .map((item) => {
        let name = item.name;
        if (item.quantity > 0 && item.quantity !== 1) {
          name += ` x${item.quantity}`;
        }
        return name;
      })
      .join(", "),
    productsList: order.orderItems.map((item) => {
      let name = item.name;
      if (item.quantity > 0 && item.quantity !== 1) {
        const quantity = `${item.quantity}`;
        return { name, quantity: quantity, unit: item.unit || undefined };
      }
      return { name, quantity: "" };
    }),
    datePickUp: order.datePickUp,
    isPaid: order.isPaid,
    totalPrice: currencyFormatter.format(Number(order.totalPrice)),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
    dataInvoice: {
      customer: {
        id: user.id || "",
        name: user.name || "",
        address: (() => {
          const a =
            user?.address[0] && user?.address[0].line1
              ? addressFormatter(user.address[0])
              : "";
          return a;
        })(),
        phone: user.phone || "",
        email: user.email || "",
      },
      order: {
        id: order.id,
        dateOfPayment: dateFormatter(order.datePickUp),
        dateOfEdition: dateFormatter(new Date()),
        items: order.orderItems.map((item) => ({
          desc: item.name,
          qty: item.quantity,
          priceTTC: item.price,
        })),
        total: order.totalPrice,
      },
    },
  }));

  return (
    <div className="flex-col p-8 pt-6">
      <div className="mb-8 flex-1 space-y-4 ">
        <UserForm initialData={formatedUser} />
      </div>
      <div>
        <OrderTable data={formattedOrders} />
      </div>
    </div>
  );
};

export default UserPage;
