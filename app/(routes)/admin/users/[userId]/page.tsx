import prismadb from "@/lib/prismadb";
import { UserForm } from "./components/user-form";
import { OrderColumn } from "./components/order-column";
import { formatter } from "@/lib/utils";
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
          orderItems: {
            include: {
              product: true,
            },
          },
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
        let name = item.product.name;
        if (Number(item.quantity) > 1) {
          name += ` x${item.quantity}`;
        }
        return name;
      })
      .join(", "),
    datePickUp: order.datePickUp,
    isPaid: order.isPaid,
    totalPrice: formatter.format(Number(order.totalPrice)),
    createdAt: order.createdAt,
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
