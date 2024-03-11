import prismadb from "@/lib/prismadb";
import { UserForm } from "./components/user-form";
import { OrderColumn } from "./components/order-column";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { OrderTable } from "./components/order-table";
import ButtonBackward from "@/components/ui/button-backward";

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
        if (Number(item.quantity) > 1) {
          name += ` x${item.quantity}`;
        }
        return name;
      })
      .join(", "),
    datePickUp: order.datePickUp,
    isPaid: order.isPaid,
    totalPrice: currencyFormatter.format(Number(order.totalPrice)),
    createdAt: order.createdAt,
    shopName: order.shop.name,
    shopId: order.shop.id,
    dataInvoice: {
      customer: {
        id: user.id || "",
        name: user.name || "",
        address: (() => {
          const a = user?.address[0]
            ? `${user?.address[0].line1} ${user?.address[0].postalCode} ${user?.address[0].city}`
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
